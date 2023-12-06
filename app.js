const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

//db connection
const pool = require('./db')
module.exports = { pool };

const app = express();
const port = 5000;
app.use(express.static('public'));
app.use(bodyParser.json());

//setup routers
const exercises = require('./routers/exercises');
const statistics = require('./routers/statistics')
const pages = require('./routers/SSR_pages')
const register = require('./routers/register')

app.use('/api/exercises', exercises)
app.use('/api/statistics', statistics)
app.use('/', pages)
app.use('/api/register', register)






app.listen(port, () => {
 console.log(`Server is running on port ${port}`);
});

