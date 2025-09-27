import React, { useState, useEffect } from 'react';
import { User, Key, Mail, UserCircle, LogOut, Copy } from 'lucide-react';
import { useAuthContext } from './auth/AuthProvider';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

const Profile = () => {
  const { user, logout } = useAuthContext();
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
      <DropdownMenuContent className="w-80 mr-4 mt-2" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user?.displayName || 'User'}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <Mail className="mr-2 h-4 w-4" />
            <span>Messages</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <UserCircle className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        
        <DropdownMenuSeparator />
        
        {/* Access Key Display (using Firebase UID) */}
        <div className="px-2 py-1.5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium">Access Key</h3>
          </div>
          
          {user?.uid ? (
            <>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1 bg-slate-100 rounded-md px-2 py-1">
                  <Key className="h-3 w-3 text-slate-500" />
                  <span className="text-sm font-mono truncate max-w-[120px]">{user.uid}</span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={copyToClipboard}
                  className="h-7 w-7 p-0"
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
              
              {copied && (
                <p className="text-xs text-green-600 mt-1">Copied to clipboard!</p>
              )}
              
              <p className="text-xs text-muted-foreground mt-2">
                This is your unique user ID. Use it to access special features in external applications.
              </p>
            </>
          ) : (
            <p className="text-xs text-muted-foreground">Loading...</p>
          )}
        </div>
        
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Profile;