const pool = require('../db');

const loginUser = async (req, res) => {
  console.log('Trying to login');
  try {
    const { email, password } = req.body;

    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    const currentDate = new Date().toISOString().split('T')[0];
    const result = await pool`SELECT * FROM users WHERE email = ${email} AND password = ${password}`;

    console.log(result);
    console.log('Result.rows:', result.length);

    if (result.length > 0) {
      console.log('Changing login');
      const change_date = await pool`
        UPDATE users
        SET last_login = ${currentDate}
        WHERE email = ${email};
      `;
      const userId = result[0].user_id;
      console.log('User ID:', userId);
      req.session.userId = userId;

      res.status(200).json({ message: 'Login successful', userId });
    } else {
      console.log('User not found');
      res.status(401).json({ error: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Middleware dla sprawdzania autentykacji
const checkAuthentication = (req, res, next) => {
  if (req.session.userId) {
    next();
  } else {
    res.redirect('/login');
  }
};

// Dodajemy endpoint do odświeżenia sesji
const refreshSession = (req, res) => {
  console.log('Refreshing session...');
  req.session.touch(); // Odświeżenie czasu trwania sesji
  res.json({ message: 'Session refreshed' });
};

module.exports = {
  loginUser,
  checkAuthentication,
  refreshSession,
};

