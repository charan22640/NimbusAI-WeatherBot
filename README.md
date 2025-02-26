# 🌦️ Weather Alert with Nimbus AI

A next-gen **AI-powered weather assistant** that provides real-time weather insights, **intelligent weather forecasting**, and interactive chatbot support using **Google's Gemini AI** and advanced data visualization.

## 🚀 Features

- **Real-Time Weather Data** – Get up-to-date weather details for any location.
- **AI-Powered Insights** – Smart weather analysis using **Google Gemini AI**.
- **Nimbus AI Chatbot** – A **context-aware AI assistant** that provides **instant, human-like weather updates**.
- **Interactive Weather Visualizations** – Stunning **charts and graphs** powered by Chart.js & Recharts.
- **Automated Weather Alerts** – Get **email notifications** for extreme weather conditions.
- **Seamless UI & UX** – Built with **Tailwind CSS** and enhanced by **Framer Motion** animations.
- **Secure & Scalable** – Uses modern development tools and best practices.

## 🚠 Nimbus AI Chatbot: Your Personal Weather Assistant

Nimbus AI isn’t just a chatbot—it’s a **smart conversational AI** designed to provide accurate, real-time weather insights in a natural, human-like manner. Whether you need a **quick forecast**, **safety recommendations**, or **weather comparisons**, Nimbus AI delivers **context-aware responses** using **Google Gemini AI** and a specialized weather dataset.

### 🧠 What Nimbus AI Can Do  
✅ **Instant Weather Updates** – Ask about any city's weather, and get detailed reports instantly.  
✅ **Weather-Based Safety Tips** – Get AI-generated advice on how to stay safe in extreme conditions.  
✅ **Location-Aware Assistance** – Understands regional weather patterns and adapts its responses accordingly.  
✅ **Predictive Insights** – Uses AI-driven analysis to forecast potential severe weather changes.

## 🫠 Technologies Used

### 🌍 **Core Technologies**

- **React 19** – Frontend framework
- **Vite** – Fast development environment
- **Tailwind CSS 4.0** – Modern UI framework

### 🔗 **APIs & Integrations**

- **OpenWeather API** – Real-time weather data
- **Google Gemini AI** – AI-powered weather predictions
- **OpenStreetMap API** – Map-based weather visualization
- **Brevo API** – Email notification service

### 📊 **Data Visualization**

- **React ChartJS 2** – Interactive weather analytics
- **Recharts** – Advanced weather graphing
- **ChartJS Data Labels Plugin** – Enhanced visualization

### 🎨 **UI/UX Components**

- **Heroicons** – Beautiful icons
- **Framer Motion** – Smooth animations
- **Lodash** – Utility functions for optimized performance

### 💼 **Backend & Database**

- **MongoDB** – Database for storing weather alerts & user data
- **Node.js & Express** – Backend for handling requests

## 📋 Prerequisites

Before running the project, ensure you have:

- **Node.js** (v14 or higher)
- **npm** or **yarn** installed
- **OpenWeather API key** (for weather data retrieval)
- **Google Gemini AI API key** (for AI-based predictions)
- **MongoDB URI** (for database connection)
- **Brevo API Key** (for email notifications)
- **Sender Email & Name** (for email notifications)

## ⚙️ Installation & Setup

1. **Clone the repository:**

   ```sh
   git clone https://github.com/yourusername/Weather-Alert-Nimbus-AI.git
   cd Weather-Alert-Nimbus-AI
   ```

2. **Install dependencies:**

   ```sh
   npm install  # or yarn install
   ```

3. **Set up environment variables:**

   - Create a `.env` file in the root directory.
   - Add the following keys:
     ```env
     VITE_OPENWEATHER_API_KEY=your_openweather_api_key
     VITE_GEMINI_AI_API_KEY=your_gemini_api_key
     MONGODB_URI=your_mongodb_uri
     BREVO_API_KEY=your_brevo_api_key
     SENDER_EMAIL=your_sender_email
     SENDER_NAME=your_sender_name
     ```

4. **Run the development server:**

   ```sh
   npm run dev  # or yarn dev
   ```

5. **Open in browser:**

   - Visit `http://localhost:5173/` to view the application.

## 📡 Weather Monitoring & Alerts

Nimbus AI automatically checks weather conditions daily at **8:00 AM** for all subscribed users and sends **email alerts** if extreme weather conditions are detected.

### ⏳ **How It Works**

1. **Fetches weather data** from OpenWeather API for each subscriber’s location.
2. **Analyzes conditions** based on thresholds for extreme rain, storms, wind, and more.
3. **Sends email alerts** using **Brevo API** to notify users of dangerous weather conditions.

### 📜 **Code Implementation**

- **Backend:** Node.js & Express
- **Database:** MongoDB (stores user subscriptions)
- **Email Service:** Brevo API for sending alerts
- **Scheduler:** Runs daily weather checks and alerts subscribers

## 🏆 Roadmap & Future Enhancements

- 🌟 **AI-based severe weather alerts**
- 💼 **Integration with satellite weather data**
- 🌍 **Advanced map-based weather visualization**
- 📢 **Custom push notifications for weather alerts**

## 🤝 Contributing

Contributions are welcome! Feel free to submit a **pull request** or open an **issue**.

## 📜 License

This project is **open-source** and licensed under the **MIT License**.

---

### ⛈️ *Stay informed. Stay safe. Powered by Nimbus AI.*

