import React from 'react';
import {
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Slide,
} from '@mui/material';

function HistorySection({ onBackClick }) {
  const historyItems = [
    {
      id: 1,
      title: 'Договор аренды №123',
      description: 'Анализ от 15.06.2023 - выявлено 3 риска',
      date: '15.06.2023',
      status: 'Завершен',
    },
    {
      id: 2,
      title: 'Трудовой договор',
      description: 'Анализ от 10.06.2023 - выявлено 2 рекомендации',
      date: '10.06.2023',
      status: 'Завершен',
    },
  ];

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        История анализов
      </Typography>
      <Button variant="outlined" onClick={onBackClick} sx={{ mb: 2 }}>
        ← Назад к загрузке
      </Button>

      <Grid container spacing={2}>
        {historyItems.map((item) => (
          <Grid item xs={12} sm={6} key={item.id}>
            <Slide in direction="up">
              <Card elevation={3}>
                <CardContent>
                  <Typography variant="h6">{item.title}</Typography>
                  <Typography variant="body2">{item.description}</Typography>
                  <Typography variant="caption" display="block" mt={1}>
                    {item.date} | {item.status}
                  </Typography>
                </CardContent>
              </Card>
            </Slide>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default HistorySection;
