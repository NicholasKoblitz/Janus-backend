const {Client} = require('pg');
const {getDatabaseUrl} = require('./config');

let db;

if(process.env.NODE_ENV === "production") {
    db = new Client({
        user: 'nick',
        connectionString: getDatabaseUrl(),
        password: "sonic0125",
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