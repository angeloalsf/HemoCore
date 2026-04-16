import { Cidade } from '../models/Cidade.js';

class CidadeService {

    static async findAll() {
        const objs = await Cidade.findAll({ include: { all: true, nested: true } });
        return objs;
    }

    static async findByUf(req) {
        const { id } = req.params;
        const objs = await Cidade.findAll({ where: { ufId: id }, include: { all: true, nested: true } });
        return objs;
    }

    static async findByPk(req) {
        const { id } = req.params;
        const obj = await Cidade.findByPk(id, { include: { all: true, nested: true } });
        return obj;
    }

    static async create(req) {
        const { nome, area, habitantes, uf } = req.body;

        const idUf = uf != null ? uf.id : null;

        const obj = await Cidade.create({ nome, area, habitantes, ufId: idUf });

        return await Cidade.findByPk(obj.id, { include: { all: true, nested: true } });
    }

    static async update(req) {
        const { id } = req.params;
        const { nome, area, habitantes, uf } = req.body;

        const idUf = uf != null ? uf.id : null;

        const obj = await Cidade.findByPk(id, { include: { all: true, nested: true } });
        if (obj == null) throw 'Cidade não encontrada!';

        Object.assign(obj, { nome, area, habitantes, ufId: idUf });

        await obj.save();

        return await Cidade.findByPk(obj.id, { include: { all: true, nested: true } });
    }

    static async delete(req) {
        const { id } = req.params;
        const obj = await Cidade.findByPk(id);
        if (obj == null) throw 'Cidade não encontrada!';
        try {
            await obj.destroy();
            return obj;
        } catch (error) {
            throw "Não é possível remover uma Cidade que possui dados relacionados!";
        }
    }
}

export { CidadeService };