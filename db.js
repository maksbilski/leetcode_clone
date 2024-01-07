const postgres = require('postgres');


PGHOST='127.0.0.1'
PGDATABASE='pap-project'
PGUSER='postgres'
PGPASSWORD='postgres'
ENDPOINT_ID='ep-muddy-field-58353771'

const pool = postgres({
  host: PGHOST,
  database: PGDATABASE,
  username: PGUSER,
  password: PGPASSWORD,
  port: 5432,
  /*ssl: 'require',
  connection: {
    options: `project=${ENDPOINT_ID}`,
  },*/
});


module.exports = pool;