import * as Yup from 'yup';
import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { cpf } from 'cpf-cnpj-validator';
import { formatStatus } from '../utils/format';
import Address from '../models/Address';
import Doc from '../models/Doc';
import Log from '../models/Log';
import Request from '../models/Request';
import User from '../models/User';
import createLog from './LogController';

class ProposalController {
  async store(req, res) {
    let idUser;

    const schema = Yup.object().shape({
      name: Yup.string().required('Name is required, please inform.'),
      email: Yup.string().required('Email is required, please inform.'),
      tax_id: Yup.string().required('Document id is required, please inform.'),
      password: Yup.string().required('Password is required, please inform.'),
      price: Yup.number().required('Value is required, please inform.'),
    });

    await schema.validate(req.body).catch(function (err) {
      return res.status(400).json({ error: err.errors });
    });

    const {
      name,
      email,
      tax_id,
      password,
      price,
      revenues,
      marital_status,
      birth,
      address,
    } = req.body;

    const existsRequest = await Request.findOne({
      where: { id_user: tax_id, price, status: { [Op.lt]: 3 } },
    });

    if (existsRequest) {
      return res
        .status(402)
        .json({ success: false, message: 'Exists active proposal from to document id.' });
    }

    const userExists = await User.findByPk(tax_id);

    const emailExists = await User.findOne({
      where: { email },
    });

    if (emailExists && !userExists) {
      return res
        .status(402)
        .json({ success: false, message: 'Email already registered.' });
    }

    const docValid = cpf.isValid(tax_id);

    if (!docValid) {
      return res.status(402).json({
        success: false,
        message: 'Document is not valid, please check.',
      });
    }

    try {
      const UUID = uuidv4();

      createLog(UUID, `Start crecording proposal ${UUID}`);

      if (!userExists) {
        const { id } = await User.create({
          id: tax_id,
          name,
          email,
          password,
          revenues,
          marital_status,
          birth,
        });
        idUser = id;

        createLog(UUID, 'New user.');

      } else {
        await userExists.update({
          name: req.body.name,
          email: req.body.email,
          marital_status: req.body.marital_status,
          birth: req.body.birth,
          revenues: req.body.revenues,
        });

        idUser = userExists.id;

        createLog(UUID, 'User already registered, update infos.');
      }

      const request = await Request.create({
        id: UUID,
        id_user: idUser,
        price,
        status: 1,
      });


      if (address) {
        const existsAddress = await Address.findOne({
          where: { id_user: idUser },
        });

        if (existsAddress) {
          await existsAddress.update({
            ...address,
          });

          createLog(UUID, 'Address update.');

        } else {
          await Address.create({
            id_user: idUser,
            ...address,
          });

          createLog(UUID, 'Address created.');

        }
      }

      return res.status(200).json({ success: true, content: request });
    } catch (err) {
      return res.status(400).json({ success: false, error: err });
    }
  }

  async update(req, res) {
    const { id } = req.params;

    if (req.body.tax_id && req.body.tax_id === ' ') {
      return res.status(402).json({
        success: false,
        message: 'Document is required, not null value.',
      });
    }

    if (req.body.name && req.body.name === ' ') {
      return res
        .status(402)
        .json({ success: false, message: 'Name is required, not null value.' });
    }

    if (req.body.email && req.body.email === ' ') {
      return res.status(402).json({
        success: false,
        message: 'Email is required, not null value.',
      });
    }

    if (req.body.price && req.body.price === ' ') {
      return res.status(402).json({
        success: false,
        message: 'Price is required, not null value.',
      });
    }

    const existsRequest = await Request.findByPk(id);

    if (!existsRequest) {
      return res
        .status(404)
        .json({ success: false, message: 'Request not found.' });
    } else if (existsRequest.id_user !== req.userId) {

      createLog(existsRequest.id, `The user ${req.userId} tried to change this proposal`);

      return res.status(402).json({
        success: false,
        message: 'This request does not belong to you.',
      });
    } else if (existsRequest.status > 2) {

      createLog(existsRequest.id, 'There was an attempt to change after the proposal was finalized');

      return res
        .status(402)
        .json({ success: false, message: 'This request is finish.' });
    }

    try {
      const newRequest = await existsRequest.update({
        price: req.body.price,
      });

      const newUser = await User.findByPk(newRequest.id_user);

      await newUser.update({
        name: req.body.name,
        email: req.body.email,
        marital_status: req.body.marital_status,
        birth: req.body.birth,
        revenues: req.body.revenues,
      });

      createLog(existsRequest.id, 'Updated user data.');

      if (req.body.address) {
        const existsAddress = await Address.findOne({
          where: { id_user: newRequest.id_user },
        });

        if (existsAddress) {
          createLog(existsRequest.id, 'Updated address data.');

          await existsAddress.update({
            ...req.body.address,
          });
        } else {
          createLog(existsRequest.id, 'Created address data.');

          await Address.create({
              id_user: newRequest.id_user,
              ...req.body.address,
            });
        }
      }

      const request = await Request.findOne({
        where: { id: newRequest.id },
        attributes: ['id', 'price', 'id_user', 'status'],
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['name', 'email', 'birth', 'marital_status', 'revenues'],
            include: [
              {
                model: Address,
                as: 'address',
                attributes: [
                  'zip',
                  'street',
                  'number',
                  'neighborhood',
                  'details',
                  'city',
                  'state',
                ],
              },
            ],
          },
          {
            model: Doc,
            as: 'docs',
            attributes: ['doc_type', 'id_file'],
          },
          {
            model: Log,
            as: 'logs',
            attributes: [ 'created_at', 'description' , 'finish' ]
          },
        ],
      });

      return res.status(200).json({
        success: true,
        status: formatStatus(newRequest.status),
        content: request,
      });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ success: false, error: err });
    }
  }

  async show(req, res) {
    const { id } = req.params;

    const request = await Request.findOne({
      where: { id },
      attributes: ['id', 'price', 'id_user', 'status'],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name', 'email', 'birth', 'marital_status', 'revenues'],
          include: [
            {
              model: Address,
              as: 'address',
              attributes: [
                'zip',
                'street',
                'number',
                'neighborhood',
                'details',
                'city',
                'state',
              ],
            },
          ],
        },
        {
          model: Doc,
          as: 'docs',
          attributes: ['doc_type', 'id_file'],
        },
        {
          model: Log,
          as: 'logs',
          attributes: [ 'created_at', 'description' , 'finish' ]
        },
      ],
    });

    if (!request) {
      return res
        .status(404)
        .json({ success: false, message: 'Request not found' });
    } else if (request.id_user !== req.userId) {
      return res.status(402).json({
        success: false,
        message: 'This request does not belong to you',
      });
    }

    return res.status(200).json({
      success: true,
      status: formatStatus(request.status),
      content: request,
    });
  }

  async next(req, res) {
    let newRequest;
    const { id } = req.params;

    const existsRequest = await Request.findByPk(id);
    const existsDoc = await Doc.findOne({
      where: { id_request: id, doc_type: 1 },
    });

    if (!existsRequest) {
      return res
        .status(404)
        .json({ success: false, message: 'Request not found.' });
    } else if (existsRequest.id_user !== req.userId) {
      return res.status(402).json({
        success: false,
        message: 'This request does not belong to you.',
      });
    } else if (existsRequest.status > 2) {
      createLog(existsRequest.id, 'There was an attempt to change after the proposal was finalized');

      return res
        .status(402)
        .json({ success: false, message: 'This request is finish.' });
    } else if (!existsDoc) {
      createLog(existsRequest.id, 'There was an attempt to change after the proposal was mandatory document is missing');

      return res.status(402).json({
        success: false,
        message: 'Mandatory document is missing, you cannot proceed.',
      });
    }

    try {

      if( existsRequest.status === 2 ){

        const sort = Math.floor(Math.random() * 2 + 1);

        newRequest = await existsRequest.update({
          status: existsRequest.status + sort,
        });
      }else{
        newRequest = await existsRequest.update({
          status: existsRequest.status + 1,
        });
      }

      createLog(existsRequest.id,
        `Updated status. Before status ${formatStatus(existsRequest.status)}, after status ${formatStatus(newRequest.status)}`
      );

      if(newRequest.status > 2){
        createLog(existsRequest.id, 'Proposal finish.');
      }

      return res.status(200).json({
        success: true,
        status: formatStatus(newRequest.status),
        content: newRequest,
      });
    } catch (err) {
      return res.status(400).json({ success: false, error: err });
    }
  }
}

export default new ProposalController();
