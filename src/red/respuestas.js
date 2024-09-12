exports.success = function (req, res, mensaje, status) {
    const statusCode = status || 200;
    const messageOk = mensaje || ' ';
    res.status(status).send({
        success: true,
        body: messageOk,
        status: statusCode
    });
};

exports.error = function (req, res, mensaje, status) {
    const statusCode = status || 500;
    const messageError = mensaje || 'Error interno del sistema';
    res.status(status).send({
        success: false,
        body: messageError,
        status: statusCode
    });
};