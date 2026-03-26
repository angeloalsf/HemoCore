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
          allowNull: true,
          validate: {
            len: {
              args: [8, 20],
              msg: 'Telefone deve ter entre 8 e 20 caracteres',
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
            len: {
              args: [14, 18],
              msg: 'CNPJ deve ter entre 14 e 18 caracteres',
            },
          },
        },
        tipo: {
          type: DataTypes.ENUM(
            'PUBLICO',
            'PRIVADO',
            'FILANTRÓPICO',
            'MILITAR'
          ),
          allowNull: false,
          validate: {
            notNull: { msg: 'Tipo é obrigatório' },
            isIn: {
              args: [['PUBLICO', 'PRIVADO', 'FILANTRÓPICO', 'MILITAR']],
              msg: 'Tipo deve ser um valor válido de TipoHospital',
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
            },
            onDelete: 'RESTRICT',
            onUpdate: 'CASCADE',
        });

    // Hospital possui muitas Solicitacoes — 1:N
    // Hospital.hasMany(models.Solicitacao, {
    //   foreignKey: {
    //     name: 'hospitalId',
    //     allowNull: false,
    //   },
    //   onDelete: 'CASCADE',
    //   onUpdate: 'CASCADE',
    // });

    // Hospital possui uma Recepcionista — 1:1
    // Hospital.hasOne(models.Recepcionista, {
    //   foreignKey: {
    //     name: 'hospitalId',
    //     allowNull: false,
    //   },
    //   onDelete: 'CASCADE',
    //   onUpdate: 'CASCADE',
    // });
  }
}

export { Hospital };