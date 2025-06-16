import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Fade,
  useTheme,
  styled,
  LinearProgress,
  Button,
} from '@mui/material';

const LoadingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '300px',
  padding: theme.spacing(4),
  background: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
  margin: theme.spacing(4, 'auto'),
  maxWidth: '800px',
  position: 'relative',
}));

const LogContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  maxHeight: '200px',
  overflowY: 'auto',
  marginTop: theme.spacing(2),
  padding: theme.spacing(2),
  backgroundColor: theme.palette.grey[100],
  borderRadius: theme.shape.borderRadius,
  fontFamily: 'monospace',
  fontSize: '0.85rem',
}));

const LogEntry = styled(Box)(({ theme, type }) => ({
  padding: theme.spacing(0.5, 0),
  color:
    type === 'error'
      ? theme.palette.error.main
      : type === 'warning'
      ? theme.palette.warning.main
      : theme.palette.text.secondary,
  borderLeft: `3px solid ${
    type === 'error'
      ? theme.palette.error.main
      : type === 'warning'
      ? theme.palette.warning.main
      : theme.palette.primary.main
  }`,
  paddingLeft: theme.spacing(1),
  marginBottom: theme.spacing(0.5),
}));

function LoadingSection({ taskId, onComplete, onCancel }) {
  const theme = useTheme();
  const [logs, setLogs] = useState([]);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Подготовка к анализу');
  const [isPolling, setIsPolling] = useState(true);

  // Функция для получения логов с бэкенда
  const fetchLogs = async () => {
    try {
      // В реальном приложении замените на запрос к вашему API
      // const response = await axios.get(`/api/tasks/${taskId}/logs`);
      // return response.data;

      // Эмуляция ответа бэкенда
      return {
        logs: [
          {
            id: Date.now(),
            message: getSimulatedLogMessage(status, progress),
            type: Math.random() > 0.9 ? 'warning' : 'info',
            timestamp: new Date().toISOString(),
          },
        ],
        progress: Math.min(progress + 5 + Math.floor(Math.random() * 10), 100),
        status: getNextStatus(status),
      };
    } catch (error) {
      console.error('Error fetching logs:', error);
      return {
        logs: [
          {
            id: Date.now(),
            message: 'Ошибка при получении статуса',
            type: 'error',
            timestamp: new Date().toISOString(),
          },
        ],
        progress,
        status,
      };
    }
  };

  // Эмуляция работы бэкенда
  const getSimulatedLogMessage = (currentStatus, currentProgress) => {
    const messages = {
      'Подготовка к анализу': 'Инициализация анализа документа',
      'Извлечение текста': `Извлечено ${Math.floor(
        currentProgress / 2
      )}% текста`,
      'Анализ содержимого': `Проанализировано ${
        currentProgress - 20
      }% содержания`,
      'Проверка законодательства': 'Проверка соответствия законам РК',
      'Формирование отчета': 'Подготовка итогового заключения',
      Завершено: 'Анализ успешно завершен',
    };
    return messages[currentStatus] || 'Выполняется анализ документа...';
  };

  const getNextStatus = (currentStatus) => {
    const statusFlow = [
      'Подготовка к анализу',
      'Извлечение текста',
      'Анализ содержимого',
      'Проверка законодательства',
      'Формирование отчета',
      'Завершено',
    ];
    const currentIndex = statusFlow.indexOf(currentStatus);
    return currentIndex < statusFlow.length - 1 &&
      progress > (currentIndex + 1) * 15
      ? statusFlow[currentIndex + 1]
      : currentStatus;
  };

  // Polling эффект
  useEffect(() => {
    if (!taskId || !isPolling) return;

    const pollingInterval = setInterval(async () => {
      const {
        logs: newLogs,
        progress: newProgress,
        status: newStatus,
      } = await fetchLogs();

      setLogs((prev) => [...prev, ...newLogs].slice(-10));
      setProgress(newProgress);
      setStatus(newStatus);

      if (newProgress >= 100) {
        setIsPolling(false);
        if (onComplete) {
          // Эмуляция результата - в реальном приложении нужно запрашивать с бэкенда
          onComplete({
            analysis:
              '### Анализ завершен\n\nДокумент соответствует законодательству РК',
            document_type: 'Договор',
            filename: 'document.pdf',
          });
        }
      }
    }, 3000);

    return () => clearInterval(pollingInterval);
  }, [taskId, isPolling, progress, status]);

  return (
    <Fade in timeout={500}>
      <LoadingContainer>
        <Typography variant="h6" gutterBottom>
          {status}
        </Typography>

        <Box sx={{ width: '100%', mb: 3 }}>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 8,
              borderRadius: 4,
              mb: 1,
              backgroundColor: theme.palette.grey[300],
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
                backgroundColor: theme.palette.primary.main,
              },
            }}
          />
          <Typography variant="body2" color="text.secondary" align="center">
            {progress}% завершено
          </Typography>
        </Box>

        <LogContainer>
          {logs.length > 0 ? (
            logs.map((log) => (
              <LogEntry key={log.id} type={log.type}>
                [{new Date(log.timestamp).toLocaleTimeString()}] {log.message}
              </LogEntry>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              Ожидание начала анализа...
            </Typography>
          )}
        </LogContainer>

        <Button
          variant="outlined"
          color="error"
          sx={{ mt: 3 }}
          onClick={() => {
            setIsPolling(false);
            if (onCancel) onCancel();
          }}
        >
          Отменить анализ
        </Button>
      </LoadingContainer>
    </Fade>
  );
}

export default LoadingSection;
