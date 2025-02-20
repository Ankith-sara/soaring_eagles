"use client";
import Colors from '@/data/Colors';
import Image from 'next/image';
import React, { useContext } from 'react';
import { Button } from '../ui/button';
import { UserDetailContext } from '@/context/UserDetailContext';
import { LucideDownload, LucideUpload, Menu } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useSidebar } from '../ui/sidebar';
import { ActionContext } from '@/context/ActionContext';

function Header() {
  const { userDetail } = useContext(UserDetailContext);
  const { action, setAction } = useContext(ActionContext);
  const { toggleSidebar } = useSidebar();
  const path = usePathname();

  const onActionBtn = (actionType) => {
    setAction({
      actionType,
      timeStamp: Date.now(),
    });
  };

  return (
    <header
      className="fixed top-0 w-full border-b border-gray-800"
      style={{ backgroundColor: Colors.BACKGROUND }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <Image
              src="/logo.png"
              alt="logo"
              width={75}
              height={75}
              className="cursor-pointer hover:opacity-90 transition-opacity"
              priority
            />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors"
            aria-label="Open Menu"
            onClick={toggleSidebar}
          >
            <Menu className="h-6 w-6 text-gray-400" />
          </button>

          {/* Desktop Navigation (User + Export/Deploy Buttons) */}
          <div className="hidden md:flex items-center gap-x-6">
            {userDetail?.name ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-gray-800/50">
                  <Image
                    onClick={toggleSidebar}
                    src={userDetail.picture || '/default-avatar.png'}
                    alt="User Avatar"
                    width={32}
                    height={32}
                    className="rounded-full ring-2 ring-gray-700 cursor-pointer"
                  />
                  <span className="text-sm text-gray-200 font-medium">
                    {userDetail.name}
                  </span>
                </div>

                {path?.includes('workspace') && (
                  <div className="flex gap-2 items-center">
                    <Button variant="ghost" onClick={() => onActionBtn('export')}>
                      <LucideDownload className="h-5 w-5 mr-2" />
                      Export
                    </Button>
                    <Button
                      className="bg-blue-500 text-white hover:bg-blue-600"
                      onClick={() => onActionBtn('deploy')}
                    >
                      <LucideUpload className="h-5 w-5 mr-2" />
                      Deploy
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  className="text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                >
                  Sign In
                </Button>
                <Button
                  className="px-6 text-white hover:bg-blue-700 transition-colors"
                  style={{ backgroundColor: Colors.BLUE }}
                >
                  Get Started
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;