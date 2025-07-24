import { useQuery } from "@tanstack/react-query";
import { Heart, TrendingUp, Calendar, Clock, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BottomNav from "@/components/bottom-nav";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { MoodEntry, ExerciseSession, User } from "@shared/schema";

interface ProgressProps {
  userId: number;
}

export default function Progress({ userId }: ProgressProps) {
  const { toast } = useToast();
  
  const { data: user } = useQuery<User>({
    queryKey: ["/api/users", userId],
  });

  const { data: moodEntries } = useQuery<MoodEntry[]>({
    queryKey: ["/api/mood-entries", userId],
  });

  const { data: exercises } = useQuery<ExerciseSession[]>({
    queryKey: ["/api/exercise-sessions", userId],
  });

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

  const getMoodLabel = (mood: number) => {
    switch (mood) {
      case 1: return "Muy mal";
      case 2: return "Mal";
      case 3: return "Regular";
      case 4: return "Bien";
      case 5: return "Excelente";
      default: return "Desconocido";
    }
  };

  const getAverageMood = () => {
    if (!moodEntries || moodEntries.length === 0) return 0;
    const sum = moodEntries.reduce((acc, entry) => acc + entry.mood, 0);
    return (sum / moodEntries.length).toFixed(1);
  };

  const getTotalExerciseTime = () => {
    if (!exercises || exercises.length === 0) return 0;
    return exercises.reduce((acc, session) => acc + session.duration, 0);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleDownloadReport = () => {
    if (!user || !moodEntries) {
      toast({
        title: "Error",
        description: "No hay datos disponibles para descargar.",
        variant: "destructive",
      });
      return;
    }

    const reportData = {
      usuario: {
        nombre: user.username,
        edad: user.age,
        genero: user.gender,
        fechaRegistro: user.createdAt
      },
      estadisticas: {
        estadoPromedio: getAverageMood(),
        totalRegistros: moodEntries.length,
        tiempoTotalEjercicios: getTotalExerciseTime(),
        sesionesEjercicio: exercises?.length || 0
      },
      registrosEstado: moodEntries.map(entry => ({
        fecha: entry.date,
        estado: entry.mood,
        estadoTexto: getMoodLabel(entry.mood),
        notas: entry.notes || ""
      })),
      sesionesEjercicio: exercises?.map(session => ({
        tipo: session.type === 'breathing' ? 'Respiración 4-7-8' : 'Meditación',
        duracion: session.duration,
        fechaCompletado: session.completedAt
      })) || [],
      fechaExportacion: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Reporte-${user.username}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Reporte descargado",
      description: `Reporte de ${user.username} guardado exitosamente.`,
    });
  };

  return (
    <div className="min-h-screen bg-light-bg flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100 px-4 py-3">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-dark-text">Tu Progreso</h1>
              <p className="text-sm text-muted-text">Resumen de tu bienestar</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadReport}
            className="flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Descargar</span>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-md mx-auto w-full px-4 py-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-text">Estado Promedio</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="text-2xl font-bold text-dark-text">{getAverageMood()}</span>
              </div>
              <p className="text-xs text-muted-text">de 5.0</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-text">Tiempo de Ejercicios</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-secondary" />
                <span className="text-2xl font-bold text-dark-text">{formatTime(getTotalExerciseTime())}</span>
              </div>
              <p className="text-xs text-muted-text">total</p>
            </CardContent>
          </Card>
        </div>

        {/* Mood History */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-dark-text">Historial de Estado de Ánimo</CardTitle>
          </CardHeader>
          <CardContent>
            {moodEntries && moodEntries.length > 0 ? (
              <div className="space-y-3">
                {moodEntries.slice(0, 10).map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 ${getMoodColor(entry.mood)} rounded-full flex items-center justify-center`}>
                        <span className="text-white text-sm font-medium">{entry.mood}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-dark-text">
                          {getMoodLabel(entry.mood)}
                        </p>
                        <p className="text-xs text-muted-text">
                          {new Date(entry.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-text">
                      {new Date(entry.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-muted-text mx-auto mb-4" />
                <p className="text-muted-text">No has registrado tu estado de ánimo aún</p>
                <p className="text-sm text-muted-text">Comienza a llevar un registro diario</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Exercise History */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-dark-text">Historial de Ejercicios</CardTitle>
          </CardHeader>
          <CardContent>
            {exercises && exercises.length > 0 ? (
              <div className="space-y-3">
                {exercises.slice(0, 10).map((session) => (
                  <div key={session.id} className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 ${session.type === 'breathing' ? 'bg-primary' : 'bg-secondary'} rounded-full flex items-center justify-center`}>
                        {session.type === 'breathing' ? (
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2C7 1.45 7.45 1 8 1S9 1.45 9 2V4M15 4V2C15 1.45 15.45 1 16 1S17 1.45 17 2V4M21 8H3M7 10H17M7 14H17M7 18H17" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3C7.03 3 3 7.03 3 12S7.03 21 12 21 21 16.97 21 12 16.97 3 12 3ZM12 6C14.21 6 16 7.79 16 10S14.21 14 12 14 8 12.21 8 10 9.79 6 12 6Z" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-dark-text">
                          {session.type === 'breathing' ? 'Respiración 4-7-8' : 'Meditación'}
                        </p>
                        <p className="text-xs text-muted-text">
                          {formatTime(session.duration)}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-text">
                      {new Date(session.completedAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-muted-text mx-auto mb-4" />
                <p className="text-muted-text">No has realizado ejercicios aún</p>
                <p className="text-sm text-muted-text">Comienza con una sesión de respiración</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Bottom Navigation */}
      <BottomNav currentPage="progress" />
    </div>
  );
}
