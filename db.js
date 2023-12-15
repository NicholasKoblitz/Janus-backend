const {Client} = require('pg');
const {getDatabaseUrl, PGPORT, PGDATABASE, PGPASSWORD, PGHOST, PGUSER} = require('./config');

let db;

if(process.env.NODE_ENV === "production") {
    db = new Client({
        user: 'janus_backend_user',
        connectionString: `postgres://janus_backend_user:ciKucrPjvbLbjT5nU86qCaoO7t8zdKCP@dpg-clue7r8cmk4c73891hcg-a.oregon-postgres.render.com/janus_backend`,
        password: "ciKucrPjvbLbjT5nU86qCaoO7t8zdKCP",
        ssl: {
            rejectUnauthorized: false
        }
    });
}
else {
    db = new Client({
        user: 'nick',
        connectionString: getDatabaseUrl(),
        password: "sonic0125"
    });
}

db.connect();

module.exports = db;