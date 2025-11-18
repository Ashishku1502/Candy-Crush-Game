import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getAllProfiles } from '@/db/api';
import { useAuth } from '@/contexts/AuthContext';
import type { Profile } from '@/types/types';
import { ArrowLeft, Users, Shield, Mail } from 'lucide-react';

export default function Admin() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (profile?.role !== 'admin') {
      navigate('/');
      return;
    }

    const loadProfiles = async () => {
      setIsLoading(true);
      const data = await getAllProfiles();
      setProfiles(data);
      setIsLoading(false);
    };

    loadProfiles();
  }, [profile, navigate]);

  if (profile?.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--game-bg-start))] via-[hsl(var(--background))] to-[hsl(var(--game-bg-end))] py-8 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(189,16,224,0.1),transparent_50%)] pointer-events-none" />
      <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-64 h-64 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto space-y-6">
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
                <Shield className="w-10 h-10 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Admin Dashboard
            </CardTitle>
            <CardDescription className="text-center text-base">
              Manage users and view system information
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Loading users...</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                  <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-primary/20">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        Total Users
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-4xl font-bold text-primary">{profiles.length}</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-secondary/10 to-accent/10 border-2 border-secondary/20">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        Admins
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-4xl font-bold text-secondary">
                        {profiles.filter(p => p.role === 'admin').length}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-accent/10 to-primary/10 border-2 border-accent/20">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        Regular Users
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-4xl font-bold text-accent">
                        {profiles.filter(p => p.role === 'user').length}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-semibold mb-4">All Users</h3>
                  {profiles.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-all"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                        {user.role === 'admin' ? (
                          <Shield className="w-5 h-5 text-white" />
                        ) : (
                          <Users className="w-5 h-5 text-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">
                          {user.username || user.email?.split('@')[0] || 'Anonymous'}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="w-3 h-3" />
                          <span className="truncate">{user.email}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            user.role === 'admin'
                              ? 'bg-primary/20 text-primary'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {user.role}
                        </span>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(user.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
