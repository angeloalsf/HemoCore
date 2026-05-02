import { Campanha } from '../models/Campanha.js';
import { ItemCampanha } from '../models/ItemCampanha.js';
import { UnidadeColeta } from '../models/UnidadeColeta.js';
import sequelize from '../config/database-connection.js';
import { Op } from 'sequelize';

class CampanhaService {

    static async findAll() {
        const objs = await Campanha.findAll({ include: { all: true, nested: true } });
        return objs;
    }

    static async findByPk(req) {
        const { id } = req.params;
        const obj = await Campanha.findByPk(id, { include: { all: true, nested: true } });
        return obj;
    }

    static async create(req) {
        const { nome, data, unidadeColeta, itensCampanha } = req.body;
        const idUnidade = unidadeColeta != null ? unidadeColeta.id : null;

        if (!itensCampanha || itensCampanha.length === 0) {
            throw 'Os Itens da Campanha (metas de doação) devem ser preenchidos!';
        }
        if (await this.verificarRegrasDeNegocio(req)) {
            const t = await sequelize.transaction();
            try {
                const obj = await Campanha.create(
                    { nome, data, unidadeColetaId: idUnidade },
                    { transaction: t }
                );
                await Promise.all(
                    itensCampanha.map(item =>
                        obj.createItemCampanha(
                            {
                                metaColeta: item.metaColeta,
                                quantiaColetada: 0,
                                tipoSanguineoId: item.tipoSanguineo ? item.tipoSanguineo.id : null
                            },
                            { transaction: t }
                        )
                    )
                );
                await t.commit();
                return await Campanha.findByPk(obj.id, { include: { all: true, nested: true } });

            } catch (error) {
                await t.rollback();
                if (error.name === 'SequelizeValidationError') throw error;
                throw "Erro ao processar a campanha no banco de dados!";
            }
        }
    }

    static async update(req) {
        const { id } = req.params;
        const { nome, data, unidadeColeta, itensCampanha } = req.body;
        const idUnidade = unidadeColeta != null ? unidadeColeta.id : null;

        if (!itensCampanha || itensCampanha.length === 0) {
            throw 'Os Itens da Campanha (metas de doação) devem ser preenchidos!';
        }
        const obj = await Campanha.findByPk(id, { include: { all: true, nested: true } });
        if (obj == null) throw 'Campanha não encontrada!';
        await this.verificarRegrasDeNegocio(req);
        const t = await sequelize.transaction();

        try {
            Object.assign(obj, { nome, data, unidadeColetaId: idUnidade });
            await obj.save({ transaction: t });

            await ItemCampanha.destroy({
                where: { campanhaId: obj.id },
                transaction: t
            });
            await Promise.all(
                itensCampanha.map(item =>
                    obj.createItemCampanha(
                        {
                            metaColeta: item.metaColeta,
                            quantiaColetada: item.quantiaColetada || 0,
                            tipoSanguineoId: item.tipoSanguineo ? item.tipoSanguineo.id : null
                        },
                        { transaction: t }
                    )
                )
            );
            await t.commit();
            return await Campanha.findByPk(obj.id, { include: { all: true, nested: true } });

        } catch (error) {
            await t.rollback();
            if (error.name === 'SequelizeValidationError') throw error;
            throw "Pelo menos um dos itens informados não foi encontrado ou é inválido!";
        }
    }

    static async delete(req) {
        const { id } = req.params;
        const obj = await Campanha.findByPk(id);
        if (obj == null) throw 'Campanha não encontrada!';

        try {
            await obj.destroy();
            return obj;
        } catch (error) {
            throw "Não foi possível remover a campanha!";
        }
    }

    static async verificarRegrasDeNegocio(req) {
        // Regra de Negócio 1: A data não pode coincidir com outra agendada para a MESMA Unidade
        const { data, unidadeColeta } = req.body;
        const idCampanhaAtual = req.params && req.params.id ? parseInt(req.params.id) : null;

        if (!data || !unidadeColeta || !unidadeColeta.id) return true;
        const filtroRegra1 = {
            unidadeColetaId: unidadeColeta.id,
            data: data
        };
        if (idCampanhaAtual) filtroRegra1.id = { [Op.ne]: idCampanhaAtual };

        const conflitoUnidade = await Campanha.findOne({ where: filtroRegra1 });
        if (conflitoUnidade) {
            throw "A data da campanha não pode coincidir com outra já agendada para esta mesma Unidade de Coleta!";
        }


        // Regra de Negócio 2: Apenas 1 campanha na MESMA Cidade no período de 7 dias
        const unidade = await UnidadeColeta.findByPk(unidadeColeta.id);
        
        if (!unidade) throw "Unidade de Coleta informada não existe!";
        const dataInformada = new Date(data);
        const dataInicio = new Date(dataInformada);
        dataInicio.setUTCDate(dataInicio.getUTCDate() - 7);

        const dataFim = new Date(dataInformada);
        dataFim.setUTCDate(dataFim.getUTCDate() + 7);

        const filtroRegra2 = {
            data: {
                [Op.between]: [
                    dataInicio.toISOString().split('T')[0],
                    dataFim.toISOString().split('T')[0]
                ]
            }
        };

        if (idCampanhaAtual) filtroRegra2.id = { [Op.ne]: idCampanhaAtual };
        const conflitoCidade = await Campanha.findOne({
            where: filtroRegra2,
            include: [{
                model: UnidadeColeta,
                as: 'unidadeColeta',
                where: { cidadeId: unidade.cidadeId }
            }]
        });
        if (conflitoCidade) {
            throw "Não é permitido agendar mais de uma campanha na mesma cidade dentro de um período de 7 dias!";
        }

        return true;
    }
}

export { CampanhaService };