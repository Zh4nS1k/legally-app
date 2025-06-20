import React, { useState, useEffect } from 'react';
import { Box, Typography, Fade, styled, Button, Alert } from '@mui/material';

const Stamp = styled(Box)(() => ({
  position: 'absolute',
  bottom: '45px',
  right: '20px',
  width: '80px',
  height: '80px',
  borderRadius: '50%',
  backgroundColor: 'rgba(255, 0, 0, 0.05)',
  border: '2px dashed rgba(200, 0, 0, 0.4)',
  transform: 'rotate(-15deg)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '9px',
  color: 'rgba(200, 0, 0, 0.6)',
  fontWeight: 700,
  textAlign: 'center',
  textTransform: 'uppercase',
  letterSpacing: '1px',
  zIndex: 4,
}));

const LoadingContainer = styled(Box)(() => ({
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
}));

const PaperScannerContainer = styled(Box)(() => ({
  position: 'relative',
  width: '220px',
  height: '300px',
  backgroundColor: '#f1f1f1',
  border: '2px solid #bbb',
  borderRadius: '10px',
  overflow: 'hidden',
  boxShadow: 'inset 0 0 6px rgba(0,0,0,0.15)',
  margin: '20px auto',
}));

const Paper = styled(Box)(() => ({
  position: 'absolute',
  top: '-85%',
  left: '10%',
  width: '80%',
  height: '100%',
  backgroundColor: '#fff',
  borderRadius: '4px',
  padding: '14px 16px',
  fontSize: '10.5px',
  fontFamily: '"Georgia", serif',
  lineHeight: 1.4,
  color: '#333',
  boxShadow: 'inset 0 0 4px rgba(0,0,0,0.1)',
  animation: 'slidePaper 6s ease-in-out infinite',
  zIndex: 2,
}));

const ScanningLine = styled(Box)(() => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '4px',
  backgroundColor: '#3a7bd5',
  animation: 'scanLine 2.5s linear infinite',
  zIndex: 3,
}));

const GlobalStyles = styled('style')({
  __html: `
    @keyframes slidePaper {
      0% { top: -85%; }
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
  'Поиск скрытых юридических рисков...',
  'Проверка реквизитов и подписей...',
  'Анализ на соответствие Налоговому кодексу РК...',
  'Оценка корпоративного права...',
  'Проверка соблюдения требований МФ РК...',
  'Анализ арбитражной практики...',
  'Сравнение с изменениями в законодательстве...',
  'Проверка лицензионных соглашений...',
  'Оценка договорных обязательств...',
  'Выявление конфликта интересов...',
  'Проверка на соответствие Закону "О бухгалтерском учете"...',
  'Анализ корпоративного управления...',
  'Проверка соблюдения AML-требований...',
  'Оценка налоговой оптимизации...',
  'Проверка на соответствие Закону "О защите персональных данных"...',
  'Анализ судебных перспектив...',
  'Проверка на наличие коррупционных рисков...',
  'Оценка договорной ответственности...',
  'Анализ финансовых последствий...',
  'Проверка на соответствие международным стандартам...',
];

function LoadingSection({ onCancel }) {
  const [message, setMessage] = useState(loadingMessages[0]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const index = Math.floor(Math.random() * loadingMessages.length);
      setMessage(loadingMessages[index]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

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
            <Typography variant="body2" component="div">
              <p>г. Астана, 20 июня 2025 года</p>
              <p>
                Настоящий договор заключён между ТОО «ЮрЭксперт» и АО «КазЛегал»
                о предоставлении юридических услуг.
              </p>
              <ol
                style={{ paddingLeft: '1.2em', marginTop: 0, marginBottom: 0 }}
              >
                <li>Срок действия договора: 12 месяцев.</li>
                <li>Стоимость услуг: 1 500 000 тенге.</li>
                <li>Ответственность сторон: регулируется ст. 351 ГК РК.</li>
              </ol>
              <p>Подписи сторон: _______________________</p>
            </Typography>
            <Stamp>
              LEGALLY.KZ
              <br />
              Проверено
            </Stamp>
          </Paper>
          <ScanningLine />
        </PaperScannerContainer>
        <GlobalStyles />
        <Button
          variant="outlined"
          color="error"
          onClick={onCancel}
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
