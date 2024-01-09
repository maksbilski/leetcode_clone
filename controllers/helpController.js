const pool = require('../db');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'papproject60@gmail.com', // Twój adres e-mail na Gmailu
    pass: 'pora kndk yjmj oycz' // Twoje hasło aplikacji
  }
});

const getSubmitForm = async (req, res) => {
  const { message } = req.body; // Pobieranie wiadomości z ciała żądania
  const userEmail = await pool`select email from users where user_id = ${req.session.userId}`;
  console.log(userEmail[0].email);
  if (!message) {
    return res.status(400).send('Brak wiadomości');
  }

  // Opcje e-maila
  const mailOptions = {
    from: 'papproject60@gmail.com',
    to: 'papproject60@gmail.com', // Zmień na swój adres e-mail
    subject: `Nowa wiadomość z formularza feedbacku, od użytkownika: ${userEmail[0].email}`,
    text: `Otrzymano nową wiadomość: ${message}`
  };

  // Wysyłanie e-maila
  try {
    await transporter.sendMail(mailOptions);
    console.log('E-mail wysłany');
    res.send('Wiadomość została wysłana');
  } catch (error) {
    console.error('Błąd przy wysyłaniu e-maila:', error);
    res.status(500).send('Błąd serwera');
  }
};

module.exports = {
  getSubmitForm
};
