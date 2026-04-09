import { Model, DataTypes } from 'sequelize';

class TecnicoLaboratorio extends Model {
  static init(sequelize) {
    super.init(
      {
        nome: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notNull: { msg: 'Nome do Técnico de Laboratório é obrigatório' },
            notEmpty: {
              msg: "Nome do Técnico de Laboratório deve ser preenchido!"
            },
            len: {
              args: [2, 50],
              msg: "Nome do Técnico de Laboratório deve ter entre 2 e 50 letras!"
            }
          }
        },

        telefone: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notNull: { msg: 'Telefone do Técnico de Laboratório é obrigatório' },
            notEmpty: {
              msg: "Telefone do Técnico de Laboratório deve ser preenchido!"
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
            notNull: { msg: 'CPF do Técnico de Laboratório é obrigatório' },
            notEmpty: {
              msg: "CPF do Técnico de Laboratório deve ser preenchido!"
            },
            is: {
              args: ["[0-9]{3}\\.[0-9]{3}\\.[0-9]{3}\\-[0-9]{2}"],
              msg: "CPF do Técnico de Laboratório deve seguir o padrão NNN.NNN.NNN-NN!"
            }
          }
        },

        areaLab: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notNull: {
              msg: 'Área do Técnico de Laboratório é obrigatória'
            },
            notEmpty: {
              msg: 'Área do Técnico de Laboratório deve ser preenchida!'
            },
            len: {
              args: [2, 50],
              msg: "Área do Técnico de Laboratório deve ter entre 2 e 50 letras!"
            }
          }
        },

        registroConselho: {
          type: DataTypes.STRING,
          allowNull: true,
          unique: true,
          validate: {
            isValido(value) {
              if (!value) return;

              const regexMap = {
                COREN: /^COREN-[A-Z]{2}\s\d{4,6}-(ENF|TE|AE)$/i,
                CRF: /^CRF-[A-Z]{2}\s\d{4,6}$/i,
                CRM: /^CRM-[A-Z]{2}\s\d{4,6}$/i,
                CRBM: /^CRBM-[A-Z]{2}\s\d{4,6}$/i,
              };

              if (this.tipoConselho && regexMap[this.tipoConselho]) {
                if (!regexMap[this.tipoConselho].test(value)) {
                  throw new Error(`Registro inválido para ${this.tipoConselho}`);
                }
              }
              if (value && this.tipoConselho && !value.startsWith(this.tipoConselho)) {
                throw new Error(`Registro não corresponde ao tipo ${this.tipoConselho}`);
              }
            }
          }
        },

        tipoConselho: {
          type: DataTypes.ENUM(
            'COREN',
            'CRF',
            'CRM',
            'CRBM'
          ),
          allowNull: true,
          validate: {
            isIn: {
              args: [['COREN', 'CRF', 'CRM', 'CRBM']],
              msg: 'Tipo de conselho inválido!'
            }
          }
        }
      },
      {
        sequelize,
        modelName: 'tecnicoLaboratorio',
        tableName: 'tecnicos_laboratorio'
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
            msg: 'Unidade de coleta do Técnico de Laboratório deve ser preenchida!'
          }
        }
      }
    });
  }
}

export { TecnicoLaboratorio };