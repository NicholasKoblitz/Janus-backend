require('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY || "JanUs-Secret";
const PORT = +process.env.PORT || 3001;
const COMET_URL = "https://215851690468e749.api-us.cometchat.io/v3/";
const API_KEY = '7a206718ea2245a90d00d043f313ab5192048e02'

function getDatabaseUrl() {
    return (process.env.NODE_ENV === 'test') ? "postgresql://nick:sonic0125@localhost:5432/janus_test" : process.env.DATABASE_URL || "postgresql://nick:sonic0125@localhost:5432/janus";
}

const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === 'test' ? 1 : 12;


module.exports = {
    SECRET_KEY,
    PORT,
    BCRYPT_WORK_FACTOR,
    getDatabaseUrl,
    COMET_URL,
    API_KEY
}