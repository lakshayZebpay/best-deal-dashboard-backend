const Pool = require("pg").Pool;

const pool = new Pool({
  user: "team4",
  password: "Z*9nY#LCwPl29b&4mM",
  host: "localhost",
  port: "49218",
  database: "projects_db",
});

module.exports = pool;
