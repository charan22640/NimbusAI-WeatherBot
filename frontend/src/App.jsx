import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Graph from "./components/Graph";
import Subscription from "./components/Subscription";
import Footer from "./components/Footer";
import WeatherSafety from './components/WeatherSafety';
import "./App.css";

const App = () => {
  const [selectedCity, setSelectedCity] = useState("Hyderabad");

  const handleCityChange = (city) => {
    setSelectedCity(city);
  };

  const handleSearch = (searchLocation) => {
    if (searchLocation) {
      setSelectedCity(searchLocation);
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar onSearch={handleSearch} />
        <FlashMessage />
        <main className="max-w-7xl mx-auto py-8"> {/* Added vertical padding */}
          <Routes>
            <Route path="/" element={
              <>
                <section className="section mb-16"> {/* Added margin bottom */}
                  <Hero onCityChange={handleCityChange} />
                </section>
                <section className="graph-section mb-16"> {/* Added margin bottom */}
                  <Graph city={selectedCity} />
                </section>
              </>
            } />
          </Routes>
        </main>
        <section className="section bg-gray-200 py-16"> {/* Added vertical padding */}
          <Subscription />
        </section>
        <div className="w-full border-t border-gray-300">
          <Footer />
        </div>
      </div>
    </Router>
  );
};

const FlashMessage = () => {
  const location = useLocation();
  const [flashMessage, setFlashMessage] = useState(location.state?.flashMessage || '');
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (location.state?.flashMessage) {
      setFlashMessage(location.state.flashMessage);
      setProgress(100);

      // Progress bar animation
      const startTime = Date.now();
      const duration = 5000; // 5 seconds

      const updateProgress = () => {
        const elapsed = Date.now() - startTime;
        const newProgress = Math.max(0, 100 - (elapsed / duration) * 100);
        setProgress(newProgress);

        if (newProgress > 0) {
          requestAnimationFrame(updateProgress);
        }
      };

      requestAnimationFrame(updateProgress);

      const timer = setTimeout(() => {
        setFlashMessage('');
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [location.state]);

  const clearFlashMessage = () => {
    setFlashMessage('');
  };

  return (
    flashMessage && (
      <div className="mb-4 text-center text-white bg-green-500 rounded-lg relative overflow-hidden">
        <div className="p-4">
          {flashMessage}
          <button
            onClick={clearFlashMessage}
            className="absolute top-2 right-2 text-white hover:text-gray-200 focus:outline-none"
          >
            X
          </button>
        </div>
        <div 
          className="absolute bottom-0 left-0 h-1 bg-white/30 transition-all duration-200"
          style={{ width: `${progress}%` }}
        />
      </div>
    )
  );
};

export default App;
