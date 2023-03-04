const {Client} = require('pg');
const {getDatabaseUrl, PGPORT, PGDATABASE, PGPASSWORD, PGHOST, PGUSER} = require('./config');

let db;

if(process.env.NODE_ENV === "production") {
    db = new Client({
        user: 'postgres',
        connectionString: `postgresql://postgres:JMkENYAGvQNc6NkyAheT@containers-us-west-57.railway.app:6431/railway`,
        password: "JMkENYAGvQNc6NkyAheT",
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