import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import API_ENDPOINTS from '../../config';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

function ProgressCharts() {
    const [healthData, setHealthData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMetric, setSelectedMetric] = useState('weight');

    useEffect(() => {
        fetchHealthData();
    }, []);

    const fetchHealthData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(API_ENDPOINTS.healthHistory, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Sort by date
            const sorted = response.data.sort((a, b) =>
                new Date(a.recorded_date) - new Date(b.recorded_date)
            );

            setHealthData(sorted);
        } catch (error) {
            console.error('Error fetching health data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getChartData = () => {
        const labels = healthData.map(d => {
            const date = new Date(d.recorded_date);
            return date.toLocaleDateString();
        });

        let dataPoints = [];
        switch (selectedMetric) {
            case 'weight':
                dataPoints = healthData.map(d => d.weight);
                break;
            case 'water':
                dataPoints = healthData.map(d => d.water_intake);
                break;
            case 'sleep':
                dataPoints = healthData.map(d => d.sleep_hours);
                break;
            case 'steps':
                dataPoints = healthData.map(d => d.steps);
                break;
            case 'mood':
                dataPoints = healthData.map(d => d.mood);
                break;
            default:
                dataPoints = healthData.map(d => d.weight);
        }

        return {
            labels,
            datasets: [
                {
                    label: selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1),
                    data: dataPoints,
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: 'rgb(75, 192, 192)',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7
                }
            ]
        };
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: true,
                text: `Your ${selectedMetric} Progress Over Time`,
                font: {
                    size: 16,
                    weight: 'bold'
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0,0,0,0.8)',
                titleFont: { size: 14 },
                bodyFont: { size: 13 },
                padding: 10,
                cornerRadius: 8
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0,0,0,0.05)'
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        }
    };

    const getMetricStats = () => {
        const validData = healthData.filter(d => d[selectedMetric] != null);
        if (validData.length === 0) return null;

        const values = validData.map(d => d[selectedMetric]);
        const latest = values[values.length - 1];
        const first = values[0];
        const change = latest - first;
        const avg = values.reduce((a, b) => a + b, 0) / values.length;
        const max = Math.max(...values);
        const min = Math.min(...values);

        return { latest, first, change, avg, max, min, count: validData.length };
    };

    const stats = getMetricStats();

    if (loading) {
        return <div style={styles.loading}>Loading charts...</div>;
    }

    if (healthData.length === 0) {
        return (
            <div style={styles.noData}>
                <p>📊 No health data yet. Start tracking to see your progress!</p>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h3 style={styles.title}>📈 Your Progress</h3>
                <select
                    value={selectedMetric}
                    onChange={(e) => setSelectedMetric(e.target.value)}
                    style={styles.select}
                >
                    <option value="weight">⚖️ Weight</option>
                    <option value="water">💧 Water Intake</option>
                    <option value="sleep">😴 Sleep Hours</option>
                    <option value="steps">👟 Steps</option>
                    <option value="mood">😊 Mood</option>
                </select>
            </div>

            <div style={styles.chartContainer}>
                <Line data={getChartData()} options={chartOptions} />
            </div>

            {stats && (
                <div style={styles.statsGrid}>
                    <div style={styles.statCard}>
                        <span style={styles.statLabel}>Current</span>
                        <span style={styles.statValue}>{stats.latest?.toFixed(1) || 'N/A'}</span>
                    </div>
                    <div style={styles.statCard}>
                        <span style={styles.statLabel}>Average</span>
                        <span style={styles.statValue}>{stats.avg?.toFixed(1) || 'N/A'}</span>
                    </div>
                    <div style={styles.statCard}>
                        <span style={styles.statLabel}>Change</span>
                        <span style={{
                            ...styles.statValue,
                            color: stats.change > 0 ? '#28a745' : stats.change < 0 ? '#dc3545' : '#666'
                        }}>
                            {stats.change > 0 ? '+' : ''}{stats.change?.toFixed(1) || '0'}
                        </span>
                    </div>
                    <div style={styles.statCard}>
                        <span style={styles.statLabel}>Records</span>
                        <span style={styles.statValue}>{stats.count}</span>
                    </div>
                </div>
            )}
        </div>
    );
}

const styles = {
    container: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        marginTop: '20px'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
    },
    title: {
        margin: 0,
        color: '#333'
    },
    select: {
        padding: '8px 12px',
        borderRadius: '5px',
        border: '1px solid #ddd',
        backgroundColor: 'white',
        fontSize: '14px',
        cursor: 'pointer'
    },
    chartContainer: {
        height: '300px',
        marginBottom: '20px'
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '15px',
        marginTop: '20px'
    },
    statCard: {
        backgroundColor: '#f8f9fa',
        padding: '15px',
        borderRadius: '8px',
        textAlign: 'center'
    },
    statLabel: {
        display: 'block',
        fontSize: '12px',
        color: '#666',
        marginBottom: '5px'
    },
    statValue: {
        display: 'block',
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#333'
    },
    loading: {
        textAlign: 'center',
        padding: '40px',
        color: '#666'
    },
    noData: {
        textAlign: 'center',
        padding: '40px',
        color: '#999',
        backgroundColor: 'white',
        borderRadius: '10px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        marginTop: '20px'
    }
};

export default ProgressCharts;