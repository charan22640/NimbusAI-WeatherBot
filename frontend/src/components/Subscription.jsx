import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { XMarkIcon } from '@heroicons/react/24/solid';

const Subscription = () => {
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { state } = useLocation();
  const [flashMessage, setFlashMessage] = useState(state?.flashMessage || '');
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [isResending, setIsResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);

  useEffect(() => {
    if (state?.flashMessage) {
      setFlashMessage(state.flashMessage);

      // Automatically clear the flash message after 5 seconds
      const timer = setTimeout(() => {
        setFlashMessage('');
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [state]);

  useEffect(() => {
    if (showOtpInput && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [showOtpInput, timeLeft]);

  useEffect(() => {
    if (showOtpInput && resendTimer > 0) {
      const timer = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [showOtpInput, resendTimer]);

  useEffect(() => {
    if (flashMessage || message) {
      const timer = setTimeout(() => {
        setFlashMessage('');
        setMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [flashMessage, message]);

  const validateForm = () => {
    let isValid = true;
    let newErrors = {};

    if (!email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is not valid';
      isValid = false;
    }

    if (!location) {
      newErrors.location = 'Location is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await fetch('http://localhost:5000/api/subscription/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, location }),
      });

      const data = await response.json();

      if (response.ok) {
        setShowOtpInput(true);
        setTimeLeft(600); // Reset timer
        setResendTimer(30);
        setFlashMessage("Please check your email for verification code! 📧");
      } else {
        setMessage(data.error || 'Subscription failed. Please try again.');
        console.error('Subscription failed:', data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Subscription failed. Please try again.');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:5000/api/subscription/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, location, otp }),
      });

      const data = await response.json();

      if (response.ok) {
        setEmail('');
        setLocation('');
        setOtp('');
        setShowOtpInput(false);
        navigate("/", { 
          state: { 
            flashMessage: "Successfully verified and subscribed! 🎉" 
          } 
        });
      } else {
        setMessage(data.error || 'Verification failed. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Verification failed. Please try again.');
    }
  };

  const handleResendOtp = async () => {
    setIsResending(true);
    try {
      const response = await fetch('http://localhost:5000/api/subscription/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, location }),
      });

      const data = await response.json();

      if (response.ok) {
        setTimeLeft(600); // Reset main timer to 10 minutes
        setResendTimer(30); // Reset resend timer to 30 seconds
        setOtp(''); // Clear OTP input
        setFlashMessage("New verification code sent! 📧");
      } else {
        setMessage(data.error || 'Failed to resend code. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Failed to resend code. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleOtpChange = (value) => {
    const cleanValue = value.replace(/[^0-9]/g, '').slice(0, 6);
    setOtp(cleanValue);
  };

  const handleDiscard = () => {
    setShowOtpInput(false);
    setEmail('');
    setLocation('');
    setOtp('');
    setMessage('');
    setErrors({});
    setTimeLeft(600);
    setIsResending(false);
    setResendTimer(30);
  };

  const OtpForm = () => (
    <form onSubmit={handleVerifyOtp} className="space-y-6 max-w-md mx-auto relative">
      {/* Cancel Button */}
      <button
        type="button"
        onClick={handleDiscard}
        className="absolute top-2 left-2 text-gray-600 hover:text-gray-800 focus:outline-none"
      >
        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
      </button>

      <div className="text-center">
        <label className="block text-gray-700 mb-4 text-lg font-medium">
          Enter Verification Code
        </label>
        
        {/* Hidden input for actual value */}
        <input
          type="text"
          inputMode="numeric"
          maxLength="6"
          value={otp}
          onChange={(e) => handleOtpChange(e.target.value)}
          className="sr-only"
          autoComplete="one-time-code"
          autoFocus
        />

        {/* Display boxes */}
        <div className="flex justify-center gap-3 mb-4">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className={`w-12 h-14 flex items-center justify-center text-2xl font-bold 
                       border-2 ${otp[index] ? 'border-blue-500' : 'border-gray-300'} 
                       rounded-lg bg-gray-50`}
            >
              {otp[index] || ''}
            </div>
          ))}
        </div>

        <div className="text-sm text-gray-600 mt-4">
          {timeLeft > 0 ? (
            <p>Code expires in: {formatTime(timeLeft)}</p>
          ) : (
            <p className="text-red-500">Code expired</p>
          )}
        </div>

        <button
          type="button"
          onClick={handleResendOtp}
          disabled={isResending || resendTimer > 0}
          className={`mt-4 text-sm ${
            resendTimer > 0
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-blue-600 hover:text-blue-800'
          }`}
        >
          {isResending 
            ? 'Sending...' 
            : resendTimer > 0 
              ? `Resend code in ${resendTimer}s` 
              : 'Resend Code'}
        </button>
      </div>

      <button
        type="submit"
        disabled={timeLeft === 0 || otp.length !== 6}
        className={`w-full font-semibold py-3 px-6 rounded-xl ${
          timeLeft === 0 || otp.length !== 6
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-500 hover:bg-blue-600 text-white'
        }`}
      >
        Verify
      </button>
    </form>
  );

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
        <div className="p-8">
          {/* Header Section */}
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Stay Ahead of the Weather
            </h2>
            <p className="text-gray-600 text-lg mb-4">
              Get real-time weather alerts delivered straight to your inbox
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto mt-6">
              <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <span className="text-2xl">⛈️</span>
                <div className="text-left">
                  <h3 className="font-medium text-gray-900">Severe Weather Alerts</h3>
                  <p className="text-sm text-gray-600">Thunderstorm and tornado warnings</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <span className="text-2xl">🌊</span>
                <div className="text-left">
                  <h3 className="font-medium text-gray-900">Flood Warnings</h3>
                  <p className="text-sm text-gray-600">Flash flood and heavy rainfall alerts</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <span className="text-2xl">🌪️</span>
                <div className="text-left">
                  <h3 className="font-medium text-gray-900">Wind Advisories</h3>
                  <p className="text-sm text-gray-600">Strong and dangerous wind alerts</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <span className="text-2xl">📱</span>
                <div className="text-left">
                  <h3 className="font-medium text-gray-900">Instant Notifications</h3>
                  <p className="text-sm text-gray-600">Real-time updates via email</p>
                </div>
              </div>
            </div>
          </div>

          {/* Subscription Form */}
          {!showOtpInput ? (
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
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
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
                  {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                </div>
              </div>

              {/* Subscription Benefits */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8 text-sm">
                <div className="flex items-center space-x-2 bg-blue-50 p-3 rounded-lg border border-blue-100">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Weather Alerts</span>
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
          ) : (
            <OtpForm />
          )}

          {/* Message Display */}
          {(flashMessage || message) && (
            <div className="mt-6 text-center">
              <p className={`py-3 px-4 rounded-lg inline-block border transition-all duration-300 ${
                flashMessage 
                  ? 'text-blue-700 bg-blue-50 border-blue-100' 
                  : 'text-red-700 bg-red-50 border-red-100'
              }`}>
                {flashMessage || message}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Subscription;