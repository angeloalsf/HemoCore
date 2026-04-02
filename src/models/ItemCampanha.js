import { Model, DataTypes } from 'sequelize';

class ItemCampanha extends Model {
    static init(sequelize) {
        super.init({
            metaColeta: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    notNull: { msg: 'A meta de coleta é obrigatória' },
                    isInt: { msg: 'A meta de coleta deve ser um número inteiro' },
                    min: {
                        args: [1],
                        msg: 'A meta de coleta deve ser maior que zero (em mL)',
                    },
                },
            },
            quantiaColetada: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
                validate: {
                    isInt: { msg: 'Quantia coletada deve ser um número inteiro' },
                    min: {
                        args: [0],
                        msg: 'Quantia coletada não pode ser negativa',
                    },
                }
            }
        }, {
            sequelize,
            modelName: 'itemCampanha',
            tableName: 'itens_campanha'
        });
    }

    static associate(models) {
        this.removeAttribute('id');
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

        this.belongsTo(models.campanha, {
            as: 'campanha',
            foreignKey: {
                name: 'campanhaId',
                allowNull: false,
                validate: {
                    notNull: {
                        msg: 'Campanha deve ser preenchida!'
                    }
                }
            }
        });
    }
}

export { ItemCampanha };