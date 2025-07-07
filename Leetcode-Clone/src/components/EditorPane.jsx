import React, { useState } from 'react';
import '../styles/EditorPane.css';

const EditorPane = () => {
  const [language, setLanguage] = useState('javascript');
  return (
    <div className='editor-container'>
      <div className='language-timer-reset-container'>
        <div className='language-menu'>Language dropdown</div>
        <div className='timer'>Timer</div>
        <div className='reset-btn'>Reset</div>
      </div>
      <div className='code-frame'>
        <iframe
          id='oc-editor'
          frameBorder='0'
          height='450px'
          width='100%'
          src={`https://onecompiler.com/embed/${language}?theme=dark&codeChangeEvent=true&listenToEvents=true&hideRun=true&hideResult=true&hideLanguageSelection=true&hideNew=true`}
        />
      </div>
    </div>
  );
};

export default EditorPane;
