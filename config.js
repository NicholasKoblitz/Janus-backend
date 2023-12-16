require('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY || "JanUs-Secret";
const PGPORT = process.env.PGPORT || 3001;
const PGDATABASE = process.env.PGDATABASE;
const PGHOST = process.env.PGHOST;
const PGPASSWORD = process.env.PGPASSWORD;
const PGUSER = process.env.PGUSER;

const COMET_URL = "https://215851690468e749.api-us.cometchat.io/v3/";
const API_KEY = '7a206718ea2245a90d00d043f313ab5192048e02'

function getDatabaseUrl() {
    return (process.env.NODE_ENV === 'test') ? "postgresql://nick:sonic0125@localhost:5432/janus_test" : process.env.DATABASE_URL || "postgres://janus_backend_user:ciKucrPjvbLbjT5nU86qCaoO7t8zdKCP@dpg-clue7r8cmk4c73891hcg-a/janus_backend";
}

const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === 'test' ? 1 : 12;


module.exports = {
    SECRET_KEY,
    PGPORT,
    PGDATABASE,
    PGHOST,
    PGPASSWORD,
    PGUSER,
    BCRYPT_WORK_FACTOR,
    getDatabaseUrl,
    COMET_URL,
    API_KEY
}