import React, { useState } from 'react';
import './App.css';

function App() {
  const [summary, setSummary] = useState('');
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [translatedText, setTranslatedText] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [translateLang, setTranslateLang] = useState('es');
  const [audioLang, setAudioLang] = useState('es');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [error, setError] = useState('');
  const [audioLoading, setAudioLoading] = useState(false);

  const languages = [
    { code: 'af', name: 'Afrikaans' },
    { code: 'ar', name: 'Arabic' },
    { code: 'bn', name: 'Bengali' },
    { code: 'bs', name: 'Bosnian' },
    { code: 'ca', name: 'Catalan' },
    { code: 'cs', name: 'Czech' },
    { code: 'cy', name: 'Welsh' },
    { code: 'da', name: 'Danish' },
    { code: 'de', name: 'German' },
    { code: 'el', name: 'Greek' },
    { code: 'en', name: 'English' },
    { code: 'eo', name: 'Esperanto' },
    { code: 'es', name: 'Spanish' },
    { code: 'et', name: 'Estonian' },
    { code: 'fi', name: 'Finnish' },
    { code: 'fr', name: 'French' },
    { code: 'gu', name: 'Gujarati' },
    { code: 'hi', name: 'Hindi' },
    { code: 'hr', name: 'Croatian' },
    { code: 'hu', name: 'Hungarian' },
    { code: 'id', name: 'Indonesian' },
    { code: 'is', name: 'Icelandic' },
    { code: 'it', name: 'Italian' },
    { code: 'ja', name: 'Japanese' },
    { code: 'jw', name: 'Javanese' },
    { code: 'km', name: 'Khmer' },
    { code: 'kn', name: 'Kannada' },
    { code: 'ko', name: 'Korean' },
    { code: 'la', name: 'Latin' },
    { code: 'lv', name: 'Latvian' },
    { code: 'ml', name: 'Malayalam' },
    { code: 'mr', name: 'Marathi' },
    { code: 'my', name: 'Myanmar (Burmese)' },
    { code: 'ne', name: 'Nepali' },
    { code: 'nl', name: 'Dutch' },
    { code: 'no', name: 'Norwegian' },
    { code: 'pl', name: 'Polish' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ro', name: 'Romanian' },
    { code: 'ru', name: 'Russian' },
    { code: 'si', name: 'Sinhala' },
    { code: 'sk', name: 'Slovak' },
    { code: 'sq', name: 'Albanian' },
    { code: 'sr', name: 'Serbian' },
    { code: 'su', name: 'Sundanese' },
    { code: 'sv', name: 'Swedish' },
    { code: 'sw', name: 'Swahili' },
    { code: 'ta', name: 'Tamil' },
    { code: 'te', name: 'Telugu' },
    { code: 'th', name: 'Thai' },
    { code: 'tl', name: 'Filipino' },
    { code: 'tr', name: 'Turkish' },
    { code: 'uk', name: 'Ukrainian' },
    { code: 'ur', name: 'Urdu' },
    { code: 'vi', name: 'Vietnamese' },
    { code: 'zh-CN', name: 'Chinese (Simplified)' },
    { code: 'zh-TW', name: 'Chinese (Traditional)' },
  ];

  const handleInputChange = (event) => {
    setSummary(event.target.value);
    setTranslatedText('');
    setAudioUrl('');
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!summary.trim()) {
      setError('Input a data stream to analyze.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://127.0.0.1:5000/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: summary }),
      });
      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else {
        setGenres(data.genres);
      }
    } catch (error) {
      console.error('Error predicting genres:', error);
      setError('Analysis failed. Check connection.');
    }
    setLoading(false);
    setIsMenuOpen(false);
  };

  const handleTranslate = async () => {
    if (!summary.trim()) {
      setError('Input a data stream to decode.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://127.0.0.1:5000/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: summary, language: translateLang, translate_only: true }),
      });
      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else {
        setTranslatedText(data.translated_text);
      }
    } catch (error) {
      console.error('Translation error:', error);
      setError('Decoding failed. Check connection.');
    }
    setLoading(false);
    setIsMenuOpen(false);
  };

  const handleGenerateAudio = async () => {
    if (!summary.trim()) {
      setError('Input a data stream to synthesize.');
      return;
    }
    setAudioLoading(true);
    setError('');
    try {
      const response = await fetch('http://127.0.0.1:5000/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: summary, language: audioLang }),
      });
      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Synthesis failed.');
        setAudioLoading(false);
        return;
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
    } catch (error) {
      console.error('TTS error:', error);
      setError('Synthesis failed. Check connection.');
    }
    setAudioLoading(false);
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="app-container">
      <button className={`hamburger ${isMenuOpen ? 'open' : ''}`} onClick={toggleMenu} aria-label="Toggle Menu">
        <span></span>
        <span></span>
        <span></span>
      </button>
      <div className={`menu-overlay ${isMenuOpen ? 'open' : ''}`}>
        <button className="close-menu" onClick={toggleMenu} aria-label="Close Menu">×</button>
        <div className="menu-content">
          <h2 className="menu-title">Prediction & Translation Modules</h2>
          <div className="menu-section">
            <label htmlFor="translate-lang">Decode to:</label>
            <select
              id="translate-lang"
              value={translateLang}
              onChange={(e) => setTranslateLang(e.target.value)}
              className="menu-select"
              aria-label="Select translation language"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>{lang.name}</option>
              ))}
            </select>
            <button onClick={handleTranslate} className={`menu-button ${loading ? 'loading' : ''}`}>
              {loading ? 'Decoding...' : 'Execute Decode'}
            </button>
          </div>
          <div className="menu-section">
            <label htmlFor="audio-lang">Synthesize to:</label>
            <select
              id="audio-lang"
              value={audioLang}
              onChange={(e) => setAudioLang(e.target.value)}
              className="menu-select"
              aria-label="Select audio language"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>{lang.name}</option>
              ))}
            </select>
            <button onClick={handleGenerateAudio} className={`menu-button ${audioLoading ? 'loading' : ''}`}>
              {audioLoading ? 'Synthesizing...' : 'Synthesize Audio'}
            </button>
          </div>
        </div>
      </div>
      <div className="main-content">
        <div className="container">
          <div className="card">
            <h1 className="title">Genre Predictor & Translator</h1>
            {error && <div className="error">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <textarea
                  value={summary}
                  onChange={handleInputChange}
                  placeholder="Input your data stream..."
                  className="textarea"
                  rows="4"
                  aria-label="Data stream input"
                  aria-invalid={error ? 'true' : 'false'}
                />
              </div>
              <button type="submit" className={`button ${loading ? 'loading' : ''}`}>
                {loading ? 'Analyzing...' : 'Scan Genres'}
              </button>
            </form>
            {translatedText && (
              <div className="translated-text">
                <h2 className="results-title">Decoded Data:</h2>
                <p>{translatedText}</p>
              </div>
            )}
            {audioUrl && (
              <div className="audio-player">
                <h2 className="results-title">Synthetic Output:</h2>
                <audio controls src={audioUrl} aria-label="Audio output"></audio>
              </div>
            )}
            {genres.length > 0 && (
              <div className="results">
                <h2 className="results-title">Detected Genres:</h2>
                <ul className="genre-list">
                  {genres.map((genre, index) => (
                    <li key={index} className="genre-item">{genre}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
