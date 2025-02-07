const transporter = require('../config/email');

class EmailService {
    constructor(transporter) {
        this.transporter = transporter;
    }

    async sendSubscriptionEmail(email, weatherAlerts) {
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: email,
            subject: 'Weather Alerts Subscription',
            text: `You have successfully subscribed to weather alerts. Here are your alerts: ${weatherAlerts.join(', ')}`,
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log('Subscription email sent successfully.');
        } catch (error) {
            console.error('Error sending subscription email:', error);
        }
    }

    async sendUnsubscriptionEmail(email) {
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: email,
            subject: 'Unsubscription from Weather Alerts',
            text: 'You have successfully unsubscribed from weather alerts.',
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log('Unsubscription email sent successfully.');
        } catch (error) {
            console.error('Error sending unsubscription email:', error);
        }
    }
}

const sendWeatherAlert = async (subscriber, weatherData) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: subscriber.email,
            subject: 'Weather Alert for Your Location',
            html: `
                <h2>Weather Alert for ${subscriber.location}</h2>
                <p>Current conditions:</p>
                <ul>
                    <li>Temperature: ${weatherData.temperature}°C</li>
                    <li>Conditions: ${weatherData.conditions}</li>
                    <li>Alerts: ${weatherData.alerts || 'None'}</li>
                </ul>
            `
        };

        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};

module.exports = {
    EmailService,
    sendWeatherAlert
};