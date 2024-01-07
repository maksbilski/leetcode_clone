const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const { checkAuthentication } = require('./controllers/loginController');
const { pool } = require('./db');

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
    maxAge: 30000, // 30 sec in milliseconds
  },
}));

app.use('/api/exercises', checkAuthentication);
app.use('/api/statistics', checkAuthentication);

// Setup routers
const exercisesRouter = require('./routers/exercises');
const statisticsRouter = require('./routers/statistics');
const pagesRouter = require('./routers/SSR_pages');
const registerRouter = require('./routers/register');
const exercisePageRouter = require('./routers/exercisePage');
const loginRouter = require('./routers/login');

app.use('/api/exercises', exercisesRouter);
app.use('/api/statistics', statisticsRouter);
app.use('/api/login', loginRouter);
app.use('/', pagesRouter);
app.use('/api/register', registerRouter);
app.use(`/api/exercises`, exercisePageRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
