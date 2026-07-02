import { useRef } from 'react';
import { SAMPLE_FEATURE, SAMPLE_INTERVIEW } from '../lib/sampleManuscript.js';

export default function ManuscriptPanel({ manuscriptText, onChange }) {
  const fileInputRef = useRef(null);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange(String(reader.result || ''));
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="panel-section">
      <h3>Manuscript</h3>
      <p className="panel-hint">
        Paste your draft, or upload a .txt/.md file. First line reads as the headline, a short
        one-line paragraph after it as the dek, "By Name" as the byline. Use{' '}
        <code>## Heading</code> for section breaks, <code>&gt; quote</code> to force a pull quote,
        <code> - item</code> lists for countdowns, and <code>Speaker: line</code> for interviews.
      </p>
      <textarea
        className="manuscript-input"
        value={manuscriptText}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
        placeholder="[KICKER]&#10;Headline Goes Here&#10;By Author Name&#10;&#10;A one-line dek that summarizes the piece.&#10;&#10;First paragraph of body copy..."
      />
      <div className="button-row">
        <button type="button" onClick={() => fileInputRef.current?.click()}>
          Upload file
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,.md,text/plain,text/markdown"
          onChange={handleFile}
          hidden
        />
        <button type="button" onClick={() => onChange(SAMPLE_FEATURE)}>
          Load feature sample
        </button>
        <button type="button" onClick={() => onChange(SAMPLE_INTERVIEW)}>
          Load interview sample
        </button>
        <button type="button" className="ghost" onClick={() => onChange('')}>
          Clear
        </button>
      </div>
    </div>
  );
}
