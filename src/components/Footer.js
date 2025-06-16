import React from 'react';
import { Box, Typography, Container, Fade } from '@mui/material';

function Footer() {
  return (
    <Fade in timeout={800}>
      <Box component="footer" sx={{ bgcolor: '#f5f5f5', py: 3, mt: 4 }}>
        <Container maxWidth="md">
          <Typography variant="body2" color="text.secondary" align="center">
            © 2025 Legally. Все права защищены.
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            align="center"
            display="block"
          >
            Информация предоставляется исключительно в ознакомительных целях.
          </Typography>
        </Container>
      </Box>
    </Fade>
  );
}

export default Footer;
