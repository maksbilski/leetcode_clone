const express = require('express');
const { Pool } = require('pg');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

const pool = new Pool({
 user: 'postgres',
 host: 'localhost',
 database: 'leetcode',
 password: 'postgres',
 port: 5432, // PostgreSQL default port
});

// Serve static files from the "public" directory
app.use(express.static('public'));
app.use(bodyParser.json());

// API endpoint to get a list of exercises
app.get('/api/exercises', async (req, res) => {
 try {
   const result = await pool.query('SELECT * FROM exercises');
   res.json(result.rows);
 } catch (error) {
   console.error(error);
   res.status(500).json({ error: 'Internal Server Error' });
 }
});

app.get('/api/exercise/sort', async (req, res) => {
  try {
  const sortKey = req.query.key;
  const result = await pool.query(`SELECT * FROM exercises ORDER BY ${sortKey}`);
  res.json(result.rows);
  } catch (error) {
  console.error(error);
  res.status(500).json({ error: 'Internal Server Error' });
  }
 });

 app.get('/api/statistics/sort', async (req, res) => {
  try {


    const {key} = req.query;
    const result = await pool.query(`
    SELECT 
        users.name,
        COUNT(ex_users.exercise_id) AS total_exercises_attempted,
        COUNT(CASE WHEN ex_users.success = true THEN 1 END) AS total_exercises_completed,
        ROUND(COUNT(CASE WHEN ex_users.done = true AND ex_users.success = true THEN 1 END) * 100.0 / COUNT(ex_users.exercise_id), 1) AS success_rate
       FROM 
        users
       JOIN 
        ex_users ON users.user_id = ex_users.user_id
       GROUP BY 
        users.name
      order by ${key} DESC;`);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
 });

 app.get('/api/statistics', async (req, res) => {
  try {
    const result = await pool.query(`
    SELECT 
        users.name,
        COUNT(ex_users.exercise_id) AS total_exercises_attempted,
        COUNT(CASE WHEN ex_users.success = true THEN 1 END) AS total_exercises_completed,
        ROUND(COUNT(CASE WHEN ex_users.done = true AND ex_users.success = true THEN 1 END) * 100.0 / COUNT(ex_users.exercise_id), 1) AS success_rate
       FROM 
        users
       JOIN 
        ex_users ON users.user_id = ex_users.user_id
       GROUP BY 
        users.name
      order by total_exercises_completed DESC;`);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
 })
 
app.post('/api/register', async (req, res) => {
  console.log('try to register')
 try {
  console.log(req.body)
   const { firstName, surname, email, password } = req.body;
   const name = `${firstName} ${surname}`;
   console.log(`First Name: ${firstName}`);
   console.log(`Surname: ${surname}`);
   console.log(`Email: ${email}`);
   console.log(`Password: ${password}`);
   const result = await pool.query(
     'INSERT INTO users (name, email, password) VALUES ($1, $2, $3)',
     [name, email, password]
   );
   res.status(201).json(result.rows[0]);
 } catch (error) {
   console.error(error);
   res.status(500).json({ error: 'Internal Server Error' });
 }
});

app.get('/', (req, res) => {
 console.log('homepage')
 res.status(200).sendFile('homepage.html', { root: path.join(__dirname, 'public') });
});

// Serve the HTML page for exercises
app.get('/exercises', (req, res) => {
 console.log('exercises')
 res.sendFile(path.join(__dirname, 'public', 'exercises', 'exercises.html'));
});

app.get('/register', (req, res) => {
 res.status(200).sendFile('registration.html', {root: path.join(__dirname, 'public', 'register') });
});

app.get('/login', (req, res) => {
  res.status(200).sendFile('login.html', {root: path.join(__dirname, 'public', 'login') });
 });

 app.get('/help', (req, res) => {
  res.status(200).sendFile('help.html', {root: path.join(__dirname, 'public', 'help') });
 });

 app.get('/statistics', (req, res) => {
  res.status(200).sendFile('statistics.html', {root: path.join(__dirname, 'public', '/statistics') });
 });
// Handling 404 errors
app.use((req, res) => {
 res.status(404).sendFile('404.html', { root: path.join(__dirname, 'public') });
});

app.listen(port, () => {
 console.log(`Server is running on port ${port}`);
});