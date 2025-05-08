import { ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { ROOT_CONTAINER_ID } from '@/lib/constants.ts';
import { renderFonts } from '@/entryPoints/render/render-font.tsx';
import { SettingsProvider } from '@/hooks/useSettings.tsx';

if (import.meta.env.DEV) {
  // Only when vite in development mode `yarn dev`
  import('@/assets/fonts/index.css');
}

export default function renderRoot(rootElement: HTMLElement | ShadowRoot, rootNode: ReactNode) {
  // Ensure we're in a valid extension context
  if (typeof chrome === 'undefined' || !chrome.runtime || !chrome.runtime.connect) {
    console.warn('Chrome extension APIs not available');
    return null;
  }

  // Wait for extension context to be ready
  if (!chrome.runtime.id) {
    console.warn('Extension context not ready');
    return null;
  }

  try {
    if (import.meta.env.PROD) {
      // Inject custom font files resolved chrome ext path in production build
      renderFonts();
    }

    // Check if root container already exists and remove it
    const existingContainer = rootElement.querySelector(`#${ROOT_CONTAINER_ID}`);
    if (existingContainer) {
      existingContainer.remove();
    }

    const rootContainer = document.createElement('div');
    rootContainer.id = ROOT_CONTAINER_ID;

    rootElement.append(rootContainer);

    const isContent = rootElement instanceof ShadowRoot;

    const root = createRoot(rootContainer);
    let mounted = true;
    
    // Wrap render in try-catch to handle potential context invalidation
    try {
      root.render(
        <SettingsProvider defaultTheme="light" shadowRoot={isContent ? rootElement : undefined}>
          {rootNode}
        </SettingsProvider>,
      );

      // Set up context invalidation listener
      const handleContextInvalidated = () => {
        if (mounted) {
          try {
            root.unmount();
          } catch (error) {
            console.warn('Error unmounting on context invalidation:', error);
          }
          mounted = false;
        }
      };

      try {
        chrome.runtime.onMessageExternal.addListener(handleContextInvalidated);
      } catch (e) {
        // Ignore errors during listener setup
      }

    } catch (error) {
      console.error('Error rendering root:', error);
      // Attempt cleanup if render fails
      try {
        root.unmount();
      } catch (unmountError) {
        console.warn('Error during cleanup:', unmountError);
      }
      mounted = false;
    }

    // Return cleanup function
    return () => {
      mounted = false;
      try {
        root.unmount();
      } catch (error) {
        console.warn('Error unmounting root:', error);
      }
    };
  } catch (error) {
    console.error('Error in renderRoot:', error);
    return null;
  }
}
