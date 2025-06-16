import React from 'react';
import { Box, Typography, Container, Slide } from '@mui/material';

function Header() {
  return (
    <Slide in direction="down" timeout={700}>
      <Box
        component="header"
        sx={{ bgcolor: '#1976d2', py: 4, color: 'white' }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" component="h1" gutterBottom>
            Legally
          </Typography>
          <Typography variant="subtitle1">
            Проверка юридических документов на соответствие законодательству
            Казахстана
          </Typography>
        </Container>
      </Box>
    </Slide>
  );
}

export default Header;
