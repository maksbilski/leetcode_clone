const pool = require('../db');
const bcrypt = require('bcrypt');

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool`SELECT * FROM users WHERE email = ${email}`;

    if (result.length > 0) {
      const user = result[0];

      const match = await bcrypt.compare(password, user.password_hash);
      if (!match) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const currentDate = new Date().toISOString().split('T')[0];
      await pool`
        UPDATE users
        SET last_login = ${currentDate}
        WHERE email = ${email};
      `;

      req.session.userId = user.user_id;
      res.status(200).json({ message: 'Login successful', userId: user.user_id });
    } else {
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
