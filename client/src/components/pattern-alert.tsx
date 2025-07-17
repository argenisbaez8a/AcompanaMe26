import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, TrendingDown, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import EmergencyResources from "./emergency-resources";
import CriticalSupportAlert from "./critical-support-alert";
import type { MoodEntry } from "@shared/schema";

interface PatternAlertProps {
  userId: number;
}

export default function PatternAlert({ userId }: PatternAlertProps) {
  const [showEmergency, setShowEmergency] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [showCriticalAlert, setShowCriticalAlert] = useState(false);

  const { data: recentMoods } = useQuery<MoodEntry[]>({
    queryKey: ["/api/mood-entries", userId, "trend", "7"],
  });

  const analyzePattern = () => {
    if (!recentMoods || recentMoods.length < 3) return null;

    // Check for critical pattern: more than 3 entries declining from regular (3) to very bad (1)
    const checkCriticalPattern = () => {
      if (recentMoods.length < 4) return false;
      
      // Look for entries that show a decline from 3 to 1 over multiple entries
      let regularToVeryBadCount = 0;
      let hasRegularStart = false;
      
      for (let i = 0; i < recentMoods.length; i++) {
        const mood = recentMoods[i].mood;
        
        // Check if we start from regular or above
        if (i === recentMoods.length - 1 && mood >= 3) {
          hasRegularStart = true;
        }
        
        // Count entries that are in the declining range (3 to 1)
        if (mood <= 3 && mood >= 1) {
          regularToVeryBadCount++;
        }
      }
      
      // Check if we have a clear declining pattern with very bad moods
      const veryBadCount = recentMoods.filter(entry => entry.mood === 1).length;
      const lowMoodCount = recentMoods.filter(entry => entry.mood <= 2).length;
      
      return (regularToVeryBadCount >= 4 && veryBadCount >= 2) || 
             (lowMoodCount >= 3 && veryBadCount >= 1);
    };

    const isCritical = checkCriticalPattern();
    
    if (isCritical) {
      return {
        type: 'critical',
        title: 'Patrón Crítico Detectado',
        message: 'Se detectó un patrón preocupante en tu estado emocional. Es importante buscar apoyo.',
        severity: 'critical'
      };
    }

    const last3Days = recentMoods.slice(0, 3);
    const lowMoodCount = last3Days.filter(entry => entry.mood <= 2).length;
    const averageMood = last3Days.reduce((sum, entry) => sum + entry.mood, 0) / last3Days.length;

    // Alert if 3 consecutive low moods or average mood is very low
    if (lowMoodCount >= 3 || averageMood <= 2.5) {
      return {
        type: 'warning',
        title: 'Patrón Detectado',
        message: 'Has registrado estados bajos por varios días consecutivos. Considera hablar con un profesional.',
        severity: 'high'
      };
    }

    // Alert if declining trend
    if (recentMoods.length >= 5) {
      const last5Days = recentMoods.slice(0, 5);
      const isDeclineTrend = last5Days.every((entry, index) => {
        if (index === 0) return true;
        return entry.mood <= last5Days[index - 1].mood;
      });

      if (isDeclineTrend) {
        return {
          type: 'info',
          title: 'Tendencia Descendente',
          message: 'Tu estado de ánimo ha mostrado una tendencia descendente. Considera usar más herramientas de bienestar.',
          severity: 'medium'
        };
      }
    }

    return null;
  };

  const pattern = analyzePattern();

  // Check for critical pattern and trigger alert
  useEffect(() => {
    if (pattern && pattern.type === 'critical' && !showCriticalAlert) {
      setShowCriticalAlert(true);
    }
  }, [pattern, showCriticalAlert]);

  if (!pattern) return null;

  const recommendations = [
    "Practica ejercicios de respiración diariamente",
    "Mantén una rutina de sueño regular",
    "Considera contactar a un profesional de salud mental",
    "Conecta con familiares y amigos",
    "Evita el alcohol y las drogas",
    "Practica actividades que disfrutes",
    "Considera unirte a un grupo de apoyo",
  ];

  return (
    <>
      <div className="mb-6">
        <Card className={`border-2 ${
          pattern.severity === 'high' 
            ? 'border-warning/30 bg-warning/5' 
            : 'border-blue-200 bg-blue-50'
        }`}>
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                pattern.severity === 'high' 
                  ? 'bg-warning' 
                  : 'bg-blue-500'
              }`}>
                {pattern.severity === 'high' ? (
                  <AlertTriangle className="w-4 h-4 text-white" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-white" />
                )}
              </div>
              <div className="flex-1">
                <h4 className={`font-medium text-sm mb-1 ${
                  pattern.severity === 'high' ? 'text-warning' : 'text-blue-700'
                }`}>
                  {pattern.title}
                </h4>
                <p className={`text-xs mb-3 ${
                  pattern.severity === 'high' ? 'text-warning' : 'text-blue-600'
                }`}>
                  {pattern.message}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowRecommendations(!showRecommendations)}
                    className={`text-xs h-7 ${
                      pattern.severity === 'high' 
                        ? 'border-warning text-warning hover:bg-warning hover:text-white' 
                        : 'border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white'
                    }`}
                  >
                    <Info className="w-3 h-3 mr-1" />
                    {showRecommendations ? 'Ocultar' : 'Ver'} recomendaciones
                  </Button>
                  {pattern.severity === 'high' && (
                    <Button
                      size="sm"
                      onClick={() => setShowEmergency(true)}
                      className="text-xs h-7 bg-emergency hover:bg-emergency/90 text-white"
                    >
                      Buscar ayuda
                    </Button>
                  )}
                </div>
              </div>
            </div>
            
            {showRecommendations && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h5 className="font-medium text-sm text-dark-text mb-2">Recomendaciones:</h5>
                <ul className="space-y-1">
                  {recommendations.slice(0, 5).map((rec, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0"></div>
                      <span className="text-xs text-muted-text">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {showEmergency && (
        <EmergencyResources onClose={() => setShowEmergency(false)} />
      )}
      {showCriticalAlert && (
        <CriticalSupportAlert onClose={() => setShowCriticalAlert(false)} />
      )}
    </>
  );
}
