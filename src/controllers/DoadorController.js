import { DoadorService } from "../services/DoadorService.js";

class DoadorController {
  
  static async findAll(req, res, next) {
    DoadorService.findAll()
        .then(objs => res.json(objs))
        .catch(next);
  }

  static async findByPk(req, res, next) {
    DoadorService.findByPk(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

  static async create(req, res, next) {
    DoadorService.create(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

  static async update(req, res, next) {
    DoadorService.update(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

  static async delete(req, res, next) {
    DoadorService.delete(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

}

export { DoadorController };