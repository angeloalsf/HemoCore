// ALUNA: GABRIELA BENEVIDES

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


        this.hasMany(models.itemCampanha, {
            foreignKey: 'campanhaId',
            as:
            {
                singular: 'itemCampanha',
                plural: 'itensCampanha'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });
    }
}

export { Campanha };