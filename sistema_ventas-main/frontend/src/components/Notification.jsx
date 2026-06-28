import { Toaster } from 'react-hot-toast';

function Notification() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: '#333',
          color: '#fff',
          borderRadius: '10px',
          padding: '14px 20px',
          fontSize: '0.9rem',
          fontFamily: "'Inter', sans-serif",
        },
        success: {
          style: {
            background: '#4CAF50',
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#4CAF50',
          },
        },
        error: {
          style: {
            background: '#f44336',
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#f44336',
          },
        },
      }}
    />
  );
}

export default Notification;
