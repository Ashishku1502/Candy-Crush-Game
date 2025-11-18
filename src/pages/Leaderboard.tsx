import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getLeaderboard } from '@/db/api';
import type { LeaderboardEntry } from '@/types/types';
import { ArrowLeft, Trophy, Medal, Award } from 'lucide-react';

export default function Leaderboard() {
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadLeaderboard = async () => {
      setIsLoading(true);
      const data = await getLeaderboard();
      setLeaderboard(data);
      setIsLoading(false);
    };

    loadLeaderboard();
  }, []);

  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="w-6 h-6 text-yellow-500" />;
    if (index === 1) return <Medal className="w-6 h-6 text-gray-400" />;
    if (index === 2) return <Award className="w-6 h-6 text-amber-700" />;
    return <span className="text-lg font-bold text-muted-foreground">#{index + 1}</span>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--game-bg-start))] via-[hsl(var(--background))] to-[hsl(var(--game-bg-end))] py-8 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(189,16,224,0.1),transparent_50%)] pointer-events-none" />
      <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-64 h-64 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-4xl mx-auto space-y-6">
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
                <Trophy className="w-10 h-10 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Leaderboard
            </CardTitle>
            <CardDescription className="text-center text-base">
              Top players ranked by highest level and total score
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Loading leaderboard...</p>
              </div>
            ) : leaderboard.length === 0 ? (
              <div className="text-center py-12">
                <Trophy className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-lg text-muted-foreground">No players yet!</p>
                <p className="text-sm text-muted-foreground">Be the first to complete a level!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {leaderboard.map((entry, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-4 p-4 rounded-lg transition-all hover:scale-[1.02] ${
                      index < 3
                        ? 'bg-gradient-to-r from-primary/10 to-secondary/10 border-2 border-primary/20'
                        : 'bg-muted/50 hover:bg-muted'
                    }`}
                  >
                    <div className="flex items-center justify-center w-12">
                      {getRankIcon(index)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">
                        {entry.username || entry.email?.split('@')[0] || 'Anonymous'}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        {entry.email}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-primary">
                        Level {entry.highest_level}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {entry.total_score.toLocaleString()} pts
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
