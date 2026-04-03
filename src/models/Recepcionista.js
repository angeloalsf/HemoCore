// ALUNO: CAIO TORRES

import { Model, DataTypes } from 'sequelize';

class Recepcionista extends Model {
  static init(sequelize) {
    super.init(
      {
        nome: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notNull: { msg: 'Nome do Recepcionista é obrigatório' },
            notEmpty: {
              msg: "Nome do Recepcionista deve ser preenchido!"
            },
            len: {
              args: [2, 50],
              msg: "Nome do Recepcionista deve ter entre 2 e 50 letras!"
            }
          }
        },

        telefone: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notNull: { msg: 'Telefone do Recepcionista é obrigatório' },
            notEmpty: {
              msg: "Telefone do Recepcionista deve ser preenchido!"
            },
            is: {
              args: ["^\\(?\\d{2}\\)?\\s?\\d{4,5}\\-?\\d{4}$"],
              msg: "Telefone deve seguir o padrão (NN) NNNNN-NNNN" 
            }
          }
        },

        cpf: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
          validate: {
            notNull: { msg: 'CPF do Recepcionista é obrigatório' },
            notEmpty: {
              msg: "CPF do Recepcionista deve ser preenchido!"
            },
            is: {
              args: ["[0-9]{3}\\.[0-9]{3}\\.[0-9]{3}\\-[0-9]{2}"],
              msg: "CPF do Recepcionista deve seguir o padrão NNN.NNN.NNN-NN!"
            }
          }
        },

        login: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
          validate: {
            notNull: { msg: 'Login do Recepcionista é obrigatório' },
            notEmpty: { msg: 'Login do Recepcionista deve ser preenchido!' },
            len: {
              args: [4, 20],
              msg: 'Login deve ter entre 4 e 20 caracteres'
            }
          }
        },

        senha: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notNull: { msg: 'Senha do Recepcionista é obrigatória' },
            notEmpty: { msg: 'Senha do Recepcionista deve ser preenchida!' },
            len: {
              args: [6, 100],
              msg: 'Senha deve ter pelo menos 6 caracteres'
            }
          }
        }
      },
      {
        sequelize,
        modelName: 'recepcionista',
        tableName: 'recepcionistas'
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.cidade, {
      as: 'cidade',
      foreignKey: {
        name: 'cidadeId',
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Cidade do Recepcionista deve ser preenchida!'
          }
        }
      }
    });
  }
}

export { Recepcionista };
