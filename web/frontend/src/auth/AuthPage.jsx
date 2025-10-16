import React, { useState, useEffect } from 'react';
import './AuthPage.css';
import { doctorLogin, doctorRegister } from './authApi';
import { FaHeartbeat, FaUserMd, FaStethoscope, FaLock, FaUser, FaPhone, FaEnvelope, FaHospital } from 'react-icons/fa';

const AuthPage = ({ onBack, onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    clinic: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      if (isLogin) {
        const doctorData = await doctorLogin({ phone: form.phone, password: form.password });
        setSuccess('Login successful! Redirecting...');
        
        // Redirect to dashboard after successful login
        setTimeout(() => {
          if (onLoginSuccess) {
            onLoginSuccess(doctorData);
          }
        }, 1000);
      } else {
        await doctorRegister(form);
        setSuccess('Registration successful! Please login.');
        setIsLogin(true);
        // Clear form after registration
        setForm({
          name: '',
          phone: '',
          email: '',
          password: '',
          clinic: ''
        });
      }
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Background Elements */}
      <div className="auth-background">
        <div className="floating-element element-1"></div>
        <div className="floating-element element-2"></div>
        <div className="floating-element element-3"></div>
      </div>

      {/* Header with Back Button */}
      <header className="auth-header">
        <div className="logo" onClick={onBack}>
          <FaHeartbeat className="logo-icon" />
          <span className="logo-text">SmartHealth</span>
        </div>
        {onBack && (
          <button className="back-btn" onClick={onBack}>
            ← Back to Home
          </button>
        )}
      </header>

      <div className={`auth-container ${isVisible ? 'visible' : ''}`}>
        <div className="auth-card">
          {/* Header Section */}
          <div className="auth-card-header">
            <div className="auth-icon">
              <FaUserMd />
            </div>
            <h2 className="auth-title">
              Doctor {isLogin ? 'Login' : 'Registration'}
            </h2>
            <p className="auth-subtitle">
              {isLogin 
                ? 'Welcome back! Please sign in to your account.' 
                : 'Create your doctor account to get started.'}
            </p>
          </div>

          {/* Toggle Buttons */}
          <div className="auth-toggle">
            <button
              className={isLogin ? 'active' : ''}
              onClick={() => setIsLogin(true)}
              type="button"
            >
              <FaLock className="toggle-icon" />
              Login
            </button>
            <button
              className={!isLogin ? 'active' : ''}
              onClick={() => setIsLogin(false)}
              type="button"
            >
              <FaStethoscope className="toggle-icon" />
              Register
            </button>
          </div>

          {/* Form Section */}
          <form className="auth-form" onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <div className="form-group">
                  <label htmlFor="name">
                    <FaUser className="label-icon" />
                    Full Name
                  </label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    value={form.name} 
                    onChange={handleChange} 
                    placeholder="Enter your full name"
                    required 
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">
                    <FaEnvelope className="label-icon" />
                    Email Address
                  </label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    value={form.email} 
                    onChange={handleChange} 
                    placeholder="Enter your email"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="clinic">
                    <FaHospital className="label-icon" />
                    Clinic/Hospital Name
                  </label>
                  <input 
                    type="text" 
                    id="clinic" 
                    name="clinic" 
                    value={form.clinic} 
                    onChange={handleChange} 
                    placeholder="Enter clinic or hospital name"
                    required 
                  />
                </div>
              </>
            )}
            <div className="form-group">
              <label htmlFor="phone">
                <FaPhone className="label-icon" />
                Phone Number
              </label>
              <input 
                type="text" 
                id="phone" 
                name="phone" 
                value={form.phone} 
                onChange={handleChange} 
                placeholder="Enter your phone number"
                required 
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">
                <FaLock className="label-icon" />
                Password
              </label>
              <input 
                type="password" 
                id="password" 
                name="password" 
                value={form.password} 
                onChange={handleChange} 
                placeholder="Enter your password"
                required 
                minLength={6} 
              />
            </div>

            {/* Error/Success Messages */}
            {error && <div className="auth-message error">{error}</div>}
            {success && <div className="auth-message success">{success}</div>}

            {/* Submit Button */}
            <button className="auth-btn primary-btn" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <div className="loading-spinner"></div>
                  {isLogin ? 'Signing in...' : 'Creating account...'}
                </>
              ) : (
                <>
                  <FaUserMd className="btn-icon" />
                  {isLogin ? 'Sign In' : 'Create Account'}
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
