import React, { useRef } from 'react';
import { formatFileSize } from '../utils/helpers';

function UploadSection({ onFileUpload, fileInfo, error, onHistoryClick }) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      onFileUpload(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  return (
    <section className="upload-section">
      <h2>Проверить документ</h2>
      <p>
        Загрузите договор или другой юридический документ для анализа на
        соответствие законодательству РК
      </p>

      <div
        style={{
          display: 'flex',
          gap: '10px',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf"
          style={{ display: 'none' }}
        />
        <button className="upload-btn" onClick={handleUploadClick}>
          Загрузить документ
        </button>
        <button className="upload-btn" onClick={onHistoryClick}>
          📜 История анализов
        </button>
      </div>

      {fileInfo && (
        <div className="file-info">
          <strong>Выбран файл:</strong> {fileInfo.name} (
          {formatFileSize(fileInfo.size)})
        </div>
      )}

      {!fileInfo && !error && (
        <div className="empty-state">
          Пожалуйста, загрузите документ для анализа.
        </div>
      )}

      {error && <div className="error-state">{error}</div>}
    </section>
  );
}

export default UploadSection;
