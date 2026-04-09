// ALUNO: ANGELO ANTONIO

import { Model, DataTypes } from 'sequelize';

class Doacao extends Model {
  static init(sequelize) {
    super.init(
      {
        data: {
          type: DataTypes.DATEONLY,
          allowNull: false,
          validate: {
            notNull: { msg: 'Data é obrigatória' },
            notEmpty: { msg: 'Data não pode ser vazia' },

            is: {
              args: [/^\d{4}-\d{2}-\d{2}$/],
              msg: 'Data deve estar no formato YYYY-MM-DD'
            },

            isDate: {
              msg: 'Data deve ser uma data válida'
            },

            isNotFuture(value) {
              const dataInformada = new Date(value);

              // 🔴 verifica se é inválida
              if (isNaN(dataInformada.getTime())) return;

              const hoje = new Date();

              hoje.setHours(0, 0, 0, 0);
              dataInformada.setHours(0, 0, 0, 0);

              if (dataInformada > hoje) {
                throw new Error('Data da doação não pode ser futura');
              }
            }
          }
        },

        quantia: {
          type: DataTypes.INTEGER,
          allowNull: false,
          validate: {
            notNull: { msg: 'Quantia é obrigatória' },
            notEmpty: { msg: 'Quantia não pode ser vazia' },

            isInt: { msg: 'Quantia deve ser um número inteiro' },

            min: {
              args: [1],
              msg: 'Quantia deve ser maior que zero',
            },

            isIn: {
              args: [[450, 500]],
              msg: 'Quantia deve ser 450ml ou 500ml'
            }
          },
        },
      },
      {
        sequelize,
        modelName: 'doacao',
        tableName: 'doacoes',
      }
    );
  }

  static associate(models) {
    // Doacao pertence a um Doador — N:1
    this.belongsTo(models.doador, {
      as: 'doador',
      foreignKey: {
        name: 'doadorId',
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Doador da Doação deve ser preenchido!'
          }
        }
      }
    });

    // Doacao pertence a um Enfermeiro — N:1
    this.belongsTo(models.enfermeiro, {
      as: 'enfermeiro',
      foreignKey: {
        name: 'enfermeiroId',
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Enfermeiro da Doação deve ser preenchido!'
          }
        }
      }
    });

    // Doacao pertence a uma UnidadeColeta — N:1
    this.belongsTo(models.unidadeColeta, {
      as: 'unidadeColeta',
      foreignKey: {
        name: 'unidadeColetaId',
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Unidade de coleta da Doação deve ser preenchida!'
          }
        }
      }
    });
  }
}

export { Doacao };