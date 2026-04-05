import { HospitalService } from "../services/HospitalService.js";

class HospitalController {
  
  static async findAll(req, res, next) {
    HospitalService.findAll()
        .then(objs => res.json(objs))
        .catch(next);
  }

  static async findByPk(req, res, next) {
    HospitalService.findByPk(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

  static async create(req, res, next) {
    HospitalService.create(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

  static async update(req, res, next) {
    HospitalService.update(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

  static async delete(req, res, next) {
    HospitalService.delete(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

}

export { HospitalController };