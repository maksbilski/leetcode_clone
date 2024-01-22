const pool  = require('../db');

async function generateUserTasks() {
  try {
    const users = await pool`
    SELECT * FROM users
    WHERE private = false;`;
    let tasksForUsers = {};

    for (const user of users) {
      const tasks = await pool`SELECT * FROM exercises WHERE date_added > ${user.last_login}`;
      tasksForUsers[user.email] = tasks;
    }
    return tasksForUsers;
  } catch (err) {
    console.error(err);
    return {};
  }
}

module.exports = generateUserTasks;
