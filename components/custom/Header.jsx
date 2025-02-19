"use client";
import Colors from '@/data/Colors';
import Image from 'next/image';
import React, { useContext } from 'react';
import { Button } from '../ui/button';
import { UserDetailContext } from '@/context/UserDetailContext';
import { Menu } from 'lucide-react';

function Header() {
  const { userDetail } = useContext(UserDetailContext);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-sm border-b border-gray-800">
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
          <button className="md:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors">
            <Menu className="h-5 w-5 text-gray-400" />
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {userDetail?.name ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-gray-800/50">
                  <Image
                    src={userDetail.picture || '/default-avatar.png'}
                    alt="User Avatar"
                    width={32}
                    height={32}
                    className="rounded-full ring-2 ring-gray-700"
                  />
                  <span className="text-sm text-gray-200 font-medium">
                    {userDetail.name}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost" 
                  className="text-gray-300 hover:text-white hover:bg-gray-800"
                >
                  Sign In
                </Button>
                <Button 
                  className="bg-blue-600 text-white hover:bg-blue-700 transition-colors px-6"
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