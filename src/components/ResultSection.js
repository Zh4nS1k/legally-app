import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Tabs,
  Tab,
  Box,
  Fade,
} from '@mui/material';
import { marked } from 'marked';
import hljs from 'highlight.js';
import { splitAnalysisIntoSections } from '../utils/helpers';

function ResultSection({ data, onBackClick }) {
  const [tab, setTab] = useState(0);

  useEffect(() => {
    document.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightElement(block);
    });
  }, [tab]);

  const highlightRisks = (html) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    doc.querySelectorAll('div, p, li').forEach((el) => {
      const text = el.textContent.toLowerCase();

      if (text.includes('высокий риск')) {
        el.classList.add('risk-highlight', 'high');
      } else if (text.includes('средний риск')) {
        el.classList.add('risk-highlight', 'medium');
      } else if (text.includes('низкий риск')) {
        el.classList.add('risk-highlight', 'low');
      }
    });

    return doc.body.innerHTML;
  };

  const rawHtml = data.analysis ? marked.parse(data.analysis) : '';
  const sections = splitAnalysisIntoSections(rawHtml);

  const tabs = [
    { label: 'Полный анализ', content: rawHtml },
    {
      label: 'Риски',
      content: highlightRisks(sections.risks || '<p>Риски не выявлены.</p>'),
    },
    {
      label: 'Рекомендации',
      content: sections.recommendations || '<p>Рекомендации отсутствуют.</p>',
    },
    {
      label: 'Сводка',
      content: sections.summary || '<p>Нет данных для сводки.</p>',
    },
  ];

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5">Результаты анализа</Typography>
      <Typography variant="subtitle1" gutterBottom>
        Тип документа: {data.document_type || 'Неизвестно'}
      </Typography>
      <Button variant="outlined" onClick={onBackClick} sx={{ mb: 2 }}>
        ← Назад к загрузке
      </Button>

      <Tabs value={tab} onChange={(e, newTab) => setTab(newTab)} centered>
        {tabs.map((t, i) => (
          <Tab key={i} label={t.label} />
        ))}
      </Tabs>

      <Fade in key={tab}>
        <Box
          sx={{
            mt: 3,
            border: '1px solid #ccc',
            borderRadius: 2,
            p: 2,
            backgroundColor: '#f9f9f9',
            overflowX: 'auto',
          }}
          dangerouslySetInnerHTML={{ __html: tabs[tab].content }}
        />
      </Fade>
    </Container>
  );
}

export default ResultSection;
