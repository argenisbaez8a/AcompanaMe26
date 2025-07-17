import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Play, Pause } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { InsertExerciseSession } from "@shared/schema";

interface MeditationProps {
  userId: number;
  onClose: () => void;
}

export default function Meditation({ userId, onClose }: MeditationProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes = 300 seconds
  const [totalTime] = useState(300);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const saveSessionMutation = useMutation({
    mutationFn: (session: InsertExerciseSession) => apiRequest("POST", "/api/exercise-sessions", session),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/exercise-sessions"] });
      toast({
        title: "¡Bien hecho!",
        description: "Tu sesión de meditación ha sido registrada.",
      });
    },
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            // Auto-complete when timer reaches 0
            saveSessionMutation.mutate({
              userId,
              type: 'meditation',
              duration: totalTime,
            });
            toast({
              title: "¡Meditación completada!",
              description: "Has completado tu sesión de 5 minutos.",
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, userId, totalTime, saveSessionMutation, toast]);

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleComplete = () => {
    setIsRunning(false);
    const completedTime = totalTime - timeLeft;
    saveSessionMutation.mutate({
      userId,
      type: 'meditation',
      duration: completedTime,
    });
    onClose();
  };

  const progress = ((totalTime - timeLeft) / totalTime) * 100;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const guidanceText = () => {
    if (timeLeft > 240) return "Siéntate cómodamente y cierra los ojos";
    if (timeLeft > 180) return "Concéntrate en tu respiración natural";
    if (timeLeft > 120) return "Observa tus pensamientos sin juzgarlos";
    if (timeLeft > 60) return "Regresa suavemente a tu respiración";
    return "Prepárate para terminar la sesión";
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-sm">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-dark-text">Meditación Guiada</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="rounded-full"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <p className="text-sm text-muted-text mb-6">
              Sesión de 5 minutos para calmar la mente
            </p>
            
            {/* Timer Circle */}
            <div className="relative w-32 h-32 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
              <div 
                className="absolute inset-0 rounded-full border-4 border-secondary transition-all duration-1000"
                style={{
                  borderTopColor: 'transparent',
                  transform: `rotate(${progress * 3.6}deg)`,
                }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary">
                    {minutes}:{seconds.toString().padStart(2, '0')}
                  </div>
                  <div className="text-xs text-muted-text">restantes</div>
                </div>
              </div>
            </div>
            
            {/* Guidance Text */}
            <div className="bg-soft-blue rounded-lg p-4 mb-6">
              <p className="text-sm text-primary font-medium">
                {guidanceText()}
              </p>
            </div>
            
            <div className="space-y-3">
              {!isRunning ? (
                <Button onClick={handleStart} className="w-full bg-secondary hover:bg-secondary/90">
                  <Play className="w-4 h-4 mr-2" />
                  {timeLeft === totalTime ? "Comenzar" : "Continuar"}
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button onClick={handlePause} variant="outline" className="flex-1">
                    <Pause className="w-4 h-4 mr-2" />
                    Pausar
                  </Button>
                  <Button onClick={handleComplete} className="flex-1 bg-secondary hover:bg-secondary/90">
                    Completar
                  </Button>
                </div>
              )}
            </div>
            
            <div className="mt-4 text-xs text-muted-text">
              Progreso: {Math.round(progress)}%
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
