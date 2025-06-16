export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function splitAnalysisIntoSections(htmlContent) {
  const sections = {
    risks: '',
    recommendations: '',
    summary: '',
  };

  // Create temporary DOM element to parse HTML
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');

  // Get all heading elements
  const headings = doc.querySelectorAll('h3, h4');
  let currentSection = null;

  headings.forEach((heading) => {
    const text = heading.textContent.toLowerCase();

    if (
      text.includes('правовые риски') ||
      text.includes('неясные формулировки') ||
      text.includes('возможные нарушения') ||
      text.includes('риски')
    ) {
      currentSection = 'risks';
    } else if (text.includes('рекомендации')) {
      currentSection = 'recommendations';
    } else if (
      text.includes('заключение') ||
      text.includes('сводка') ||
      text.includes('итог') ||
      text.includes('вывод')
    ) {
      currentSection = 'summary';
    }

    if (currentSection) {
      // Get content until next heading
      let content = '';
      let nextElement = heading.nextElementSibling;

      while (nextElement && !['H3', 'H4'].includes(nextElement.tagName)) {
        content += nextElement.outerHTML;
        nextElement = nextElement.nextElementSibling;
      }

      sections[currentSection] += heading.outerHTML + content;
    }
  });

  return sections;
}
