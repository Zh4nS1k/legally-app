import React, { useState, useEffect } from 'react';
import { marked } from 'marked';
import hljs from 'highlight.js';
import { splitAnalysisIntoSections } from '../utils/helpers';

function ResultSection({ data, onBackClick }) {
  const [activeContentTab, setActiveContentTab] = useState('full');

  useEffect(() => {
    // Highlight code blocks after render
    document.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightElement(block);
    });
  }, [activeContentTab]);

  const handleTabClick = (tab) => {
    setActiveContentTab(tab);
  };

  // Process markdown content
  const htmlContent = data.analysis ? marked.parse(data.analysis) : '';
  const sections = splitAnalysisIntoSections(htmlContent);

  return (
    <section className="result-section">
      <h2>Результаты анализа</h2>
      <p className="document-type">
        Тип документа: {data.document_type || 'Неизвестно'}
      </p>

      <button
        className="upload-btn"
        onClick={onBackClick}
        style={{ marginBottom: '20px' }}
      >
        ← Назад к загрузке
      </button>

      <div className="tab-container">
        <div
          className={`tab ${activeContentTab === 'full' ? 'active' : ''}`}
          onClick={() => handleTabClick('full')}
        >
          Полный анализ
        </div>
        <div
          className={`tab ${activeContentTab === 'risks' ? 'active' : ''}`}
          onClick={() => handleTabClick('risks')}
        >
          Риски
        </div>
        <div
          className={`tab ${
            activeContentTab === 'recommendations' ? 'active' : ''
          }`}
          onClick={() => handleTabClick('recommendations')}
        >
          Рекомендации
        </div>
        <div
          className={`tab ${activeContentTab === 'summary' ? 'active' : ''}`}
          onClick={() => handleTabClick('summary')}
        >
          Сводка
        </div>
      </div>

      <div
        className={`tab-content ${activeContentTab === 'full' ? 'active' : ''}`}
      >
        <div
          className="analysis-container"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>

      <div
        className={`tab-content ${
          activeContentTab === 'risks' ? 'active' : ''
        }`}
      >
        <div
          className="analysis-container"
          dangerouslySetInnerHTML={{
            __html: sections.risks || '<p>Риски не выявлены.</p>',
          }}
        />
      </div>

      <div
        className={`tab-content ${
          activeContentTab === 'recommendations' ? 'active' : ''
        }`}
      >
        <div
          className="analysis-container"
          dangerouslySetInnerHTML={{
            __html:
              sections.recommendations || '<p>Рекомендации отсутствуют.</p>',
          }}
        />
      </div>

      <div
        className={`tab-content ${
          activeContentTab === 'summary' ? 'active' : ''
        }`}
      >
        <div
          className="analysis-container"
          dangerouslySetInnerHTML={{
            __html: sections.summary || '<p>Нет данных для сводки.</p>',
          }}
        />
      </div>
    </section>
  );
}

export default ResultSection;
