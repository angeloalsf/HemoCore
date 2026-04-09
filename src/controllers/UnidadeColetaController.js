import { UnidadeColetaService } from "../services/UnidadeColetaService.js";

class UnidadeColetaController { 

    static async findAll(req, res, next) {
        UnidadeColetaService.findAll()
            .then(objs => res.json(objs))
            .catch(next);
    }

    static async findByPk(req, res, next) {
        UnidadeColetaService.findByPk(req)
            .then(obj => res.json(obj))
            .catch(next);
    }

    static async create(req, res, next) {
        UnidadeColetaService.create(req)
            .then(obj => res.json(obj))
            .catch(next);
    }

    static async update(req, res, next) {
        UnidadeColetaService.update(req)
            .then(obj => res.json(obj))
            .catch(next);
    }

    static async delete(req, res, next) {
        UnidadeColetaService.delete(req)
            .then(() => res.status(204).end())
            .catch(next);
    }

}

export { UnidadeColetaController };