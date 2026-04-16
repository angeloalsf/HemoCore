import { UnidadeColeta } from '../models/UnidadeColeta.js';

class UnidadeColetaService {

    static async findAll() {
        const objs = await UnidadeColeta.findAll({ include: { all: true, nested: true } });
        return objs;
    }

    static async findByPk(req) {
        const { id } = req.params;
        const obj = await UnidadeColeta.findByPk(id, { include: { all: true, nested: true } });
        return obj;
    }

    static async create(req) {
        const { nome, tipo_unidade, telefone, cidade } = req.body;

        const obj = await UnidadeColeta.create({ nome, tipo_unidade, telefone, cidadeId: cidade.id });
        return await UnidadeColeta.findByPk(obj.id, { include: { all: true, nested: true } });
    }

    static async update(req) {
        const { id } = req.params;
        const { nome, tipo_unidade, telefone, cidade } = req.body;

        const obj = await UnidadeColeta.findByPk(id, { include: { all: true, nested: true } });

        if (obj == null) throw 'Unidade de Coleta não encontrada!';
        Object.assign(obj, { nome, tipo_unidade, telefone, cidadeId: cidade.id });
        await obj.save();
        return await UnidadeColeta.findByPk(id, { include: { all: true, nested: true } });
    }

    static async delete(req) {
        const { id } = req.params;
        const obj = await UnidadeColeta.findByPk(id);
        if (obj == null) throw 'Unidade de Coleta não encontrada!';
        try {
            await obj.destroy();
            return obj;
        } catch (error) {
            throw "Não é possível remover uma Unidade de Coleta que possui Campanhas!";
        }
    }
}

export { UnidadeColetaService };