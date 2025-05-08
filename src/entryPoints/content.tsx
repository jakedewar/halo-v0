import SidePanel from '@/components/content/side-panel/side-panel';
import renderRoot from '@/entryPoints/render/render-root.tsx';

import mainCSS from '@/entryPoints/main.css?inline';
import contentCSS from '@/components/content/content.css?inline';

function createShadow() {
  try {
    // Check if extension context is valid
    if (!chrome?.runtime) {
      console.warn('Chrome extension APIs not available');
      return null;
    }

    // Inside content page html, will create a custom entry tag <ext-boilerplate-entry>
    const sidebarTagName = 'ext-boilerplate-entry';
    
    // Check if element already exists
    const existingElement = document.querySelector(sidebarTagName);
    if (existingElement) {
      return existingElement.shadowRoot;
    }

    const sidebarElement = document.createElement(sidebarTagName);
    document.documentElement.appendChild(sidebarElement);

    const shadowRoot = sidebarElement.attachShadow({ mode: 'open' });
    shadowRoot.adoptedStyleSheets = [];

    // Apply styles
    try {
      if ('adoptedStyleSheets' in Document.prototype) {
        [mainCSS, contentCSS].forEach((styleSheetContent) => {
          const styleSheet = new CSSStyleSheet();
          styleSheet.replaceSync(styleSheetContent);
          shadowRoot.adoptedStyleSheets.push(styleSheet);
        });
      } else {
        [mainCSS, contentCSS].forEach((styleSheetContent) => {
          const styleElement = document.createElement('style');
          styleElement.textContent = styleSheetContent;
          shadowRoot.appendChild(styleElement);
        });
      }
    } catch (error) {
      console.error('Error applying styles:', error);
      // Fallback to basic style injection
      const styleElement = document.createElement('style');
      styleElement.textContent = mainCSS + contentCSS;
      shadowRoot.appendChild(styleElement);
    }

    return shadowRoot;
  } catch (error) {
    console.error('Error creating shadow DOM:', error);
    return null;
  }
}

// Simple initialization without complex retry logic
try {
  const shadowRoot = createShadow();
  if (shadowRoot) {
    renderRoot(shadowRoot, <SidePanel />);
  }
} catch (error) {
  console.error('Error initializing content script:', error);
}
