import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { updateUsername } from '@/db/api';
import { ArrowLeft, User, Mail, Shield } from 'lucide-react';

export default function Profile() {
  const { user, profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [username, setUsername] = useState(profile?.username || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !username.trim()) return;

    setIsLoading(true);
    const success = await updateUsername(user.id, username.trim());
    
    if (success) {
      await refreshProfile();
      toast({
        title: 'Profile Updated',
        description: 'Your username has been updated successfully!',
      });
    } else {
      toast({
        title: 'Update Failed',
        description: 'Failed to update username. It may already be taken.',
        variant: 'destructive',
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--game-bg-start))] via-[hsl(var(--background))] to-[hsl(var(--game-bg-end))] py-8 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(189,16,224,0.1),transparent_50%)] pointer-events-none" />
      <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-64 h-64 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-2xl mx-auto space-y-6">
        <Button
          variant="outline"
          onClick={() => navigate('/')}
          className="gap-2 bg-card/50 backdrop-blur-sm hover:bg-card border-2 hover:border-primary/50"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Game
        </Button>

        <Card className="bg-card/80 backdrop-blur-sm border-2 border-primary/10 shadow-2xl">
          <CardHeader className="space-y-3">
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                <User className="w-10 h-10 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Profile Settings
            </CardTitle>
            <CardDescription className="text-center text-base">
              Manage your account information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                <Mail className="w-5 h-5 text-primary" />
                <div className="flex-1">
                  <Label className="text-sm text-muted-foreground">Email</Label>
                  <p className="font-medium">{profile?.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                <Shield className="w-5 h-5 text-primary" />
                <div className="flex-1">
                  <Label className="text-sm text-muted-foreground">Role</Label>
                  <p className="font-medium capitalize">{profile?.role}</p>
                </div>
              </div>

              <form onSubmit={handleUpdateUsername} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    className="bg-background/50"
                  />
                  <p className="text-xs text-muted-foreground">
                    This will be displayed on the leaderboard
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || !username.trim() || username === profile?.username}
                  className="w-full"
                >
                  {isLoading ? 'Updating...' : 'Update Username'}
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
