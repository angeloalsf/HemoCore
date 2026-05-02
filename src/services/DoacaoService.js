import { Doacao } from "../models/Doacao.js";
import { Doador } from "../models/Doador.js";
import sequelize from '../config/database-connection.js';
import { Op } from 'sequelize';

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

    if (doador == null) throw 'Doador deve ser preenchido!';
    if (enfermeiro == null) throw 'Enfermeiro deve ser preenchido!';
    if (unidadeColeta == null) throw 'Unidade de coleta deve ser preenchida!';

    if (await this.verificarRegrasDeNegocio(req)) {

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

    if (await this.verificarRegrasDeNegocio(req, id)) {

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

  static async verificarRegrasDeNegocio(req, doacaoId = null) {

    const { data, quantia, doador } = req.body;

    if (!doador) throw 'Doador deve ser informado!';

    // Regra: quantidade de sangue
    if (quantia == null) throw "Quantia deve ser preenchida!";
    if (quantia !== 450 && quantia !== 500) {
      throw "Quantia deve ser igual a 450ml ou 500ml!";
    }

    const doadorCompleto = await Doador.findByPk(doador.id);

    if (!doadorCompleto) throw "Doador não encontrado!";

    // Regra: status apto
    if (doadorCompleto.status !== 'APTO') {
      throw `Doador está inapto para doação. Status atual: ${doadorCompleto.status}`;
    }

    // Buscar doações do ano atual
    const inicioAno = new Date(new Date().getFullYear(), 0, 1);
    const hoje = new Date();

    const doacoes = await Doacao.findAll({
      where: {
        doadorId: doador.id,
        data: {
          [Op.between]: [inicioAno, hoje]
        }
      },
      order: [['data', 'DESC']]
    });

    // Remove a própria doação no update
    const doacoesFiltradas = doacaoId
      ? doacoes.filter(d => d.id !== doacaoId)
      : doacoes;

    const sexo = doadorCompleto.sexo;
    const limite = sexo === 'M' ? 4 : 3;
    const intervaloMinimo = sexo === 'M' ? 60 : 90;

    // Regra: limite anual
    if (doacoesFiltradas.length >= limite) {
      await doadorCompleto.update({ status: 'INAPTO' });
      throw `Limite anual atingido: ${doacoesFiltradas.length}/${limite} doações já realizadas este ano.`;
    }

    // Regra: intervalo entre doações
    if (doacoesFiltradas.length > 0) {
      const ultimaDoacao = new Date(doacoesFiltradas[0].data);
      const novaData = new Date(data);

      const diffDias = Math.floor(
        (novaData - ultimaDoacao) / (1000 * 60 * 60 * 24)
      );

      const diasRestantes = intervaloMinimo - diffDias;

      if (diffDias < intervaloMinimo) {
        throw `Intervalo mínimo não respeitado. Aguarde mais ${diasRestantes} dias para próxima doação.`;
      }
    }

    return true;
  }

}

export { DoacaoService };