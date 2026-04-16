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

        if (await this.verificarRegrasDeNegocio(req)) {
            const t = await sequelize.transaction();

            try {
                const obj = await Campanha.create(
                    { nome, data, unidadeColetaId: unidadeColeta.id },
                    { transaction: t }
                );


                await Promise.all(
                    itensCampanha.map(item =>
                        obj.createItemCampanha(
                            {
                                metaColeta: item.metaColeta,
                                quantiaColetada: 0,
                                tipoSanguineoId: item.tipoSanguineo.id
                            },
                            { transaction: t }
                        )
                    )
                );

                await t.commit();
                return await Campanha.findByPk(obj.id, { include: { all: true, nested: true } });

            } catch (error) {
                await t.rollback();
                throw "Erro ao cadastrar a campanha e suas metas. Verifique os dados enviados!";
            }
        }
    }

    static async update(req) {
        const { id } = req.params;
        const { nome, data, unidadeColeta, itensCampanha } = req.body;

        const obj = await Campanha.findByPk(id, { include: { all: true, nested: true } });
        if (obj == null) throw 'Campanha não encontrada!';

        await this.verificarRegrasDeNegocio(req);

        const t = await sequelize.transaction();

        try {
            Object.assign(obj, { nome, data, unidadeColetaId: unidadeColeta.id });
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
                            tipoSanguineoId: item.tipoSanguineo.id
                        },
                        { transaction: t }
                    )
                )
            );

            await t.commit();
            return await Campanha.findByPk(obj.id, { include: { all: true, nested: true } });

        } catch (error) {
            await t.rollback();
            throw "Erro ao atualizar a campanha. Verifique os dados enviados!";
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

        // Regra de Negócio 1: A data da campanha não pode coincidir com outra já agendada para esta mesma Unidade de Coleta
        const { data, unidadeColeta } = req.body;

        const idCampanhaAtual = req.params ? req.params.id : null;

        if (!data || !unidadeColeta || !unidadeColeta.id) return true;

        const whereRegra2 = {
            unidadeColetaId: unidadeColeta.id,
            data: data
        };
        if (idCampanhaAtual) whereRegra2.id = { [Op.ne]: idCampanhaAtual };

        const conflitoUnidade = await Campanha.findOne({ where: whereRegra2 });
        if (conflitoUnidade) {
            throw "A data da campanha não pode coincidir com outra já agendada para esta mesma Unidade de Coleta!";
        }


        // Regra de Negócio 2: Não é permitido agendar mais de uma campanha na mesma cidade dentro de um período de 7 dias
        const unidade = await UnidadeColeta.findByPk(unidadeColeta.id);
        if (!unidade) throw "Unidade de Coleta informada não existe!";

        const dataInformada = new Date(data);

        const dataInicio = new Date(dataInformada);
        dataInicio.setDate(dataInicio.getDate() - 7);

        const dataFim = new Date(dataInformada);
        dataFim.setDate(dataFim.getDate() + 7);

        const whereRegra1 = {
            data: { [Op.between]: [dataInicio.toISOString().split('T')[0], dataFim.toISOString().split('T')[0]] }
        };
        if (idCampanhaAtual) whereRegra1.id = { [Op.ne]: idCampanhaAtual };

        const conflitoCidade = await Campanha.findOne({
            where: whereRegra1,
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