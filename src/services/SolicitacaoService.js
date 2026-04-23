import { Solicitacao } from '../models/Solicitacao.js';

import sequelize from '../config/database-connection.js';
import { QueryTypes } from 'sequelize';
import { TipoSanguineo } from '../models/TipoSanguineo.js';

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

        await this.reduzirEstoqueTipoSanguineo(itensSolicitacao, t);

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
      await this.aumentarEstoqueTipoSanguineo(obj.itensSolicitacao, t);

      await Promise.all(itensSolicitacao.map(item => obj.createItemSolicitacao({ quantidade: item.quantidade, tipoSanguineoId: item.tipoSanguineo.id, solicitacaoId: obj.id }, { transaction: t })));
      await this.reduzirEstoqueTipoSanguineo(itensSolicitacao, t);

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

  static async reduzirEstoqueTipoSanguineo(item, t) {
    await this.ajustarEstoqueTipoSanguineo(item, -item.quantidade, t);
  }

  static async aumentarEstoqueTipoSanguineo(item, t) {
    await this.ajustarEstoqueTipoSanguineo(item, item.quantidade, t);
  }


  // Itera a lista de itens de solicitação e reduz a quantidade do tipo sanguíneo correspondente no banco de dados
  static async ajustarEstoqueTipoSanguineo(itensSolicitacao, t) {
    await Promise.all(
      itensSolicitacao.map(item => this.ajustarEstoqueTipoSanguineoItem(item, t))
    );
  }

  // Itera um item e reduz a quantidade do tipo sanguíneo correspondente no banco de dados
  static async ajustarEstoqueTipoSanguineoItem(item, t) {
    const { tipoSanguineo, quantidade } = item;
    const tipoSanguineoFromBanco = await TipoSanguineo.findByPk(tipoSanguineo.id);

    if (!tipoSanguineoFromBanco) throw `Tipo Sanguíneo não encontrado!`;

    tipoSanguineoFromBanco.quantidade += quantidade;
    await tipoSanguineoFromBanco.save({ transaction: t });
  }

  // Regra de Negócio 1: A solicitação somente poderá ser marcada como “Realizada” se houver quantidade suficiente do item solicitado em estoque no momento da efetivação.
  // Regra de Negócio 2: Se já houver mais de 2 solicitações canceladas para um mesmo hospital num período de 7 dias para o mesmo tipo sanguíneo, o mesmo ganha prioridade no processo. 
  static async verificarRegrasDeNegocio(req) {
    const { itensSolicitacao } = req.body;
    
    // Regra de Negócio 1: A solicitação somente poderá ser marcada como “Realizada” se houver quantidade suficiente do item solicitado em estoque no momento da efetivação
    await this.validarEstoqueDosItens(itensSolicitacao);

    return true;
  }

  static async validarEstoqueDosItens(itensSolicitacao) {
    await Promise.all(
      itensSolicitacao.map(item => this.validarEstoque(item))
    );
  }

  // Responsabilidade única: validar UM item
  static async validarEstoque(item) {
    const { tipoSanguineo, quantidade } = item;

    const tipoSanguineoFromBanco = await TipoSanguineo.findByPk(tipoSanguineo.id);
    console.log(`Validando estoque para o tipo sanguíneo ${tipoSanguineoFromBanco.getModelVerboso()}: disponível ${tipoSanguineoFromBanco.quantidade}, solicitado ${quantidade}.`);

    if (!tipoSanguineoFromBanco) {
      throw new Error(`Tipo sanguíneo ${tipoSanguineo.id} não encontrado`);
    }

    if (tipoSanguineoFromBanco.quantidade < quantidade) {
      throw `Estoque insuficiente para o tipo sanguíneo ${tipoSanguineoFromBanco.getModelVerboso()}: disponível ${tipoSanguineoFromBanco.quantidade}, solicitado ${quantidade}.`;
    }
  }

}

export { SolicitacaoService };