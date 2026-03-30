import { Model, DataTypes } from 'sequelize';

class Enfermeiro extends Model {
  static init(sequelize) {
    super.init(
      {
        nome: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notNull: { msg: 'Nome do Enfermeiro é obrigatório' },
            notEmpty: {
              msg: "Nome do Enfermeiro deve ser preenchido!"
            },
            len: {
              args: [2, 50],
              msg: "Nome do Enfermeiro deve ter entre 2 e 50 letras!"
            }
          }
        },

        telefone: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notNull: { msg: 'Telefone do Enfermeiro é obrigatório' },
            notEmpty: {
              msg: "Telefone do Enfermeiro deve ser preenchido!"
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
            notNull: { msg: 'CPF do Enfermeiro é obrigatório' },
            notEmpty: {
              msg: "CPF do Enfermeiro deve ser preenchido!"
            },
            is: {
              args: ["[0-9]{3}\\.[0-9]{3}\\.[0-9]{3}\\-[0-9]{2}"],
              msg: "CPF do Enfermeiro deve seguir o padrão NNN.NNN.NNN-NN!"
            }
          }
        },

        especialidade: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notNull: {
              msg: 'Especialidade do Enfermeiro é obrigatória'
            },
            notEmpty: {
              msg: 'Especialidade do Enfermeiro deve ser preenchida!'
            },
            len: {
              args: [2, 50],
              msg: "Especialidade do Enfermeiro deve ter entre 2 e 50 letras!"
            }
          }
        },

        registroCoren: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
          validate: {
            notNull: {
              msg: 'Registro do Coren do Enfermeiro é obrigatório'
            },
            notEmpty: {
              msg: 'Registro do Coren do Enfermeiro deve ser preenchido!'
            },
            is: {
              args: [/^COREN-[A-Z]{2}\s\d{4,6}-(ENF|TE|AE)$/],
              msg: "Coren deve seguir o padrão COREN-UF NNNNNN-CATEGORIA!"
            }
          }
        }
      },
      {
        sequelize,
        modelName: 'enfermeiro',
        tableName: 'enfermeiros'
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.unidadeColeta, {
      as: 'unidadeColeta',
      foreignKey: {
        name: 'unidadeColetaId',
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Unidade de coleta do Enfermeiro deve ser preenchida!'
          }
        }
      }
    });
  }
}

export { Enfermeiro };