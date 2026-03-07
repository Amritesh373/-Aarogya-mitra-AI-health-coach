import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_ENDPOINTS from '../../config';

function HealthTracker() {
    const [healthData, setHealthData] = useState({
        weight: '',
        body_fat: '',
        water_intake: '',
        sleep_hours: '',
        sleep_quality: 3,
        mood: 3,
        energy_level: 3,
        steps: '',
        notes: ''
    });

    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [authError, setAuthError] = useState(false);

    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem('token');
        if (!token) {
            setAuthError(true);
            setMessage('❌ Please login to view health tracker');
            setTimeout(() => {
                window.location.href = '/login';
            }, 2000);
        } else {
            fetchHistory();
        }
    }, []);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                throw new Error('No token found');
            }

            console.log('Fetching history with token:', token.substring(0, 10) + '...');

            const response = await axios.get(API_ENDPOINTS.healthHistory, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('History response:', response.data);
            setHistory(response.data || []);

        } catch (error) {
            console.error('Error fetching history:', error);

            if (error.response?.status === 401) {
                setMessage('❌ Session expired. Please login again.');
                localStorage.removeItem('token');
                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);
            } else {
                setMessage('❌ Error loading history: ' + (error.response?.data?.detail || error.message));
            }
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setHealthData({
            ...healthData,
            [name]: value
        });
    };

    const handleSliderChange = (name, value) => {
        setHealthData({
            ...healthData,
            [name]: parseInt(value)
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');

        try {
            const token = localStorage.getItem('token');

            if (!token) {
                setMessage('❌ Please login first');
                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);
                return;
            }

            // Clean up the data - remove empty fields and convert to numbers
            const cleanedData = {};

            if (healthData.weight) cleanedData.weight = parseFloat(healthData.weight);
            if (healthData.body_fat) cleanedData.body_fat = parseFloat(healthData.body_fat);
            if (healthData.water_intake) cleanedData.water_intake = parseInt(healthData.water_intake);
            if (healthData.sleep_hours) cleanedData.sleep_hours = parseFloat(healthData.sleep_hours);

            // Always include these with defaults if needed
            cleanedData.sleep_quality = parseInt(healthData.sleep_quality);
            cleanedData.mood = parseInt(healthData.mood);
            cleanedData.energy_level = parseInt(healthData.energy_level);

            if (healthData.steps) cleanedData.steps = parseInt(healthData.steps);
            if (healthData.notes) cleanedData.notes = healthData.notes;

            console.log('Sending health data:', cleanedData);
            console.log('Using token:', token.substring(0, 10) + '...');
            console.log('Endpoint:', API_ENDPOINTS.healthLog);

            const response = await axios.post(
                API_ENDPOINTS.healthLog,
                cleanedData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('Save response:', response.data);
            setMessage('✅ Health data saved successfully!');

            // Reset form
            setHealthData({
                weight: '',
                body_fat: '',
                water_intake: '',
                sleep_hours: '',
                sleep_quality: 3,
                mood: 3,
                energy_level: 3,
                steps: '',
                notes: ''
            });

            // Refresh history
            fetchHistory();

        } catch (error) {
            console.error('Full error:', error);
            console.error('Error response:', error.response?.data);
            console.error('Error status:', error.response?.status);

            if (error.response?.status === 401) {
                setMessage('❌ Session expired. Please login again.');
                localStorage.removeItem('token');
                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);
            } else if (error.response?.status === 422) {
                setMessage('❌ Invalid data format: ' + JSON.stringify(error.response?.data));
            } else {
                setMessage('❌ Error: ' + (error.response?.data?.detail || error.message));
            }
        } finally {
            setSaving(false);
        }
    };

    const handleBack = () => {
        window.location.href = '/dashboard';
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Just now';
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    };

    // Show login message if not authenticated
    if (authError) {
        return (
            <div style={styles.container}>
                <div style={styles.header}>
                    <h1 style={styles.title}>📊 Health Tracker</h1>
                    <button onClick={handleBack} style={styles.backButton}>
                        ← Back to Dashboard
                    </button>
                </div>
                <div style={styles.errorMessage}>
                    {message}
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            {/* Header */}
            <div style={styles.header}>
                <h1 style={styles.title}>📊 Health Tracker</h1>
                <button onClick={handleBack} style={styles.backButton}>
                    ← Back to Dashboard
                </button>
            </div>

            {/* Message */}
            {message && (
                <div style={message.includes('✅') ? styles.successMessage : styles.errorMessage}>
                    {message}
                </div>
            )}

            {/* Debug Info - Remove after fixing */}
            <div style={styles.debugInfo}>
                <strong>🔗 Token:</strong> {localStorage.getItem('token') ? 'Present' : 'Missing'}<br />
                <strong>🔗 Health Log Endpoint:</strong> {API_ENDPOINTS.healthLog}<br />
                <strong>🔗 Health History Endpoint:</strong> {API_ENDPOINTS.healthHistory}
            </div>

            {/* Main Content */}
            <div style={styles.content}>
                {/* Left Column - Input Form */}
                <div style={styles.formCard}>
                    <h2 style={styles.sectionTitle}>Log Today's Health</h2>

                    <form onSubmit={handleSubmit}>
                        <div style={styles.formRow}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Weight (kg)</label>
                                <input
                                    type="number"
                                    name="weight"
                                    value={healthData.weight}
                                    onChange={handleChange}
                                    style={styles.input}
                                    step="0.1"
                                    placeholder="70.5"
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Body Fat %</label>
                                <input
                                    type="number"
                                    name="body_fat"
                                    value={healthData.body_fat}
                                    onChange={handleChange}
                                    style={styles.input}
                                    step="0.1"
                                    placeholder="15.5"
                                />
                            </div>
                        </div>

                        <div style={styles.formRow}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Water Intake (ml)</label>
                                <input
                                    type="number"
                                    name="water_intake"
                                    value={healthData.water_intake}
                                    onChange={handleChange}
                                    style={styles.input}
                                    placeholder="2000"
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Sleep (hours)</label>
                                <input
                                    type="number"
                                    name="sleep_hours"
                                    value={healthData.sleep_hours}
                                    onChange={handleChange}
                                    style={styles.input}
                                    step="0.5"
                                    placeholder="7.5"
                                />
                            </div>
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Sleep Quality: {healthData.sleep_quality}/5</label>
                            <input
                                type="range"
                                min="1"
                                max="5"
                                value={healthData.sleep_quality}
                                onChange={(e) => handleSliderChange('sleep_quality', e.target.value)}
                                style={styles.range}
                            />
                            <div style={styles.rangeLabels}>
                                <span>😴 Poor</span>
                                <span>😊 Great</span>
                            </div>
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Mood: {healthData.mood}/5</label>
                            <input
                                type="range"
                                min="1"
                                max="5"
                                value={healthData.mood}
                                onChange={(e) => handleSliderChange('mood', e.target.value)}
                                style={styles.range}
                            />
                            <div style={styles.rangeLabels}>
                                <span>😞 Bad</span>
                                <span>😄 Excellent</span>
                            </div>
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Energy Level: {healthData.energy_level}/5</label>
                            <input
                                type="range"
                                min="1"
                                max="5"
                                value={healthData.energy_level}
                                onChange={(e) => handleSliderChange('energy_level', e.target.value)}
                                style={styles.range}
                            />
                            <div style={styles.rangeLabels}>
                                <span>🪫 Low</span>
                                <span>⚡ High</span>
                            </div>
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Steps</label>
                            <input
                                type="number"
                                name="steps"
                                value={healthData.steps}
                                onChange={handleChange}
                                style={styles.input}
                                placeholder="8000"
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Notes</label>
                            <textarea
                                name="notes"
                                value={healthData.notes}
                                onChange={handleChange}
                                style={styles.textarea}
                                rows="3"
                                placeholder="How do you feel today? Any observations?"
                            />
                        </div>

                        <button
                            type="submit"
                            style={saving ? styles.saveButtonDisabled : styles.saveButton}
                            disabled={saving}
                        >
                            {saving ? '💾 Saving...' : '💾 Save Health Data'}
                        </button>
                    </form>
                </div>

                {/* Right Column - History */}
                <div style={styles.historyCard}>
                    <h2 style={styles.sectionTitle}>Recent History</h2>

                    {loading && <p style={styles.loading}>Loading history...</p>}

                    {!loading && history.length === 0 && (
                        <p style={styles.noData}>No health data logged yet. Start tracking today!</p>
                    )}

                    <div style={styles.historyList}>
                        {history.map((entry, index) => (
                            <div key={index} style={styles.historyItem}>
                                <div style={styles.historyHeader}>
                                    <span style={styles.historyDate}>{formatDate(entry.recorded_date)}</span>
                                </div>
                                <div style={styles.historyDetails}>
                                    {entry.weight && <span>⚖️ {entry.weight} kg</span>}
                                    {entry.water_intake && <span>💧 {entry.water_intake} ml</span>}
                                    {entry.sleep_hours && <span>😴 {entry.sleep_hours}h</span>}
                                    {entry.steps && <span>👟 {entry.steps} steps</span>}
                                    {entry.mood && <span>😊 Mood: {entry.mood}/5</span>}
                                </div>
                                {entry.notes && (
                                    <div style={styles.historyNotes}>📝 {entry.notes}</div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

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
        cursor: 'pointer'
    },
    debugInfo: {
        backgroundColor: '#e7f3ff',
        padding: '15px',
        borderRadius: '5px',
        marginBottom: '20px',
        border: '1px solid #91c9ff',
        fontSize: '14px',
        lineHeight: '1.6'
    },
    successMessage: {
        backgroundColor: '#d4edda',
        color: '#155724',
        padding: '15px',
        borderRadius: '5px',
        marginBottom: '20px',
        border: '1px solid #c3e6cb'
    },
    errorMessage: {
        backgroundColor: '#f8d7da',
        color: '#721c24',
        padding: '15px',
        borderRadius: '5px',
        marginBottom: '20px',
        border: '1px solid #f5c6cb'
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
    historyCard: {
        backgroundColor: 'white',
        padding: '25px',
        borderRadius: '10px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        maxHeight: '600px',
        overflowY: 'auto'
    },
    sectionTitle: {
        marginTop: 0,
        marginBottom: '20px',
        borderBottom: '2px solid #007bff',
        paddingBottom: '10px'
    },
    formRow: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '15px',
        marginBottom: '15px'
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
    textarea: {
        width: '100%',
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ddd',
        fontSize: '14px',
        fontFamily: 'inherit',
        resize: 'vertical'
    },
    range: {
        width: '100%',
        margin: '10px 0'
    },
    rangeLabels: {
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '12px',
        color: '#666'
    },
    saveButton: {
        width: '100%',
        padding: '15px',
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: 'bold',
        marginTop: '10px'
    },
    saveButtonDisabled: {
        width: '100%',
        padding: '15px',
        backgroundColor: '#6c757d',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        fontSize: '16px',
        marginTop: '10px',
        cursor: 'not-allowed'
    },
    loading: {
        textAlign: 'center',
        color: '#666'
    },
    noData: {
        textAlign: 'center',
        color: '#999',
        padding: '40px'
    },
    historyList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px'
    },
    historyItem: {
        backgroundColor: '#f8f9fa',
        padding: '15px',
        borderRadius: '5px',
        borderLeft: '4px solid #007bff'
    },
    historyHeader: {
        marginBottom: '10px'
    },
    historyDate: {
        fontWeight: 'bold',
        color: '#007bff'
    },
    historyDetails: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '15px',
        marginBottom: '10px',
        fontSize: '14px'
    },
    historyNotes: {
        fontSize: '13px',
        color: '#666',
        fontStyle: 'italic',
        borderTop: '1px dashed #ddd',
        paddingTop: '8px',
        marginTop: '8px'
    }
};

export default HealthTracker;