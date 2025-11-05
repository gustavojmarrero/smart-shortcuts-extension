import React from 'react';
import ReactDOM from 'react-dom/client';
import Options from './Options';
import '../styles/index.css';

// Add listener for storage changes from other devices
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'sync' && changes.config) {
    console.log('🔄 [SYNC] Storage changed from another device!');
    console.log('🔄 [SYNC] Old value:', changes.config.oldValue ? `${changes.config.oldValue.sections?.length} sections` : 'none');
    console.log('🔄 [SYNC] New value:', changes.config.newValue ? `${changes.config.newValue.sections?.length} sections` : 'none');

    // Reload the page to show updated config
    window.location.reload();
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Options />
  </React.StrictMode>
);
