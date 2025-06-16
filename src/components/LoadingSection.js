import React from 'react';
import { Box, CircularProgress, Typography, Fade } from '@mui/material';

function LoadingSection() {
  return (
    <Fade in timeout={500}>
      <Box sx={{ textAlign: 'center', mt: 6 }}>
        <CircularProgress color="primary" />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Анализируем документ. Это может занять несколько минут...
        </Typography>
      </Box>
    </Fade>
  );
}

export default LoadingSection;
