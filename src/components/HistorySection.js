import React from 'react';

function HistorySection({ onBackClick }) {
  // Mock history data
  const historyItems = [
    {
      id: 1,
      title: 'Договор аренды №123',
      description: 'Анализ от 15.06.2023 - выявлено 3 риска',
      date: '15.06.2023',
      status: 'Завершен',
    },
    {
      id: 2,
      title: 'Трудовой договор',
      description: 'Анализ от 10.06.2023 - выявлено 2 рекомендации',
      date: '10.06.2023',
      status: 'Завершен',
    },
  ];

  return (
    <section className="result-section">
      <h2>История анализов</h2>

      <button
        className="upload-btn"
        onClick={onBackClick}
        style={{ marginBottom: '20px' }}
      >
        ← Назад к загрузке
      </button>

      <div className="analysis-container">
        {historyItems.length > 0 ? (
          historyItems.map((item) => (
            <div key={item.id} className="history-card">
              <h4>{item.title}</h4>
              <p>{item.description}</p>
              <div className="history-meta">
                <span>{item.date}</span>
                <span>{item.status}</span>
              </div>
            </div>
          ))
        ) : (
          <p>История анализов пуста</p>
        )}
      </div>
    </section>
  );
}

export default HistorySection;
