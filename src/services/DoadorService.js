import { Doador } from "../models/Doador.js";
import sequelize from "../config/database-connection.js";
import { QueryTypes } from "sequelize";

class DoadorService {

  static async findAll() {
    const objs = await Doador.findAll({ include: { all: true, nested: true } });
    return objs;
  }

  static async findByPk(req) {
    const { id } = req.params;
    const obj = await Doador.findByPk(id, { include: { all: true, nested: true } });
    return obj;
  }

  static async create(req) {
    const {
      nome,
      sexo,
      telefone,
      cpf,
      status,
      tipoSanguineo,
      cidade
    } = req.body;

    const obj = await Doador.create({
      nome,
      sexo,
      telefone,
      cpf,
      status,
      tipoSanguineoId: tipoSanguineo?.id ?? null,
      cidadeId: cidade?.id ?? null
    });

    return await Doador.findByPk(obj.id, { include: { all: true, nested: true } });
  }

  static async update(req) {
    const { id } = req.params;
    const {
      nome,
      sexo,
      telefone,
      cpf,
      status,
      tipoSanguineo,
      cidade
    } = req.body;

    const obj = await Doador.findByPk(id, { include: { all: true, nested: true } });

    if (obj == null) throw 'Doador não encontrado!';
    Object.assign(obj, {
      nome,
      sexo,
      telefone,
      cpf,
      status,
      tipoSanguineoId: tipoSanguineo?.id ?? null,
      cidadeId: cidade?.id ?? null
    });
    await obj.save();
    return await Doador.findByPk(obj.id, { include: { all: true, nested: true } });
  }

  static async delete(req) {
    const { id } = req.params;
    const obj = await Doador.findByPk(id);
    if (obj == null) throw 'Doador não encontrado!';
    try {
      await obj.destroy();
      return obj;
    } catch (error) {
      throw "Não é possível remover um Doador com participações em doações!";
    }
  }

  static async relatorioDoadoresPorTipoSanguineo(req) {
    const { dataInicio, dataFim } = req.params;

    if (!dataInicio || !dataFim) {
      throw new Error("Os parâmetros 'dataInicio' e 'dataFim' são obrigatórios.");
    }

    const inicio = new Date(dataInicio);
    const fim = new Date(dataFim);

    if (isNaN(inicio.getTime()) || isNaN(fim.getTime())) {
      throw new Error("Datas inválidas. Utilize o formato YYYY-MM-DD.");
    }

    if (inicio > fim) {
      throw new Error("'dataInicio' não pode ser posterior a 'dataFim'.");
    }

    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const offset = (page - 1) * limit;

    const inicioExecucao = Date.now();
    console.info(`[DoadorService] relatorioDoadoresPorTipoSanguineo | período: ${dataInicio} → ${dataFim} | page: ${page} | limit: ${limit}`);

    try {

      // Busca os grupos ordenados por total de doadores (decrescente)
      // COUNT(DISTINCT d.id) garante que cada doador é contado uma única vez
      // mesmo que tenha feito múltiplas doações no período
      const dados = await sequelize.query(
        `SELECT
            ts.id AS tipoSanguineoId,
            ts.grupo_a_b_o AS grupoABO,
            ts.fator_r_h AS fatorRH,
            ts.descricao AS descricao,

            ts.grupo_a_b_o ||
            CASE
                WHEN ts.fator_r_h = 1 THEN '+'
                ELSE '-'
            END AS label,

            COUNT(dc.id) AS totalDoacoes

        FROM tipos_sanguineos ts

        LEFT JOIN doadores d
            ON d.tipo_sanguineo_id = ts.id

        LEFT JOIN doacoes dc
            ON dc.doador_id = d.id
            AND dc.data BETWEEN '2026-01-01'
            AND '2026-12-31'

        GROUP BY
            ts.id,
            ts.grupo_a_b_o,
            ts.fator_r_h,
            ts.descricao

        ORDER BY totalDoacoes DESC

        LIMIT 20 OFFSET 0;`,
        {
          replacements: {
            dataInicio: `${dataInicio} 00:00:00`,
            dataFim:    `${dataFim} 23:59:59`,
            limit,
            offset
          },
          type: QueryTypes.SELECT
        }
      );

      // Total consolidado: soma de todos os grupos (sem paginação)
      const [{ totalConsolidado }] = await sequelize.query(
        `SELECT COUNT(DISTINCT dc.id) AS totalConsolidado
         FROM doacoes dc
          WHERE dc.data BETWEEN :dataInicio AND :dataFim`,
        {
          replacements: {
            dataInicio: `${dataInicio} 00:00:00`,
            dataFim:    `${dataFim} 23:59:59`
          },
          type: QueryTypes.SELECT
        }
      );

      // Total de grupos para calcular páginas
      const [{ totalRegistros }] = await sequelize.query(
        `SELECT COUNT(*) AS totalRegistros FROM tipos_sanguineos`,
        { type: QueryTypes.SELECT }
      );

      const duracao = Date.now() - inicioExecucao;
      console.info(`[DoadorService] relatorioDoadoresPorTipoSanguineo | concluído em ${duracao}ms | totalConsolidado: ${totalConsolidado}`);

      return {
        dados,
        totalConsolidado: parseInt(totalConsolidado, 10),
        pagina:           page,
        totalPaginas:     Math.ceil(parseInt(totalRegistros, 10) / limit) || 1,
        totalRegistros:   parseInt(totalRegistros, 10),
        periodo: { dataInicio, dataFim }
      };

    } catch (error) {
      const duracao = Date.now() - inicioExecucao;
      console.error(`[DoadorService] relatorioDoadoresPorTipoSanguineo | erro após ${duracao}ms`, error);

      if (typeof error === "string") throw error;

      throw new Error("Erro ao processar o relatório. Tente novamente mais tarde.");
    }
  }

}

export { DoadorService };