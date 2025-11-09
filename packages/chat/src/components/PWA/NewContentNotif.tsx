import type { FC } from 'preact/compat';

interface NewContentNotifProps {
  updateServiceWorker: (reloadPage?: boolean) => Promise<void>;
  needRefresh: boolean;
}

export const NewContentNotif: FC<NewContentNotifProps> = ({
  needRefresh,
  updateServiceWorker,
}) => {
  if (!needRefresh) {
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
        fontSize: '14px',
        display: 'flex',
        gap: '12px',
        alignItems: 'center',
      }}
    >
      <span>New content available, click on reload button to update.</span>
      <button
        onClick={() => updateServiceWorker(true)}
        style={{
          background: '#10a37f',
          border: 'none',
          borderRadius: '6px',
          color: '#ffffff',
          padding: '6px 12px',
          cursor: 'pointer',
          fontSize: '14px',
        }}
      >
        Reload
      </button>
    </div>
  );
};
