require('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY || "JanUs-Secret";
const PORT = +process.env.PORT || 3001;

function getDatabaseUrl() {
    return (process.env.NODE_ENV === 'test') ? "postgresql://nick:sonic0125@localhost:5432/janus_test" : process.env.DATABASE_URL || "postgresql://nick:sonic0125@localhost:5432/janus";
}

const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === 'test' ? 1 : 12;


module.exports = {
    SECRET_KEY,
    PORT,
    BCRYPT_WORK_FACTOR,
    getDatabaseUrl
}