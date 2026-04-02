import { Model, DataTypes } from 'sequelize';

class TipoSanguineo extends Model {

  static init(sequelize) {
    super.init({
      grupoABO: { 
        type: DataTypes.STRING, 
        allowNull: false,
        validate: {
          notEmpty: { msg: "Grupo ABO deve ser preenchida!" },
          len: { args: [1, 2], msg: "Grupo ABO deve ter entre 1 e 2 letras!" }
        }
      },
      fatorRH: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        validate: {
          notNull: { msg: "Fator RH deve ser informado!" }
        }
      },
      quantidade: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: { msg: "Quantidade deve ser um número inteiro!" },
          min: { args: [0], msg: "Quantidade não pode ser negativa!" }
        }
      },
      descricao: {
        type: DataTypes.STRING(500),
        allowNull: true,
        validate: {
          len: {
            args: [0, 500],
            msg: 'Descrição deve ter no máximo 500 caracteres'
          }
        }
      }
    }, { sequelize, modelName: 'tipoSanguineo', tableName: 'tipos_sanguineos' })
  }

  static associate(models) {
  }
  
}

export { TipoSanguineo };