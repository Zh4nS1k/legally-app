import React from 'react';

function LoadingSection() {
  return (
    <section className="loading-section">
      <div className="spinner"></div>
      <p>Анализируем документ. Это может занять несколько минут...</p>
    </section>
  );
}

export default LoadingSection;
