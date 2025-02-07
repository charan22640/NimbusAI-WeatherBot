import { useState } from "react";

const Subscription = () => {
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await fetch('http://localhost:5000/api/subscription/subscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                location: location
            })
        });

        const data = await response.json();
        if (response.ok) {
            setMessage("Successfully subscribed for weather alerts! 🎉");
            console.log('Subscription successful:', data);
            setEmail("");
            setLocation("");
        } else {
            setMessage(data.error || "Subscription failed. Please try again.");
            console.error('Subscription failed:', data.error);
        }
    } catch (error) {
        console.error('Error:', error);
        setMessage("Subscription failed. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
        <div className="p-8">
          {/* Header Section */}
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Stay Ahead of the Weather
            </h2>
            <p className="text-gray-600 text-lg">
              Get real-time weather alerts delivered straight to your inbox
            </p>
          </div>

          {/* Subscription Form */}
          <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-gray-700 mb-2 text-sm font-medium">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 
                           text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 
                           focus:ring-blue-500/50 focus:border-transparent transition-all"
                  required
                />
              </div>
              <div>
                <label htmlFor="location" className="block text-gray-700 mb-2 text-sm font-medium">
                  Location
                </label>
                <input
                  id="location"
                  type="text"
                  placeholder="Enter your city"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 
                           text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 
                           focus:ring-blue-500/50 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            {/* Features List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8 text-sm">
              <div className="flex items-center space-x-2 bg-blue-50 p-3 rounded-lg border border-blue-100">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">Daily Weather Updates</span>
              </div>
              <div className="flex items-center space-x-2 bg-blue-50 p-3 rounded-lg border border-blue-100">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">Rain Alerts</span>
              </div>
              <div className="flex items-center space-x-2 bg-blue-50 p-3 rounded-lg border border-blue-100">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">Severe Weather Warnings</span>
              </div>
              <div className="flex items-center space-x-2 bg-blue-50 p-3 rounded-lg border border-blue-100">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">Weekly Forecasts</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 
                       rounded-xl transition-all duration-300 transform hover:scale-[1.02] 
                       focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-lg"
            >
              Subscribe Now
            </button>
          </form>

          {/* Success Message */}
          {message && (
            <div className="mt-6 text-center">
              <p className="text-blue-700 bg-blue-50 py-3 px-4 rounded-lg inline-block border border-blue-100">
                {message}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Subscription;