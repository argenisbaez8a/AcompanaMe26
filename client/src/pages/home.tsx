import { useQuery } from "@tanstack/react-query";
import { Heart, Bell } from "lucide-react";
import MoodTracker from "@/components/mood-tracker";
import MoodHistory from "@/components/mood-history";
import BreathingExercise from "@/components/breathing-exercise";
import Meditation from "@/components/meditation";
import EmergencyResources from "@/components/emergency-resources";
import DepressionInfo from "@/components/depression-info";
import PatternAlert from "@/components/pattern-alert";
import BottomNav from "@/components/bottom-nav";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import type { User } from "@shared/schema";

interface HomeProps {
  userId: number;
}

export default function Home({ userId }: HomeProps) {
  const [showBreathing, setShowBreathing] = useState(false);
  const [showMeditation, setShowMeditation] = useState(false);
  const [showEmergency, setShowEmergency] = useState(false);
  const [showDepression, setShowDepression] = useState(false);
  const [showPatternAlert, setShowPatternAlert] = useState(true);

  const { data: user } = useQuery<User>({
    queryKey: ["/api/users", userId],
  });

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
              <h1 className="text-lg font-semibold text-dark-text">MindCare</h1>
              <p className="text-sm text-muted-text">
                {user ? `Hola, ${user.name}` : "Hola"}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Bell className="w-5 h-5 text-muted-text" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-md mx-auto w-full px-4 py-6">
        {/* Welcome Section */}
        <section className="mb-8">
          <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-6 text-white mb-6">
            <h2 className="text-xl font-semibold mb-2">¿Cómo te sientes hoy?</h2>
            <p className="text-blue-100 text-sm">
              Registra tu estado emocional y recibe apoyo personalizado
            </p>
          </div>
        </section>

        {/* Pattern Alert */}
        {showPatternAlert && (
          <PatternAlert userId={userId} onClose={() => setShowPatternAlert(false)} />
        )}

        {/* Mood Tracker */}
        <MoodTracker userId={userId} />

        {/* Quick Actions */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold text-dark-text mb-4">Herramientas de Bienestar</h3>
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2C7 1.45 7.45 1 8 1S9 1.45 9 2V4M15 4V2C15 1.45 15.45 1 16 1S17 1.45 17 2V4M21 8H3M7 10H17M7 14H17M7 18H17" />
                  </svg>
                </div>
                <h4 className="font-medium text-dark-text text-sm mb-1">Respiración 4-7-8</h4>
                <p className="text-xs text-muted-text mb-3">Técnica de relajación</p>
                <Button 
                  size="sm" 
                  className="w-full"
                  onClick={() => setShowBreathing(true)}
                >
                  Iniciar
                </Button>
              </CardContent>
            </Card>

            <Card className="p-4">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3C7.03 3 3 7.03 3 12S7.03 21 12 21 21 16.97 21 12 16.97 3 12 3ZM12 6C14.21 6 16 7.79 16 10S14.21 14 12 14 8 12.21 8 10 9.79 6 12 6Z" />
                  </svg>
                </div>
                <h4 className="font-medium text-dark-text text-sm mb-1">Meditación</h4>
                <p className="text-xs text-muted-text mb-3">Sesión de 5 minutos</p>
                <Button 
                  size="sm" 
                  className="w-full bg-secondary hover:bg-secondary/90"
                  onClick={() => setShowMeditation(true)}
                >
                  Meditar
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Mood History */}
        <MoodHistory userId={userId} />

        {/* Resources Section */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold text-dark-text mb-4">Recursos y Apoyo</h3>
          <div className="space-y-4">
            <Card className="p-4">
              <CardContent className="p-0">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-dark-text">Sobre la Depresión</h4>
                    <p className="text-sm text-muted-text">Mitos y verdades</p>
                  </div>
                </div>
                <Button 
                  variant="outline"
                  className="w-full bg-purple-50 text-purple-600 hover:bg-purple-100 border-purple-200"
                  onClick={() => setShowDepression(true)}
                >
                  Leer más
                </Button>
              </CardContent>
            </Card>

            <Card className="p-4">
              <CardContent className="p-0">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-emergency" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-dark-text">Ayuda de Emergencia</h4>
                    <p className="text-sm text-muted-text">Recursos inmediatos</p>
                  </div>
                </div>
                <Button 
                  variant="outline"
                  className="w-full bg-red-50 text-emergency hover:bg-red-100 border-red-200"
                  onClick={() => setShowEmergency(true)}
                >
                  Acceder
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      {/* Bottom Navigation */}
      <BottomNav currentPage="home" />

      {/* Modals */}
      {showBreathing && (
        <BreathingExercise 
          userId={userId} 
          onClose={() => setShowBreathing(false)} 
        />
      )}
      {showMeditation && (
        <Meditation 
          userId={userId} 
          onClose={() => setShowMeditation(false)} 
        />
      )}
      {showEmergency && (
        <EmergencyResources onClose={() => setShowEmergency(false)} />
      )}
      {showDepression && (
        <DepressionInfo onClose={() => setShowDepression(false)} />
      )}
    </div>
  );
}
