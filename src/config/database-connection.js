import Sequelize from 'sequelize';
import { databaseConfig } from "./database-config.js";

import { Uf } from '../models/Uf.js';
import { Cidade } from '../models/Cidade.js';
import { Hospital } from '../models/Hospital.js';
import { TipoSanguineo } from '../models/TipoSanguineo.js';
import { UnidadeColeta } from '../models/UnidadeColeta.js';

const sequelize = new Sequelize(databaseConfig);

Uf.init(sequelize);
Cidade.init(sequelize);
Hospital.init(sequelize);
TipoSanguineo.init(sequelize);
UnidadeColeta.init(sequelize);

Uf.associate(sequelize.models);
Cidade.associate(sequelize.models);
Hospital.associate(sequelize.models);
TipoSanguineo.associate(sequelize.models);
UnidadeColeta.associate(sequelize.models);

databaseInserts(); // comentar quando estiver em ambiente de produção (não criar tabelas e não inserir registros de teste)

function databaseInserts() {
    (async () => {

        await sequelize.sync({ force: true });

        // Cadastro de UFs
        const uf1 = await Uf.create({ sigla: "ES", nome: "Espírito Santo" });
        const uf2 = await Uf.create({ sigla: "MG", nome: "Minas Gerais" });


        const cidade1 = await Cidade.create({ nome: "Cachoeiro", habitantes: 210000, area: 876.8, ufId: 1 });
        const cidade2 = await Cidade.create({ nome: "Alegre", habitantes: 31000, area: 772.0, ufId: 1 });
        const cidade3 = await Cidade.create({ nome: "Belo Horizonte", habitantes: 2520000, area: 331.4, ufId: 2 });
        const cidade4 = await Cidade.create({ nome: "Lavras", habitantes: 105000, area: 564.7, ufId: 2 });

        const tipos = await Promise.all([
            TipoSanguineo.create({
                grupoABO: 'A',
                fatorRH: true,
                quantidade: 120,
                descricao: 'Tipo Sanguíneo A positivo'
            }),
            TipoSanguineo.create({
                grupoABO: 'A',
                fatorRH: false,
                quantidade: 80,
                descricao: 'Tipo Sanguíneo A negativo'
            }),
            TipoSanguineo.create({
                grupoABO: 'B',
                fatorRH: true,
                quantidade: 60,
                descricao: 'Tipo Sanguíneo B positivo'
            }),
            TipoSanguineo.create({
                grupoABO: 'O',
                fatorRH: true,
                quantidade: 200,
                descricao: 'Tipo Sanguíneo O positivo'
            }),
            TipoSanguineo.create({
                grupoABO: 'AB',
                fatorRH: true,
                quantidade: 40,
                descricao: 'Tipo Sanguíneo AB positivo'
            })
        ]);

        const hospital1 = await Hospital.create({
            nome: "Hospital Santa Casa",
            sigla: "HSC",
            telefone: "(28) 99999-9999",
            CNPJ: "12.345.678/0001-95",
            tipo: "FILANTRÓPICO",
            cidadeId: 1,
        });
        const unidadeColeta1 = await UnidadeColeta.create({
            nome: "Unidade de Coleta 1",
            tipo_unidade: "MÓVEL",
            telefone: "(28) 99999-9999",
            cidadeId: 1
        });
    })();
    
}

export default sequelize;