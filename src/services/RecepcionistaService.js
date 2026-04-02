import { Recepcionista } from "../models/Recepcionista.js";

class RecepcionistaService {

  static async findAll() {
    const objs = await Recepcionista.findAll({ include: { all: true, nested: true } });
    return objs;
  }

  static async findByPk(req) {
    const { id } = req.params;
    const obj = await Recepcionista.findByPk(id, { include: { all: true, nested: true } });
    return obj;
  }

  static async create(req) {
    const { nome, telefone, cpf, login, senha, cidade } = req.body;
    if (cidade == null) throw 'A Cidade do Recepcionista deve ser preenchida!';
    const obj = await Recepcionista.create({ nome, telefone, cpf, login, senha, cidadeId: cidade.id });
    return await Recepcionista.findByPk(obj.id, { include: { all: true, nested: true } });
  }

  static async update(req) {
    const { id } = req.params;
    const { nome, telefone, cpf, login, senha, cidade } = req.body;
    if (cidade == null) throw 'A Cidade do Recepcionista deve ser preenchida!';
    const obj = await Recepcionista.findByPk(id, { include: { all: true, nested: true } });
    if (obj == null) throw 'Recepcionista não encontrado!';
    Object.assign(obj, { nome, telefone, cpf, login, senha, cidadeId: cidade.id });
    await obj.save();
    return await Recepcionista.findByPk(obj.id, { include: { all: true, nested: true } });
  }

  static async delete(req) {
    const { id } = req.params;
    const obj = await Recepcionista.findByPk(id);
    if (obj == null) throw 'Recepcionista não encontrado!';
    await obj.destroy();
    return obj;
  }

}

export { RecepcionistaService };