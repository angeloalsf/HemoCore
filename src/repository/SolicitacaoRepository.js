import sequelize from '../config/database-connection.js';
import { QueryTypes } from 'sequelize';

class SolicitacaoRepository {

  /**
   * Lista solicitações de um hospital, com filtro opcional por período.
   *
   * @param {number} hospitalId - ID do hospital.
   * @param {string|Date} [inicio] - Data inicial (opcional).
   * @param {string|Date} [termino] - Data final (opcional).
   *
   * @returns {Promise<Array>} Lista com: id, hospital, tipoSanguineo, quantia e dataSolicitacao.
  */
  static async findSolicitacoesByHospital(hospitalId, inicio, termino) {
    const conditions = ['s.hospital_id = :hospitalId',
                        "s.status = 'FINALIZADA'"
    ];
    const replacements = { hospitalId };

    if (inicio) {
      conditions.push('s.data >= :inicio');
      replacements.inicio = inicio;
    }

    if (termino) {
      conditions.push('s.data <= :termino');
      replacements.termino = termino;
    }

    // Monta o WHERE automaticamente a partir do array
    const whereClause = `WHERE ${conditions.join(' AND ')}`;

    const sql = `
      SELECT 
        s.id, 
        h.nome AS hospital, 
        (ts.grupo_abo || CASE WHEN ts.fator_rh = 1 THEN '+' ELSE '-' END) AS tipoSanguineo,
        SUM(is_table.quantidade) AS quantia,
        s.data AS dataSolicitacao
      FROM solicitacoes s
      JOIN hospitais h ON s.hospital_id = h.id
      JOIN itens_solicitacao is_table ON is_table.solicitacao_id = s.id
      JOIN tipos_sanguineos ts ON is_table.tipo_sanguineo_id = ts.id
      ${whereClause}
      GROUP BY h.nome, ts.grupo_abo, ts.fator_rh
    `;

    return sequelize.query(sql, { replacements, type: QueryTypes.SELECT });
  }

  /**
   * Lista os maiores solicitantes (hospitais) para um determinado tipo sanguíneo e período.
   *
   * @param {number} tipoSanguineoId - ID do tipo sanguíneo.
   * @param {string|Date} [inicio] - Data inicial (opcional).
   * @param {string|Date} [termino] - Data final (opcional).
   *
   * @returns {Promise<Array>} Lista com: id (hospital), hospital, cnpj, tipoSanguineo, quantidade.
   */
  static async findMaioresSolicitantes(tipoSanguineoId, inicio, termino) {
    const conditions = ['is_table.tipo_sanguineo_id = :tipoSanguineoId'];
    const replacements = { tipoSanguineoId };

    if (inicio) {
      conditions.push('s.data >= :inicio');
      replacements.inicio = inicio;
    }

    if (termino) {
      conditions.push('s.data <= :termino');
      replacements.termino = termino;
    }

    const whereClause = `WHERE ${conditions.join(' AND ')}`;

    const sql = `
      SELECT 
        h.id, 
        h.nome AS hospital, 
        h.cnpj,
        (ts.grupo_abo || CASE WHEN ts.fator_rh = 1 THEN '+' ELSE '-' END) AS tipoSanguineo,
        SUM(is_table.quantidade) AS quantidade
      FROM hospitais h
      JOIN solicitacoes s ON s.hospital_id = h.id
      JOIN itens_solicitacao is_table ON is_table.solicitacao_id = s.id
      JOIN tipos_sanguineos ts ON is_table.tipo_sanguineo_id = ts.id
      ${whereClause}
      GROUP BY h.id, h.nome, h.cnpj, ts.grupo_abo, ts.fator_rh
      ORDER BY quantidade DESC
    `;

    return sequelize.query(sql, { replacements, type: QueryTypes.SELECT });
  }

}

export { SolicitacaoRepository };
