import React, { useState } from 'react';
import { User, Key, Copy, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from './auth/AuthProvider';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

const Profile = () => {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();
  const [copied, setCopied] = useState<boolean>(false);

  // Copy user ID to clipboard
  const copyToClipboard = () => {
    if (user?.uid) {
      navigator.clipboard.writeText(user.uid);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center justify-center w-10 h-10 rounded-full overflow-hidden border-2 border-speech-green shadow-md focus:outline-none focus:ring-2 focus:ring-speech-green focus:ring-offset-2">
          <img
            src={user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || user?.email || 'User')}&background=10b981&color=fff&size=40`}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-64 mr-4 mt-2 bg-white border-2 border-speech-green/20 shadow-lg rounded-2xl"
        align="end"
        forceMount
      >
        <DropdownMenuItem
          className="cursor-pointer font-bricolage text-speech-green hover:bg-speech-green/10 rounded-xl mx-2 my-1 px-4 py-3"
          onClick={() => navigate('/profile')}
        >
          <User className="mr-3 h-5 w-5" />
          <span className="text-base font-medium">Profile</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-speech-green/20" />

        <DropdownMenuItem
          className="cursor-pointer font-bricolage text-speech-green hover:bg-speech-green/10 rounded-xl mx-2 my-1 px-4 py-3"
          onClick={copyToClipboard}
        >
          <Key className="mr-3 h-5 w-5" />
          <span className="text-base font-medium">Copy Access Key</span>
        </DropdownMenuItem>

        {copied && (
          <div className="px-4 py-2">
            <p className="text-sm text-green-600 font-bricolage">Access key copied!</p>
          </div>
        )}

        <DropdownMenuSeparator className="bg-speech-green/20" />

        <DropdownMenuItem
          className="cursor-pointer font-bricolage text-red-600 hover:bg-red-50 rounded-xl mx-2 my-1 px-4 py-3"
          onClick={handleLogout}
        >
          <LogOut className="mr-3 h-5 w-5" />
          <span className="text-base font-medium">Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Profile;