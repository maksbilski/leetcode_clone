const pool = require('../db');


const login_user = async (req, res) => {
    console.log('try to login');
    try {
      const { email, password } = req.body;
  
      console.log(`Email: ${email}`);
      console.log(`Password: ${password}`);
  
      const result = await pool.query(
        'SELECT * FROM users WHERE email = $1 AND password = $2',
        [email, password]
      );
  
      console.log('Result.rows:', result.rows);
  
      if (result.rows.length > 0) {
        const userId = result.rows[0].user_id; // Замените .id на .user_id
        console.log('User ID:', userId);
        req.session.userId = userId;
  
        res.status(200).json({ message: 'Login successful', userId });
        // res.redirect('/exercises');
      } else {
        console.log('User not found');
        res.status(401).json({ error: 'Invalid email or password' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

// Middleware для проверки аутентификации
const checkAuthentication = (req, res, next) => {
    console.log('Checking authentication...');
    console.log('req.session:', req.session);
    console.log('req.session.userId:', req.session.userId);
  if (req.session.userId) {
    next();
  } else {
    res.redirect('/login'); 
  }
};

module.exports = {
  login_user,
  checkAuthentication, // Экспортируем middleware для использования в других файлах
};
