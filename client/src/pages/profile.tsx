import { useQuery } from "@tanstack/react-query";
import { Heart, User, Settings, Info, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BottomNav from "@/components/bottom-nav";
import EmergencyResources from "@/components/emergency-resources";
import DepressionInfo from "@/components/depression-info";
import { useState } from "react";
import type { User as UserType } from "@shared/schema";

interface ProfileProps {
  userId: number;
}

export default function Profile({ userId }: ProfileProps) {
  const [showEmergency, setShowEmergency] = useState(false);
  const [showDepression, setShowDepression] = useState(false);

  const { data: user } = useQuery<UserType>({
    queryKey: ["/api/users", userId],
  });

  const handleLogout = () => {
    localStorage.removeItem("currentUserId");
    window.location.reload();
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
              <h1 className="text-lg font-semibold text-dark-text">Mi Perfil</h1>
              <p className="text-sm text-muted-text">Configuración y recursos</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-md mx-auto w-full px-4 py-6">
        {/* User Info Card */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl text-dark-text">
                  {user?.name || "Usuario"}
                </CardTitle>
                <p className="text-sm text-muted-text">
                  {user?.age ? `${user.age} años` : ""} {user?.gender && user.age ? "• " : ""}{user?.gender || ""}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-soft-blue rounded-lg p-4">
              <p className="text-sm text-primary font-medium mb-2">
                ¡Bienvenido a tu espacio de bienestar!
              </p>
              <p className="text-xs text-muted-text">
                Aquí encontrarás recursos y herramientas para cuidar tu salud mental
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="space-y-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <Phone className="w-5 h-5 text-emergency" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-dark-text">Recursos de Emergencia</h3>
                  <p className="text-sm text-muted-text">Ayuda inmediata cuando la necesites</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowEmergency(true)}
                >
                  Ver
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Info className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-dark-text">Información sobre Depresión</h3>
                  <p className="text-sm text-muted-text">Mitos, realidades y señales de alerta</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowDepression(true)}
                >
                  Leer
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mental Health Tips */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg text-dark-text">Consejos para el Bienestar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 text-sm">💚</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-dark-text">Mantén una rutina diaria</p>
                  <p className="text-xs text-muted-text">Horarios regulares ayudan a estabilizar el estado de ánimo</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 text-sm">🏃</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-dark-text">Haz ejercicio regularmente</p>
                  <p className="text-xs text-muted-text">La actividad física libera endorfinas naturales</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-yellow-600 text-sm">🤝</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-dark-text">Conecta con otros</p>
                  <p className="text-xs text-muted-text">Las relaciones sociales son fundamentales para el bienestar</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-600 text-sm">😴</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-dark-text">Cuida tu sueño</p>
                  <p className="text-xs text-muted-text">Dormir bien es esencial para la salud mental</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Important Notice */}
        <Card className="mb-8 border-warning/20 bg-warning/5">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-warning rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs">⚠️</span>
              </div>
              <div>
                <p className="text-sm font-medium text-dark-text">Recordatorio Importante</p>
                <p className="text-xs text-muted-text mt-1">
                  Esta aplicación no reemplaza el tratamiento médico profesional. 
                  Si experimentas síntomas graves o pensamientos de autolesión, 
                  busca ayuda profesional inmediatamente.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg text-dark-text flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Configuración
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={handleLogout}
              >
                Cerrar sesión
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Bottom Navigation */}
      <BottomNav currentPage="profile" />

      {/* Modals */}
      {showEmergency && (
        <EmergencyResources onClose={() => setShowEmergency(false)} />
      )}
      {showDepression && (
        <DepressionInfo onClose={() => setShowDepression(false)} />
      )}
    </div>
  );
}
