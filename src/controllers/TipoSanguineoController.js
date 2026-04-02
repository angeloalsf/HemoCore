import { TipoSanguineoService } from "../services/TipoSanguineoService.js";

class TipoSanguineoController {
  
  static async findAll(req, res, next) {
    TipoSanguineoService.findAll()
        .then(objs => res.json(objs))
        .catch(next);
  }

  static async findByPk(req, res, next) {
    TipoSanguineoService.findByPk(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

  static async create(req, res, next) {
    TipoSanguineoService.create(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

  static async update(req, res, next) {
    TipoSanguineoService.update(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

  static async delete(req, res, next) {
    TipoSanguineoService.delete(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

}

export { TipoSanguineoController };