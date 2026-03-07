import React, { useState } from 'react';
import axios from 'axios';
import API_ENDPOINTS from '../../config';

function NutritionPlanner() {
    const [formData, setFormData] = useState({
        age: 30,
        weight: 70,
        height: 170,
        fitness_goal: 'weight_loss',
        dietary_restrictions: [],
        activity_level: 'moderate'
    });

    const [nutrition, setNutrition] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleDietChange = (e) => {
        const options = e.target.options;
        const selected = [];
        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
                selected.push(options[i].value);
            }
        }
        setFormData({
            ...formData,
            dietary_restrictions: selected
        });
    };

    const generateNutrition = async () => {
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');

            if (!token) {
                setError('Please login first');
                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);
                return;
            }

            console.log('Sending to:', API_ENDPOINTS.generateNutrition);
            console.log('With data:', formData);

            const response = await axios.post(
                API_ENDPOINTS.generateNutrition,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('Response:', response.data);
            setNutrition(response.data);

        } catch (error) {
            console.error('Error:', error);

            if (error.response?.status === 401) {
                setError('Session expired. Please login again.');
                localStorage.removeItem('token');
                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);
            } else {
                setError(error.response?.data?.detail || error.message);
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
                <h1 style={styles.title}>🥗 AI Nutrition Planner</h1>
                <button onClick={handleBack} style={styles.backButton}>
                    ← Back to Dashboard
                </button>
            </div>

            {/* Debug Info */}
            <div style={styles.debugInfo}>
                <strong>🔗 API Endpoint:</strong> {API_ENDPOINTS.generateNutrition}
            </div>

            {/* Error Message */}
            {error && (
                <div style={styles.errorMessage}>
                    ❌ {error}
                </div>
            )}

            {/* Main Content */}
            <div style={styles.content}>
                {/* Form Column */}
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
                            <option value="maintain">⚖️ Maintain Weight</option>
                            <option value="general_health">🌟 General Health</option>
                        </select>
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Activity Level</label>
                        <select
                            name="activity_level"
                            value={formData.activity_level}
                            onChange={handleChange}
                            style={styles.select}
                        >
                            <option value="sedentary">🪑 Sedentary (desk job)</option>
                            <option value="light">🚶 Light exercise 1-2 days/week</option>
                            <option value="moderate">🏃 Moderate exercise 3-5 days/week</option>
                            <option value="active">💪 Active exercise 6-7 days/week</option>
                            <option value="very_active">⚡ Very active (athlete)</option>
                        </select>
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Dietary Restrictions (Ctrl+Click to select multiple)</label>
                        <select
                            multiple={true}
                            value={formData.dietary_restrictions}
                            onChange={handleDietChange}
                            style={{ ...styles.select, height: '120px' }}
                        >
                            <option value="vegetarian">🥬 Vegetarian</option>
                            <option value="vegan">🌱 Vegan</option>
                            <option value="gluten_free">🌾 Gluten Free</option>
                            <option value="dairy_free">🥛 Dairy Free</option>
                            <option value="keto">🥑 Keto</option>
                            <option value="paleo">🍖 Paleo</option>
                            <option value="halal">☪️ Halal</option>
                            <option value="kosher">✡️ Kosher</option>
                        </select>
                        <small style={styles.hint}>Selected: {formData.dietary_restrictions.join(', ') || 'None'}</small>
                    </div>

                    <button
                        onClick={generateNutrition}
                        style={loading ? styles.generateButtonDisabled : styles.generateButton}
                        disabled={loading}
                    >
                        {loading ? '⏳ Generating...' : '✨ Generate Nutrition Plan'}
                    </button>
                </div>

                {/* Results Column */}
                <div style={styles.resultCard}>
                    {nutrition ? (
                        <>
                            <h2 style={styles.sectionTitle}>Your Nutrition Plan</h2>
                            <div style={styles.nutritionContent}>
                                <div style={styles.macroCard}>
                                    <h3>Daily Calories</h3>
                                    <p style={styles.calorieNumber}>{nutrition.calories || 2000} kcal</p>
                                </div>

                                <div style={styles.macroGrid}>
                                    <div style={styles.macroItem}>
                                        <span style={styles.macroLabel}>Protein</span>
                                        <span style={styles.macroValue}>{nutrition.macros?.protein || 150}g</span>
                                    </div>
                                    <div style={styles.macroItem}>
                                        <span style={styles.macroLabel}>Carbs</span>
                                        <span style={styles.macroValue}>{nutrition.macros?.carbs || 200}g</span>
                                    </div>
                                    <div style={styles.macroItem}>
                                        <span style={styles.macroLabel}>Fats</span>
                                        <span style={styles.macroValue}>{nutrition.macros?.fats || 65}g</span>
                                    </div>
                                </div>

                                <h3>Sample Meal Plan</h3>
                                <div style={styles.mealPlan}>
                                    <div style={styles.meal}>
                                        <strong>Breakfast:</strong> {nutrition.meal_plan?.breakfast || 'Oatmeal with fruits'}
                                    </div>
                                    <div style={styles.meal}>
                                        <strong>Lunch:</strong> {nutrition.meal_plan?.lunch || 'Grilled chicken with vegetables'}
                                    </div>
                                    <div style={styles.meal}>
                                        <strong>Dinner:</strong> {nutrition.meal_plan?.dinner || 'Baked fish with quinoa'}
                                    </div>
                                    <div style={styles.meal}>
                                        <strong>Snacks:</strong> {nutrition.meal_plan?.snacks?.join(', ') || 'Greek yogurt, nuts'}
                                    </div>
                                </div>

                                {nutrition.tips && (
                                    <>
                                        <h3>💡 Tips</h3>
                                        <ul style={styles.tipsList}>
                                            {nutrition.tips.map((tip, index) => (
                                                <li key={index}>{tip}</li>
                                            ))}
                                        </ul>
                                    </>
                                )}
                            </div>
                        </>
                    ) : (
                        <div style={styles.placeholder}>
                            <p style={styles.placeholderText}>
                                {loading ? '⏳ Generating your nutrition plan...' : '👈 Fill in your details and click generate to see your personalized nutrition plan'}
                            </p>
                        </div>
                    )}
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
    title: { margin: 0, color: '#333' },
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
        padding: '10px',
        borderRadius: '5px',
        marginBottom: '20px',
        border: '1px solid #91c9ff'
    },
    errorMessage: {
        backgroundColor: '#f8d7da',
        color: '#721c24',
        padding: '15px',
        borderRadius: '5px',
        marginBottom: '20px'
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
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
    },
    sectionTitle: {
        marginTop: 0,
        marginBottom: '20px',
        borderBottom: '2px solid #28a745',
        paddingBottom: '10px'
    },
    formGroup: { marginBottom: '15px' },
    label: {
        display: 'block',
        marginBottom: '5px',
        fontWeight: 'bold'
    },
    input: {
        width: '100%',
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ddd',
        boxSizing: 'border-box'
    },
    select: {
        width: '100%',
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ddd',
        backgroundColor: 'white'
    },
    hint: {
        display: 'block',
        marginTop: '5px',
        color: '#666',
        fontSize: '12px'
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
        marginTop: '20px'
    },
    generateButtonDisabled: {
        width: '100%',
        padding: '15px',
        backgroundColor: '#6c757d',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        fontSize: '16px',
        marginTop: '20px',
        cursor: 'not-allowed'
    },
    nutritionContent: {
        padding: '10px'
    },
    macroCard: {
        backgroundColor: '#e8f5e9',
        padding: '20px',
        borderRadius: '10px',
        textAlign: 'center',
        marginBottom: '20px'
    },
    calorieNumber: {
        fontSize: '36px',
        fontWeight: 'bold',
        color: '#28a745',
        margin: '10px 0'
    },
    macroGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '10px',
        marginBottom: '20px'
    },
    macroItem: {
        backgroundColor: '#f8f9fa',
        padding: '15px',
        borderRadius: '5px',
        textAlign: 'center'
    },
    macroLabel: {
        display: 'block',
        fontSize: '12px',
        color: '#666'
    },
    macroValue: {
        display: 'block',
        fontSize: '18px',
        fontWeight: 'bold',
        marginTop: '5px'
    },
    mealPlan: {
        backgroundColor: '#f8f9fa',
        padding: '15px',
        borderRadius: '5px',
        marginBottom: '20px'
    },
    meal: {
        padding: '8px 0',
        borderBottom: '1px solid #dee2e6'
    },
    tipsList: {
        paddingLeft: '20px',
        lineHeight: '1.8'
    },
    placeholder: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '400px',
        backgroundColor: '#f8f9fa',
        borderRadius: '5px'
    },
    placeholderText: {
        color: '#999',
        textAlign: 'center',
        padding: '20px'
    }
};

export default NutritionPlanner;