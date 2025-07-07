import React, { useState } from 'react';
import '../styles/ResultPane.css';

const ResultPane = ({ code, language, onRun }) => {
  const [activeTab, setActiveTab] = useState('input');
  const [inputValue, setInputValue] = useState('');
  const [outputValue, setOutputValue] = useState('');
  const [btnDisabled, setBtnDisabled] = useState(false);

  // console.log('code recieved :', code);

  const disableBtn = () => {
    setTimeout(() => setBtnDisabled(false), 10000);
  };

  const handleRunClick = async () => {
    setBtnDisabled(true);
    disableBtn();
    if (!code.trim()) {
      return alert('Code is empty!');
    }
    const output = await onRun(code, language, inputValue);
    setOutputValue(output);
    setActiveTab('output');
  };

  return (
    <div className='result-pane-container'>
      <div className='input-output-tabs-container'>
        <p
          className={activeTab === 'input' ? 'active-tab' : ''}
          onClick={() => setActiveTab('input')}
        >
          Input
        </p>
        <p
          className={activeTab === 'output' ? 'active-tab' : ''}
          onClick={() => setActiveTab('output')}
        >
          Output
        </p>
      </div>

      <div className='text-area-wrapper'>
        <textarea
          rows='4'
          placeholder={
            activeTab === 'input'
              ? 'Enter test input...'
              : 'Output will appear here'
          }
          value={activeTab === 'input' ? inputValue : outputValue}
          onChange={(e) =>
            activeTab === 'input' && setInputValue(e.target.value)
          }
          readOnly={activeTab === 'output'}
        />
      </div>

      <button
        className='run-btn '
        disabled={btnDisabled}
        onClick={handleRunClick}
      >
        Run
      </button>
    </div>
  );
};

export default ResultPane;
