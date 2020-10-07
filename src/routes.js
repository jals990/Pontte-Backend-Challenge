import Router from 'express';
import multer from 'multer';

import multerConfig from './config/multer';

import FileController from './app/controllers/FileController';
import ProposalController from './app/controllers/ProposalController';
import SessionController from './app/controllers/SessionController';
import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/session/store', SessionController.store);
routes.post('/proposal/store', ProposalController.store);

routes.use(authMiddleware);

routes.post('/file/store/:id', upload.single('file'), FileController.store);

routes.put('/proposal/update/:id', ProposalController.update);
routes.get('/proposal/show/:id', ProposalController.show);
routes.post('/proposal/next/:id', ProposalController.next);

export default routes;
