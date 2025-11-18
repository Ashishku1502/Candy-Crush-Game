import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface RequireAuthProps {
  children: React.ReactNode;
  whiteList?: string[];
}

export function RequireAuth({ children, whiteList = ['/login'] }: RequireAuthProps) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (loading) return;

    const isWhitelisted = whiteList.some(path => {
      if (path.endsWith('/*')) {
        const basePath = path.slice(0, -2);
        return location.pathname.startsWith(basePath);
      }
      return location.pathname === path;
    });

    if (!user && !isWhitelisted) {
      navigate('/login', { state: { from: location.pathname } });
    }
  }, [user, loading, location.pathname, navigate, whiteList]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[hsl(var(--game-bg-start))] to-[hsl(var(--game-bg-end))]">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-lg text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
