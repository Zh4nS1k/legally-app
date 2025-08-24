import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  CircularProgress,
  Alert,
  Tooltip,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ClearIcon from '@mui/icons-material/Clear';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import InfoIcon from '@mui/icons-material/Info';
import { styled } from '@mui/material/styles';

const OuterContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  width: '100%',
  padding: '20px',
  backgroundColor: '#f5f7fa',
}));

const ChatContainer = styled(Box)(({ theme }) => ({
  width: '95%',
  maxWidth: '1000px',
  height: '90vh',
  backgroundColor: 'white',
  borderRadius: '20px',
  boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
}));

const Header = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
  color: 'white',
  padding: '20px',
  textAlign: 'center',
  position: 'relative',
}));

const StatsBadge = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '20px',
  right: '20px',
  background: 'rgba(255,255,255,0.1)',
  padding: '8px 12px',
  borderRadius: '15px',
  fontSize: '12px',
  display: 'flex',
  alignItems: 'center',
  gap: '5px',
}));

const ChatMessages = styled(Box)(({ theme }) => ({
  flex: 1,
  padding: '20px',
  overflowY: 'auto',
  backgroundColor: '#f8f9fa',
  display: 'flex',
  flexDirection: 'column',
}));

const Message = styled(Box)(({ theme, isUser }) => ({
  marginBottom: '20px',
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: isUser ? 'flex-end' : 'flex-start',
  width: '100%',
}));

const MessageAvatar = styled(Avatar)(({ theme, isUser }) => ({
  width: '40px',
  height: '40px',
  margin: '0 10px',
  backgroundColor: isUser
    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    : theme.palette.success.main,
  color: 'white',
}));

const MessageContent = styled(Box)(({ theme, isUser }) => ({
  maxWidth: '70%',
  padding: '15px 20px',
  borderRadius: '20px',
  position: 'relative',
  wordWrap: 'break-word',
  backgroundColor: isUser
    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    : 'white',
  color: isUser ? 'white' : theme.palette.text.primary,
  border: isUser ? 'none' : '1px solid #e9ecef',
  borderBottomRightRadius: isUser ? '5px' : '20px',
  borderBottomLeftRadius: isUser ? '20px' : '5px',
  boxShadow: isUser ? 'none' : '0 2px 10px rgba(0,0,0,0.1)',
  background: isUser
    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    : 'white',
}));

const ModeIndicator = styled(Box)(({ theme, mode }) => ({
  position: 'absolute',
  top: '-10px',
  right: '10px',
  background:
    mode === 'legal_rag'
      ? theme.palette.error.main
      : mode === 'general'
      ? theme.palette.grey[600]
      : theme.palette.success.main,
  color: 'white',
  padding: '4px 8px',
  borderRadius: '10px',
  fontSize: '10px',
  fontWeight: 'bold',
}));

const SourcesBox = styled(Box)(({ theme }) => ({
  marginTop: '10px',
  padding: '10px',
  background: '#e3f2fd',
  borderRadius: '10px',
  fontSize: '12px',
}));

const SourceItem = styled(Box)(({ theme }) => ({
  background: 'white',
  padding: '8px',
  margin: '5px 0',
  borderRadius: '5px',
  borderLeft: '3px solid #1976d2',
}));

const ChatInput = styled(Box)(({ theme }) => ({
  padding: '20px',
  backgroundColor: 'white',
  borderTop: '1px solid #e9ecef',
}));

const InputContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '10px',
  alignItems: 'flex-end',
}));

const InputField = styled(TextField)(({ theme }) => ({
  flex: 1,
  '& .MuiOutlinedInput-root': {
    borderRadius: '25px',
    padding: '5px 15px',
  },
  '& textarea': {
    resize: 'none',
    fontFamily: 'inherit',
    fontSize: '16px',
  },
}));

const SendButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  borderRadius: '25px',
  padding: '15px 25px',
  '&:hover': {
    transform: 'translateY(-2px)',
    background: 'linear-gradient(135deg, #5a6fd1 0%, #6a4299 100%)',
  },
  '&:disabled': {
    opacity: 0.6,
  },
}));

const Controls = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '10px',
  marginTop: '10px',
}));

const ControlButton = styled(Button)(({ theme }) => ({
  background: '#6c757d',
  color: 'white',
  borderRadius: '15px',
  padding: '8px 15px',
  fontSize: '12px',
  textTransform: 'none',
  '&:hover': {
    background: '#5a6268',
  },
}));

const TypingIndicator = styled(Box)(({ theme }) => ({
  padding: '15px 20px',
  background: 'white',
  borderRadius: '20px',
  borderBottomLeftRadius: '5px',
  marginBottom: '20px',
  border: '1px solid #e9ecef',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
}));

const ChatSection = () => {
  const [messages, setMessages] = useState([
    {
      content:
        'Здравствуйте! Я AI-ассистент, специализирующийся на казахстанском законодательстве. Задавайте мне любые вопросы по законам, кодексам и правовым нормам. Я использую RAG систему для поиска актуальной информации в юридических документах.',
      isUser: false,
      mode: 'legal_rag',
      sources: [],
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ total_vectors: 0 });
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Load system stats on component mount
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/stats');
        const data = await response.json();
        if (response.ok) {
          setStats(data);
        }
      } catch (err) {
        console.error('Error fetching stats:', err);
      }
    };

    fetchStats();
  }, []);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const sendMessage = async () => {
    const message = input.trim();
    if (!message || isTyping) return;

    // Add user message to chat
    setMessages((prev) => [...prev, { content: message, isUser: true }]);
    setInput('');
    setIsTyping(true);
    setError(null);

    try {
      const response = await fetch('/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error('Ошибка при обработке запроса');
      }

      const data = await response.json();

      // Add AI response to chat
      setMessages((prev) => [
        ...prev,
        {
          content: data.answer,
          isUser: false,
          mode: data.mode,
          sources: data.sources || [],
        },
      ]);
    } catch (err) {
      setError(err.message);
      setMessages((prev) => [
        ...prev,
        {
          content: 'Извините, произошла ошибка при обработке запроса.',
          isUser: false,
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const clearHistory = async () => {
    if (!window.confirm('Вы уверены, что хотите очистить историю разговора?'))
      return;

    try {
      const response = await fetch('/clear', { method: 'POST' });

      if (response.ok) {
        setMessages([
          {
            content: 'История разговора очищена. Задавайте новые вопросы!',
            isUser: false,
            mode: 'legal_rag',
          },
        ]);
      }
    } catch (err) {
      setError('Ошибка при очистке истории');
    }
  };

  const exportChat = async () => {
    try {
      const response = await fetch('/history');
      const data = await response.json();

      if (response.ok) {
        const chatText = data.history
          .map(
            (msg) =>
              `${msg.role === 'user' ? '👤 Вы' : '🤖 AI'}: ${msg.content}`
          )
          .join('\n\n');

        const blob = new Blob([chatText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `legal_chat_${new Date().toISOString().split('T')[0]}.txt`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      setError('Ошибка при экспорте чата');
    }
  };

  const showStats = async () => {
    try {
      const response = await fetch('/stats');
      const stats = await response.json();

      if (response.ok) {
        alert(`📊 Статистика системы:
• Векторов в индексе: ${stats.total_vectors}
• Размерность: ${stats.index_dimension}
• История разговора: ${stats.conversation_history_length}
• Модели: ${stats.models?.embedding || 'N/A'}`);
      }
    } catch (err) {
      setError('Ошибка при получении статистики');
    }
  };

  return (
    <OuterContainer>
      <ChatContainer>
        <Header>
          <Typography variant="h5" component="h1">
            🤖 Юридический AI-ассистент
          </Typography>
          <Typography variant="body2">
            Задавайте вопросы по казахстанскому законодательству
          </Typography>
          <StatsBadge>
            <InfoIcon fontSize="small" />
            <span>{stats.total_vectors} документов</span>
          </StatsBadge>
        </Header>

        <ChatMessages>
          {messages.map((message, index) => (
            <Message key={index} isUser={message.isUser}>
              {!message.isUser && (
                <MessageAvatar isUser={message.isUser}>🤖</MessageAvatar>
              )}
              <MessageContent isUser={message.isUser}>
                {!message.isUser && message.mode && (
                  <ModeIndicator mode={message.mode}>
                    {message.mode === 'legal_rag' ? 'RAG' : 'GPT'}
                  </ModeIndicator>
                )}
                <Typography
                  component="div"
                  dangerouslySetInnerHTML={{
                    __html: message.content.replace(/\n/g, '<br>'),
                  }}
                />

                {message.sources && message.sources.length > 0 && (
                  <SourcesBox>
                    <Typography variant="subtitle2" color="primary">
                      📚 Источники:
                    </Typography>
                    {message.sources.map((source, i) => (
                      <SourceItem key={i}>
                        <Typography variant="body2">{source}</Typography>
                      </SourceItem>
                    ))}
                  </SourcesBox>
                )}
              </MessageContent>
              {message.isUser && (
                <MessageAvatar isUser={message.isUser}>👤</MessageAvatar>
              )}
            </Message>
          ))}

          {isTyping && (
            <TypingIndicator>
              <CircularProgress size={16} />
              <Typography variant="body2">AI набирает сообщение...</Typography>
            </TypingIndicator>
          )}

          <div ref={messagesEndRef} />
        </ChatMessages>

        {error && (
          <Box sx={{ px: 2 }}>
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          </Box>
        )}

        <ChatInput>
          <InputContainer>
            <InputField
              multiline
              minRows={1}
              maxRows={4}
              placeholder="Введите ваш вопрос..."
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              fullWidth
            />
            <Tooltip title="Отправить">
              <span>
                <SendButton
                  onClick={sendMessage}
                  disabled={!input.trim() || isTyping}
                  endIcon={<SendIcon />}
                >
                  Отправить
                </SendButton>
              </span>
            </Tooltip>
          </InputContainer>

          <Controls>
            <ControlButton startIcon={<ClearIcon />} onClick={clearHistory}>
              Очистить историю
            </ControlButton>
            <ControlButton
              startIcon={<FileDownloadIcon />}
              onClick={exportChat}
            >
              Экспорт чата
            </ControlButton>
            <ControlButton startIcon={<InfoIcon />} onClick={showStats}>
              Статистика
            </ControlButton>
          </Controls>
        </ChatInput>
      </ChatContainer>
    </OuterContainer>
  );
};

export default ChatSection;
