import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Fade, styled, Button, Alert } from '@mui/material';

const LoadingContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '32px',
  background: '#fff',
  borderRadius: '8px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  margin: '32px auto',
  maxWidth: '800px',
  textAlign: 'center',
});

const PaperScannerContainer = styled(Box)({
  position: 'relative',
  width: '200px',
  height: '260px',
  backgroundColor: '#f1f1f1',
  border: '2px solid #bbb',
  borderRadius: '10px',
  overflow: 'hidden',
  boxShadow: 'inset 0 0 6px rgba(0,0,0,0.15)',
  margin: '20px auto',
});

const Paper = styled(Box)({
  position: 'absolute',
  top: '-100%',
  left: '10%',
  width: '80%',
  height: '100%',
  backgroundColor: '#fff',
  borderRadius: '4px',
  padding: '16px',
  fontSize: '12px',
  fontFamily: 'serif',
  lineHeight: 1.5,
  color: '#333',
  boxShadow: 'inset 0 0 4px rgba(0,0,0,0.1)',
  animation: 'slidePaper 6s ease-in-out infinite',
  zIndex: 2,
});

const ScanningLine = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '4px',
  backgroundColor: '#3a7bd5',
  animation: 'scanLine 2.5s linear infinite',
  zIndex: 3,
});

const GlobalStyles = styled('style')({
  __html: `
    @keyframes slidePaper {
      0% { top: -100%; }
      10% { top: -5%; }
      90% { top: -5%; }
      100% { top: 100%; }
    }

    @keyframes scanLine {
      0% { top: 0%; }
      100% { top: 100%; }
    }
  `,
});

const loadingMessages = [
  'Анализ структуры документа...',
  'Проверка соответствия ГК РК...',
  'Выявление налоговых рисков...',
  'Анализ договорных условий...',
  'Проверка на соответствие ТК РК...',
];

function LoadingSection({ file, onComplete, onCancel }) {
  const [message, setMessage] = useState(loadingMessages[0]);
  const [error, setError] = useState(null);
  const processingRef = useRef(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const index = Math.floor(Math.random() * loadingMessages.length);
      setMessage(loadingMessages[index]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!file || processingRef.current) return;
    processingRef.current = true;

    let cancelled = false;

    const analyze = async () => {
      try {
        await new Promise((res) => setTimeout(res, 12000));
        if (!cancelled) onComplete({ status: 'success' });
      } catch (err) {
        if (!cancelled) setError('Ошибка при анализе документа');
      }
    };

    analyze();
    return () => {
      cancelled = true;
    };
  }, [file, onComplete]);

  return (
    <Fade in timeout={500}>
      <LoadingContainer>
        <Typography variant="h6" gutterBottom>
          {message}
        </Typography>

        <PaperScannerContainer>
          <Paper>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              ДОГОВОР №001/2025
            </Typography>
            <Typography variant="body2">
              Настоящий договор заключён между сторонами...
              <br />
              <br />
              1. Срок действия: 12 месяцев. <br />
              2. Подписи сторон: ________________
            </Typography>
          </Paper>
          <ScanningLine />
        </PaperScannerContainer>

        <GlobalStyles />

        <Button
          variant="outlined"
          color="error"
          onClick={onCancel}
          disabled={!processingRef.current}
          sx={{ mt: 2 }}
        >
          Отменить анализ
        </Button>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </LoadingContainer>
    </Fade>
  );
}

export default LoadingSection;
