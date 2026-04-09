import { EnfermeiroService } from "../services/EnfermeiroService.js";

class EnfermeiroController {
  
  static async findAll(req, res, next) {
    EnfermeiroService.findAll()
        .then(objs => res.json(objs))
        .catch(next);
  }

  static async findByPk(req, res, next) {
    EnfermeiroService.findByPk(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

  static async create(req, res, next) {
    EnfermeiroService.create(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

  static async update(req, res, next) {
    EnfermeiroService.update(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

  static async delete(req, res, next) {
    EnfermeiroService.delete(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

}

export { EnfermeiroController };