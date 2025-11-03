import './app.css';
import { useWllama, WllamaProvider } from './utils/wllama.context';
import { Input } from './components/Input/Input';

export function App() {
  return (
    <WllamaProvider>
      <Main />
    </WllamaProvider>
  )
}

export function Main() {
  const { downloadProgress } = useWllama();

  return (
    <>
      {downloadProgress.value < 100 && (
        <div style={{
          position: 'fixed',
          top: '12px',
          right: '12px',
          zIndex: 1000,
          background: '#40414f',
          padding: '12px 18px',
          borderRadius: '12px',
          color: '#ffffff',
          fontSize: '14x'
        }}>
          <progress id="file" value={downloadProgress} max="100" style={{ marginRight: '12px' }}>
            {downloadProgress}%
          </progress>
          <span>Downloading: {downloadProgress}%</span>
        </div>
      )}
      <Input />
    </>
  )
}
