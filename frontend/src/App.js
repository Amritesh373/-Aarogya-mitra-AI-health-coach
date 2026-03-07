import React from 'react';
import Login from './pages/Login';
import Dashboard from './components/Dashboard/Dashboard';
import WorkoutPlanner from './components/Workouts/WorkoutPlanner';
import NutritionPlanner from './components/Nutrition/NutritionPlanner';  // NEW
import AROMICoach from './components/AICoach/AROMICoach';
import HealthTracker from './components/Health/HealthTracker';

function App() {
  const token = localStorage.getItem('token');
  const path = window.location.pathname;

  // Public routes
  if (path === '/login') {
    return <Login />;
  }

  // Protected routes - require token
  if (!token) {
    window.location.href = '/login';
    return null;
  }

  // Route to components
  if (path === '/dashboard') {
    return <Dashboard />;
  }

  if (path === '/ai-coach') {
    return <AROMICoach />;
  }

  if (path === '/workout') {
    return <WorkoutPlanner />;
  }

  if (path === '/nutrition') {        // NEW
    return <NutritionPlanner />;       // NEW
  }

  if (path === '/health') {
    return <HealthTracker />;
  }

  // Default redirect
  window.location.href = '/dashboard';
  return null;
}

export default App;