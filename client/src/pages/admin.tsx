import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Shield, Calendar, Users, BarChart3, Download, Trash2, FileText, Mail, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { LocalStorage } from "@/lib/localStorage";

interface MoodEntry {
  id: number;
  userId: number;
  mood: number;
  notes?: string;
  date: string;
}

interface User {
  id: number;
  name: string;
  age: number;
  gender: string;
  guardianEmail?: string;
  guardianName?: string;
  createdAt: string;
}

export default function Admin() {
  const [, setLocation] = useLocation();
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [allMoodEntries, setAllMoodEntries] = useState<MoodEntry[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const loadAllData = () => {
      const users = LocalStorage.getAllUsers();
      const moodEntries = LocalStorage.getAllMoodEntries();
      
      setAllUsers(users);
      setAllMoodEntries(moodEntries.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      ));
    };

    loadAllData();
  }, []);

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

  const handleResetData = () => {
    if (confirm("¿Estás seguro de que quieres eliminar TODOS los datos? Esta acción no se puede deshacer.")) {
      LocalStorage.clearAllData();
      toast({
        title: "Sistema reiniciado",
        description: "Todos los datos han sido eliminados.",
      });
      setLocation("/login");
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

  const getUserById = (userId: number) => {
    return allUsers.find(user => user.id === userId) || null;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCriticalEntries = () => {
    return allMoodEntries.filter(entry => entry.mood <= 2);
  };

  const getEntriesWithNotes = () => {
    return allMoodEntries.filter(entry => entry.notes && entry.notes.trim().length > 0);
  };

  return (
    <div className="min-h-screen bg-light-bg p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-6 h-6 text-primary" />
              <span>Panel Administrativo - AcompañaMe</span>
            </CardTitle>
            <p className="text-sm text-muted-text">
              Acceso completo al diario emocional y datos del sistema (Código maestro: 23092309)
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium">Usuarios</h3>
                      <p className="text-2xl font-bold text-primary">{allUsers.length}</p>
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
                      <h3 className="font-medium">Registros</h3>
                      <p className="text-2xl font-bold text-secondary">{allMoodEntries.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-warning rounded-full flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium">Críticos</h3>
                      <p className="text-2xl font-bold text-warning">{getCriticalEntries().length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <Mail className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium">Con Notas</h3>
                      <p className="text-2xl font-bold text-blue-500">{getEntriesWithNotes().length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex space-x-4">
              <Button onClick={() => setLocation("/")} className="flex-1">
                Volver a la aplicación
              </Button>
              <Button 
                onClick={handleDownloadData}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Exportar datos</span>
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleResetData}
                className="flex items-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Reiniciar sistema</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Users Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Usuarios Registrados</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {allUsers.length === 0 ? (
              <p className="text-muted-text text-center py-4">No hay usuarios registrados</p>
            ) : (
              <div className="space-y-4">
                {allUsers.map((user) => (
                  <Card key={user.id} className="border-l-4 border-l-primary">
                    <CardContent className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium">{user.name}</h4>
                          <p className="text-sm text-muted-text">
                            {user.age} años • {user.gender}
                          </p>
                          <p className="text-xs text-muted-text">
                            Registrado: {formatDate(user.createdAt)}
                          </p>
                        </div>
                        <div>
                          {user.guardianName && (
                            <div>
                              <p className="text-sm font-medium">Tutor/Cuidador:</p>
                              <p className="text-sm">{user.guardianName}</p>
                              {user.guardianEmail && (
                                <p className="text-xs text-muted-text">{user.guardianEmail}</p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Detailed Mood Entries */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5" />
              <span>Diario Emocional Completo</span>
            </CardTitle>
            <p className="text-sm text-muted-text">
              Todos los registros emocionales con notas detalladas
            </p>
          </CardHeader>
          <CardContent>
            {allMoodEntries.length === 0 ? (
              <p className="text-muted-text text-center py-8">No hay registros emocionales</p>
            ) : (
              <div className="space-y-4">
                {allMoodEntries.map((entry) => {
                  const user = getUserById(entry.userId);
                  return (
                    <Card key={entry.id} className={`border-l-4 ${
                      entry.mood <= 2 ? 'border-l-red-500 bg-red-50' : 
                      entry.mood === 3 ? 'border-l-yellow-500 bg-yellow-50' : 
                      'border-l-green-500 bg-green-50'
                    }`}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{getMoodEmoji(entry.mood)}</span>
                            <div>
                              <div className="flex items-center space-x-2">
                                <Badge className={getMoodBadgeColor(entry.mood)}>
                                  {getMoodLabel(entry.mood)} ({entry.mood}/5)
                                </Badge>
                                {entry.mood <= 2 && (
                                  <Badge variant="destructive" className="text-xs">
                                    ⚠️ CRÍTICO
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm font-medium mt-1">
                                {user ? user.name : `Usuario ID: ${entry.userId}`}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">{formatDate(entry.date)}</p>
                            <p className="text-xs text-muted-text">ID: {entry.id}</p>
                          </div>
                        </div>
                        
                        {entry.notes && entry.notes.trim().length > 0 && (
                          <div className="mt-3 p-3 bg-white rounded-lg border">
                            <p className="text-xs font-medium text-muted-text mb-1">
                              📝 NOTAS ADICIONALES:
                            </p>
                            <p className="text-sm">{entry.notes}</p>
                          </div>
                        )}
                        
                        {!entry.notes && (
                          <p className="text-xs text-muted-text italic">
                            Sin notas adicionales
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}