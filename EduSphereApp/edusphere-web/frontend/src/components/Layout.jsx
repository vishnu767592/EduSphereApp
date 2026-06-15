import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar />
        <main style={{
          flex: 1,
          padding: '32px',
          overflowY: 'auto',
          maxWidth: '1200px',
          margin: '0 auto',
          width: '100%'
        }} className="main-content">
          {children}
        </main>
      </div>

      <style>{`
        @media (max-width: 576px) {
          .main-content {
            padding: 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default Layout;
