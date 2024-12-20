require('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY || "JanUs-Secret";

const COMET_URL = "https://215851690468e749.api-us.cometchat.io/v3/";
const API_KEY = '7a206718ea2245a90d00d043f313ab5192048e02'


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