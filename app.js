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
const exercisesRouter = require('./routers/exercises');
const statisticsRouter = require('./routers/statistics')
const pagesRouter = require('./routers/SSR_pages')
const registerRouter = require('./routers/register')
const exercisePageRouter = require('./routers/exercise_page')

app.use('/api/exercises', exercisesRouter)
app.use('/api/statistics', statisticsRouter)
app.use('/', pagesRouter)
app.use('/api/register', registerRouter)
app.use('/api/exercises/:exercise_id', exercisePageRouter)






app.listen(port, () => {
 console.log(`Server is running on port ${port}`);
});

