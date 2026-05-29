const fs = require('fs');

// We copy the renderMarkdown function from page.tsx to test it
function renderMarkdown(md) {
  if (!md) return '';
  const lines = md.split('\n');
  let html = '';
  let inList = false;
  let listType = null;
  let inParagraph = false;

  const closeParagraph = () => {
    if (inParagraph) {
      html += '</p>\n';
      inParagraph = false;
    }
  };

  const closeList = () => {
    if (inList) {
      if (listType === 'ul') {
        html += '</ul>\n';
      } else if (listType === 'ol') {
        html += '</ol>\n';
      }
      inList = false;
      listType = null;
    }
  };

  const parseInline = (text) => {
    return text
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`(.+?)`/g, '<code>$1</code>')
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (!line) {
      closeParagraph();
      closeList();
      continue;
    }

    if (line === '---') {
      closeParagraph();
      closeList();
      html += '<hr />\n';
      continue;
    }

    if (line.startsWith('## ')) {
      closeParagraph();
      closeList();
      const content = line.substring(3).trim();
      html += `<h2>${parseInline(content)}</h2>\n`;
      continue;
    }

    if (line.startsWith('### ')) {
      closeParagraph();
      closeList();
      const content = line.substring(4).trim();
      html += `<h3>${parseInline(content)}</h3>\n`;
      continue;
    }

    if (line.startsWith('- ')) {
      closeParagraph();
      if (!inList || listType !== 'ul') {
        closeList();
        html += '<ul>\n';
        inList = true;
        listType = 'ul';
      }
      const content = line.substring(2).trim();
      html += `<li>${parseInline(content)}</li>\n`;
      continue;
    }

    if (/^\d+\.\s/.test(line)) {
      closeParagraph();
      if (!inList || listType !== 'ol') {
        closeList();
        html += '<ol>\n';
        inList = true;
        listType = 'ol';
      }
      const match = line.match(/^(\d+)\.\s(.*)/);
      const content = match ? match[2].trim() : line;
      html += `<li>${parseInline(content)}</li>\n`;
      continue;
    }

    closeList();
    if (!inParagraph) {
      html += '<p>';
      inParagraph = true;
    } else {
      html += ' ';
    }
    html += parseInline(line);
  }

  closeParagraph();
  closeList();
  return html;
}

const md = `## Vad testas i medborgarskapstestet?

Medborgarskapstestet – officiellt kallat **samhällskunskapstestet** – innehåller frågor från sju tydligt definierade ämnesområden.

---

## Ämnesområde 1: Landet Sverige`;

console.log(renderMarkdown(md));
