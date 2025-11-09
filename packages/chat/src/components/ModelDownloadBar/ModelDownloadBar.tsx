import { useWllama } from '../../utils/wllama.context';

export const ModelDownloadBar = () => {
  const { downloadProgress } = useWllama();

  if (downloadProgress.value === 100) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: '12px',
        right: '12px',
        zIndex: 1000,
        background: '#40414f',
        padding: '12px 18px',
        borderRadius: '12px',
        color: '#ffffff',
        fontSize: '14x',
      }}
    >
      <progress
        id="file"
        value={downloadProgress}
        max="100"
        style={{ marginRight: '12px' }}
      >
        {downloadProgress}%
      </progress>
      <span>Downloading: {downloadProgress}%</span>
    </div>
  );
};
