import type { FC } from 'preact/compat';

export const OfflineNotif: FC<{ offlineReady: boolean }> = ({
  offlineReady,
}) => {
  if (!offlineReady) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: '12px',
        right: '12px',
        zIndex: 1000,
        background: '#10a37f',
        padding: '12px 18px',
        borderRadius: '12px',
        color: '#ffffff',
        fontSize: '14px',
      }}
    >
      App ready to work offline
    </div>
  );
};
