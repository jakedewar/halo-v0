import { GENERAL_SETTINGS_KEY, MESSAGE_TYPES } from '@/lib/types.ts';

// Keep track of ports with additional metadata
interface PortInfo {
  port: chrome.runtime.Port;
  lastActive: number;
}

const ports: { [key: string]: PortInfo } = {};

/** Fired when the extension is first installed,
 *  when the extension is updated to a new version,
 *  and when Chrome is updated to a new version. */
chrome.runtime.onInstalled.addListener(async (details) => {
  console.log('[background.js] onInstalled', details);
  
  // Initialize default settings if needed
  const settings = await chrome.storage.sync.get(GENERAL_SETTINGS_KEY);
  if (!settings[GENERAL_SETTINGS_KEY]) {
    await chrome.storage.sync.set({
      [GENERAL_SETTINGS_KEY]: {
        theme: 'light',
        hide_sidebar_button: false
      }
    });
  }
});

// Listen for connection attempts
chrome.runtime.onConnect.addListener((port) => {
  const portId = port.name || 'default';
  
  // Store port with metadata
  ports[portId] = {
    port,
    lastActive: Date.now()
  };

  console.log(`[background.js] Port connected: ${portId}`);

  // Listen for messages on this port
  port.onMessage.addListener((msg) => {
    try {
      console.log(`[background.js] Message received on port ${portId}:`, msg);
      // Update last active timestamp
      if (ports[portId]) {
        ports[portId].lastActive = Date.now();
      }
    } catch (error) {
      console.error(`[background.js] Error handling message on port ${portId}:`, error);
    }
  });

  // Clean up when port disconnects
  port.onDisconnect.addListener(() => {
    const error = chrome.runtime.lastError;
    if (error) {
      console.log(`[background.js] Port ${portId} disconnected with error:`, error.message);
    } else {
      console.log(`[background.js] Port disconnected: ${portId}`);
    }
    
    if (ports[portId]) {
      delete ports[portId];
    }
  });
});

// Handle startup
chrome.runtime.onStartup.addListener(() => {
  console.log('[background.js] onStartup');
});

/**
 *  Sent to the event page just before it is unloaded.
 *  This gives the extension opportunity to do some clean up.
 *  Note that since the page is unloading,
 *  any asynchronous operations started while handling this event
 *  are not guaranteed to complete.
 *  If more activity for the event page occurs before it gets
 *  unloaded the onSuspendCanceled event will
 *  be sent and the page won't be unloaded. */
chrome.runtime.onSuspend.addListener(() => {
  console.log('[background.js] onSuspend');
  // Clean up all ports
  Object.keys(ports).forEach(portId => {
    try {
      ports[portId].port.disconnect();
    } catch (error) {
      console.error(`[background.js] Error disconnecting port ${portId}:`, error);
    }
    delete ports[portId];
  });
});

// Handle one-time messages
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  console.log('[background.js] onMessage: ', message);

  if (message?.type === MESSAGE_TYPES.OPEN_OPTIONS) {
    chrome.runtime.openOptionsPage();
    sendResponse({ success: true });
  }

  // Important: return true if you want to send a response asynchronously
  return true;
});

// Handle settings changes
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync' && changes[GENERAL_SETTINGS_KEY]) {
    const message = { 
      type: MESSAGE_TYPES.GENERAL_SETTINGS_UPDATED, 
      data: changes[GENERAL_SETTINGS_KEY].newValue 
    };

    // Broadcast to all connected ports
    Object.values(ports).forEach(({ port }) => {
      try {
        port.postMessage(message);
      } catch (error) {
        console.error('Failed to post message to port:', error);
      }
    });

    // Also broadcast to one-time listeners
    chrome.runtime.sendMessage(message).catch(() => {
      // Ignore errors from no receivers
    });

    // Broadcast to all content scripts
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach((tab) => {
        if (tab.id) {
          chrome.tabs.sendMessage(tab.id, message).catch(() => {
            // Ignore errors from no receivers
          });
        }
      });
    });
  }
});

export {};
