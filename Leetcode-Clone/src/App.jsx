import { useEffect, useState } from 'react';
import EditorPane from './components/EditorPane.jsx';
import ResultPane from './components/ResultPane.jsx';
import axios from 'axios';

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

  return (
    <div className='main-container'>
      <EditorPane language={language} setLanguage={setLanguage} />
      <ResultPane code={code} language={language} onRun={handleRun} />
    </div>
  );
}

export default App;
