import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { User, LogOut, Trophy, Settings } from 'lucide-react';

export function UserProfile() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <Button
        onClick={() => navigate('/login')}
        variant="outline"
        size="sm"
        className="gap-2 bg-card/50 backdrop-blur-sm hover:bg-card border-2 hover:border-primary/50 transition-all hover:scale-105 active:scale-95"
      >
        <User className="w-4 h-4" />
        <span className="hidden xl:inline">Sign In</span>
      </Button>
    );
  }

  const displayName = profile?.username || profile?.email?.split('@')[0] || 'User';

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 bg-card/50 backdrop-blur-sm hover:bg-card border-2 hover:border-primary/50 transition-all hover:scale-105 active:scale-95"
        >
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <span className="hidden xl:inline font-semibold">{displayName}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{displayName}</p>
            <p className="text-xs text-muted-foreground">{profile?.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate('/leaderboard')}>
          <Trophy className="w-4 h-4 mr-2" />
          Leaderboard
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/profile')}>
          <Settings className="w-4 h-4 mr-2" />
          Profile Settings
        </DropdownMenuItem>
        {profile?.role === 'admin' && (
          <DropdownMenuItem onClick={() => navigate('/admin')}>
            <Settings className="w-4 h-4 mr-2" />
            Admin Dashboard
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
