import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/db/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Sparkles } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const from = (location.state as { from?: string })?.from || '/';

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const handleGoogleLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithSSO({
        domain: 'miaoda-gg.com',
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (error) {
        console.error('SSO login failed:', error);
        toast({
          title: 'Login Failed',
          description: error.message || 'Failed to initiate Google login',
          variant: 'destructive',
        });
        return;
      }

      if (data?.url) {
        window.open(data.url, '_self');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Login Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[hsl(var(--game-bg-start))] via-[hsl(var(--background))] to-[hsl(var(--game-bg-end))] p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(189,16,224,0.1),transparent_50%)] pointer-events-none" />
      <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-64 h-64 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md animate-fade-in">
        <div className="text-center mb-8 space-y-4">
          <div className="inline-block">
            <h1 className="text-5xl xl:text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent drop-shadow-lg">
              🍬 Candy Crush
            </h1>
            <div className="h-1 bg-gradient-to-r from-primary via-secondary to-accent rounded-full mt-2" />
          </div>
          <p className="text-lg text-muted-foreground font-medium">
            Sign in to save your progress and compete on the leaderboard!
          </p>
        </div>

        <Card className="bg-card/80 backdrop-blur-sm border-2 border-primary/10 shadow-2xl">
          <CardHeader className="space-y-3">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Welcome Back!
            </CardTitle>
            <CardDescription className="text-center text-base">
              Continue your candy-matching adventure
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Button
              onClick={handleGoogleLogin}
              size="lg"
              className="w-full text-base font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign in with Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-muted" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Secure Authentication
                </span>
              </div>
            </div>

            <div className="text-center text-sm text-muted-foreground space-y-2">
              <p>🎮 Save your progress across devices</p>
              <p>🏆 Compete on the global leaderboard</p>
              <p>⭐ Track your achievements</p>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          By signing in, you agree to save your game progress securely
        </p>
      </div>
    </div>
  );
}
