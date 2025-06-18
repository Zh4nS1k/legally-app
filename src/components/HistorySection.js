import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Slide,
  CircularProgress,
  Alert,
  Box,
} from '@mui/material';

function HistorySection({ onBackClick }) {
  const [historyItems, setHistoryItems] = useState(null); // Изначально null
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8080/api/history', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Ошибка при загрузке истории');
        }

        const data = await response.json();
        setHistoryItems(data || []); // Гарантируем, что будет массив
      } catch (err) {
        setError(err.message);
        setHistoryItems([]); // Устанавливаем пустой массив при ошибке
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="outlined" onClick={onBackClick}>
          ← Назад к загрузке
        </Button>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        История анализов
      </Typography>
      <Button variant="outlined" onClick={onBackClick} sx={{ mb: 2 }}>
        ← Назад к загрузке
      </Button>

      {!historyItems || historyItems.length === 0 ? (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="body1" color="text.secondary">
            История анализов пуста
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {historyItems.map((item) => (
            <Grid item xs={12} sm={6} key={item._id || item.filename}>
              <Slide in direction="up">
                <Card elevation={3}>
                  <CardContent>
                    <Typography variant="h6">{item.filename}</Typography>
                    <Typography variant="body2">
                      Тип: {item.type || 'Неизвестно'}
                    </Typography>
                    <Typography variant="caption" display="block" mt={1}>
                      {new Date(item.created_at).toLocaleDateString()} |{' '}
                      {item.analysis
                        ? `${item.analysis.substring(0, 50)}...`
                        : 'Нет данных'}
                    </Typography>
                  </CardContent>
                </Card>
              </Slide>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}

export default HistorySection;
