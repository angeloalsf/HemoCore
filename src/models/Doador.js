// ALUNO: ANGELO ANTONIO

import { Model, DataTypes } from 'sequelize';

class Doador extends Model {
  static init(sequelize) {
    super.init(
      {
        nome: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notNull: { msg: 'Nome do Doador é obrigatório' },
            notEmpty: {
              msg: "Nome do Doador deve ser preenchido!"
            },
            len: {
              args: [2, 50],
              msg: "Nome do Doador deve ter entre 2 e 50 letras!"
            }
          }
        },

        sexo: {
          type: DataTypes.ENUM(
            'M',
            'F'
          ),
          allowNull: false,
          validate: {
            notNull: {
              msg: 'Sexo do Doador deve ser preenchido!'
            },
            notEmpty: {
              msg: "Sexo do Doador deve ser preenchido!"
            },
            isIn: {
              args: [['M', 'F']],
              msg: 'Sexo do Doador deve ser M ou F',
            },
          }
        },

        telefone: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notNull: { msg: 'Telefone do Doador é obrigatório' },
            notEmpty: {
              msg: "Telefone do Doador deve ser preenchido!"
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
            notNull: { msg: 'CPF do Doador é obrigatório' },
            notEmpty: {
              msg: "CPF do Doador deve ser preenchido!"
            },
            is: {
              args: ["[0-9]{3}\\.[0-9]{3}\\.[0-9]{3}\\-[0-9]{2}"],
              msg: "CPF do Doador deve seguir o padrão NNN.NNN.NNN-NN!"
            }
          }
        },

        status: {
          type: DataTypes.ENUM(
            'APTO',
            'INAPTO',
            'PENDENTE'
          ),
          allowNull: false,
          validate: {
            notNull: {
              msg: 'Status do Doador deve ser preenchido!'
            },
            isIn: {
              args: [['APTO', 'INAPTO', 'PENDENTE']],
              msg: 'Status do Doador deve ser um valor válido',
            },
          }
        }
      },
      {
        sequelize,
        modelName: 'doador',
        tableName: 'doadores'
      }
    );
  }

  static associate(models) {
    // Doador → TipoSanguineo (N:1)
    this.belongsTo(models.tipoSanguineo, {
      as: 'tipoSanguineo',
      foreignKey: {
        name: 'tipoSanguineoId',
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Tipo sanguíneo do Doador deve ser preenchido!'
          }
        }
      }
    });

    this.belongsTo(models.cidade, {
      as: 'cidade',
      foreignKey: {
        name: 'cidadeId',
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Cidade do Doador deve ser preenchida!'
          }
        }
      }
    });

    // Doador → Doação (1:N)
    this.hasMany(models.doacao, {
      as: 'doacoes',
      foreignKey: 'doadorId'
    });
  }
}

export { Doador };