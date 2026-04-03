// ALUNO: CAIO TORRES

import { Model, DataTypes } from 'sequelize';

class Solicitacao extends Model {
  static init(sequelize) {
    super.init(
      {
        data: {
          type: DataTypes.DATEONLY,
          allowNull: false,
          defaultValue: DataTypes.NOW,
          validate: {
            notNull: { msg: 'Data da solicitação é obrigatória' },
            notEmpty: { msg: 'Data da solicitação não pode ser vazia' },
            isDate: { msg: 'Data deve ser uma data válida' }
          }
        },

        status: {
          type: DataTypes.ENUM(
            'EM ABERTO',
            'CANCELADA',
            'FINALIZADA',
            'CANCELADA'
          ),
          allowNull: false,
          defaultValue: 'EM ABERTO',
          validate: {
            notNull: { msg: 'Status da solicitação é obrigatório' },
            isIn: {
              args: [['EM ABERTO', 'CANCELADA', 'FINALIZADA']],
              msg: 'Status da solicitação deve ser um valor válido'
            }
          }
        },

        urgencia: {
          type: DataTypes.ENUM(
            'BAIXA',
            'MÉDIA',
            'ALTA'
          ),
          allowNull: false,
          defaultValue: 'BAIXA',
          validate: {
            notNull: { msg: 'Urgência da solicitação é obrigatória' },
            isIn: {
              args: [['BAIXA', 'MÉDIA', 'ALTA']],
              msg: 'Urgência da solicitação deve ser um valor válido'
            }
          }
        },

        observacao: {
          type: DataTypes.STRING(500),
          allowNull: true,
          validate: {
            len: {
              args: [0, 500],
              msg: 'Observação deve ter no máximo 500 caracteres'
            }
          }
        }
      },
      {
        sequelize,
        modelName: 'solicitacao',
        tableName: 'solicitacoes'
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.hospital, {
      as: 'hospital',
      foreignKey: {
        name: 'hospitalId',
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Hospital da solicitação deve ser preenchido!'
          }
        }
      }
    });

    this.hasMany(models.itemSolicitacao, { foreignKey: 'solicitacaoId', as: { singular:'itemSolicitacao' , plural: 'itensSolicitacao'}, onDelete: 'CASCADE', onUpdate: 'CASCADE'});

  }
}

export { Solicitacao };
