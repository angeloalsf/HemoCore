import Sequelize from 'sequelize';
import { databaseConfig } from "./database-config.js";

import { Uf } from '../models/Uf.js';
import { Cidade } from '../models/Cidade.js';

const sequelize = new Sequelize(databaseConfig);

Uf.init(sequelize);
Cidade.init(sequelize);

Uf.associate(sequelize.models);
Cidade.associate(sequelize.models);

databaseInserts(); // comentar quando estiver em ambiente de produção (não criar tabelas e não inserir registros de teste)

function databaseInserts() {
    (async () => {

        await sequelize.sync({ force: true }); 

        const uf1 = await Uf.create({ sigla: "ES", nome: "Espírito Santo" });
        const uf2 = await Uf.create({ sigla: "MG", nome: "Minas Gerais" });

        const cidade1 = await Cidade.create({ nome: "Cachoeiro", ufId: 1 });
        const cidade2 = await Cidade.create({ nome: "Alegre", ufId: 1 });
        const cidade3 = await Cidade.create({ nome: "Belo Horizonte", ufId: 2 });
        const cidade4 = await Cidade.create({ nome: "Lavras", ufId: 2 });

    })();
}

export default sequelize;