import React, { useState, useEffect, useCallback, useRef } from 'react';
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
import ProfileSection from './components/ProfileSection';
import ChatSection from './components/ChatSection';
import { CContainer } from '@coreui/react';
import {
  Home as HomeIcon,
  History as HistoryIcon,
  Person as ProfileIcon,
  Chat as ChatIcon,
} from '@mui/icons-material';
import { Box, Typography, Button, Modal, Fade, Avatar } from '@mui/material';
import './styles/index.css';

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

function App() {
  const navigate = useNavigate();
  const abortControllerRef = useRef(null);
  const [appState, setAppState] = useState({
    isLoading: false,
    fileInfo: null,
    analysisData: null,
    error: null,
    isAuthenticated: false,
    userData: null,
  });
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const showConfirmModal = (title, message, onConfirm) => {
    setConfirmModal({ open: true, title, message, onConfirm });
  };

  const closeConfirmModal = () => {
    setConfirmModal({
      open: false,
      title: '',
      message: '',
      onConfirm: () => {},
    });
  };

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    setAppState({
      isLoading: false,
      fileInfo: null,
      analysisData: null,
      error: null,
      isAuthenticated: false,
      userData: null,
    });
    navigate('/login');
  }, [navigate]);

  const validateToken = useCallback(
    async (token) => {
      try {
        const response = await fetch(
          'http://localhost:8080/api/validate-token',
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.ok) {
          setAppState((prev) => ({ ...prev, isAuthenticated: true }));
        } else {
          handleLogout();
        }
      } catch {
        handleLogout();
      }
    },
    [handleLogout]
  );

  const fetchUserData = useCallback(async (token) => {
    try {
      const response = await fetch('http://localhost:8080/api/user', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setAppState((prev) => ({ ...prev, userData: data }));
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      validateToken(token);
      fetchUserData(token);
    }
  }, [validateToken, fetchUserData]);

  const handleFileUpload = async (file) => {
    if (!file) return;
    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    setAppState((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
      fileInfo: { name: file.name, size: file.size },
    }));

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Требуется авторизация');
      const formData = new FormData();
      formData.append('document', file);

      const response = await fetch('http://localhost:8080/api/analyze', {
        method: 'POST',
        body: formData,
        headers: { Authorization: `Bearer ${token}` },
        signal: abortController.signal,
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
      if (err.name === 'AbortError') {
        console.warn('Анализ отменен пользователем');
        setAppState((prev) => ({
          ...prev,
          isLoading: false,
          fileInfo: null,
          analysisData: null,
          error: 'Анализ отменен пользователем',
        }));
      } else {
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
    }
  };

  const handleCancelUpload = () => {
    showConfirmModal(
      'Отменить анализ',
      'Вы уверены, что хотите отменить анализ документа?',
      () => {
        if (abortControllerRef.current) abortControllerRef.current.abort();
      }
    );
  };

  const handleRemoveFile = () => {
    showConfirmModal(
      'Удалить файл',
      'Вы уверены, что хотите удалить загруженный файл?',
      async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(
            'http://localhost:8080/api/cache/clear',
            {
              method: 'POST',
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (!response.ok) throw new Error('Не удалось удалить файл');

          setAppState((prev) => ({ ...prev, fileInfo: null, error: null }));
        } catch (err) {
          setAppState((prev) => ({ ...prev, error: err.message }));
        }
      }
    );
  };

  return (
    <div className="App">
      {appState.isAuthenticated && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: '#fff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            padding: '0.5rem 2rem',
            position: 'sticky',
            top: 0,
            zIndex: 1500,
          }}
        >
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              startIcon={<HomeIcon />}
              onClick={() => navigate('/')}
              sx={{ textTransform: 'none' }}
            >
              Главная
            </Button>
            <Button
              startIcon={<HistoryIcon />}
              onClick={() => navigate('/history')}
              sx={{ textTransform: 'none' }}
            >
              История
            </Button>
            <Button
              startIcon={<ProfileIcon />}
              onClick={() => navigate('/profile')}
              sx={{ textTransform: 'none' }}
            >
              Профиль
            </Button>
            <Button
              startIcon={<ChatIcon />}
              onClick={() => navigate('/chat')}
              sx={{ textTransform: 'none' }}
            >
              Консультация
            </Button>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              startIcon={
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: 'secondary.main',
                  }}
                >
                  {appState.userData?.email?.charAt(0).toUpperCase() || 'U'}
                </Avatar>
              }
              onClick={() => navigate('/profile')}
              sx={{
                color: 'text.primary',
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
              }}
            >
              {appState.userData?.email || 'Профиль'}
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={handleLogout}
              sx={{ textTransform: 'none' }}
            >
              Выход
            </Button>
          </Box>
        </Box>
      )}

      <Header
        isAuthenticated={appState.isAuthenticated}
        onLogout={handleLogout}
        userData={appState.userData}
      />

      <CContainer fluid className="main-content py-4 modern-container">
        <Routes>
          <Route
            path="/login"
            element={
              <AuthPage
                onSuccess={() => {
                  const token = localStorage.getItem('token');
                  setAppState((prev) => ({ ...prev, isAuthenticated: true }));
                  fetchUserData(token);
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
            path="/profile"
            element={
              <ProtectedRoute isAuthenticated={appState.isAuthenticated}>
                <ProfileSection
                  userData={appState.userData}
                  onLogout={handleLogout}
                  onBack={() => navigate('/')}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <ProtectedRoute isAuthenticated={appState.isAuthenticated}>
                <ChatSection />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute isAuthenticated={appState.isAuthenticated}>
                <HistorySection onBackClick={() => navigate('/')} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute isAuthenticated={appState.isAuthenticated}>
                {appState.isLoading ? (
                  <LoadingSection onCancel={handleCancelUpload} />
                ) : appState.analysisData ? (
                  <ResultSection
                    data={appState.analysisData}
                    onBackClick={() =>
                      setAppState((prev) => ({
                        ...prev,
                        analysisData: null,
                      }))
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
                    onHistoryClick={() => navigate('/history')}
                    onCancelUpload={handleCancelUpload}
                    onRemoveFile={handleRemoveFile}
                  />
                )}
              </ProtectedRoute>
            }
          />
        </Routes>
      </CContainer>

      <Footer />

      <Modal
        open={confirmModal.open}
        onClose={closeConfirmModal}
        closeAfterTransition
      >
        <Fade in={confirmModal.open}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
              borderRadius: 3,
            }}
          >
            <Typography variant="h6">{confirmModal.title}</Typography>
            <Typography sx={{ mt: 2 }}>{confirmModal.message}</Typography>
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={closeConfirmModal} sx={{ mr: 2 }}>
                Отмена
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  confirmModal.onConfirm();
                  closeConfirmModal();
                }}
              >
                Подтвердить
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}

export default AppWrapper;
