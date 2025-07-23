import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { BarChart3, Users, FileText, RotateCcw } from "lucide-react";
import type { User, MoodEntry } from "@shared/schema";

export default function Admin() {
  const [, setLocation] = useLocation();

  // This would normally fetch all users and their data
  // For now, we'll show a simple admin interface
  const handleResetData = () => {
    localStorage.clear();
    window.location.reload();
  };

  const handleBackToApp = () => {
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-light-bg p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-6 h-6" />
              <span>Panel Administrativo - MindCare</span>
            </CardTitle>
            <p className="text-sm text-muted-text">
              Vista de administración para gestión del sistema
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium">Usuarios Registrados</h3>
                      <p className="text-sm text-muted-text">Sistema en memoria activa</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium">Registros Emocionales</h3>
                      <p className="text-sm text-muted-text">Datos de seguimiento</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-6 space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium text-yellow-800 mb-2">Información del Sistema</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Los datos se almacenan en memoria durante la sesión</li>
                  <li>• Las notificaciones por email están configuradas con SendGrid</li>
                  <li>• El código maestro permite reiniciar completamente el sistema</li>
                </ul>
              </div>

              <div className="flex space-x-4">
                <Button onClick={handleBackToApp} className="flex-1">
                  Volver a la aplicación
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={handleResetData}
                  className="flex items-center space-x-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reiniciar sistema</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}