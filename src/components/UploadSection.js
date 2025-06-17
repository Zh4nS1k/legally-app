import React, { useRef, useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Alert,
  Fade,
  Stack,
  Box,
  CircularProgress,
  Paper,
  IconButton,
  useTheme,
} from '@mui/material';
import {
  UploadFile as UploadFileIcon,
  History as HistoryIcon,
  Description as DescriptionIcon,
  Close as CloseIcon,
  CloudUpload as CloudUploadIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const FileUploadArea = styled(Box)(({ theme, dragactive }) => ({
  padding: theme.spacing(dragactive ? 4 : 3),
  border: `2px dashed ${
    dragactive ? theme.palette.primary.main : theme.palette.divider
  }`,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: dragactive
    ? theme.palette.action.hover
    : theme.palette.background.paper,
  transition: 'all 0.3s ease',
  textAlign: 'center',
  cursor: 'pointer',
  position: 'relative',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.action.hover,
  },
}));

function UploadSection({
  onFileUpload,
  fileInfo,
  error,
  onHistoryClick,
  isLoading = false,
  onClearError,
}) {
  const theme = useTheme();
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files?.length > 0) {
      onFileUpload(e.target.files[0]);
    }
    setDragActive(false);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.length > 0) {
      onFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveFile = (e) => {
    e.stopPropagation();
    fileInputRef.current.value = '';
    onFileUpload(null);
    onClearError();
  };

  return (
    <Fade in timeout={600}>
      <Container maxWidth="md" sx={{ mt: 6, mb: 4 }}>
        <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
            Анализ юридических документов
          </Typography>

          {error && (
            <Alert
              severity="error"
              sx={{ mt: 2, mb: 3 }}
              action={
                <IconButton size="small" color="inherit" onClick={onClearError}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              }
            >
              {error}
            </Alert>
          )}

          <FileUploadArea
            dragactive={dragActive}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => !fileInfo && fileInputRef.current.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf"
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
                <CircularProgress
                  size={60}
                  thickness={4}
                  sx={{ mb: 2, color: theme.palette.primary.main }}
                />
                <Typography variant="h6">Идет анализ документа...</Typography>
              </Box>
            ) : fileInfo ? (
              <Box>
                <DescriptionIcon
                  sx={{ fontSize: 60, color: 'primary.main', mb: 1 }}
                />
                <Typography variant="h6" gutterBottom>
                  {fileInfo.name}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<CloseIcon />}
                    onClick={handleRemoveFile}
                  >
                    Удалить файл
                  </Button>
                </Box>
              </Box>
            ) : (
              <>
                <CloudUploadIcon
                  sx={{ fontSize: 60, color: 'primary.main', mb: 2 }}
                />
                <Typography variant="h6" gutterBottom>
                  {dragActive
                    ? 'Отпустите файл для загрузки'
                    : 'Перетащите файл сюда или нажмите для выбора'}
                </Typography>
              </>
            )}
          </FileUploadArea>

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
              disabled={isLoading || !!fileInfo}
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
        </Paper>
      </Container>
    </Fade>
  );
}

export default UploadSection;
