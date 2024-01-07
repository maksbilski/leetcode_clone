const nodemailer = require('nodemailer');
const generateUserTasks = require('./generateUserTasks');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'papproject60@gmail.com', // Twój adres e-mail na Gmailu
        pass: 'pora kndk yjmj oycz' // Twoje hasło aplikacji
    }
});

async function checkExercisesAndSendEmail() {
    const userTasks = await generateUserTasks();
  
    for (const userEmail in userTasks) {
      if (userTasks[userEmail].length > 0) {
        // Przygotowanie listy zadań
        const taskList = userTasks[userEmail].map(task => `- ${task.name}`).join('\n');
        console.log(taskList);
        console.log('mail:');
        console.log(userEmail);
        const mailOptions = {
          from: 'papproject60@gmail.com', // Twój adres e-mail
          to: userEmail,               // Adres e-mail odbiorcy (klucz)
          subject: 'Nowe Zadania Dostępne',
          text: `Cześć,\n\nMamy nowe zadania, które mogą Cię zainteresować:\n\n${taskList}\n\nZapraszamy do rozwiązania ich na naszej platformie!\n\nPozdrawiamy
          
          приходи в дискорд в 8 вечера xD`
        };
  
        transporter.sendMail(mailOptions, function(error, info){
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
    const testUserEmail = 'mlisows@gmail.com'; // Zmień na adres, na który chcesz wysłać testowy e-mail
    const taskList = 'Przykładowe zadanie 1\nPrzykładowe zadanie 2'; // Przykładowa lista zadań
  
    const mailOptions = {
      from: 'papproject60@gmail.com', // Twój adres e-mail
      to: testUserEmail,              // Adres e-mail do testów
      subject: 'Test Nowych Zadań Dostępnych',
      text: `Cześć,\n\nTo jest testowy e-mail. Oto twoje zadania:\n\n${taskList}\n\nPozdrawiamy,\nZespół [Nazwa Twojej Platformy]`
    };
  
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Testowy e-mail wysłany: ' + info.response);
      }
    });
  }
  

module.exports = {checkExercisesAndSendEmail,
                  testSendEmail,
}
