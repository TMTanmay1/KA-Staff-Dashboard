import React from 'react';

function Attendance() {
  const style = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      textAlign: 'center',
    },
    heading: {
      color: 'red',
      fontWeight: 'bold',
      fontSize: '2rem',
      marginBottom: '20px',
    },
    text: {
      fontSize: '1.2rem',
      maxWidth: '600px',
    },
  };

  return (
    <div style={style.container}>
      <div style={style.heading}>Coming Soon</div>
      <div style={style.text}>
        This page is under development and will be available shortly. Thank you for your patience!
      </div>
      <div style={style.text}>
        Stay tuned for updates and new features that will enhance your experience.
      </div>
    </div>
  );
}

export default Attendance;
