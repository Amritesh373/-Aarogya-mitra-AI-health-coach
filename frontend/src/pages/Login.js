import React, { useState } from 'react';
import axios from 'axios';
import API_ENDPOINTS from '../config';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegister) {
        // Register - use actual object, not {...}
        const response = await axios.post(API_ENDPOINTS.register, {
          email: email,
          username: username,
          password: password,
          full_name: fullName
        });
        localStorage.setItem('token', response.data.access_token);
        setMessage('Registration successful!');
        window.location.href = '/dashboard';
      } else {
        // Login
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);

        const response = await axios.post(API_ENDPOINTS.login, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        localStorage.setItem('token', response.data.access_token);
        setMessage('Login successful!');
        window.location.href = '/dashboard';
      }
    } catch (error) {
      setMessage(error.response?.data?.detail || 'Error occurred');
    }
  };

  return (
    <div style={{
      maxWidth: '400px',
      margin: '50px auto',
      padding: '30px',
      borderRadius: '10px',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h2 style={{ textAlign: 'center', color: '#333' }}>
        {isRegister ? 'Register' : 'Login'} to Aarogya Mitra
      </h2>
      
      <form onSubmit={handleSubmit}>
        {isRegister && (
          <>
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              style={styles.input}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              required
            />
          </>
        )}
        
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
          required
        />
        
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          required
        />
        
        <button type="submit" style={styles.button}>
          {isRegister ? 'Register' : 'Login'}
        </button>
      </form>
      
      <p style={{ textAlign: 'center', marginTop: '20px' }}>
        {isRegister ? 'Already have an account? ' : "Don't have an account? "}
        <button
          onClick={() => setIsRegister(!isRegister)}
          style={styles.toggleButton}
        >
          {isRegister ? 'Login' : 'Register'}
        </button>
      </p>
      
      {message && (
        <p style={{ textAlign: 'center', color: message.includes('successful') ? 'green' : 'red' }}>
          {message}
        </p>
      )}
    </div>
  );
}

const styles = {
  input: {
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    borderRadius: '5px',
    border: '1px solid #ddd',
    boxSizing: 'border-box',
    fontSize: '16px'
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    marginTop: '10px'
  },
  toggleButton: {
    background: 'none',
    border: 'none',
    color: '#007bff',
    cursor: 'pointer',
    textDecoration: 'underline'
  }
};

export default Login;