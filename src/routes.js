import express from "express";

// import { UfController } from './controllers/UfController.js';
// import { CidadeController } from './controllers/CidadeController.js';
import { EnfermeiroController } from './controllers/EnfermeiroController.js';

const routes = express.Router();

// routes.get('/ufs', UfController.findAll);
// routes.get('/ufs/:id', UfController.findByPk);
// routes.post('/ufs', UfController.create);
// routes.put('/ufs/:id', UfController.update);
// routes.delete('/ufs/:id', UfController.delete);

// routes.get('/cidades', CidadeController.findAll);
// routes.get('/cidades/:id', CidadeController.findByPk);
// routes.post('/cidades', CidadeController.create);
// routes.put('/cidades/:id', CidadeController.update);
// routes.delete('/cidades/:id', CidadeController.delete);
// routes.get('/cidades/findByUf/:id', CidadeController.findByUf);

routes.get('/enfermeiro', EnfermeiroController.findAll);
routes.get('/enfermeiro/:id', EnfermeiroController.findByPk);
routes.post('/enfermeiro', EnfermeiroController.create);
routes.put('/enfermeiro/:id', EnfermeiroController.update);
routes.delete('/enfermeiro/:id', EnfermeiroController.delete);

export default routes;