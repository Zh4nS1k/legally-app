import React, { useRef, useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Alert,
  Fade,
  Stack,
  Box,
  Chip,
  CircularProgress,
  Paper,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import HistoryIcon from '@mui/icons-material/History';
import DescriptionIcon from '@mui/icons-material/Description';
import CloseIcon from '@mui/icons-material/Close';
import { formatFileSize } from '../utils/helpers';

function UploadSection({
  onFileUpload,
  fileInfo,
  error,
  onHistoryClick,
  isLoading = false,
}) {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      onFileUpload(e.target.files[0]);
    }
    setDragActive(false);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveFile = () => {
    fileInputRef.current.value = '';
    onFileUpload(null);
  };

  return (
    <Fade in timeout={600}>
      <Container maxWidth="md" sx={{ mt: 6, mb: 4 }}>
        <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
            Анализ юридических документов
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Проверьте документ на соответствие законодательству Казахстана
          </Typography>

          <Box
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            sx={{
              mt: 4,
              p: dragActive ? 4 : 3,
              border: dragActive
                ? '2px dashed'
                : '2px dashed rgba(0, 0, 0, 0.12)',
              borderColor: dragActive ? 'primary.main' : 'divider',
              borderRadius: 2,
              backgroundColor: dragActive ? 'action.hover' : 'background.paper',
              transition: 'all 0.3s ease',
              textAlign: 'center',
              cursor: 'pointer',
              position: 'relative',
            }}
            onClick={() => !fileInfo && fileInputRef.current.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx"
              hidden
            />

            {isLoading ? (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <CircularProgress size={60} thickness={4} sx={{ mb: 2 }} />
                <Typography>Обработка документа...</Typography>
              </Box>
            ) : fileInfo ? (
              <Box>
                <DescriptionIcon
                  sx={{ fontSize: 60, color: 'primary.main', mb: 1 }}
                />
                <Typography variant="h6" gutterBottom>
                  {fileInfo.name}
                </Typography>
                <Chip
                  label={formatFileSize(fileInfo.size)}
                  variant="outlined"
                  sx={{ mr: 1 }}
                />
                <Chip
                  label={fileInfo.type || 'PDF документ'}
                  variant="outlined"
                  color="primary"
                />
                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<CloseIcon />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFile();
                    }}
                  >
                    Удалить
                  </Button>
                </Box>
              </Box>
            ) : (
              <>
                <UploadFileIcon
                  sx={{ fontSize: 60, color: 'primary.main', mb: 2 }}
                />
                <Typography variant="h6" gutterBottom>
                  Перетащите файл сюда или нажмите для выбора
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Поддерживаемые форматы: PDF, DOC, DOCX
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Максимальный размер: 10MB
                </Typography>
              </>
            )}
          </Box>

          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            sx={{ mt: 4 }}
          >
            <Button
              variant="contained"
              size="large"
              startIcon={<UploadFileIcon />}
              onClick={() => fileInputRef.current.click()}
              disabled={isLoading}
            >
              Выбрать файл
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<HistoryIcon />}
              onClick={onHistoryClick}
              disabled={isLoading}
            >
              История проверок
            </Button>
          </Stack>

          {error && (
            <Alert
              severity="error"
              sx={{ mt: 3 }}
              action={
                <Button
                  color="inherit"
                  size="small"
                  onClick={() => onFileUpload(null)}
                >
                  ОК
                </Button>
              }
            >
              {error}
            </Alert>
          )}

          {!error && !fileInfo && (
            <Alert severity="info" sx={{ mt: 3 }}>
              <Typography variant="body2">
                Сервис проверит ваш документ на:
              </Typography>
              <Box component="ul" sx={{ pl: 2, mb: 0 }}>
                <li>Соответствие законодательству РК</li>
                <li>Потенциальные правовые риски</li>
                <li>Неясные формулировки</li>
              </Box>
            </Alert>
          )}
        </Paper>
      </Container>
    </Fade>
  );
}

export default UploadSection;
