import Sequelize from 'sequelize';
import { databaseConfig } from "./database-config.js";

import { Uf } from '../models/Uf.js';
import { Cidade } from '../models/Cidade.js';
import { Hospital } from '../models/Hospital.js';
import { TipoSanguineo } from '../models/TipoSanguineo.js';
import { UnidadeColeta } from '../models/UnidadeColeta.js';
import { Doador } from '../models/Doador.js';
import { Enfermeiro } from '../models/Enfermeiro.js';
import { TecnicoLaboratorio } from '../models/TecnicoLaboratorio.js';
import { Doacao } from '../models/Doacao.js';
import { Recepcionista } from '../models/Recepcionista.js';
import { Solicitacao } from '../models/Solicitacao.js';
import { ItemSolicitacao } from '../models/ItemSolicitacao.js';
import { Campanha } from '../models/Campanha.js';
import { ItemCampanha } from '../models/ItemCampanha.js';

const sequelize = new Sequelize(databaseConfig);

Uf.init(sequelize);
Cidade.init(sequelize);
Hospital.init(sequelize);
TipoSanguineo.init(sequelize);
Enfermeiro.init(sequelize);
TecnicoLaboratorio.init(sequelize);
UnidadeColeta.init(sequelize);
Doador.init(sequelize);
Doacao.init(sequelize);
Recepcionista.init(sequelize);
Solicitacao.init(sequelize);
ItemSolicitacao.init(sequelize);
Campanha.init(sequelize);
ItemCampanha.init(sequelize);

Uf.associate(sequelize.models);
Cidade.associate(sequelize.models);
Hospital.associate(sequelize.models);
TipoSanguineo.associate(sequelize.models);
Enfermeiro.associate(sequelize.models);
TecnicoLaboratorio.associate(sequelize.models);
UnidadeColeta.associate(sequelize.models);
Doador.associate(sequelize.models);
Doacao.associate(sequelize.models);
Recepcionista.associate(sequelize.models);
Solicitacao.associate(sequelize.models);
ItemSolicitacao.associate(sequelize.models);
Campanha.associate(sequelize.models);
ItemCampanha.associate(sequelize.models);

databaseInserts(); // comentar quando estiver em ambiente de produção (não criar tabelas e não inserir registros de teste)

function databaseInserts() {
    (async () => {

        await sequelize.sync({ force: true });

        // Cadastro de UFs
        const uf1 = await Uf.create({ sigla: "ES", nome: "Espírito Santo" });
        const uf2 = await Uf.create({ sigla: "MG", nome: "Minas Gerais" });
        const uf3 = await Uf.create({ sigla: "RJ", nome: "Rio de Janeiro" });
        const uf4 = await Uf.create({ sigla: "SP", nome: "São Paulo" });


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

        const hospital2 = await Hospital.create({
            nome: "Hospital Estadual Dr. Jayme Santos Neves",
            sigla: "HEJSN",
            telefone: "(27) 99888-7777",
            CNPJ: "23.456.789/0001-12",
            tipo: "PUBLICO",
            cidadeId: 2,
        });

        const hospital3 = await Hospital.create({
            nome: "Hospital Evangélico de Vila Velha",
            sigla: "HEVV",
            telefone: "(27) 98765-4321",
            CNPJ: "34.567.890/0001-23",
            tipo: "PRIVADO",
            cidadeId: 3,
        });

        const hospital4 = await Hospital.create({
            nome: "Hospital Unimed Sul Capixaba",
            sigla: "HUSC",
            telefone: "(28) 99999-1111",
            CNPJ: "45.678.901/0001-34",
            tipo: "FILANTRÓPICO",
            cidadeId: 1,
        });


        const unidadeColeta1 = await UnidadeColeta.create({
            nome: "Unidade de Coleta 1",
            tipo_unidade: "FIXA",
            telefone: "(28) 99999-9999",
            cidadeId: 1
        });

        const unidadeColeta2 = await UnidadeColeta.create({
            nome: "Unidade de Coleta 2",
            tipo_unidade: "MÓVEL",
            telefone: "(28) 88888-8888",
            cidadeId: 1
        });

        const unidadeColeta3 = await UnidadeColeta.create({
            nome: "Unidade de Coleta 3",
            tipo_unidade: "FIXA",
            telefone: "(28) 77777-7777",
            cidadeId: 2
        });

        const unidadeColeta4 = await UnidadeColeta.create({
            nome: "Unidade de Coleta 4",
            tipo_unidade: "MÓVEL",
            telefone: "(28) 66666-6666",
            cidadeId: 3
        });


        const doador1 = await Doador.create({
            nome: "Angelo",
            telefone: "(28) 99999-9999",
            cpf: "123.456.789-00",
            status: "APTO",
            tipoSanguineoId: 4,
            cidadeId: 1
        });

        const doador2 = await Doador.create({
            nome: "Caio",
            telefone: "(28) 99999-9999",
            cpf: "123.456.789-01",
            status: "INAPTO",
            tipoSanguineoId: 2,
            cidadeId: 2
        });

        const doador3 = await Doador.create({
            nome: "Gabriela ",
            telefone: "(28) 99999-9999",
            cpf: "123.456.789-02",
            status: "PENDENTE",
            tipoSanguineoId: 1,
            cidadeId: 3
        });

        const doador4 = await Doador.create({
            nome: "Linux",
            telefone: "(28) 99999-9999",
            cpf: "123.456.789-03",
            status: "PENDENTE",
            tipoSanguineoId: 5,
            cidadeId: 4
        });


        const enfermeiro1 = await Enfermeiro.create({
            nome: "João Silva",
            telefone: "(28) 98888-7777",
            cpf: "123.456.789-10",
            especialidade: "Hemoterapia",
            registroCoren: "COREN-ES 12345-ENF",
            unidadeColetaId: 1
        });

        const enfermeiro2 = await Enfermeiro.create({
            nome: "Maria Oliveira",
            telefone: "(28) 99911-2233",
            cpf: "234.567.890-12",
            especialidade: "Hemoterapia",
            registroCoren: "COREN-ES 54321-ENF",
            unidadeColetaId: 1
        });

        const enfermeiro3 = await Enfermeiro.create({
            nome: "Carlos Souza",
            telefone: "(27) 98844-5566",
            cpf: "345.678.901-23",
            especialidade: "Urgência e Emergência",
            registroCoren: "COREN-ES 98765-ENF",
            unidadeColetaId: 2
        });

        const enfermeiro4 = await Enfermeiro.create({
            nome: "Aline Ferreira",
            telefone: "(28) 99977-8899",
            cpf: "456.789.012-34",
            especialidade: "Enfermagem Geral",
            registroCoren: "COREN-ES 11223-ENF",
            unidadeColetaId: 3
        });


        const tecnico1 = await TecnicoLaboratorio.create({
            nome: "Carlos Souza",
            telefone: "(28) 97777-6666",
            cpf: "123.456.789-55",
            areaLab: "Análises Clínicas",
            tipoConselho: null,
            registroConselho: null,
            unidadeColetaId: 1
        });

        const tecnico2 = await TecnicoLaboratorio.create({
            nome: "Mariana Alves",
            telefone: "(28) 96666-5555",
            cpf: "123.456.789-56",
            areaLab: "Biomedicina",
            tipoConselho: "CRBM",
            registroConselho: "CRBM-MG 123456",
            unidadeColetaId: 1
        });

        const tecnico3 = await TecnicoLaboratorio.create({
            nome: "Pedro Henrique",
            telefone: "(28) 95555-4444",
            cpf: "123.456.789-57",
            areaLab: "Farmácia",
            tipoConselho: "CRF",
            registroConselho: "CRF-MG 654321",
            unidadeColetaId: 1
        });

        const tecnico4 = await TecnicoLaboratorio.create({
            nome: "Júlio Cezar",
            telefone: "(28) 95555-3333",
            cpf: "123.456.789-92",
            areaLab: "Farmácia",
            tipoConselho: "CRF",
            registroConselho: "CRF-MG 123654",
            unidadeColetaId: 3
        });


        const doacao1 = await Doacao.create({
            data: "2026-03-29",
            quantia: 450,
            doadorId: 1,
            enfermeiroId: 1,
            unidadeColetaId: 1
        });

        const doacao2 = await Doacao.create({
            data: "2026-04-01",
            quantia: 450,
            doadorId: 2,
            enfermeiroId: 2,
            unidadeColetaId: 1
        });

        const doacao3 = await Doacao.create({
            data: "2026-04-02",
            quantia: 500,
            doadorId: 3,
            enfermeiroId: 3,
            unidadeColetaId: 2
        });

        const doacao4 = await Doacao.create({
            data: "2026-03-02",
            quantia: 500,
            doadorId: 4,
            enfermeiroId: 4,
            unidadeColetaId: 3
        });


        const recepcionista1 = await Recepcionista.create({
            nome: "Ana Maria Braga",
            telefone: "(28) 99111-2222",
            cpf: "123.456.789-99",
            login: "anamaria",
            senha: "password123",
            cidadeId: 1
        });

        const recepcionista2 = await Recepcionista.create({
            nome: "Fernanda Costa",
            telefone: "(28) 99222-3333",
            cpf: "234.567.890-88",
            login: "fernandac",
            senha: "password123",
            cidadeId: 2
        });

        const recepcionista3 = await Recepcionista.create({
            nome: "Lucas Martins",
            telefone: "(27) 99333-4444",
            cpf: "345.678.901-77",
            login: "lucasm",
            senha: "password123",
            cidadeId: 3
        });

        const recepcionista4 = await Recepcionista.create({
            nome: "Juliana Rocha",
            telefone: "(28) 99444-5555",
            cpf: "456.789.012-66",
            login: "julianar",
            senha: "password123",
            cidadeId: 1
        });


        const solicitacao1 = await Solicitacao.create({
            data: "2026-04-01",
            status: "EM ABERTO",
            urgencia: "ALTA",
            observacao: "Paciente em estado crítico, necessita de transfusão urgente.",
            hospitalId: 1
        });

        const solicitacao2 = await Solicitacao.create({
            data: "2026-04-01",
            status: "FINALIZADA",
            urgencia: "MÉDIA",
            observacao: "Cirurgia cardíaca eletiva agendada para a próxima semana.",
            hospitalId: 2
        });

        const solicitacao3 = await Solicitacao.create({
            data: "2026-04-02",
            status: "CANCELADA",
            urgencia: "BAIXA",
            observacao: "Reposição de estoque de rotina para o banco de sangue do hospital.",
            hospitalId: 3
        });

        const solicitacao4 = await Solicitacao.create({
            data: "2026-04-02",
            status: "EM ABERTO",
            urgencia: "ALTA",
            observacao: "Paciente do pronto-socorro com hemorragia severa devido a acidente de trânsito.",
            hospitalId: 4
        });


        const itemSolicitacao1 = await ItemSolicitacao.create({
            quantidade: 2,
            solicitacaoId: 1,
            tipoSanguineoId: 4
        });

        const itemSolicitacao2 = await ItemSolicitacao.create({
            quantidade: 1,
            solicitacaoId: 1,
            tipoSanguineoId: 1
        });

        const itemSolicitacao3 = await ItemSolicitacao.create({
            quantidade: 4,
            solicitacaoId: 2,
            tipoSanguineoId: 2
        });

        const itemSolicitacao4 = await ItemSolicitacao.create({
            quantidade: 10,
            solicitacaoId: 3,
            tipoSanguineoId: 3
        });


        const campanha1 = await Campanha.create({
            nome: "Campanha de Doação de Sangue - Abril Vermelho",
            data: "2026-04-15",
            unidadeColetaId: 1
        });

        const campanha2 = await Campanha.create({
            nome: "Campanha de Doação de Sangue - Maio Vermelho",
            data: "2026-05-10",
            unidadeColetaId: 2
        });

        const campanha3 = await Campanha.create({
            nome: "Salve Vidas IFES",
            data: "2026-06-18",
            unidadeColetaId: 3
        });

        const campanha4 = await Campanha.create({
            nome: "Campanha de Inverno Solidário",
            data: "2026-07-20",
            unidadeColetaId: 1
        });


        const itemCampanha1 = await ItemCampanha.create({
            metaColeta: 5000,
            quantiaColetada: 0,
            campanhaId: 1,
            tipoSanguineoId: 4
        });

        const itemCampanha2 = await ItemCampanha.create({
            metaColeta: 5000,
            quantiaColetada: 10000,
            campanhaId: 2,
            tipoSanguineoId: 1
        });

        const itemCampanha3 = await ItemCampanha.create({
            metaColeta: 5000,
            quantiaColetada: 5000,
            campanhaId: 2,
            tipoSanguineoId: 3
        });

        const itemCampanha4 = await ItemCampanha.create({
            metaColeta: 3000,
            quantiaColetada: 1500,
            campanhaId: 3,
            tipoSanguineoId: 3
        });

        // Caio Torres - Regra de negócio 2:
        for (let i = 1; i <= 3; i++) {
            const s = await Solicitacao.create({
                data: new Date().toISOString().split('T')[0],
                status: 'CANCELADA',
                urgencia: 'ALTA',
                hospitalId: 3
            });
            await ItemSolicitacao.create({
                quantidade: 1,
                solicitacaoId: s.id,
                tipoSanguineoId: 4
            });
        }

    })();

}

export default sequelize;
