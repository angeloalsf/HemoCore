import sequelize from '../config/database-connection.js';
import { QueryTypes } from 'sequelize';

class DoacaoRepository {

  static async findSomatorioPorTipoSanguineo(dataInicio, dataFim) {
    const conditions = [];
    const replacements = {};

    if (dataInicio) {
      conditions.push('d.data >= :dataInicio');
      replacements.dataInicio = dataInicio;
    }

    if (dataFim) {
      conditions.push('d.data <= :dataFim');
      replacements.dataFim = dataFim;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const sql = `
      SELECT
        ts.grupo_abo || (CASE WHEN ts.fator_rh = TRUE THEN '+' ELSE '-' END) AS tipoSanguineo,
        COUNT(d.id) || ' Doações' AS total
      FROM doacoes d
      JOIN doadores doa ON d.doador_id = doa.id
      JOIN tipos_sanguineos ts ON doa.tipo_sanguineo_id = ts.id
      ${whereClause}
      GROUP BY ts.id, ts.grupo_abo, ts.fator_rh
      ORDER BY COUNT(d.id) DESC
    `;

    return sequelize.query(sql, { replacements, type: QueryTypes.SELECT });
  }

  static async findDoadoresAtivos(tipoSanguineo, dataInicio, dataFim) {
    const conditions = ["doa.status = 'APTO'"];
    const replacements = {};

    if (tipoSanguineo) {
      conditions.push('doa.tipo_sanguineo_id = :tipoSanguineo');
      replacements.tipoSanguineo = tipoSanguineo;
    }

    if (dataInicio) {
      conditions.push('d.data >= :dataInicio');
      replacements.dataInicio = dataInicio;
    }

    if (dataFim) {
      conditions.push('d.data <= :dataFim');
      replacements.dataFim = dataFim;
    }

    const whereClause = `WHERE ${conditions.join(' AND ')}`;

    const sql = `
      SELECT
        doa.nome,
        doa.cpf,
        u.sigla AS uf,
        ts.grupo_abo || (CASE WHEN ts.fator_rh = TRUE THEN '+' ELSE '-' END) AS tipoSanguineo,
        doa.status,
        d.data AS dataDoacao
      FROM doacoes d
      JOIN doadores doa ON d.doador_id = doa.id
      JOIN tipos_sanguineos ts ON doa.tipo_sanguineo_id = ts.id
      JOIN cidades cid ON doa.cidade_id = cid.id
      JOIN ufs u ON cid.uf_id = u.id
      ${whereClause}
      ORDER BY d.data DESC
    `;

    return sequelize.query(sql, { replacements, type: QueryTypes.SELECT });
  }
}

export { DoacaoRepository };
