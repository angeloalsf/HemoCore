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
            'ATIVO',
            'INATIVO',
            'PENDENTE'
          ),
          allowNull: false,
          validate: {
            notNull: {
              msg: 'Status do Doador deve ser preenchido!'
            },
            isIn: {
              args: [['ATIVO', 'INATIVO', 'PENDENTE']],
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

    // Doador → Doação (1:N)
    // this.hasMany(models.doacao, {
    //   as: 'doacoes',
    //   foreignKey: 'doadorId'
    // });
  }
}

export { Doador };