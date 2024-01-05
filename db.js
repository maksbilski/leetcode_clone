const postgres = require('postgres');


PGHOST='localhost'
PGDATABASE='pap_project'
PGUSER='postgres'
PGPASSWORD='marcin'
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