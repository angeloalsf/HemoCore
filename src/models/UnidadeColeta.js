import { Model, DataTypes } from 'sequelize';

class UnidadeColeta extends Model {

    static init(sequelize) {
        super.init({
            nome: {
                type: DataTypes.STRING,
                validate: {
                    notEmpty: { msg: "Nome da Unidade de Coleta deve ser preenchida!" },
                    len: { args: [2, 50], msg: "Nome da Unidade de Coleta deve ter entre 2 e 50 letras!" }
                }
            },
            tipo_unidade: {
                type: DataTypes.ENUM('MÓVEL', 'FIXA'),
                validate: {
                    isIn: { args: [['MÓVEL', 'FIXA']], msg: "Tipo da Unidade de Coleta deve ser 'MÓVEL' ou 'FIXA'!" }
                }
            },
            telefone: {
                type: DataTypes.STRING,
                validate: {
                    notEmpty: { msg: "Número do Telefone deve ser preenchido!" },
                    is: { args: /^\([0-9]{2}\) [0-9]?[0-9]{4}-[0-9]{4}/, msg: "Telefone deve seguir o padrão (NN) NNNNN-NNNN" }
                }
            }
        }, { sequelize, modelName: 'unidadeColeta', tableName: 'unidades_coleta' })
    }

    static associate(models) {
        this.belongsTo(models.cidade, {
            as: 'cidade',
            foreignKey: {
            name: 'cidadeId',
            allowNull: false,
            validate: {
                notNull: {
                msg: 'Cidade da Unidade de Coleta deve ser preenchida!'
                }
            }
            }
        });

        this.hasMany(models.enfermeiro, {
            as: 'enfermeiros',
            foreignKey: 'unidadeColetaId'
        });

        this.hasMany(models.tecnicoLaboratorio, {
            as: 'tecnicos_laboratorio',
            foreignKey: 'unidadeColetaId'
        });
    }
}

export { UnidadeColeta };