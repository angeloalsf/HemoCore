import { Model, DataTypes } from 'sequelize';

class Cidade extends Model {

  static init(sequelize) {
    super.init({
      nome: { 
        type: DataTypes.STRING, 
        validate: {
          notEmpty: { msg: "Nome da Cidade deve ser preenchida!" },
          len: { args: [2, 50], msg: "Nome da Cidade deve ter entre 2 e 50 letras!" }
        }
      },
      habitantes: {
        type: DataTypes.INTEGER,
        validate: {
          isInt: { msg: "Habitantes deve ser um número inteiro!" },
          min: { args: [0], msg: "Habitantes não pode ser negativo!" }
        }
      },
      area: {
        type: DataTypes.DOUBLE,
        validate: {
          isFloat: { msg: "Área deve ser um número!" },
          min: { args: [0.0], msg: "Área não pode ser negativa!" }
        }
      }
    }, { sequelize, modelName: 'cidade', tableName: 'cidades' })
  }

  static associate(models) {
    this.belongsTo(models.uf, {as: 'uf', foreignKey: {name: 'ufId' , allowNull: false, validate: {notNull: {msg: 'Uf da Cidade deve ser preenchida!'}}}});
  }
  
}

export { Cidade };