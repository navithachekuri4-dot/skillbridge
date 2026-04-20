// src/App.js
import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SkillsProvider } from './context/SkillsContext';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy load pages for performance (demonstrates React.lazy + Suspense)
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Skills = lazy(() => import('./pages/Skills'));
const Analyze = lazy(() => import('./pages/Analyze'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Portfolio = lazy(() => import('./pages/Portfolio'));
const Tasks = lazy(() => import('./pages/Tasks'));

function PageLoader() {
  return (
    <div style={{
      height: '100vh',
      background: '#0d1117',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: 12,
      color: '#388bfd',
    }}>
      loading...
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SkillsProvider>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Protected routes — require auth */}
              <Route path="/dashboard" element={
                <ProtectedRoute><Dashboard /></ProtectedRoute>
              } />
              <Route path="/skills" element={
                <ProtectedRoute><Skills /></ProtectedRoute>
              } />
              <Route path="/analyze" element={
                <ProtectedRoute><Analyze /></ProtectedRoute>
              } />
              <Route path="/analytics" element={
                <ProtectedRoute><Analytics /></ProtectedRoute>
              } />
              <Route path="/portfolio" element={
                <ProtectedRoute><Portfolio /></ProtectedRoute>
              } />
              <Route path="/tasks" element={
                <ProtectedRoute><Tasks /></ProtectedRoute>
              } />

              {/* Default redirect */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Suspense>
        </SkillsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
