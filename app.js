const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const { checkAuthentication } = require('./controllers/loginController');
const { pool } = require('./db');

//db connection
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
  cookie: {
    maxAge: 300000, // 30 sec in milliseconds
  },
}));

//setInterval(checkExercisesAndSendEmail, 10000);

app.use('/exercises', checkAuthentication);
app.use('/statistics', checkAuthentication);
// app.use('/profile', checkAuthentication);
// app.use('/help', checkAuthentication);

//setup routers
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



// app.use('/api/exercises', exercises);
// app.use('/api/login', login);
// app.use('/api/statistics', statistics);
// app.use('/', pages);
// app.use('/api/register', register);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
