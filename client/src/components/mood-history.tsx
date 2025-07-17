import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import type { MoodEntry } from "@shared/schema";

interface MoodHistoryProps {
  userId: number;
}

export default function MoodHistory({ userId }: MoodHistoryProps) {
  const [, setLocation] = useLocation();

  const { data: moodEntries, isLoading } = useQuery<MoodEntry[]>({
    queryKey: ["/api/mood-entries", userId],
  });

  const getMoodEmoji = (mood: number) => {
    switch (mood) {
      case 1: return "😢";
      case 2: return "😔";
      case 3: return "😐";
      case 4: return "😊";
      case 5: return "😄";
      default: return "😐";
    }
  };

  const getMoodLabel = (mood: number) => {
    switch (mood) {
      case 1: return "Muy mal";
      case 2: return "Mal";
      case 3: return "Regular";
      case 4: return "Bien";
      case 5: return "Excelente";
      default: return "Regular";
    }
  };

  const getMoodColor = (mood: number) => {
    switch (mood) {
      case 1: return "bg-red-500";
      case 2: return "bg-orange-500";
      case 3: return "bg-yellow-500";
      case 4: return "bg-green-500";
      case 5: return "bg-green-600";
      default: return "bg-gray-500";
    }
  };

  const formatDate = (date: string | Date) => {
    const entryDate = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (entryDate.toDateString() === today.toDateString()) {
      return "Hoy";
    } else if (entryDate.toDateString() === yesterday.toDateString()) {
      return "Ayer";
    } else {
      const daysAgo = Math.floor((today.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
      return `Hace ${daysAgo} días`;
    }
  };

  if (isLoading) {
    return (
      <section className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-dark-text">
              Historial Emocional
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="animate-pulse space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section className="mb-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-dark-text">
              Historial Emocional
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/progress")}
              className="text-primary font-medium"
            >
              Ver todo
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {moodEntries && moodEntries.length > 0 ? (
            <div className="space-y-3">
              {moodEntries.slice(0, 5).map((entry) => (
                <div key={entry.id} className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 ${getMoodColor(entry.mood)} rounded-full flex items-center justify-center`}>
                      <span className="text-white text-sm">
                        {getMoodEmoji(entry.mood)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-dark-text">
                        {formatDate(entry.date)}
                      </p>
                      <p className="text-xs text-muted-text">
                        {getMoodLabel(entry.mood)}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-text">
                    {new Date(entry.date).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <p className="text-muted-text mb-2">No tienes registros aún</p>
              <p className="text-sm text-muted-text">
                Comienza registrando tu estado de ánimo arriba
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
