// components/Overlay.js
import React from 'react';

const Overlay = () => {
  return <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 999 }}></div>;
};

export default Overlay;
