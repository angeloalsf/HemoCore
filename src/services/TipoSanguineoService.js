import { TipoSanguineo } from "../models/TipoSanguineo.js";

class TipoSanguineoService {

  static async findAll() {
    const objs = await TipoSanguineo.findAll({ include: { all: true, nested: true } });
    return objs;
  }

  static async findByPk(req) {
    const { id } = req.params;
    const obj = await TipoSanguineo.findByPk(id, { include: { all: true, nested: true } });
    return obj;
  }

  static async create(req) {
    const { grupoABO, fatorRH, quantidade, descricao } = req.body;
    const obj = await TipoSanguineo.create({ grupoABO, fatorRH, quantidade, descricao });
    return await TipoSanguineo.findByPk(obj.id, { include: { all: true, nested: true } });
  }

  static async update(req) {
    const { id } = req.params;
    const { grupoABO, fatorRH, quantidade, descricao } = req.body;
    const obj = await TipoSanguineo.findByPk(id, { include: { all: true, nested: true } });
    if (obj == null) throw 'Tipo Sanguíneo não encontrado!';
    Object.assign(obj, { grupoABO, fatorRH, quantidade, descricao });
    await obj.save();
    return await TipoSanguineo.findByPk(obj.id, { include: { all: true, nested: true } });
  }

  static async delete(req) {
    const { id } = req.params;
    const obj = await TipoSanguineo.findByPk(id);
    if (obj == null) throw 'Tipo Sanguíneo não encontrado!';
    await obj.destroy();
    return obj;
  }

  static async adicionarEstoque(tipoSanguineoId, quantidade, transaction) {
    if (quantidade <= 0) {
      throw new Error('Quantidade deve ser positiva para adicionar estoque.');
    }
    
    return this._ajustarEstoque(tipoSanguineoId, quantidade, transaction);
  }

  static async removerEstoque(tipoSanguineoId, quantidade, transaction) {
    if (quantidade <= 0) {
      throw new Error('Quantidade deve ser positiva para remover estoque.');
    }

    return this._ajustarEstoque(tipoSanguineoId, -quantidade, transaction);
  }

  static async _ajustarEstoque(tipoSanguineoId, valor, transaction) {
    const tipoSanguineo = await TipoSanguineo.findByPk(tipoSanguineoId);
    if (!tipoSanguineo) throw `Tipo Sanguíneo ID ${tipoSanguineoId} não encontrado!`;

    tipoSanguineo.quantidade += valor;

    if (tipoSanguineo.quantidade < 0) {
      throw `Estoque insuficiente para o tipo sanguíneo ${tipoSanguineo.getModelVerboso()}!`;
    }

    await tipoSanguineo.save({ transaction });
  }

}

export { TipoSanguineoService };
