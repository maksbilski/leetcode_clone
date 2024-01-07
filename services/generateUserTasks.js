const { pool } = require('./db');

async function generateUserTasks() {
  try {
    const users = await pool.query('SELECT id, last_login FROM users');
    let tasksForUsers = {};

    for (const user of users.rows) {
      const tasks = await pool.query('SELECT * FROM exercises WHERE date_added > $1', [user.last_login]);
      tasksForUsers[user.id] = tasks.rows;
    }

    return tasksForUsers;
  } catch (err) {
    console.error(err);
    return {};
  }
}

module.exports = generateUserTasks;
