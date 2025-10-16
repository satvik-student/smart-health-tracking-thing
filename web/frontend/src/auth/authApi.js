// API functions for doctor login and register
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

export async function doctorLogin({ phone, password }) {
  try {
    const res = await fetch(`${API_URL}/api/doctors/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, password })
    });
    
    if (!res.ok) {
      // Try to parse error response, but handle cases where it's not JSON
      let errorMessage = 'Login failed';
      try {
        const data = await res.json();
        errorMessage = data.message || errorMessage;
      } catch (e) {
        errorMessage = `HTTP ${res.status}: ${res.statusText}`;
      }
      throw new Error(errorMessage);
    }
    
    return res.json();
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Unable to connect to server. Please check if the backend is running.');
    }
    throw error;
  }
}

export async function doctorRegister({ name, phone, email, password, clinic }) {
  try {
    const res = await fetch(`${API_URL}/api/doctors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone, email, password, clinic })
    });
    
    if (!res.ok) {
      // Try to parse error response, but handle cases where it's not JSON
      let errorMessage = 'Registration failed';
      try {
        const data = await res.json();
        errorMessage = data.message || errorMessage;
      } catch (e) {
        errorMessage = `HTTP ${res.status}: ${res.statusText}`;
      }
      throw new Error(errorMessage);
    }
    
    return res.json();
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Unable to connect to server. Please check if the backend is running.');
    }
    throw error;
  }
}
