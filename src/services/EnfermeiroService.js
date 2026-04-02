import { Enfermeiro } from "../models/Enfermeiro.js";

class EnfermeiroService {

  static async findAll() {
    const objs = await Enfermeiro.findAll({ include: { all: true, nested: true } });
    return objs;
  }

  static async findByPk(req) {
    const { id } = req.params;
    const obj = await Enfermeiro.findByPk(id, { include: { all: true, nested: true } });
    return obj;
  }

  static async create(req) {
    const { 
        nome, 
        imagem,
        telefone,
        cpf,
        especialidade,
        registroCoren,
        unidadeColetaId
    } = req.body;

    const obj = await Enfermeiro.create({ 
        nome,
        imagem,
        telefone,
        cpf,
        especialidade,
        registroCoren,
        unidadeColetaId
    });

    return await Enfermeiro.findByPk(obj.id, { include: { all: true, nested: true } });
    }

  static async update(req) {
    const { id } = req.params;
    const { 
    nome, 
    telefone,
    cpf,
    especialidade,
    registroCoren,
    unidadeColetaId
    } = req.body;

    const obj = await Enfermeiro.findByPk(id, { include: { all: true, nested: true } });

    if (obj == null) throw 'Enfermeiro não encontrado!';
    Object.assign(obj, { 
    nome,
    telefone,
    cpf,
    especialidade,
    registroCoren,
    unidadeColetaId
    });
    await obj.save();
    return await Enfermeiro.findByPk(obj.id, { include: { all: true, nested: true } });
  }

  static async delete(req) {
    const { id } = req.params;
    const obj = await Enfermeiro.findByPk(id);
    if (obj == null) throw 'Enfermeiro não encontrado!';
    try {
      await obj.destroy();
      return obj;
    } catch (error) {
      throw "Não é possível remover um Enfermeiro com participações em doações!";
    }
  }

}

export { EnfermeiroService };