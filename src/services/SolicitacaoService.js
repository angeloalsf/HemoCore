import { Solicitacao } from '../models/Solicitacao.js';
import { TipoSanguineo } from '../models/TipoSanguineo.js';
import { TipoSanguineoService } from './TipoSanguineoService.js';
import sequelize from '../config/database-connection.js';

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

    // Validação pré-transação para evitar rollbacks desnecessários
    await this.verificarRegrasDeNegocio(req);

    const t = await sequelize.transaction();

    try {
      const obj = await Solicitacao.create(
        { data, status, urgencia, observacao, hospitalId: hospital.id },
        { transaction: t }
      );

      // Criar itens e reduzir estoque
      for (const item of itensSolicitacao) {
        await obj.createItemSolicitacao(
          { 
            quantidade: item.quantidade, 
            tipoSanguineoId: item.tipoSanguineo.id, 
            solicitacaoId: obj.id 
          }, 
          { transaction: t }
        );

        await TipoSanguineoService.removerEstoque(item.tipoSanguineo.id, item.quantidade, t);
      }

      await t.commit();
      return await Solicitacao.findByPk(obj.id, { include: { all: true, nested: true } });

    } catch (error) {
      await t.rollback();
      throw "Pelo menos um dos itens informados não foi encontrado!";
    }
  }

  static async update(req) {
    const { id } = req.params;
    const { data, status, urgencia, observacao, hospital, itensSolicitacao } = req.body;

    const obj = await Solicitacao.findByPk(id, { include: { all: true, nested: true } });
    if (obj == null) throw 'Solicitação não encontrada!';

    // Validação pré-transação
    await this.verificarRegrasDeNegocio(req);

    const t = await sequelize.transaction();

    try {
      // 1. Devolver estoque dos itens antigos e removê-los
      for (const itemAntigo of obj.itensSolicitacao) {
        await TipoSanguineoService.adicionarEstoque(itemAntigo.tipoSanguineoId, itemAntigo.quantidade, t);
        await itemAntigo.destroy({ transaction: t });
      }

      // 2. Atualizar dados da solicitação
      Object.assign(obj, { data, status, urgencia, observacao, hospitalId: hospital.id });
      await obj.save({ transaction: t });

      // 3. Criar novos itens e reduzir estoque
      for (const itemNovo of itensSolicitacao) {
        await obj.createItemSolicitacao(
          { 
            quantidade: itemNovo.quantidade, 
            tipoSanguineoId: itemNovo.tipoSanguineo.id, 
            solicitacaoId: obj.id 
          }, 
          { transaction: t }
        );

        await TipoSanguineoService.removerEstoque(itemNovo.tipoSanguineo.id, itemNovo.quantidade, t);
      }

      await t.commit();
      return await Solicitacao.findByPk(obj.id, { include: { all: true, nested: true } });

    } catch (error) {
      await t.rollback();
      throw "Pelo menos um dos itens informados não foi encontrado!";
    }
  }

  static async delete(req) {
    const { id } = req.params;
    const obj = await Solicitacao.findByPk(id, { include: { all: true, nested: true } });

    if (obj == null) throw 'Solicitação não encontrada!';

    const t = await sequelize.transaction();

    try {
      // Devolver estoque antes de deletar
      for (const item of obj.itensSolicitacao) {
        await TipoSanguineoService.adicionarEstoque(item.tipoSanguineoId, item.quantidade, t);
        await item.destroy({ transaction: t });
      }

      await obj.destroy({ transaction: t });
      await t.commit();
      return obj;
    } catch (error) {
      await t.rollback();
      throw "Não é possível remover uma solicitação que possui itens vinculados!";
    }
  }

  // Regra de Negócio 1: A solicitação somente poderá ser marcada como “Realizada” se houver quantidade suficiente do item solicitado em estoque no momento da efetivação.
  // Regra de Negócio 2: Se já houver mais de 2 solicitações canceladas para um mesmo hospital num período de 7 dias para o mesmo tipo sanguíneo, o mesmo ganha prioridade no processo. 
  static async verificarRegrasDeNegocio(req) {
    const { itensSolicitacao } = req.body;
    
    if (!itensSolicitacao || itensSolicitacao.length === 0) {
      throw "A solicitação deve conter pelo menos um item!";
    }

    // Regra de Negócio 1: Validar estoque para cada item da solicitação
    for (const item of itensSolicitacao) {
      await this.validarEstoque(item);
    }

    // Regra de Negócio 2: Verificar histórico de solicitações canceladas para o hospital e tipo sanguíneo

    return true;
  }

  static async validarEstoque(item) {
    const { tipoSanguineo, quantidade } = item;
    const tipoSanguineoFromBanco = await TipoSanguineo.findByPk(tipoSanguineo.id);

    if (!tipoSanguineoFromBanco) {
      throw `Tipo sanguíneo ID ${tipoSanguineo.id} não encontrado!`;
    }

    if (tipoSanguineoFromBanco.quantidade < quantidade) {
      throw `Estoque insuficiente para o tipo sanguíneo ${tipoSanguineoFromBanco.getModelVerboso()}: disponível ${tipoSanguineoFromBanco.quantidade}, solicitado ${quantidade}.`;
    }
  }

}

export { SolicitacaoService };