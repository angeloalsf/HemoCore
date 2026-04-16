import { DoacaoService } from "../services/DoacaoService.js";

class DoacaoController {
  
  static async findAll(req, res, next) {
    DoacaoService.findAll()
        .then(objs => res.json(objs))
        .catch(next);
  }

  static async findByPk(req, res, next) {
    DoacaoService.findByPk(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

  static async create(req, res, next) {
    DoacaoService.create(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

  static async update(req, res, next) {
    DoacaoService.update(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

  static async delete(req, res, next) {
    DoacaoService.delete(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

}

export { DoacaoController };