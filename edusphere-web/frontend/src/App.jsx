import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import Loader from './components/Loader';

// Import Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import SubjectLearning from './pages/SubjectLearning';
import TopicListing from './pages/TopicListing';
import LessonDetail from './pages/LessonDetail';
import VideoLearning from './pages/VideoLearning';
import Quiz from './pages/Quiz';
import Notes from './pages/Notes';
import ProgressDashboard from './pages/ProgressDashboard';
import HologramViewer from './pages/HologramViewer';
import Profile from './pages/Profile';
import AITutor from './pages/AITutor';
import Planner from './pages/Planner';
import Bookmarks from './pages/Bookmarks';
import AdminPanel from './pages/AdminPanel';

// Protected Route Wrapper Component
const ProtectedRoute = ({ children }) => {
  const { token, loading } = useAuth();

  if (loading) {
    return <Loader message="Verifying session credentials..." />;
  }

  if (!token) {
    // Session unauthorized -> Redirect to login page
    return <Navigate to="/login" replace />;
  }

  return <Layout>{children}</Layout>;
};

// Public Route Wrapper (redirects to dashboard if already logged in)
const PublicRoute = ({ children }) => {
  const { token, loading } = useAuth();

  if (loading) {
    return <Loader message="Checking session..." />;
  }

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />

            {/* Protected Student Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/learning" element={<ProtectedRoute><SubjectLearning /></ProtectedRoute>} />
            <Route path="/subjects/:subjectId" element={<ProtectedRoute><TopicListing /></ProtectedRoute>} />
            <Route path="/topics/:topicId" element={<ProtectedRoute><LessonDetail /></ProtectedRoute>} />
            <Route path="/lessons/:lessonId/video" element={<ProtectedRoute><VideoLearning /></ProtectedRoute>} />
            <Route path="/lessons/:lessonId/quiz" element={<ProtectedRoute><Quiz /></ProtectedRoute>} />
            <Route path="/lessons/:lessonId/notes" element={<ProtectedRoute><Notes /></ProtectedRoute>} />
            <Route path="/progress" element={<ProtectedRoute><ProgressDashboard /></ProtectedRoute>} />
            <Route path="/hologram" element={<ProtectedRoute><HologramViewer /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/ai-tutor" element={<ProtectedRoute><AITutor /></ProtectedRoute>} />
            <Route path="/planner" element={<ProtectedRoute><Planner /></ProtectedRoute>} />
            <Route path="/bookmarks" element={<ProtectedRoute><Bookmarks /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />

            {/* Fallback Catch-All Redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
