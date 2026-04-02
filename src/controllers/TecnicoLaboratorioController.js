import { TecnicoLaboratorioService } from "../services/TecnicoLaboratorioService.js";

class TecnicoLaboratorioController {
  
  static async findAll(req, res, next) {
    TecnicoLaboratorioService.findAll()
        .then(objs => res.json(objs))
        .catch(next);
  }

  static async findByPk(req, res, next) {
    TecnicoLaboratorioService.findByPk(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

  static async create(req, res, next) {
    TecnicoLaboratorioService.create(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

  static async update(req, res, next) {
    TecnicoLaboratorioService.update(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

  static async delete(req, res, next) {
    TecnicoLaboratorioService.delete(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

}

export { TecnicoLaboratorioController };