import React from 'react';
import LandingPage from './landing/LandingPage';
import AuthPage from './auth/AuthPage';
import Dashboard from './home-dashboard/Dashboard';
import './App.css';

function App() {
  const [route, setRoute] = React.useState('landing');
  const [doctorData, setDoctorData] = React.useState(null);

  // Check for existing login on component mount
  React.useEffect(() => {
    const savedDoctor = localStorage.getItem('doctorData');
    const savedAuth = localStorage.getItem('isAuthenticated');
    
    if (savedAuth === 'true' && savedDoctor) {
      try {
        const doctor = JSON.parse(savedDoctor);
        setDoctorData(doctor);
        setRoute('dashboard');
      } catch (error) {
        // Clear invalid data
        localStorage.removeItem('doctorData');
        localStorage.removeItem('isAuthenticated');
      }
    }
  }, []);

  // Handle successful login
  const handleLoginSuccess = (doctor) => {
    setDoctorData(doctor);
    setRoute('dashboard');
    
    // Save to localStorage for persistence
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('doctorData', JSON.stringify(doctor));
  };

  // Handle logout
  const handleLogout = () => {
    setDoctorData(null);
    setRoute('landing');
    
    // Clear localStorage
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('doctorData');
  };

  // Handle navigation to auth page
  const handleAuthNavigation = () => {
    setRoute('auth');
  };

  // Handle back to landing from auth
  const handleBackToLanding = () => {
    setRoute('landing');
  };

  const renderCurrentRoute = () => {
    switch (route) {
      case 'landing':
        return <LandingPage onAuth={handleAuthNavigation} />;
      case 'auth':
        return (
          <AuthPage 
            onLoginSuccess={handleLoginSuccess}
            onBack={handleBackToLanding}
          />
        );
      case 'dashboard':
        return (
          <Dashboard 
            doctorData={doctorData}
            onLogout={handleLogout}
          />
        );
      default:
        return <LandingPage onAuth={handleAuthNavigation} />;
    }
  };

  return (
    <div className="App">
      {renderCurrentRoute()}
    </div>
  );
}

export default App;
