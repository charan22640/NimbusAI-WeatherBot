# Contents of /weather-alerts-backend/weather-alerts-backend/README.md

# Weather Alerts Backend

This project is a backend application built with Node.js and Express that provides email subscription features for weather alerts. Users can subscribe to receive notifications about weather updates.

## Features

- User subscription management (subscribe/unsubscribe)
- Fetching weather alerts from an external API
- Sending email notifications for subscriptions

## Getting Started

### Prerequisites

- Node.js
- MongoDB Atlas account

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/weather-alerts-backend.git
   ```

2. Navigate to the project directory:
   ```
   cd weather-alerts-backend
   ```

3. Install the dependencies:
   ```
   npm install
   ```

4. Create a `.env` file based on the `.env.example` file and fill in your MongoDB and email service credentials.

### Running the Application

To start the application, run:
```
npm start
```

### API Endpoints

- `POST /subscribe`: Subscribe a user to weather alerts.
- `POST /unsubscribe`: Unsubscribe a user from weather alerts.
- `GET /weather-alerts`: Get current weather alerts.

## License

This project is licensed under the MIT License.