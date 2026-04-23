// ALUNO: CAIO TORRES

import { Model, DataTypes } from 'sequelize';

class ItemSolicitacao extends Model {
  static init(sequelize) {
    super.init(
      {
        quantidade: {
          type: DataTypes.INTEGER,
          allowNull: false,
          validate: {
            notNull: { msg: 'Quantidade do item de solicitação é obrigatória' },
            isInt: { msg: 'Quantidade deve ser um número inteiro' },
            min: {
              args: [1],
              msg: 'Quantidade deve ser no mínimo 1'
            }
          }
        }
      },
      {
        sequelize,
        modelName: 'itemSolicitacao',
        tableName: 'itens_solicitacao'
      }
    );
  }

  static associate(models) {
    // Item de Solicitação pertence a uma Solicitação (N:1)
    this.belongsTo(models.solicitacao, {
      as: 'solicitacao',
      foreignKey: {
        name: 'solicitacaoId',
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Solicitação deve ser preenchida!'
          }
        }
      }
    });

    // Item de Solicitação pertence a um Tipo Sanguíneo (N:1)
    this.belongsTo(models.tipoSanguineo, {
      as: 'tipoSanguineo',
      foreignKey: {
        name: 'tipoSanguineoId',
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Tipo sanguíneo deve ser preenchido!'
          }
        }
      }
    });
  }
}

export { ItemSolicitacao };
