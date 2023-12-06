const pool = require('../db')


const register_user =  async (req, res) => {
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
  };

module.exports = {
    register_user,
}