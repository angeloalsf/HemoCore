import sequelize from '../config/database-connection.js';
import { QueryTypes } from 'sequelize';

class CampanhaRepository {

  /**
   * Listagem Geral de Campanhas (Agenda Completa)
   * Ator: Recepcionista
   * Retorna todas as campanhas cadastradas no sistema (passadas e futuras),
   * ordenadas cronologicamente da mais antiga para a mais recente.
   *
   * @param {number} [cidadeId] - Filtro opcional por Cidade.
   * @param {number} [unidadeColetaId] - Filtro opcional por Unidade de Coleta.
   * @param {number} [ufId] - Filtro opcional por UF.
   *
   * @returns {Promise<Array>}
   */
  static async findAgendaCampanhas(cidadeId, unidadeColetaId, ufId) {
    const conditions = [];
    const replacements = {};

    if (cidadeId) {
      conditions.push('uc.cidade_id = :cidadeId');
      replacements.cidadeId = cidadeId;
    }

    if (unidadeColetaId) {
      conditions.push('c.unidade_coleta_id = :unidadeColetaId');
      replacements.unidadeColetaId = unidadeColetaId;
    }

    if (ufId) {
      conditions.push('u.id = :ufId');
      replacements.ufId = ufId;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const sql = `
      SELECT 
        c.id, 
        c.nome AS campanha, 
        c.data, 
        uc.nome AS unidadeColeta,
        cid.nome AS cidade,
        u.sigla AS uf
      FROM campanhas c
      JOIN unidades_coleta uc ON c.unidade_coleta_id = uc.id
      JOIN cidades cid ON uc.cidade_id = cid.id
      JOIN ufs u ON cid.uf_id = u.id
      ${whereClause}
      ORDER BY c.data ASC
    `;

    return sequelize.query(sql, { replacements, type: QueryTypes.SELECT });
  }

/**
   * Relatório de Coletas por Cidade com Status de Meta
   * Ator: Recepcionista
   * Apresenta o somatório de bolsas coletadas por cidade e calcula se a meta foi atingida.
   */
  static async findColetasPorCidade(ufId) {
    const conditions = [
      'c.data < CURRENT_DATE',
      'ic.quantia_coletada > 0'
    ];
    const replacements = {};

    if (ufId) {
      conditions.push('u.id = :ufId');
      replacements.ufId = ufId;
    }

    const whereClause = `WHERE ${conditions.join(' AND ')}`;

    const sql = `
      SELECT 
        cid.nome AS cidade, 
        CASE 
          WHEN SUM(ic.quantia_coletada) >= SUM(ic.meta_coleta) THEN 'Atingida' 
          ELSE 'Não Atingida' 
        END AS statusMeta,
        SUM(ic.meta_coleta) AS somaMetaColeta,
        SUM(ic.quantia_coletada) AS somaQuantiaColetada
      FROM campanhas c
      JOIN itens_campanha ic ON ic.campanha_id = c.id
      JOIN unidades_coleta uc ON c.unidade_coleta_id = uc.id
      JOIN cidades cid ON uc.cidade_id = cid.id
      JOIN ufs u ON cid.uf_id = u.id
      ${whereClause}
      GROUP BY cid.id, cid.nome
      ORDER BY somaQuantiaColetada DESC
    `;

    return sequelize.query(sql, { replacements, type: QueryTypes.SELECT });
  }
}

export { CampanhaRepository };