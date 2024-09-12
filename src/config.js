const postgres = require('postgres');

require('dotenv').config();

module.exports = {
    app: {
        port : process.env.PORT || 3000,
    },
    postgre: {
        user: process.env.PGUSER || 'postgres',
        host: process.env.PGHOST || 'localhost',
        database: process.env.PGDATABASE || 'bullmarketing',
        password: process.env.PGPASSWORD || '0924',
        port: process.env.PGPORT || 5432,
    }
};