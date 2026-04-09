import { TecnicoLaboratorio } from "../models/TecnicoLaboratorio.js";

class TecnicoLaboratorioService {

  static async findAll() {
    const objs = await TecnicoLaboratorio.findAll({ include: { all: true, nested: true } });
    return objs;
  }

  static async findByPk(req) {
    const { id } = req.params;
    const obj = await TecnicoLaboratorio.findByPk(id, { include: { all: true, nested: true } });
    return obj;
  }

  static async create(req) {
    const { 
        nome, 
        telefone,
        cpf,
        areaLab,
        registroConselho,
        tipoConselho,
        unidadeColeta
    } = req.body;

    const obj = await TecnicoLaboratorio.create({ 
        nome,
        telefone,
        cpf,
        areaLab,
        registroConselho,
        tipoConselho,
        unidadeColetaId: unidadeColeta?.id ?? null
    });

    return await TecnicoLaboratorio.findByPk(obj.id, { include: { all: true, nested: true } });
    }

  static async update(req) {
    const { id } = req.params;
    const { 
    nome, 
    telefone,
    cpf,
    areaLab,
    registroConselho,
    tipoConselho,
    unidadeColeta
    } = req.body;

    const obj = await TecnicoLaboratorio.findByPk(id, { include: { all: true, nested: true } });

    if (obj == null) throw 'Tecnico de Laboratorio não encontrado!';
    Object.assign(obj, { 
    nome,
    telefone,
    cpf,
    areaLab,
    registroConselho,
    tipoConselho,
    unidadeColetaId: unidadeColeta?.id ?? null
    });
    await obj.save();
    return await TecnicoLaboratorio.findByPk(obj.id, { include: { all: true, nested: true } });
  }

  static async delete(req) {
    const { id } = req.params;
    const obj = await TecnicoLaboratorio.findByPk(id);
    if (obj == null) throw 'Tecnico de Laboratorio não encontrado!';
    try {
      await obj.destroy();
      return obj;
    } catch (error) {
      throw "Não é possível remover um Tecnico de Laboratorio com participações em doações!";
    }
  }

}

export { TecnicoLaboratorioService };