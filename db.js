const {Client} = require('pg');

let db = new Client({
    connectionString: "postgresql://postgres.pmbpgyeoydjkhwqgxbay:hqTKe0v2uX32h5gg@aws-0-us-east-1.pooler.supabase.com:6543/postgres"
})

db.connect();

module.exports = db;