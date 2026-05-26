import { useState } from 'react';

export default function GovTopBar() {
  const [contrast, setContrast] = useState('normal');

  function toggleContrast() {
    const newContrast = contrast === 'normal' ? 'high' : 'normal';
    setContrast(newContrast);
    if (newContrast === 'high') {
      document.documentElement.setAttribute('data-contrast', 'high');
    } else {
      document.documentElement.removeAttribute('data-contrast');
    }
  }

  function changeFontSize(action) {
    const html = document.documentElement;
    const currentSize = parseFloat(window.getComputedStyle(html).fontSize);
    if (action === 'increase' && currentSize < 20) {
      html.style.fontSize = `${currentSize + 2}px`;
    } else if (action === 'decrease' && currentSize > 12) {
      html.style.fontSize = `${currentSize - 2}px`;
    } else if (action === 'reset') {
      html.style.fontSize = '16px';
    }
  }

  return (
    <div className="gov-top-bar">
      <div className="gov-top-left">
        <span style={{ fontSize: '1.2rem' }}>🇮🇳</span>
        <span>GOVERNMENT OF INDIA</span>
      </div>
      <div className="gov-top-right">
        <button onClick={() => changeFontSize('decrease')} aria-label="Decrease font size">A-</button>
        <button onClick={() => changeFontSize('reset')} aria-label="Reset font size">A</button>
        <button onClick={() => changeFontSize('increase')} aria-label="Increase font size">A+</button>
        <button onClick={toggleContrast} aria-label="Toggle high contrast">
          {contrast === 'normal' ? '◐' : '◑'}
        </button>
        <select style={{ background: 'transparent', color: '#fff', border: 'none', outline: 'none' }}>
          <option value="en" style={{ color: '#000' }}>English</option>
          <option value="hi" style={{ color: '#000' }}>हिन्दी</option>
        </select>
      </div>
    </div>
  );
}
