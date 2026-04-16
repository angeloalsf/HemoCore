import { Solicitacao } from '../models/Solicitacao.js';

import sequelize from '../config/database-connection.js';
import { QueryTypes } from 'sequelize';

class SolicitacaoService {

  static async findAll() {
    const objs = await Solicitacao.findAll({ include: { all: true, nested: true } });
    return objs;
  }

  static async findByPk(req) {
    const { id } = req.params;
    const obj = await Solicitacao.findByPk(id, { include: { all: true, nested: true } });
    return obj;
  }

  static async create(req) {
    const { data, status, urgencia, observacao, hospital, itensSolicitacao } = req.body;

    if (await this.verificarRegrasDeNegocio(req)) {
      const t = await sequelize.transaction();
      const obj = await Solicitacao.create({ data, status, urgencia, observacao, hospitalId: hospital.id }, { transaction: t });

      try {
        await Promise.all(itensSolicitacao.map(item => obj.createItemSolicitacao({ quantidade: item.quantidade, tipoSanguineoId: item.tipoSanguineo.id, solicitacaoId: obj.id }, { transaction: t }) ));
        await t.commit();

        return await Solicitacao.findByPk(obj.id, { include: { all: true, nested: true } });

      } catch (error) {
        await t.rollback();
        throw "Pelo menos um dos itens informados não foi encontrado!";
      }
    }
  }

  static async update(req) {
    const { id } = req.params;
    const { data, status, urgencia, observacao, hospital, itensSolicitacao } = req.body;

    const obj = await Solicitacao.findByPk(id, { include: { all: true, nested: true } });

    if (obj == null) throw 'Solicitação não encontrada!';

    const t = await sequelize.transaction();
    Object.assign(obj, { data, status, urgencia, observacao, hospitalId: hospital.id });
    await obj.save({ transaction: t }); // Salvando os dados simples do objeto Solicitacao

    try {
      await Promise.all(obj.itensSolicitacao.map(item => item.destroy({ transaction: t }))); // destruindo todos itensSolicitacao desta solicitação
      await Promise.all(itensSolicitacao.map(item => obj.createItemSolicitacao({ quantidade: item.quantidade, tipoSanguineoId: item.tipoSanguineo.id, solicitacaoId: obj.id }, { transaction: t })));

      await t.commit();

      return await Solicitacao.findByPk(obj.id, { include: { all: true, nested: true } });

    } catch (error) {
      await t.rollback();
      throw "Pelo menos um dos itens informados não foi encontrado!";
    }
  }

  static async delete(req) {
    const { id } = req.params;
    const obj = await Solicitacao.findByPk(id);

    if (obj == null) throw 'Solicitação não encontrada!';
    
    try {
      await obj.destroy();
      return obj;
    } catch (error) {
      throw "Não é possível remover uma solicitação que possui itens vinculados!";
    }
  }

  // Implementando as regras de negócio relacionadas ao processo de negócio Empréstimo
  // Regra de Negócio 1: Cliente não pode ter multas não pagas
  // Regra de Negócio 2: Não podem ser emprestadas fitas reservadas para outros clientes
  // Regra de Negócio 3: Não podem ser emprestadas fitas com status disponível false
  static async verificarRegrasDeNegocio(req) {
    return true;
  }

}

export { SolicitacaoService };