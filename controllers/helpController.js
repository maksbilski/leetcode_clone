const pool = require('../db');
const nodemailer = require('nodemailer');

// Set up a mail transporter for sending emails
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'papproject60@gmail.com', // Your Gmail email address
    pass: 'pora kndk yjmj oycz' // Your app password
  }
});

/**
 * Handles the submission of a feedback form by sending an email with the user's message.
 *
 * @param {object} req - The request object containing the user's session and message.
 * @param {object} res - The response object for sending back the status of the email sending.
 */
const getSubmitForm = async (req, res) => {
  const { message } = req.body; // Retrieve the message from the request body
  const userEmail = await pool`select email from users where user_id = ${req.session.userId}`;
  if (!message) {
    return res.status(400).send('No message provided');
  }

  // Email options
  const mailOptions = {
    from: 'papproject60@gmail.com',
    to: 'papproject60@gmail.com', // Change to your email address
    subject: `New feedback form message from user: ${userEmail[0].email}`,
    text: `Received a new message: ${message}`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.send('Message has been sent');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Server error');
  }
};

module.exports = {
  getSubmitForm
};
