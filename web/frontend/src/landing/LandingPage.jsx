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
            <FaHeartbeat className="logo-icon" />
            <span className="logo-text">SmartHealth</span>
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
            <span className="gradient-text">Smart Health</span>
            <br />
            Tracking System
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
          
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">1000+</div>
              <div className="stat-label">Active Doctors</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">50K+</div>
              <div className="stat-label">Patients Monitored</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">99.9%</div>
              <div className="stat-label">Uptime</div>
            </div>
          </div>
          
          <div className="hero-features">
            <div className="feature-pill">
              <FaRobot className="feature-icon" />
              AI-Powered Analytics
            </div>
            <div className="feature-pill">
              <FaShieldAlt className="feature-icon" />
              End-to-End Encryption
            </div>
            <div className="feature-pill">
              <FaMobile className="feature-icon" />
              Cross-Platform Support
            </div>
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
