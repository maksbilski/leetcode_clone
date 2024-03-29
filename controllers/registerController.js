const pool = require('../db');
const bcrypt = require('bcrypt');


/**
 * Registers a new user by adding their details to the database.
 * This includes hashing the user's password for secure storage.
 * If the user already exists (based on email), registration is not allowed.
 *
 * @param {object} req - The request object containing user registration details (firstName, email, password).
 * @param {object} res - The response object for sending back the registration status.
 */
const registerUser = async (req, res) => {
  try {
    const { firstName, email, password } = req.body;
    const name = `${firstName}`;

    const is_exist = await pool`SELECT * FROM users WHERE email = ${email}`;
    if (is_exist.length > 0) {
      return res.status(401).json({ error: 'You already have an account' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const current_date = new Date().toISOString();
    await pool`
      INSERT INTO users (name, email, password_hash, private, last_login)
      VALUES (${name}, ${email}, ${hashedPassword}, false, ${current_date});
    `;

    const newUser = await pool`SELECT * FROM users WHERE email = ${email}`;
    const userId = newUser[0].user_id;

    req.session.userId = userId;
    res.status(200).json('User registered successfully');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  registerUser,
};
