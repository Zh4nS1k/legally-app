import React, { useRef } from 'react';
import {
  Container,
  Typography,
  Button,
  Alert,
  Fade,
  Stack,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import HistoryIcon from '@mui/icons-material/History';
import { formatFileSize } from '../utils/helpers';

function UploadSection({ onFileUpload, fileInfo, error, onHistoryClick }) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      onFileUpload(e.target.files[0]);
    }
  };

  return (
    <Fade in timeout={600}>
      <Container sx={{ mt: 6 }}>
        <Typography variant="h5" gutterBottom>
          Проверить документ
        </Typography>
        <Typography variant="body1" gutterBottom>
          Загрузите договор или другой юридический документ для анализа
        </Typography>

        <Stack
          direction="row"
          spacing={2}
          justifyContent="center"
          sx={{ mt: 2 }}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf"
            hidden
          />
          <Button
            variant="contained"
            startIcon={<UploadFileIcon />}
            onClick={() => fileInputRef.current.click()}
          >
            Загрузить
          </Button>
          <Button
            variant="outlined"
            startIcon={<HistoryIcon />}
            onClick={onHistoryClick}
          >
            История
          </Button>
        </Stack>

        {fileInfo && (
          <Alert severity="info" sx={{ mt: 2 }}>
            Выбран файл: {fileInfo.name} ({formatFileSize(fileInfo.size)})
          </Alert>
        )}

        {!fileInfo && !error && (
          <Alert severity="info" sx={{ mt: 2 }}>
            Пожалуйста, загрузите документ для анализа.
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Container>
    </Fade>
  );
}

export default UploadSection;
