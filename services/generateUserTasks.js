const pool  = require('../db');

async function generateUserTasks() {
  try {
    console.log('intervalll')
    const users = await pool`
    SELECT * FROM users
    WHERE private = false;`;
    //console.log(users);
    let tasksForUsers = {};

    for (const user of users) {
      const tasks = await pool`SELECT * FROM exercises WHERE date_added > ${user.last_login}`;
      tasksForUsers[user.email] = tasks;
    }
    //console.log(tasksForUsers);
    return tasksForUsers;
  } catch (err) {
    console.error(err);
    return {};
  }
}

module.exports = generateUserTasks;
