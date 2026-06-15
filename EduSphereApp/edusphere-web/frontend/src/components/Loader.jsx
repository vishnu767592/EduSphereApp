import React from 'react';

const Loader = ({ message = 'Loading...' }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '200px',
      gap: '12px'
    }}>
      <div className="spinner"></div>
      <p style={{ color: 'var(--text-muted)', fontSize: '14px', fontFamily: 'var(--font-title)' }}>{message}</p>
    </div>
  );
};

export default Loader;
