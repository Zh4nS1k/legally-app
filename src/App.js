import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from 'react-router-dom';
import Header from './components/Header';
import UploadSection from './components/UploadSection';
import LoadingSection from './components/LoadingSection';
import ResultSection from './components/ResultSection';
import HistorySection from './components/HistorySection';
import Footer from './components/Footer';
import AuthPage from './components/AuthPage';
import ProtectedRoute from './components/ProtectedRoute';
import './styles/index.css';

function App() {
  const navigate = useNavigate();
  const [appState, setAppState] = useState({
    isLoading: false,
    fileInfo: null,
    analysisData: null,
    error: null,
    isAuthenticated: false,
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) validateToken(token);
  }, []);

  const validateToken = async (token) => {
    try {
      const response = await fetch('http://localhost:8080/api/validate-token', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setAppState((prev) => ({ ...prev, isAuthenticated: true }));
      } else {
        handleLogout();
      }
    } catch {
      handleLogout();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setAppState({
      isLoading: false,
      fileInfo: null,
      analysisData: null,
      error: null,
      isAuthenticated: false,
    });
    navigate('/login');
  };

  const handleFileUpload = async (file) => {
    if (!file) return;

    setAppState((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
      fileInfo: {
        name: file.name,
        size: file.size,
      },
    }));

    try {
      let token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Требуется авторизация');
      }

      const formData = new FormData();
      formData.append('document', file);

      // Debug logging
      console.log('Uploading file:', file.name, 'Size:', file.size);
      console.log('Token exists:', !!token);

      const response = await fetch('http://localhost:8080/api/analyze', {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
          // Note: Don't set Content-Type header - the browser will set it with the correct boundary
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Ошибка при анализе документа');
      }

      const data = await response.json();
      setAppState((prev) => ({
        ...prev,
        isLoading: false,
        analysisData: data,
      }));
    } catch (err) {
      console.error('Upload error:', err);
      setAppState((prev) => ({
        ...prev,
        isLoading: false,
        error: err.message,
      }));

      if (
        err.message.includes('Сессия истекла') ||
        err.message.includes('Требуется авторизация')
      ) {
        handleLogout();
      }
    }
  };

  return (
    <div className="App">
      <Header
        isAuthenticated={appState.isAuthenticated}
        onLogout={handleLogout}
      />
      <main className="container">
        <Routes>
          <Route
            path="/login"
            element={
              <AuthPage
                onSuccess={() => {
                  setAppState((prev) => ({ ...prev, isAuthenticated: true }));
                  navigate('/');
                }}
                type="login"
              />
            }
          />
          <Route
            path="/register"
            element={
              <AuthPage onSuccess={() => navigate('/login')} type="register" />
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute isAuthenticated={appState.isAuthenticated}>
                {appState.isLoading ? (
                  <LoadingSection />
                ) : appState.analysisData ? (
                  <ResultSection
                    data={appState.analysisData}
                    onBackClick={() =>
                      setAppState((prev) => ({ ...prev, analysisData: null }))
                    }
                  />
                ) : (
                  <UploadSection
                    onFileUpload={handleFileUpload}
                    fileInfo={appState.fileInfo}
                    error={appState.error}
                    onClearError={() =>
                      setAppState((prev) => ({ ...prev, error: null }))
                    }
                  />
                )}
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute isAuthenticated={appState.isAuthenticated}>
                <HistorySection />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;
