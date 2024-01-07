const postgres = require('postgres');


PGHOST='ep-muddy-field-58353771.us-east-2.aws.neon.tech'
PGDATABASE='leetcode'
PGUSER='sofianasekajlo4'
PGPASSWORD='cCp1hn8YOWQL'
ENDPOINT_ID='ep-muddy-field-58353771'

const pool = postgres({
  host: PGHOST,
  database: PGDATABASE,
  username: PGUSER,
  password: PGPASSWORD,
  port: 5432,
  ssl: 'require',
  connection: {
    options: `project=${ENDPOINT_ID}`,
  },
});


module.exports = pool;