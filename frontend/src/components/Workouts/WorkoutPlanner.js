import React, { useState } from 'react';
import axios from 'axios';
import API_ENDPOINTS from '../../config';  // Import the API endpoints

function WorkoutPlanner() {
    const [formData, setFormData] = useState({
        age: 30,
        weight: 70,
        height: 170,
        fitness_goal: 'weight_loss',
        experience_level: 'beginner',
        equipment: ['bodyweight'],
        days_per_week: 5
    });

    const [workout, setWorkout] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleEquipmentChange = (e) => {
        const value = e.target.value;
        setFormData({
            ...formData,
            equipment: [value]
        });
    };

    const generateWorkout = async () => {
        setLoading(true);
        setError('');

        try {
            // Get token from localStorage
            const token = localStorage.getItem('token');

            if (!token) {
                setError('Please login first');
                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);
                return;
            }

            // Log what we're sending (for debugging)
            console.log('=== WORKOUT GENERATION DEBUG ===');
            console.log('Sending to:', API_ENDPOINTS.generateWorkout);
            console.log('With data:', formData);
            console.log('With token:', token);

            // Make API call using the imported endpoint
            const response = await axios.post(
                API_ENDPOINTS.generateWorkout,  // Using the imported constant
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('Response:', response.data);
            setWorkout(response.data);

        } catch (error) {
            console.error('Full error:', error);
            console.error('Error response:', error.response?.data);

            // Handle different error types
            if (error.response?.status === 401) {
                setError('Session expired. Please login again.');
                localStorage.removeItem('token');
                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);
            } else if (error.response?.status === 404) {
                setError('API endpoint not found. Please check if backend is running and URL is correct.');
                console.log('Expected URL:', API_ENDPOINTS.generateWorkout);
            } else if (error.code === 'ECONNREFUSED') {
                setError('Cannot connect to backend. Make sure the server is running on port 8000.');
            } else {
                setError(error.response?.data?.detail || error.message || 'Failed to generate workout');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        window.location.href = '/dashboard';
    };

    return (
        <div style={styles.container}>
            {/* Header */}
            <div style={styles.header}>
                <h1 style={styles.title}>💪 AI Workout Planner</h1>
                <button onClick={handleBack} style={styles.backButton}>
                    ← Back to Dashboard
                </button>
            </div>

            {/* Debug info - shows current API endpoint */}
            <div style={styles.debugInfo}>
                <strong>🔗 API Endpoint:</strong> {API_ENDPOINTS.generateWorkout}
                <br />
                <strong>🖥️ Backend Status:</strong> {error ? '❌ Error' : '✅ Connected'}
            </div>

            {/* Error message */}
            {error && (
                <div style={styles.errorMessage}>
                    ❌ {error}
                </div>
            )}

            {/* Main content */}
            <div style={styles.content}>
                {/* Left column - Form */}
                <div style={styles.formCard}>
                    <h2 style={styles.sectionTitle}>Your Profile</h2>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Age</label>
                        <input
                            type="number"
                            name="age"
                            value={formData.age}
                            onChange={handleChange}
                            style={styles.input}
                            min="1"
                            max="120"
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Weight (kg)</label>
                        <input
                            type="number"
                            name="weight"
                            value={formData.weight}
                            onChange={handleChange}
                            style={styles.input}
                            min="20"
                            max="300"
                            step="0.1"
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Height (cm)</label>
                        <input
                            type="number"
                            name="height"
                            value={formData.height}
                            onChange={handleChange}
                            style={styles.input}
                            min="50"
                            max="250"
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Fitness Goal</label>
                        <select
                            name="fitness_goal"
                            value={formData.fitness_goal}
                            onChange={handleChange}
                            style={styles.select}
                        >
                            <option value="weight_loss">🔥 Weight Loss</option>
                            <option value="muscle_gain">💪 Muscle Gain</option>
                            <option value="general_fitness">🌟 General Fitness</option>
                            <option value="endurance">🏃 Endurance</option>
                            <option value="flexibility">🧘 Flexibility</option>
                        </select>
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Experience Level</label>
                        <select
                            name="experience_level"
                            value={formData.experience_level}
                            onChange={handleChange}
                            style={styles.select}
                        >
                            <option value="beginner">🌱 Beginner</option>
                            <option value="intermediate">📊 Intermediate</option>
                            <option value="advanced">⚡ Advanced</option>
                        </select>
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Available Equipment</label>
                        <select
                            value={formData.equipment[0]}
                            onChange={handleEquipmentChange}
                            style={styles.select}
                        >
                            <option value="bodyweight">🏋️ Bodyweight Only</option>
                            <option value="dumbbells">🏋️‍♂️ Dumbbells</option>
                            <option value="barbell">🏋️‍♀️ Barbell</option>
                            <option value="full_gym">🏢 Full Gym</option>
                            <option value="resistance_bands">🪢 Resistance Bands</option>
                        </select>
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Days per Week</label>
                        <input
                            type="range"
                            name="days_per_week"
                            value={formData.days_per_week}
                            onChange={handleChange}
                            style={styles.range}
                            min="1"
                            max="7"
                        />
                        <div style={styles.rangeValue}>{formData.days_per_week} days</div>
                    </div>

                    <button
                        onClick={generateWorkout}
                        style={loading ? styles.generateButtonDisabled : styles.generateButton}
                        disabled={loading}
                    >
                        {loading ? '⏳ Generating...' : '✨ Generate Workout Plan'}
                    </button>
                </div>

                {/* Right column - Results */}
                <div style={styles.resultCard}>
                    {workout ? (
                        <>
                            <h2 style={styles.sectionTitle}>Your Personalized Workout Plan</h2>
                            <div style={styles.workoutContent}>
                                <pre style={styles.pre}>
                                    {JSON.stringify(workout, null, 2)}
                                </pre>
                            </div>
                        </>
                    ) : (
                        <div style={styles.placeholder}>
                            <p style={styles.placeholderText}>
                                {loading ? '⏳ Generating your workout plan...' : '👈 Fill in your details and click generate to see your personalized workout plan'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Styles
const styles = {
    container: {
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        maxWidth: '1400px',
        margin: '0 auto',
        backgroundColor: '#f5f5f5',
        minHeight: '100vh'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
    },
    title: {
        margin: 0,
        color: '#333'
    },
    backButton: {
        padding: '10px 20px',
        backgroundColor: '#6c757d',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '14px'
    },
    debugInfo: {
        backgroundColor: '#e7f3ff',
        padding: '10px',
        borderRadius: '5px',
        marginBottom: '20px',
        border: '1px solid #91c9ff',
        fontSize: '12px',
        lineHeight: '1.6'
    },
    errorMessage: {
        backgroundColor: '#f8d7da',
        color: '#721c24',
        padding: '15px',
        borderRadius: '5px',
        marginBottom: '20px',
        border: '1px solid #f5c6cb',
        fontWeight: 'bold'
    },
    content: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px'
    },
    formCard: {
        backgroundColor: 'white',
        padding: '25px',
        borderRadius: '10px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
    },
    resultCard: {
        backgroundColor: 'white',
        padding: '25px',
        borderRadius: '10px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        minHeight: '400px'
    },
    sectionTitle: {
        marginTop: 0,
        marginBottom: '20px',
        color: '#333',
        borderBottom: '2px solid #007bff',
        paddingBottom: '10px'
    },
    formGroup: {
        marginBottom: '15px'
    },
    label: {
        display: 'block',
        marginBottom: '5px',
        fontWeight: 'bold',
        color: '#555'
    },
    input: {
        width: '100%',
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ddd',
        fontSize: '14px',
        boxSizing: 'border-box'
    },
    select: {
        width: '100%',
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ddd',
        fontSize: '14px',
        backgroundColor: 'white'
    },
    range: {
        width: '100%',
        margin: '10px 0'
    },
    rangeValue: {
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#007bff'
    },
    generateButton: {
        width: '100%',
        padding: '15px',
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: 'bold',
        marginTop: '20px',
        transition: 'background-color 0.3s'
    },
    generateButtonDisabled: {
        width: '100%',
        padding: '15px',
        backgroundColor: '#6c757d',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        fontSize: '16px',
        fontWeight: 'bold',
        marginTop: '20px',
        cursor: 'not-allowed'
    },
    workoutContent: {
        backgroundColor: '#f8f9fa',
        padding: '15px',
        borderRadius: '5px',
        overflow: 'auto',
        maxHeight: '500px'
    },
    pre: {
        margin: 0,
        fontSize: '12px',
        lineHeight: '1.5',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word'
    },
    placeholder: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '300px',
        backgroundColor: '#f8f9fa',
        borderRadius: '5px'
    },
    placeholderText: {
        color: '#999',
        fontSize: '16px',
        textAlign: 'center',
        padding: '20px'
    }
};

export default WorkoutPlanner;