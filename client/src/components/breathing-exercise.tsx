import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Play, Pause } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { InsertExerciseSession } from "@shared/schema";

interface BreathingExerciseProps {
  userId: number;
  onClose: () => void;
}

export default function BreathingExercise({ userId, onClose }: BreathingExerciseProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'pause'>('inhale');
  const [count, setCount] = useState(4);
  const [cycle, setCycle] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const saveSessionMutation = useMutation({
    mutationFn: (session: InsertExerciseSession) => apiRequest("POST", "/api/exercise-sessions", session),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/exercise-sessions"] });
      toast({
        title: "¡Excelente!",
        description: "Tu sesión de respiración ha sido registrada.",
      });
    },
  });

  const phases = {
    inhale: { duration: 4, next: 'hold', label: 'Inhala' },
    hold: { duration: 7, next: 'exhale', label: 'Mantén' },
    exhale: { duration: 8, next: 'pause', label: 'Exhala' },
    pause: { duration: 2, next: 'inhale', label: 'Pausa' }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning) {
      interval = setInterval(() => {
        setCount(prev => {
          if (prev <= 1) {
            const currentPhase = phases[phase];
            const nextPhase = currentPhase.next as keyof typeof phases;
            
            if (phase === 'pause') {
              setCycle(prev => prev + 1);
            }
            
            setPhase(nextPhase);
            return phases[nextPhase].duration;
          }
          return prev - 1;
        });
        
        setTotalTime(prev => prev + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, phase]);

  const handleStart = () => {
    setIsRunning(true);
    setPhase('inhale');
    setCount(4);
    setCycle(0);
    setTotalTime(0);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleComplete = () => {
    setIsRunning(false);
    saveSessionMutation.mutate({
      userId,
      type: 'breathing',
      duration: totalTime,
    });
    onClose();
  };

  const progress = ((phases[phase].duration - count) / phases[phase].duration) * 100;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-sm">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-dark-text">Respiración 4-7-8</h3>
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
              {isRunning ? 
                `Ciclo ${cycle + 1} • ${Math.floor(totalTime / 60)}:${(totalTime % 60).toString().padStart(2, '0')}` : 
                "Inhala 4 seg, mantén 7 seg, exhala 8 seg"
              }
            </p>
            
            {/* Breathing Circle */}
            <div className="relative w-32 h-32 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
              <div 
                className="absolute inset-0 rounded-full border-4 border-primary transition-all duration-1000"
                style={{
                  borderTopColor: 'transparent',
                  transform: `rotate(${progress * 3.6}deg)`,
                }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{count}</div>
                  <div className="text-xs text-muted-text">{phases[phase].label}</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              {!isRunning ? (
                <Button onClick={handleStart} className="w-full">
                  <Play className="w-4 h-4 mr-2" />
                  Iniciar
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button onClick={handlePause} variant="outline" className="flex-1">
                    <Pause className="w-4 h-4 mr-2" />
                    Pausar
                  </Button>
                  {cycle >= 3 && (
                    <Button onClick={handleComplete} className="flex-1">
                      Completar
                    </Button>
                  )}
                </div>
              )}
            </div>
            
            {cycle > 0 && (
              <p className="text-xs text-muted-text mt-4">
                Ciclos completados: {cycle}/4
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
