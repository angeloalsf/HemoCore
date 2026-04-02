import express from "express";

import { UfController } from './controllers/UfController.js';
import { RecepcionistaController } from './controllers/RecepcionistaController.js';
import { TipoSanguineoController } from './controllers/TipoSanguineoController.js';


const routes = express.Router();

routes.get('/ufs', UfController.findAll);
routes.get('/ufs/:id', UfController.findByPk);
routes.post('/ufs', UfController.create);
routes.put('/ufs/:id', UfController.update);
routes.delete('/ufs/:id', UfController.delete);

routes.get('/recepcionistas', RecepcionistaController.findAll);
routes.get('/recepcionistas/:id', RecepcionistaController.findByPk);
routes.post('/recepcionistas', RecepcionistaController.create);
routes.put('/recepcionistas/:id', RecepcionistaController.update);
routes.delete('/recepcionistas/:id', RecepcionistaController.delete);

routes.get('/tipos-sanguineos', TipoSanguineoController.findAll);
routes.get('/tipos-sanguineos/:id', TipoSanguineoController.findByPk);
routes.post('/tipos-sanguineos', TipoSanguineoController.create);
routes.put('/tipos-sanguineos/:id', TipoSanguineoController.update);
routes.delete('/tipos-sanguineos/:id', TipoSanguineoController.delete);

export default routes;