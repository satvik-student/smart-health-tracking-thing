import React, { useState, useEffect } from 'react';
import './LandingPage.css';
import { FaHeartbeat, FaArrowRight, FaUserMd, FaRobot, FaShieldAlt, FaMobile } from 'react-icons/fa';

const LandingPage = ({ onAuth }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation on mount
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  return (
    <div className="landing-page">
      <section className="hero">
        <nav className="navbar">
          <div className="logo">
            <span className="logo-icon">🏥</span>
            <span className="logo-text">
              <span style={{ color: '#00c9a7' }}>Arogya</span>
              <span style={{ color: '#ffffff' }}>Link</span>
            </span>
          </div>
          <div className="nav-actions">
            <button className="nav-btn secondary-btn" onClick={onAuth}>
              <FaUserMd className="btn-icon" />
              Doctor Login
            </button>
          </div>
        </nav>
        
        <div className={`hero-content ${isVisible ? 'visible' : ''}`}>
          <h1 className="hero-title">
            <span className="gradient-text">ArogyaLink</span>
            <br />
            Health Tracking System
          </h1>
          
          <p className="hero-subtitle">
            Revolutionizing healthcare management with intelligent tracking,
            real-time monitoring, and seamless doctor-patient communication
          </p>
          
          <div className="hero-buttons">
            <button className="primary-btn" onClick={onAuth}>
              Get Started
              <FaArrowRight className="btn-icon" />
            </button>
          </div>
        </div>
        
        <div className="hero-background">
          <div className="floating-element element-1"></div>
          <div className="floating-element element-2"></div>
          <div className="floating-element element-3"></div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
