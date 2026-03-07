import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_ENDPOINTS from '../../config';
import ProgressCharts from './ProgressCharts';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(API_ENDPOINTS.me, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user:', error);
      handleLogout();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  if (loading) {
    return <div style={styles.container}>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>🏥 Aarogya Mitra Dashboard</h1>
        <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
      </div>

      <div style={styles.welcomeCard}>
        <h2>Welcome, {user?.full_name || user?.username}!</h2>
        <p>Your AI Health Companion is ready to assist you.</p>
      </div>

      <div style={styles.statsGrid}><ProgressCharts />
        <div style={styles.statCard}>
          <h3>⚡ Quick Actions</h3>
          <button style={styles.actionButton} onClick={() => window.location.href = '/workout'}>
            💪 Generate Workout
          </button>
          <button style={styles.actionButton} onClick={() => window.location.href = '/nutrition'}>
            🥗 Nutrition Plan
          </button>
          <button style={styles.actionButton} onClick={() => window.location.href = '/ai-coach'}>
            🤖 Chat with AROMI
          </button>
          <button style={styles.actionButton} onClick={() => window.location.href = '/health'}>
            📊 Health Tracker
          </button>
        </div>

        <div style={styles.statCard}>
          <h3>📊 Your Stats</h3>
          <p>Age: {user?.age || 'Not set'}</p>
          <p>Weight: {user?.weight || 'Not set'} kg</p>
          <p>Height: {user?.height || 'Not set'} cm</p>
          <p>Goal: {user?.fitness_goal || 'Not set'}</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px'
  },
  logoutButton: {
    padding: '10px 20px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  welcomeCard: {
    backgroundColor: '#e3f2fd',
    padding: '30px',
    borderRadius: '10px',
    marginBottom: '30px',
    textAlign: 'center'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px'
  },
  statCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
  },
  actionButton: {
    display: 'block',
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  }
};

// ✅ THIS LINE MUST BE AT THE BOTTOM!
export default Dashboard;