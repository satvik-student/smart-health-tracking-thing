import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { 
  FaHeartbeat, 
  FaUser, 
  FaPlus, 
  FaSearch, 
  FaTachometerAlt,
  FaHeart,
  FaTint,
  FaWeight,
  FaChartLine,
  FaEdit,
  FaTrash,
  FaSignOutAlt,
  FaUsers
} from 'react-icons/fa';

const Dashboard = ({ onLogout }) => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showAddData, setShowAddData] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [notification, setNotification] = useState({ message: '', type: 'success' });
  const [editingRecord, setEditingRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [healthData, setHealthData] = useState([]);
  const [newHealthData, setNewHealthData] = useState({
    bloodPressure: { systolic: '', diastolic: '' },
    sugarLevel: '',
    heartRate: '',
    weight: ''
  });

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';
      const response = await fetch(`${API_URL}/api/patients`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setPatients(data || []);
    } catch (error) {
      console.error('Error fetching patients:', error);
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchPatientData = async (patientId) => {
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';
      const response = await fetch(`${API_URL}/api/patients/${patientId}/data`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setHealthData(data || []);
    } catch (error) {
      console.error('Error fetching patient data:', error);
      setHealthData([]);
    }
  };

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    fetchPatientData(patient.patientId);
    setShowAddData(false);
  };

  const handleAddHealthData = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';
      
      let response;
      if (editingRecord) {
        // Update existing record
        response = await fetch(`${API_URL}/api/patients/data/${editingRecord._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newHealthData)
        });
      } else {
        // Create new record
        response = await fetch(`${API_URL}/api/patients/${selectedPatient.patientId}/data`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newHealthData)
        });
      }

      if (response.ok) {
        await fetchPatientData(selectedPatient.patientId);
        setShowAddData(false);
        setEditingRecord(null);
        setNewHealthData({
          bloodPressure: { systolic: '', diastolic: '' },
          sugarLevel: '',
          heartRate: '',
          weight: ''
        });
        showSuccessNotification(editingRecord ? 'Health data updated successfully!' : 'Health data added successfully!');
      } else {
        const errorData = await response.json();
        showErrorNotification('Error saving data: ' + (errorData.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error saving health data:', error);
      showErrorNotification('Failed to save health data. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Notification functions
  const showSuccessNotification = (message) => {
    setNotification({ message, type: 'success' });
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const showErrorNotification = (message) => {
    setNotification({ message, type: 'error' });
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 4000);
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = () => {
    setShowLogoutModal(false);
    onLogout();
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  const handleEditRecord = (record) => {
    // Set the form data to the record values for editing
    setNewHealthData({
      bloodPressure: {
        systolic: record.bloodPressure.systolic,
        diastolic: record.bloodPressure.diastolic
      },
      sugarLevel: record.sugarLevel,
      heartRate: record.heartRate,
      weight: record.weight
    });
    setEditingRecord(record);
    setShowAddData(true);
  };

  const handleDeleteClick = (record) => {
    setRecordToDelete(record);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';
      const response = await fetch(`${API_URL}/api/patients/data/${recordToDelete._id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        // Refresh the patient data after deletion
        await fetchPatientData(selectedPatient.patientId);
        showSuccessNotification('Health record deleted successfully!');
      } else {
        const errorData = await response.json();
        showErrorNotification('Error deleting record: ' + (errorData.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error deleting record:', error);
      showErrorNotification('Failed to delete health record. Please try again.');
    } finally {
      setShowDeleteModal(false);
      setRecordToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setRecordToDelete(null);
  };

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.patientId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getLatestVitals = () => {
    if (healthData.length === 0) return null;
    return healthData[0];
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <div className="logo">
            <FaHeartbeat className="logo-icon" />
            <span className="logo-text">SmartHealth</span>
          </div>
          <div className="header-title">
            <h1>Doctor Dashboard</h1>
            <p>Patient Health Management System</p>
          </div>
        </div>
        <div className="header-right">
          <button className="logout-btn" onClick={handleLogoutClick}>
            <FaSignOutAlt className="btn-icon" />
            Logout
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        {/* Sidebar - Patient List */}
        <aside className="sidebar">
          <div className="sidebar-header">
            <h3>
              <FaUsers className="section-icon" />
              Patients ({filteredPatients.length})
            </h3>
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="patient-list">
            {loading ? (
              <div className="loading">Loading patients...</div>
            ) : filteredPatients.length === 0 ? (
              <div className="no-patients">No patients found</div>
            ) : (
              filteredPatients.map(patient => (
                <div
                  key={patient.patientId}
                  className={`patient-card ${selectedPatient?.patientId === patient.patientId ? 'active' : ''}`}
                  onClick={() => handlePatientSelect(patient)}
                >
                  <div className="patient-avatar">
                    <FaUser />
                  </div>
                  <div className="patient-info">
                    <h4>{patient.name}</h4>
                    <p>ID: {patient.patientId}</p>
                    <p>{patient.phone}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          {!selectedPatient ? (
            <div className="welcome-screen">
              <FaHeartbeat className="welcome-icon" />
              <h2>Welcome to SmartHealth Dashboard</h2>
              <p>Select a patient from the sidebar to view their health data</p>
            </div>
          ) : (
            <div className="patient-dashboard">
              {/* Patient Header */}
              <div className="patient-header">
                <div className="patient-details">
                  <h2>{selectedPatient.name}</h2>
                  <div className="patient-meta">
                    <span>Patient ID: {selectedPatient.patientId}</span>
                    <span>Phone: {selectedPatient.phone}</span>
                  </div>
                </div>
                <div className="patient-actions">
                  <button 
                    className="primary-btn"
                    onClick={() => {
                      setEditingRecord(null);
                      setNewHealthData({
                        bloodPressure: { systolic: '', diastolic: '' },
                        sugarLevel: '',
                        heartRate: '',
                        weight: ''
                      });
                      setShowAddData(!showAddData);
                    }}
                  >
                    <FaPlus className="btn-icon" />
                    Add Health Data
                  </button>
                </div>
              </div>

              {/* Latest Vitals Cards */}
              {getLatestVitals() && (
                <div className="vitals-grid">
                  <div className="vital-card">
                    <div className="vital-icon bp">
                      <FaTachometerAlt />
                    </div>
                    <div className="vital-info">
                      <h4>Blood Pressure</h4>
                      <p className="vital-value">
                        {getLatestVitals().bloodPressure.systolic}/
                        {getLatestVitals().bloodPressure.diastolic}
                      </p>
                      <span className="vital-unit">mmHg</span>
                    </div>
                  </div>

                  <div className="vital-card">
                    <div className="vital-icon sugar">
                      <FaTint />
                    </div>
                    <div className="vital-info">
                      <h4>Sugar Level</h4>
                      <p className="vital-value">{getLatestVitals().sugarLevel}</p>
                      <span className="vital-unit">mg/dL</span>
                    </div>
                  </div>

                  <div className="vital-card">
                    <div className="vital-icon heart">
                      <FaHeart />
                    </div>
                    <div className="vital-info">
                      <h4>Heart Rate</h4>
                      <p className="vital-value">{getLatestVitals().heartRate}</p>
                      <span className="vital-unit">BPM</span>
                    </div>
                  </div>

                  <div className="vital-card">
                    <div className="vital-icon weight">
                      <FaWeight />
                    </div>
                    <div className="vital-info">
                      <h4>Weight</h4>
                      <p className="vital-value">{getLatestVitals().weight}</p>
                      <span className="vital-unit">kg</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Add/Edit Health Data Form */}
              {showAddData && (
                <div className="add-data-form">
                  <h3>{editingRecord ? 'Edit Health Data' : 'Add New Health Data'}</h3>
                  <form onSubmit={handleAddHealthData}>
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Blood Pressure</label>
                        <div className="bp-inputs">
                          <input
                            type="number"
                            placeholder="Systolic (120)"
                            value={newHealthData.bloodPressure.systolic}
                            onChange={(e) => setNewHealthData({
                              ...newHealthData,
                              bloodPressure: { ...newHealthData.bloodPressure, systolic: e.target.value }
                            })}
                            min="50"
                            max="300"
                            required
                          />
                          <span>/</span>
                          <input
                            type="number"
                            placeholder="Diastolic (80)"
                            value={newHealthData.bloodPressure.diastolic}
                            onChange={(e) => setNewHealthData({
                              ...newHealthData,
                              bloodPressure: { ...newHealthData.bloodPressure, diastolic: e.target.value }
                            })}
                            min="30"
                            max="200"
                            required
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label>Sugar Level (mg/dL)</label>
                        <input
                          type="number"
                          placeholder="Enter sugar level (80-120 normal)"
                          value={newHealthData.sugarLevel}
                          onChange={(e) => setNewHealthData({ ...newHealthData, sugarLevel: e.target.value })}
                          min="20"
                          max="600"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Heart Rate (BPM)</label>
                        <input
                          type="number"
                          placeholder="Enter heart rate (60-100 normal)"
                          value={newHealthData.heartRate}
                          onChange={(e) => setNewHealthData({ ...newHealthData, heartRate: e.target.value })}
                          min="30"
                          max="220"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Weight (kg)</label>
                        <input
                          type="number"
                          placeholder="Enter weight in kg"
                          step="0.1"
                          value={newHealthData.weight}
                          onChange={(e) => setNewHealthData({ ...newHealthData, weight: e.target.value })}
                          min="10"
                          max="500"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-actions">
                      <button type="button" className="secondary-btn" onClick={() => {
                        setShowAddData(false);
                        setEditingRecord(null);
                        setNewHealthData({
                          bloodPressure: { systolic: '', diastolic: '' },
                          sugarLevel: '',
                          heartRate: '',
                          weight: ''
                        });
                      }}>
                        Cancel
                      </button>
                      <button type="submit" className="primary-btn" disabled={saving}>
                        {saving ? 'Saving...' : (editingRecord ? 'Update Data' : 'Save Data')}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Health Data History */}
              <div className="health-history">
                <h3>
                  <FaChartLine className="section-icon" />
                  Health Data History
                </h3>
                
                {healthData.length === 0 ? (
                  <div className="no-data">
                    <p>No health data recorded yet</p>
                    <button className="primary-btn" onClick={() => setShowAddData(true)}>
                      <FaPlus className="btn-icon" />
                      Add First Record
                    </button>
                  </div>
                ) : (
                  <div className="data-table">
                    <table>
                      <thead>
                        <tr>
                          <th>Date & Time</th>
                          <th>Blood Pressure</th>
                          <th>Sugar Level</th>
                          <th>Heart Rate</th>
                          <th>Weight</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {healthData.map(record => (
                          <tr key={record._id}>
                            <td>{new Date(record.recordedAt).toLocaleString()}</td>
                            <td>{record.bloodPressure.systolic}/{record.bloodPressure.diastolic}</td>
                            <td>{record.sugarLevel} mg/dL</td>
                            <td>{record.heartRate} BPM</td>
                            <td>{record.weight} kg</td>
                            <td>
                              <div className="action-buttons">
                                <button 
                                  className="action-btn edit-btn" 
                                  onClick={() => handleEditRecord(record)}
                                  title="Edit Record"
                                >
                                  <FaEdit />
                                </button>
                                <button 
                                  className="action-btn delete-btn" 
                                  onClick={() => handleDeleteClick(record)}
                                  title="Delete Record"
                                >
                                  <FaTrash />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="logout-modal">
            <div className="modal-header">
              <h3>Confirm Logout</h3>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to logout?</p>
              <p className="modal-subtitle">You will be redirected to the landing page.</p>
            </div>
            <div className="modal-actions">
              <button className="secondary-btn" onClick={handleLogoutCancel}>
                Cancel
              </button>
              <button className="danger-btn" onClick={handleLogoutConfirm}>
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="logout-modal">
            <div className="modal-header">
              <h3>Confirm Delete</h3>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete this health record?</p>
              <p className="modal-subtitle">This action cannot be undone.</p>
            </div>
            <div className="modal-actions">
              <button className="secondary-btn" onClick={handleDeleteCancel}>
                Cancel
              </button>
              <button className="danger-btn" onClick={handleDeleteConfirm}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success/Error Notification */}
      {showNotification && (
        <div className={`notification ${notification.type}`}>
          <div className="notification-content">
            <span className="notification-message">{notification.message}</span>
            <button 
              className="notification-close"
              onClick={() => setShowNotification(false)}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;