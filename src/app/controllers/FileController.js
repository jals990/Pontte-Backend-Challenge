import { Op } from 'sequelize';
import Doc from '../models/Doc';
import File from '../models/File';
import Request from '../models/Request';
import { v4 as uuidv4 } from 'uuid';
import { formatStatus } from '../utils/format';
import createLog from './LogController';

class FileController {
  async store(req, res) {
    if (!req.params || !req.body.doc_type || !req.file) {
      console.log(req.file);
      return res.status(400).json({
        success: false,
        message: 'Verify parameters, consult documentation.',
      });
    }

    const { id: id_request } = req.params;
    const doc_type = req.body.doc_type;
    const { originalname: name, key: path, size } = req.file;

    const reqExists = await Request.findByPk(id_request);

    if (!reqExists) {
      return res
        .status(404)
        .json({ success: false, message: 'Request not found' });
    } else if (reqExists.id_user !== req.userId) {
      createLog(reqExists.id, `The user ${req.userId} tried to change this proposal`);

      return res.status(402).json({
        success: false,
        message: 'This request does not belong to you',
      });
    } else if (reqExists.status > 2) {
      createLog(reqExists.id, 'An attempt was made to change a mandatory document missing.');

      return res.status(402).json({
        success: false,
        message: 'This request not accepted documents.',
        status: formatStatus(reqExists.status),
        request: reqExists,
      });
    }

    if (doc_type < 3) {
      const docExists = await Doc.findOne({
        where: { doc_type, id_request },
      });

      if (docExists) {
        createLog(reqExists.id, 'Document type already registered.');

        return res
          .status(400)
          .json({ success: false, message: 'Document already registered.' });
      }
    }

    if (doc_type > 3) {
      createLog(reqExists.id, 'Attempt to save an unsupported document type, see the documentation.');

      return res.status(400).json({
        success: false,
        message: 'Document type not supported, consult documentation.',
      });
    }

    try {
      const file = await File.create({
        id: uuidv4(),
        name,
        path,
        size,
      });

      const doc = await Doc.create({
        doc_type,
        id_request: reqExists.id,
        id_file: file.id,
      });

      createLog(reqExists.id, `Document accepted and saved. Id ${doc.id}`);

      return res.status(200).json({
        success: true,
        message: `Document accepted and saved. Id ${doc.id}`,
      });
    } catch (err) {
      return res.status(400).json({ success: false, error: err });
    }
  }
}

export default new FileController();
