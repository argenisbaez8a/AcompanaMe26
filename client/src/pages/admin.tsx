import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Shield, Calendar, Users, BarChart3, Download, Trash2, FileText, Mail, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";

interface MoodEntry {
  id: number;
  userId: number;
  mood: number;
  notes?: string;
  date: string;
}

interface User {
  id: number;
  username: string;
  age: number;
  gender: string;
  guardianEmail?: string;
  guardianName?: string;
  createdAt: string;
}

export default function Admin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: allUsers = [] } = useQuery({
    queryKey: ['/api/users'],
    queryFn: async () => {
      const response = await fetch('/api/users');
      if (!response.ok) return [];
      return response.json();
    }
  });

  const { data: allMoodEntries = [] } = useQuery({
    queryKey: ['/api/mood-entries'],
    queryFn: async () => {
      const response = await fetch('/api/mood-entries');
      if (!response.ok) return [];
      return response.json();
    }
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

  const getMoodBadgeColor = (mood: number) => {
    switch (mood) {
      case 1: return "bg-red-500 hover:bg-red-600 text-white";
      case 2: return "bg-orange-500 hover:bg-orange-600 text-white";
      case 3: return "bg-yellow-500 hover:bg-yellow-600 text-black";
      case 4: return "bg-green-500 hover:bg-green-600 text-white";
      case 5: return "bg-green-600 hover:bg-green-700 text-white";
      default: return "bg-gray-500";
    }
  };

  const handleResetData = async () => {
    if (confirm("¿Estás seguro de que quieres eliminar TODOS los datos? Esta acción no se puede deshacer.")) {
      try {
        await fetch('/api/admin/reset', { method: 'POST' });
        localStorage.clear();
        toast({
          title: "Sistema reiniciado",
          description: "Todos los datos han sido eliminados.",
        });
        setLocation("/");
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudo reiniciar el sistema.",
          variant: "destructive",
        });
      }
    }
  };

  const handleDownloadData = () => {
    const data = {
      users: allUsers,
      moodEntries: allMoodEntries,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AcompañaMe-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Datos exportados",
      description: "Los datos han sido descargados como archivo JSON.",
    });
  };

  // Statistics calculations
  const totalUsers = allUsers.length;
  const totalMoodEntries = allMoodEntries.length;
  const averageMood = totalMoodEntries > 0 
    ? (allMoodEntries.reduce((sum: number, entry: MoodEntry) => sum + entry.mood, 0) / totalMoodEntries).toFixed(1)
    : "0";

  const recentEntries = allMoodEntries.slice(0, 10);

  return (
    <div className="min-h-screen bg-light-bg p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-dark-text">Panel de Administración</h1>
              <p className="text-muted-text">Vista general del sistema AcompañaMe</p>
            </div>
          </div>
          <Button
            onClick={() => setLocation("/")}
            variant="outline"
          >
            Volver al inicio
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Usuarios</CardTitle>
              <Users className="h-4 w-4 text-muted-text" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Registros de Estado</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-text" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalMoodEntries}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Estado Promedio</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-text" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageMood}/5</div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Actividad Reciente</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentEntries.length === 0 ? (
                <p className="text-muted-text text-center py-4">No hay registros de actividad</p>
              ) : (
                recentEntries.map((entry: MoodEntry) => (
                  <div key={entry.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{getMoodEmoji(entry.mood)}</span>
                      <div>
                        <p className="font-medium">Usuario #{entry.userId}</p>
                        <p className="text-sm text-muted-text">
                          {new Date(entry.date).toLocaleDateString('es-ES', { 
                            day: 'numeric', 
                            month: 'long', 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                        {entry.notes && (
                          <p className="text-sm text-muted-text mt-1">"{entry.notes}"</p>
                        )}
                      </div>
                    </div>
                    <Badge className={getMoodBadgeColor(entry.mood)}>
                      {getMoodLabel(entry.mood)}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Acciones del Sistema</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                onClick={handleDownloadData}
                className="flex items-center space-x-2"
                variant="outline"
              >
                <Download className="w-4 h-4" />
                <span>Exportar Datos</span>
              </Button>

              <Button
                onClick={handleResetData}
                className="flex items-center space-x-2"
                variant="destructive"
              >
                <Trash2 className="w-4 h-4" />
                <span>Reiniciar Sistema</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}