import express from "express";

// import { CidadeController } from './controllers/CidadeController.js';
import { EnfermeiroController } from './controllers/EnfermeiroController.js';
import { TecnicoLaboratorioController } from "./controllers/TecnicoLaboratorioController.js";
import { HospitalController } from "./controllers/HospitalController.js";
import { DoadorController } from "./controllers/DoadorController.js";
import { DoacaoController } from "./controllers/DoacaoController.js";
import { UfController } from './controllers/UfController.js';
import { RecepcionistaController } from './controllers/RecepcionistaController.js';
import { TipoSanguineoController } from './controllers/TipoSanguineoController.js';
import { SolicitacaoController } from "./controllers/SolicitacaoController.js";


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

// routes.get('/cidades', CidadeController.findAll);
// routes.get('/cidades/:id', CidadeController.findByPk);
// routes.post('/cidades', CidadeController.create);
// routes.put('/cidades/:id', CidadeController.update);
// routes.delete('/cidades/:id', CidadeController.delete);
// routes.get('/cidades/findByUf/:id', CidadeController.findByUf);

routes.get('/hospitais', HospitalController.findAll);
routes.get('/hospitais/:id', HospitalController.findByPk);
routes.post('/hospitais', HospitalController.create);
routes.put('/hospitais/:id', HospitalController.update);
routes.delete('/hospitais/:id', HospitalController.delete);

routes.get('/enfermeiros', EnfermeiroController.findAll);
routes.get('/enfermeiros/:id', EnfermeiroController.findByPk);
routes.post('/enfermeiros', EnfermeiroController.create);
routes.put('/enfermeiros/:id', EnfermeiroController.update);
routes.delete('/enfermeiros/:id', EnfermeiroController.delete);

routes.get('/tecnicos-laboratorio', TecnicoLaboratorioController.findAll);
routes.get('/tecnicos-laboratorio/:id', TecnicoLaboratorioController.findByPk);
routes.post('/tecnicos-laboratorio', TecnicoLaboratorioController.create);
routes.put('/tecnicos-laboratorio/:id', TecnicoLaboratorioController.update);
routes.delete('/tecnicos-laboratorio/:id', TecnicoLaboratorioController.delete);

routes.get('/doadores', DoadorController.findAll);
routes.get('/doadores/:id', DoadorController.findByPk);
routes.post('/doadores', DoadorController.create);
routes.put('/doadores/:id', DoadorController.update);
routes.delete('/doadores/:id', DoadorController.delete);

routes.get('/doacoes', DoacaoController.findAll);
routes.get('/doacoes/:id', DoacaoController.findByPk);
routes.post('/doacoes', DoacaoController.create);
routes.put('/doacoes/:id', DoacaoController.update);
routes.delete('/doacoes/:id', DoacaoController.delete);

routes.get('/solicitacoes', SolicitacaoController.findAll);
routes.get('/solicitacoes/:id', SolicitacaoController.findByPk);
routes.post('/solicitacoes', SolicitacaoController.create);
routes.put('/solicitacoes/:id', SolicitacaoController.update);
routes.delete('/solicitacoes/:id', SolicitacaoController.delete);


export default routes;