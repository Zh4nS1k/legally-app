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
  Collapse,
  IconButton,
  Tabs,
  Tab,
  Fade,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import hljs from 'highlight.js';
import MarkdownIt from 'markdown-it';
import { splitAnalysisIntoSections } from '../utils/helpers';

import 'highlight.js/styles/github.css';

const md = new MarkdownIt({
  html: true,
  linkify: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre class="hljs"><code>${
          hljs.highlight(str, { language: lang }).value
        }</code></pre>`;
      } catch (__) {}
    }
    return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`;
  },
});

function HistorySection({ onBackClick }) {
  const [historyItems, setHistoryItems] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedItems, setExpandedItems] = useState({});
  const [tabStates, setTabStates] = useState({});

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
        setHistoryItems(data || []);
      } catch (err) {
        setError(err.message);
        setHistoryItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const toggleExpand = (itemId) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
    // Инициализируем вкладку для каждого элемента
    if (!tabStates[itemId]) {
      setTabStates((prev) => ({ ...prev, [itemId]: 0 }));
    }
  };

  const handleTabChange = (itemId, newTab) => {
    setTabStates((prev) => ({ ...prev, [itemId]: newTab }));
  };

  const enhanceContentWithStyles = (html) => {
    const container = document.createElement('div');
    container.innerHTML = html;

    // Style risk levels
    container.querySelectorAll('li, p').forEach((el) => {
      const text = el.textContent.toLowerCase();
      if (text.includes('высок') || text.includes('high')) {
        el.classList.add('risk-high');
      } else if (text.includes('средн') || text.includes('medium')) {
        el.classList.add('risk-medium');
      } else if (text.includes('низк') || text.includes('low')) {
        el.classList.add('risk-low');
      }
    });

    // Add icons or badges for legal references
    container.querySelectorAll('li').forEach((el) => {
      if (
        el.textContent.includes('Статья') ||
        el.textContent.includes('Закон')
      ) {
        el.classList.add('legal-reference');
      }
    });

    return container.innerHTML;
  };

  const processAnalysisContent = (analysis) => {
    if (!analysis)
      return {
        tabs: [
          {
            label: 'Полный анализ',
            content: '<p class="no-content">Нет данных анализа</p>',
            description: 'Полный анализ',
          },
        ],
        sections: {},
      };

    const htmlContent = md.render(analysis);
    const sections = splitAnalysisIntoSections(htmlContent);

    const tabs = [
      {
        label: 'Полный анализ',
        content: enhanceContentWithStyles(htmlContent),
        description: 'Полный анализ',
      },
      {
        label: 'Риски',
        content: sections.risks
          ? enhanceContentWithStyles(sections.risks)
          : '<p class="no-risks">Правовые риски не выявлены.</p>',
        description: 'Выявленные правовые риски и их уровень опасности',
      },
      {
        label: 'Рекомендации',
        content: sections.recommendations
          ? enhanceContentWithStyles(sections.recommendations)
          : '<p class="no-recommendations">Рекомендации отсутствуют.</p>',
        description: 'Предложения по устранению выявленных проблем',
      },
      {
        label: 'Сводка',
        content: sections.summary
          ? enhanceContentWithStyles(sections.summary)
          : '<p class="no-summary">Нет данных для сводки.</p>',
        description: 'Краткое резюме основных проблем и рекомендаций',
      },
    ];

    return { tabs, sections };
  };

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
    <Container sx={{ mt: 4, mb: 4 }}>
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
        <Grid container spacing={3}>
          {historyItems.map((item) => {
            const { tabs } = processAnalysisContent(item.analysis);
            const currentTab = tabStates[item._id] || 0;

            return (
              <Grid item xs={12} key={item._id || item.filename}>
                <Slide in direction="up">
                  <Card elevation={3}>
                    <CardContent>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          mb: 1,
                        }}
                      >
                        <Typography variant="h6">{item.filename}</Typography>
                        <Box>
                          <Typography
                            variant="body2"
                            component="span"
                            sx={{ mr: 2 }}
                          >
                            Тип: {item.type || 'Неизвестно'}
                          </Typography>
                          <Typography variant="caption" component="span">
                            {new Date(item.created_at).toLocaleDateString()}
                          </Typography>
                          <IconButton
                            onClick={() => toggleExpand(item._id)}
                            aria-label="Показать/скрыть анализ"
                            sx={{ ml: 1 }}
                          >
                            {expandedItems[item._id] ? (
                              <ExpandLessIcon />
                            ) : (
                              <ExpandMoreIcon />
                            )}
                          </IconButton>
                        </Box>
                      </Box>

                      <Collapse in={expandedItems[item._id]}>
                        <Box sx={{ mt: 2 }}>
                          <Tabs
                            value={currentTab}
                            onChange={(e, newTab) =>
                              handleTabChange(item._id, newTab)
                            }
                            variant="fullWidth"
                            sx={{ mb: 2 }}
                          >
                            {tabs.map((t, i) => (
                              <Tab
                                key={i}
                                label={
                                  <Box
                                    sx={{
                                      display: 'flex',
                                      flexDirection: 'column',
                                    }}
                                  >
                                    <span>{t.label}</span>
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                    >
                                      {t.description}
                                    </Typography>
                                  </Box>
                                }
                              />
                            ))}
                          </Tabs>

                          <Fade in key={`${item._id}-${currentTab}`}>
                            <Box
                              sx={{
                                p: 3,
                                backgroundColor: '#fff',
                                borderRadius: 2,
                                boxShadow: 1,
                                minHeight: '200px',
                                '& .risk-high': {
                                  borderLeft: '4px solid #ff1744',
                                  paddingLeft: '12px',
                                  backgroundColor: '#ffebee',
                                },
                                '& .risk-medium': {
                                  borderLeft: '4px solid #ff9100',
                                  paddingLeft: '12px',
                                  backgroundColor: '#fff3e0',
                                },
                                '& .risk-low': {
                                  borderLeft: '4px solid #00c853',
                                  paddingLeft: '12px',
                                  backgroundColor: '#e8f5e9',
                                },
                                '& .legal-reference': {
                                  fontWeight: '500',
                                  color: '#1565c0',
                                },
                                '& .no-risks, & .no-recommendations, & .no-summary, & .no-content':
                                  {
                                    fontStyle: 'italic',
                                    color: '#757575',
                                  },
                              }}
                              dangerouslySetInnerHTML={{
                                __html: tabs[currentTab].content,
                              }}
                            />
                          </Fade>
                        </Box>
                      </Collapse>
                    </CardContent>
                  </Card>
                </Slide>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Container>
  );
}

export default HistorySection;
