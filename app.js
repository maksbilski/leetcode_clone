const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');
const { checkAuthentication } = require('./controllers/loginController');
const { pool } = require('./db');

module.exports = { pool };

const {checkExercisesAndSendEmail, testSendEmail} = require('./services/emailService');


const app = express();
const port = 5000;
app.use(express.static('public'));
app.use(bodyParser.json());

const secret_key = 'PaP2023z';

app.use(session({
  secret: secret_key,
  resave: false,
  saveUninitialized: true,
  cookie: {},
}));

setInterval(checkExercisesAndSendEmail, 2147483647);

app.use('/exercises', checkAuthentication);
app.use('/statistics', checkAuthentication);
app.use('/profile', checkAuthentication);
app.use('/help', checkAuthentication);

const helpRouter = require('./routers/help')
const profileRouter = require('./routers/profile')
const exercisesRouter = require('./routers/exercises');
const statisticsRouter = require('./routers/statistics');
const loginRouter = require('./routers/login');
const exercisePageRouter = require('./routers/exercisePage')
const registerRouter = require('./routers/register')
const pagesRouter = require('./routers/SSR_pages')

app.use('/api/profile', profileRouter)
app.use('/api/exercises', exercisesRouter)
app.use('/api/statistics', statisticsRouter)
app.use('/api/login', loginRouter)
app.use('/', pagesRouter)
app.use('/api/register', registerRouter)
app.use(`/api/exercises`, exercisePageRouter)
app.use('/api/help', helpRouter)


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
