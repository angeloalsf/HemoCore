import { CampanhaService } from "../services/CampanhaService.js";

class CampanhaController {

  static async findAll(req, res, next) {
    CampanhaService.findAll()
      .then(objs => res.json(objs))
      .catch(next);
  }

  static async findByPk(req, res, next) {
    CampanhaService.findByPk(req)
      .then(obj => res.json(obj))
      .catch(next);
  }

  static async create(req, res, next) {
    CampanhaService.create(req)
      .then(obj => res.json(obj))
      .catch(next);
  }

  static async update(req, res, next) {
    CampanhaService.update(req)
      .then(obj => res.json(obj))
      .catch(next);
  }

  static async delete(req, res, next) {
    CampanhaService.delete(req)
      .then(obj => res.json(obj))
      .catch(next);
  }

  static async findAgendaCampanhas(req, res, next) {
    CampanhaService.findAgendaCampanhas(req)
      .then(objs => res.json(objs))
      .catch(next);
  }

  static async findColetasPorCidade(req, res, next) {
    CampanhaService.findColetasPorCidade(req)
      .then(objs => res.json(objs))
      .catch(next);
  }

}

export { CampanhaController };