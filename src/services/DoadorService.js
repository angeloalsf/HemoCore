import { Doador } from "../models/Doador.js";

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

}

export { DoadorService };