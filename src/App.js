import React, { useState } from 'react';
import Header from './components/Header';
import UploadSection from './components/UploadSection';
import LoadingSection from './components/LoadingSection';
import ResultSection from './components/ResultSection';
import HistorySection from './components/HistorySection';
import Footer from './components/Footer';
import './styles/index.css';

function App() {
  const [activeTab, setActiveTab] = useState('upload');
  const [isLoading, setIsLoading] = useState(false);
  const [fileInfo, setFileInfo] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [error, setError] = useState(null);

  const handleFileUpload = async (file) => {
    // Validate file type
    if (!file.name.endsWith('.pdf')) {
      setError('Пожалуйста, загрузите файл в формате PDF');
      return;
    }

    setFileInfo({
      name: file.name,
      size: file.size,
    });
    setError(null);
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('document', file);

      const response = await fetch('http://localhost:8080/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || `Server returned ${response.status}`);
      }

      const data = await response.json();
      setAnalysisData(data);
      setActiveTab('result');
    } catch (err) {
      console.error('Upload error:', err);
      setError(
        'Произошла ошибка при анализе документа. Пожалуйста, попробуйте позже.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <Header />

      <main className="container">
        {activeTab === 'upload' && (
          <UploadSection
            onFileUpload={handleFileUpload}
            fileInfo={fileInfo}
            error={error}
            onHistoryClick={() => setActiveTab('history')}
          />
        )}

        {isLoading && <LoadingSection />}

        {analysisData && activeTab === 'result' && (
          <ResultSection
            data={analysisData}
            onBackClick={() => setActiveTab('upload')}
          />
        )}

        {activeTab === 'history' && (
          <HistorySection onBackClick={() => setActiveTab('upload')} />
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
