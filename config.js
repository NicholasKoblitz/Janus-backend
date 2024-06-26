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
    return (process.env.NODE_ENV === 'test') ? "postgresql://nick:sonic0125@localhost:5432/janus_test" : "postgres://janus_database_user:jrjeehjQlBxAoavEiTaaBHPV2Ud1juiI@dpg-clv1u5ed3nmc73894k90-a/janus_database";
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