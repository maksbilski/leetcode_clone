const nodemailer = require('nodemailer');
const generateUserTasks = require('./generateUserTasks');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'papproject60@gmail.com',
        pass: 'pora kndk yjmj oycz'
    }
});

async function checkExercisesAndSendEmail() {
    const userTasks = await generateUserTasks();

    for (const userEmail in userTasks) {
        if (userTasks[userEmail].length > 0) {
          
            const taskList = userTasks[userEmail].map(task => `- ${task.name}`).join('\n');
            const mailOptions = {
                from: 'papproject60@gmail.com',
                to: userEmail,               
                subject: 'New problems on our website',
                text: `Hi,\n\nWe would like to inform you about new programming problems on our site. The list of new problems:\n\n${taskList}\n\nVisit our website to solve them!\n\nGood luck, \nCode Champions`
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
        }
    }
}

async function testSendEmail() {
    const testUserEmail = 'mlisows@gmail.com'; 
    const taskList = 'Example problem 1\nExample problem 2'; 

    const mailOptions = {
        from: 'papproject60@gmail.com', 
        to: testUserEmail,             
        subject: 'New problems available test',
        text: `Hi,\n\nThis email is only for testing. Here are new available problems:\n\n${taskList}\n\nGood luck,\nCode Champions`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Test email sent: ' + info.response);
        }
    });
}

module.exports = {
    checkExercisesAndSendEmail,
    testSendEmail,
}
