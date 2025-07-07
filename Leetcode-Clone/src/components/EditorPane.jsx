import React from 'react';
import '../styles/EditorPane.css';

const EditorPane = ({ language, setLanguage }) => {
  return (
    <div className='editor-container'>
      <div className='language-timer-reset-container'>
        <div className='lang-menu'>
          <select
            className='language-menu'
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value='python'>Python</option>
            <option value='javascript'>JavaScript</option>
            <option value='cpp'>C++</option>
            <option value='java'>Java</option>
          </select>
        </div>
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
