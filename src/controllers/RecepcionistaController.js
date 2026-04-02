import { RecepcionistaService } from "../services/RecepcionistaService.js";

class RecepcionistaController {
  
  static async findAll(req, res, next) {
    RecepcionistaService.findAll()
        .then(objs => res.json(objs))
        .catch(next);
  }

  static async findByPk(req, res, next) {
    RecepcionistaService.findByPk(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

  static async create(req, res, next) {
    RecepcionistaService.create(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

  static async update(req, res, next) {
    RecepcionistaService.update(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

  static async delete(req, res, next) {
    RecepcionistaService.delete(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

}

export { RecepcionistaController };