import { Solicitacao } from '../models/Solicitacao.js';
import { TipoSanguineo } from '../models/TipoSanguineo.js';
import { ItemSolicitacao } from '../models/ItemSolicitacao.js';
import { TipoSanguineoService } from './TipoSanguineoService.js';
import sequelize from '../config/database-connection.js';
import { Op } from 'sequelize';

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
    // Validação pré-transação para evitar rollbacks desnecessários
    await this.verificarRegrasDeNegocio(req);

    const { data, status, urgencia, observacao, hospital, itensSolicitacao } = req.body;

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
      throw error;
    }
  }

  static async update(req) {
    const { id } = req.params;
    const obj = await Solicitacao.findByPk(id, { include: { all: true, nested: true } });
    if (obj == null) throw 'Solicitação não encontrada!';

    // Validação pré-transação
    await this.verificarRegrasDeNegocio(req);

    const { data, status, urgencia, observacao, hospital, itensSolicitacao } = req.body;

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

      // 3. Só cria novos itens e retira estoque se não for cancelamento
      if (status !== 'CANCELADA') {
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
      }

      await t.commit();
      return await Solicitacao.findByPk(obj.id, { include: { all: true, nested: true } });

    } catch (error) {
      await t.rollback();
      throw error;
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
      throw error;
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
    await this.aplicarRegraPrioridade(req);

    return true;
  }

  static async aplicarRegraPrioridade(req) {
    const { hospital, itensSolicitacao } = req.body;
    const hospitalId = hospital.id;

    // Calcula a data de 7 dias atrás
    const seteDiasAtras = new Date();
    seteDiasAtras.setDate(seteDiasAtras.getDate() - 7);
    const dataFormatada = seteDiasAtras.toISOString().split('T')[0];

    for (const item of itensSolicitacao) {
      const tipoSanguineoId = item.tipoSanguineo.id;

      const contagemCanceladas = await Solicitacao.count({
        where: {
          hospitalId,
          status: 'CANCELADA',
          data: {
            [Op.gte]: dataFormatada
          }
        },
        include: [{
          model: ItemSolicitacao,
          as: 'itensSolicitacao',
          where: { tipoSanguineoId }
        }]
      });

      if (contagemCanceladas > 2) {
        req.body.urgencia = 'CRÍTICA';
        
        const aviso = `[SISTEMA]: Prioridade elevada para CRÍTICA devido ao histórico de cancelamentos recentes (${contagemCanceladas} solicitações) para este tipo sanguíneo nos últimos 7 dias. `;
        
        if (req.body.observacao) {
          req.body.observacao = aviso + '\n\n' + req.body.observacao;
        } else {
          req.body.observacao = aviso.trim();
        }
        break; 
      }
    }
  }

  static async validarEstoque(item) {
    const { tipoSanguineo, quantidade } = item;
    const tipoSanguineoFromBanco = await TipoSanguineo.findByPk(tipoSanguineo.id);

    if (!tipoSanguineoFromBanco) {
      throw `Tipo sanguíneo ID ${tipoSanguineo.id} não encontrado!`;
    }

    if (tipoSanguineoFromBanco.quantidade < quantidade) {
      throw `Estoque insuficiente para o tipo sanguíneo ${tipoSanguineoFromBanco.getModelVerboso()}: Estoque disponível ${tipoSanguineoFromBanco.quantidade}, quantia solicitada ${quantidade}.`;
    }
  }

}

export { SolicitacaoService };