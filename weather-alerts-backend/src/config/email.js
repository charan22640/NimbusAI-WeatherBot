const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

const emailTemplates = {
    subscription: (email) => `
        <h1>Welcome to Weather Alerts!</h1>
        <p>Thank you for subscribing, ${email}. You will now receive weather alerts.</p>
    `,
    unsubscription: (email) => `
        <h1>Goodbye!</h1>
        <p>We're sorry to see you go, ${email}. You have been unsubscribed from weather alerts.</p>
    `,
};

module.exports = {
    transporter,
    emailTemplates,
};