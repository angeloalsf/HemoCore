import { Model, DataTypes } from 'sequelize';

class Campanha extends Model {
    static init(sequelize) {
        super.init({
            nome: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: { msg: "Nome da Camapanha deve ser preenchida!" },
                    len: { args: [2, 50], msg: "Nome da Camapanha deve ter entre 2 e 50 letras!" }
                }
            },
            data: {
                type: DataTypes.DATEONLY,
                allowNull: false,
                defaultValue: DataTypes.NOW,
                validate: {
                    notNull: { msg: 'Data da campanha é obrigatória' },
                    notEmpty: { msg: 'Data da campanha não pode ser vazia' },
                    isDate: { msg: 'Data deve ser uma data válida' }
                }
            },
            metaColeta: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    notNull: { msg: 'A meta de coleta é obrigatória' },
                    notEmpty: { msg: 'A meta de coleta não pode ser vazia' },
                    isInt: { msg: 'A meta de coleta deve ser um número inteiro' },
                    min: {
                        args: [1],
                        msg: 'A meta de coleta deve ser maior que zero (em mL)',
                    },
                },
            },
            quantiaColetada: {
                type: DataTypes.INTEGER,
                allowNull: true,
                validate: {
                    isInt: { msg: 'Quantia coletada deve ser um número inteiro' },
                    min: {
                        args: [0],
                        msg: 'Quantia coletada não pode ser negativa',
                    },
                }
            }
        }, { sequelize, modelName: 'campanha', tableName: 'campanhas' });
    }

    static associate(models) {
        this.belongsTo(models.unidadeColeta, {
            as: 'unidadeColeta',
            foreignKey: {
                name: 'unidadeColetaId',
                allowNull: false,
                validate: {
                    notNull: {
                        msg: 'Unidade de Coleta da Campanha deve ser preenchida!'
                    }
                }
            }
        });

        this.belongsTo(models.tipoSanguineo, {
            as: 'tipoSanguineo',
            foreignKey: {
                name: 'tipoSanguineoId',
                allowNull: false,
                validate: {
                    notNull: {
                        msg: 'Tipo sanguíneo da campanha deve ser preenchido!'
                    }
                }
            }
        });
    }
}

export { Campanha };