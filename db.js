const {Client} = require('pg');
const {getDatabaseUrl, PGPORT, PGDATABASE, PGPASSWORD, PGHOST, PGUSER} = require('./config');

let db;

if(process.env.NODE_ENV === "production") {
    db = new Client({
        user: 'janus_database_user',
        connectionString: getDatabaseUrl(),
        password: "jrjeehjQlBxAoavEiTaaBHPV2Ud1juiI",
        ssl: {
            rejectUnauthorized: false
        }
    });
}
else {
    db = new Client({
        user: 'nick',
        connectionString: getDatabaseUrl()
    });
}

db.connect();

module.exports = db;