function errorHandler(err, req, res, next) {
    let status = 500;
    let error = "Internal Server Error";
    let message = "Erro interno do servidor";
    let details = [];

    // Erro custom (string)
    if (typeof err === 'string') {
        const is404 = err.toLowerCase().endsWith('not found');

        status = is404 ? 404 : 400;
        error = is404 ? "Not Found" : "Bad Request";
        message = err;
    }

    // Validação Sequelize
    else if (err.name === "SequelizeValidationError") {
        status = 400;
        error = "Validation Error";
        message = "Erro de validação";

        details = err.errors.map(e => ({
            campo: e.path,
            mensagem: e.message
        }));
    }

    // Unique
    else if (err.name === "SequelizeUniqueConstraintError") {
        status = 400;
        error = "Unique Constraint Error";
        message = "Registro duplicado";

        details = err.errors.map(e => ({
            campo: e.path,
            mensagem: e.message,
            valor: e.value
        }));
    }

    // Foreign Key
    else if (err.name === "SequelizeForeignKeyConstraintError") {
        status = 400;
        error = "Foreign Key Constraint Error";
        message = "Erro de integridade referencial";

        const tabelaMatch = err.sql?.match(/INSERT INTO `(\w+)`/);
        const campoMatch = err.sql?.match(/`(\w+_id)`/);

        const entidade = tabelaMatch ? tabelaMatch[1] : "Desconhecida";
        const campo = campoMatch ? campoMatch[1] : "campo_relacionado";

        details = [{
            entidade,
            campo,
            mensagem: `O valor informado para ${campo} não existe`
        }];
    }

    // Genérico
    if (status === 500) {
        console.error(err);
    }

    return res.status(status).json({
        status,
        error,
        message,
        ...(details.length > 0 && { details })
    });
}

export default errorHandler;