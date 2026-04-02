// ALUNO: ANGELO ANTONIO

import { Model, DataTypes } from 'sequelize';

class Hospital extends Model {
  static init(sequelize) {
    super.init(
      {
        nome: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notNull: { msg: 'Nome é obrigatório' },
            notEmpty: { msg: 'Nome não pode ser vazio' },
            len: {
              args: [2, 150],
              msg: 'Nome deve ter entre 2 e 150 caracteres',
            },
          },
        },
        sigla: {
          type: DataTypes.STRING(20),
          allowNull: false,
          validate: {
            notNull: { msg: 'Sigla é obrigatória' },
            notEmpty: { msg: 'Sigla não pode ser vazia' },
            len: {
              args: [1, 20],
              msg: 'Sigla deve ter entre 1 e 20 caracteres',
            },
          },
        },
        telefone: {
          type: DataTypes.STRING(20),
          allowNull: false,
          validate: {
            notNull: { msg: 'Telefone é obrigatório' },
            notEmpty: { msg: "Número do Telefone deve ser preenchido!" },
            is: {
                  args: /^\([0-9]{2}\) [0-9]?[0-9]{4}-[0-9]{4}/,
                  msg: "Telefone deve seguir o padrão (NN) NNNNN-NNNN" 
            },
          },
        },
        CNPJ: {
          type: DataTypes.STRING(18),
          allowNull: false,
          unique: true,
          validate: {
            notNull: { msg: 'CNPJ é obrigatório' },
            notEmpty: { msg: 'CNPJ não pode ser vazio' },
              is: {
                    args: /^\d{14}$|^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/,
                    msg: 'CNPJ inválido',
            }
          },
        },
        tipo: {
          type: DataTypes.ENUM(
            'PUBLICO',
            'PRIVADO',
            'FILANTRÓPICO'
          ),
          allowNull: false,
          validate: {
            notNull: { msg: 'Tipo é obrigatório' },
            isIn: {
              args: [['PUBLICO', 'PRIVADO', 'FILANTRÓPICO']],
              msg: 'Tipo deve ser um valor válido de Tipo Hospital',
            },
          },
        },
      },
      {
        sequelize,
        modelName: 'hospital',
        tableName: 'hospitais',
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
              msg: 'Cidade do Hospital deve ser preenchida!',
              },
            },
          }
        });

    // Hospital possui muitas Solicitacoes — 1:N
    // this.hasMany(models.solicitacao, {
    //   as: 'solicitacoes',
    //   foreignKey: 'hospitalId'
    // });
  }
}

export { Hospital };