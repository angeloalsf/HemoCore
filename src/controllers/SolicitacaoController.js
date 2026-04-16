import { SolicitacaoService } from "../services/SolicitacaoService.js";

class SolicitacaoController {
  
  static async findAll(req, res, next) {
    SolicitacaoService.findAll()
        .then(objs => res.json(objs))
        .catch(next);
  }

  static async findByPk(req, res, next) {
    SolicitacaoService.findByPk(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

  static async create(req, res, next) { 
    SolicitacaoService.create(req)
          .then(obj => res.json(obj))
          .catch(next);
  }

  static async update(req, res, next) {
    SolicitacaoService.update(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

  static async delete(req, res, next) {
    SolicitacaoService.delete(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

}

export { SolicitacaoController };