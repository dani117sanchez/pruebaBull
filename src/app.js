const express = require('express');
const config = require('./config');

const usuarios = require('./modules/usuarios/routes');

const app = express();

app.use(express.json());

app.set('port',config.app.port);

// routes
app.use('/api/usuarios', usuarios);

module.exports = app;