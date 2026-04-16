import { Doacao } from "../models/Doacao.js";
import sequelize from '../config/database-connection.js';

class DoacaoService {

  static async findAll() {
    const objs = await Doacao.findAll({ include: { all: true, nested: true } });
    return objs;
  }

  static async findByPk(req) {
    const { id } = req.params;
    const obj = await Doacao.findByPk(id, { include: { all: true, nested: true } });
    return obj;
  }

  static async create(req) {
    const {
        data,
        quantia,
        doador,
        enfermeiro,
        unidadeColeta
    } = req.body;

    if (quantia == null) throw "Quantia deve ser preenchida!"
    if (quantia !== 450 && quantia !== 500) {
        throw "Quantia deve ser igual a 450ml ou 500ml!";
    }
    if (doador == null) throw 'Doador deve ser preenchido!';
    if (enfermeiro == null) throw 'Enfermeiro deve ser preenchido!';
    if (unidadeColeta == null) throw 'Unidade de coleta deve ser preenchida!';

    const t = await sequelize.transaction();

    try {
      const obj = await Doacao.create({
        data,
        quantia,
        doadorId: doador.id,
        enfermeiroId: enfermeiro.id,
        unidadeColetaId: unidadeColeta.id
      }, { transaction: t });

      await t.commit();

      return await Doacao.findByPk(obj.id, { include: { all: true, nested: true } });

    } catch (error) {
        await t.rollback();
        throw error;
    }
  }

  static async update(req) {
    const { id } = req.params;
    const {
        data,
        quantia,
        doador,
        enfermeiro,
        unidadeColeta
    } = req.body;

    if (doador == null) throw 'Doador deve ser preenchido!';
    if (enfermeiro == null) throw 'Enfermeiro deve ser preenchido!';
    if (unidadeColeta == null) throw 'Unidade de coleta deve ser preenchida!';

    const obj = await Doacao.findByPk(id);

    if (obj == null) throw 'Doação não encontrada!';

    const t = await sequelize.transaction();

    try {
      Object.assign(obj, {
        data,
        quantia,
        doadorId: doador.id,
        enfermeiroId: enfermeiro.id,
        unidadeColetaId: unidadeColeta.id
      });

      await obj.save({ transaction: t });

      await t.commit();

      return await Doacao.findByPk(obj.id, { include: { all: true, nested: true } });

    } catch (error) {
        await t.rollback();
        throw error;
    }
  }

  static async delete(req) {
    const { id } = req.params;
    const obj = await Doacao.findByPk(id);

    if (obj == null) throw 'Doação não encontrada!';

    const t = await sequelize.transaction();

    try {
      await obj.destroy({ transaction: t });

      await t.commit();

      return obj;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

}

export { DoacaoService };