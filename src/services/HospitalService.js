import { Hospital } from "../models/Hospital.js";

class HospitalService {

  static async findAll() {
    const objs = await Hospital.findAll({ include: { all: true, nested: true } });
    return objs;
  }

  static async findByPk(req) {
    const { id } = req.params;
    const obj = await Hospital.findByPk(id, { include: { all: true, nested: true } });
    return obj;
  }

  static async create(req) {
    const { 
        nome,
        sigla,
        telefone,
        CNPJ,
        tipo,
        cidade
    } = req.body;

    const obj = await Hospital.create({ 
        nome,
        sigla,
        telefone,
        CNPJ,
        tipo,
        cidadeId: cidade.id
    });

    return await Hospital.findByPk(obj.id, { include: { all: true, nested: true } });
    }

  static async update(req) {
    const { id } = req.params;
    const { 
    nome, 
    sigla,
    telefone,
    CNPJ,
    tipo,
    cidade
    } = req.body;

    const obj = await Hospital.findByPk(id, { include: { all: true, nested: true } });

    if (obj == null) throw 'Hospital não encontrado!';
    Object.assign(obj, { 
    nome,
    sigla,
    telefone,
    CNPJ,
    tipo,
    cidadeId: cidade.id
    });
    await obj.save();
    return await Hospital.findByPk(obj.id, { include: { all: true, nested: true } });
  }

  static async delete(req) {
    const { id } = req.params;
    const obj = await Hospital.findByPk(id);
    if (obj == null) throw 'Hospital não encontrado!';
    try {
      await obj.destroy();
      return obj;
    } catch (error) {
      throw "Não é possível remover um Hospital com participações em solicitações!";
    }
  }

}

export { HospitalService };