const pool = require('../db');
const bcrypt = require('bcrypt');

/**
 * Handles user login by verifying email and password.
 * If credentials are valid, updates the last login date and sets the user session.
 *
 * @param {object} req - The request object containing email and password.
 * @param {object} res - The response object for sending back the login status.
 */
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

/**
 * Middleware for checking user authentication.
 * If the user is authenticated, proceeds to the next middleware. Otherwise, redirects to the login page.
 *
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function in the stack.
 */
const checkAuthentication = (req, res, next) => {
  if (req.session.userId) {
    next();
  } else {
    res.redirect('/login');
  }
};

/**
 * Endpoint for refreshing the user's session.
 *
 * @param {object} req - The request object.
 * @param {object} res - The response object for sending back the refresh status.
 */
const refreshSession = (req, res) => {
  req.session.touch(); // Refreshes the session duration
  res.json({ message: 'Session refreshed' });
};

module.exports = {
  loginUser,
  checkAuthentication,
  refreshSession,
};
