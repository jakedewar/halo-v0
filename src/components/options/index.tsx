import './options.css';
import { MessageCircleMore, Palette, Settings } from 'lucide-react';
import { Command, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command.tsx';
import { useState } from 'react';

import CardSwitch from '@/components/ui/card-switch.tsx';
import { useSettings } from '@/hooks/useSettings.tsx';
import iconDark from '@/assets/images/icon-dark.png';
import iconLight from '@/assets/images/icon-light.png';
import SafeImage from '@/components/ui/safe-image.tsx';

type MenuItemTypes = 'General' | 'Appearance' | 'Contact';

export default function Options() {
  const { settings, setSettings } = useSettings();
  const [currentMenu, setCurrentMenu] = useState<MenuItemTypes>('General');
  const menuItemClass = 'ext-text-sm ext-py-2 ext-px-3 ext-rounded-xl ext-font-normal ext-mt-2 ext-cursor-pointer';

  function handleMenuClick(value: unknown) {
    setCurrentMenu(value as MenuItemTypes);
  }

  return (
    <div className="ext-w-full ext-h-svh ext-flex ext-flex-col ext-bg-background ext-text-foreground">
      <div className="ext-flex ext-w-[896px] ext-h-full ext-m-auto">
        <div className="ext-w-full ext-flex ext-flex-col ext-px-2">
          {/* HEADER */}
          <div className="ext-flex ext-flex-row ext-justify-between ext-py-7">
            <div className="ext-flex ext-flex-row ext-items-center">
              <SafeImage className="ext-pl-3" width={45} src={settings.theme === 'dark' ? iconLight : iconDark} />
              <p
                className={`ext-text-center ext-text-2xl ext-ml-2 ext-font-black ${settings.theme === 'dark' ? 'ext-text-white' : 'ext-text-black'}`}
              >
                Halo
              </p>
            </div>
          </div>

          {/* CONTENT */}
          <div className="ext-flex ext-flex-row ext-flex-1">
            {/* LEFT MENU */}
            <div className="ext-flex ext-w-56">
              <Command value={currentMenu}>
                <CommandList>
                  <CommandItem className={menuItemClass} value="General" onSelect={handleMenuClick}>
                    <Settings /> <span>General</span>
                  </CommandItem>
                  <CommandItem className={menuItemClass} value="Appearance" onSelect={handleMenuClick}>
                    <Palette /> <span>Appearance</span>
                  </CommandItem>
                  <CommandSeparator className="ext-my-3" />
                  <CommandItem className={menuItemClass} value="Contact" onSelect={handleMenuClick}>
                    <MessageCircleMore /> <span>Contact Us</span>
                  </CommandItem>
                </CommandList>
              </Command>
            </div>

            {/* RIGHT CONTENT */}
            <div className="ext-flex ext-flex-col ext-flex-1 ext-pl-9 ext-pr-3 ext-pt-2">
              <div className="ext-flex ext-flex-col ext-gap-3">
                {currentMenu === 'General' && (
                  <>
                    <CardSwitch
                      title={'Hide Floating Button'}
                      checked={settings.hide_sidebar_button}
                      onChecked={() => setSettings({ hide_sidebar_button: !settings.hide_sidebar_button })}
                      subtitle={'Hide Floating Button in all content page.'}
                    />
                  </>
                )}
                {currentMenu === 'Appearance' && (
                  <>
                    <CardSwitch
                      title={'Dark Mode'}
                      checked={settings.theme === 'dark'}
                      onChecked={(checked) => setSettings({ theme: checked ? 'dark' : 'light' })}
                      subtitle={'Switch between dark mode applied to all extension modules.'}
                    />
                  </>
                )}
                {currentMenu === 'Contact' && (
                  <>
                    <div className="ext-w-full ext-bg-secondary hover:ext-bg-secondary/75 ext-rounded-2xl ext-flex-row ext-gap-1 ext-px-6 ext-py-4">
                      <div className="ext-flex ext-flex-col ext-gap-1">
                        <p className="ext-font-semibold ext-text">Contact Us</p>
                        <p className="ext-text-xs ext-pt-4">Contact us on</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="ext-flex ext-flex-col ext-justify-center ext-w-full ext-items-center ext-pt-4 ext-pb-14">
            <p className="ext-text-xs">Made with ❤️ by Ahmed Dinar</p>
            <p className="ext-text-xs">Version {chrome?.runtime?.getManifest().version}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
