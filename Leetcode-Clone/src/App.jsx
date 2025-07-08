import { useEffect, useState } from 'react';
import EditorPane from './components/EditorPane.jsx';
import ResultPane from './components/ResultPane.jsx';
import axios from 'axios';
import ProblemPane from './components/ProblemPane.jsx';
import '../src/styles/App.css';

function App() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python');

  const apikey = import.meta.env.VITE_APIKEY;

  useEffect(() => {
    const handleMessage = (e) => {
      if (e.data?.files?.[0]?.content) {
        console.log('window logging:', e.data);
        const latestCode = e.data.files[0].content;
        setCode(latestCode);
        localStorage.setItem('student-code', latestCode);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleRun = async (code, language, stdin) => {
    try {
      const response = await axios.post(
        'https://onecompiler-apis.p.rapidapi.com/api/v1/run',
        {
          language,
          stdin,
          files: [
            {
              name: `main.${language === 'python' ? 'py' : 'js'}`,
              content: code,
            },
          ],
        },
        {
          headers: {
            'content-type': 'application/json',
            'X-RapidAPI-Key': `${apikey}`,
            'X-RapidAPI-Host': 'onecompiler-apis.p.rapidapi.com',
          },
        }
      );

      console.log('response data from one compiler :', response.data);

      const { stdout, stderr, exception } = response.data;
      return stdout || stderr || exception || 'No Output';
    } catch (error) {
      console.error(' API Error:', error);
      return 'Failed to run code.';
    }
  };

  // useEffect(() => {
  //   let resizer = document.getElementById('resizer');
  //   let problemPane = document.getElementById('problempaneid');

  //   let resizing = false;

  //   //when click happens
  //   resizer.addEventListener('mousedown', (e) => {
  //     resizing = true;
  //     document.body.style.cursor = 'ew-resize';
  //     e.preventDefault();
  //   });

  //   //when mouse is released
  //   document.addEventListener('mouseup', (e) => {
  //     if (resizing) {
  //       resizing = false;
  //       document.body.style.cursor = 'default';
  //     }
  //   });

  //   //lets calculate width and apply the changes.
  //   document.addEventListener('mousemove', (e) => {
  //     if (!resizing) {
  //       return;
  //     }
  //     let leftOffset = document.getElementById('maincontainerid').offsetLeft;
  //     let newWidth = e.clientX - leftOffset;
  //     problemPane.style.width = newWidth + 'px';
  //   });

  //   return () => {
  //     document.removeEventListener('mousedown', () => {});
  //     document.removeEventListener('mousemove', () => {});
  //   };
  // }, []);

  useEffect(() => {
    const resizer = document.getElementById('resizer');
    const problemPane = document.getElementById('problempaneid');
    const mainContainer = document.getElementById('maincontainerid');
    const overlay = document.getElementById('iframeoverlay');

    let resizing = false;

    const handleMouseDown = (e) => {
      resizing = true;
      document.body.style.cursor = 'ew-resize';
      e.preventDefault();
    };

    const handleMouseMove = (e) => {
      if (!resizing) return;

      const leftOffset = mainContainer.offsetLeft;
      const newWidth = e.clientX - leftOffset;

      problemPane.style.width = `${newWidth}px`;
      overlay.style.display = 'block';
    };

    const handleMouseUp = () => {
      if (resizing) {
        resizing = false;
        document.body.style.cursor = 'default';
        overlay.style.display = 'none';
      }
    };

    resizer.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      resizer.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div className='main-container' id='maincontainerid'>
      <div id='problempaneid' className='problem-pane'>
        <ProblemPane />
      </div>
      <div className='resizer' id='resizer'></div>
      <div className='editor-result-pane'>
        <div className='editor-container'>
          <EditorPane language={language} setLanguage={setLanguage} />
        </div>
        <div className='result-container'>
          <ResultPane code={code} language={language} onRun={handleRun} />
        </div>
      </div>
      <div id='iframeoverlay' className='iframeoverlay'></div>
    </div>
  );
}

export default App;
