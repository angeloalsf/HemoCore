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
        const errosEncontrados = [];

        const idCidade = (cidade && cidade.id) ? cidade.id : null;

        if (!idCidade) {
            errosEncontrados.push({ path: 'cidadeId', message: 'A Cidade da Unidade de Coleta deve ser preenchida no formato correto!' });
        }

        try {
            const unidadeTemp = UnidadeColeta.build({ nome, tipo_unidade, telefone, cidadeId: idCidade });
            await unidadeTemp.validate();
        } catch (err) {
            if (err.name === 'SequelizeValidationError') {
                errosEncontrados.push(...err.errors);
            }
        }

        if (errosEncontrados.length > 0) {
            const erroPacote = new Error();
            erroPacote.name = 'SequelizeValidationError';
            erroPacote.errors = errosEncontrados;
            throw erroPacote;
        }

        const obj = await UnidadeColeta.create({ nome, tipo_unidade, telefone, cidadeId: cidade.id });
        return await UnidadeColeta.findByPk(obj.id, { include: { all: true, nested: true } });
    }

    static async update(req) {
        const { id } = req.params;
        const { nome, tipo_unidade, telefone, cidade } = req.body;

        const errosEncontrados = [];
        const idCidade = (cidade && cidade.id) ? cidade.id : null;

        if (!idCidade) {
            errosEncontrados.push({ path: 'cidadeId', message: 'A Cidade da Unidade de Coleta deve ser preenchida no formato correto!' });
        }

        try {
            const unidadeTemp = UnidadeColeta.build({ nome, tipo_unidade, telefone, cidadeId: idCidade });
            await unidadeTemp.validate();
        } catch (err) {
            if (err.name === 'SequelizeValidationError') {
                errosEncontrados.push(...err.errors);
            }
        }

        if (errosEncontrados.length > 0) {
            const erroPacote = new Error();
            erroPacote.name = 'SequelizeValidationError';
            erroPacote.errors = errosEncontrados;
            throw erroPacote;
        }
        
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