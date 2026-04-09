function errorHandler(err, req, res, next) {
    switch (true) {
        case typeof err === 'string':
            // erro personalizado
            const is404 = err.toLowerCase().endsWith('not found');
            const statusCode = is404 ? 404 : 400;
            return res.status(statusCode).json({ message: err });
        default:
        if (err.name === "SequelizeValidationError") {
            return res.status(400).json({
                message: "Erro de validação",
                errors: err.errors.map(e => ({
                campo: e.path,
                mensagem: e.message
                }))
            });
        }
    }
}

export default errorHandler;