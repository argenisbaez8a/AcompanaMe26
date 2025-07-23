import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, Key, RotateCcw } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { InsertUser } from "@shared/schema";

interface LoginProps {
  onUserCreated: (userId: number) => void;
}

export default function Login({ onUserCreated }: LoginProps) {
  const [formData, setFormData] = useState<InsertUser & { personalEmail: string }>({
    name: "",
    age: 0,
    gender: "",
    guardianEmail: "",
    guardianName: "",
    personalEmail: "",
  });
  const [masterCode, setMasterCode] = useState("");
  const [showMasterCodeSection, setShowMasterCodeSection] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const createUserMutation = useMutation({
    mutationFn: (userData: InsertUser) => apiRequest("POST", "/api/users", userData),
    onSuccess: async (response) => {
      const user = await response.json();
      localStorage.setItem("currentUserId", user.id.toString());
      onUserCreated(user.id);
      toast({
        title: "¡Bienvenido!",
        description: "Tu perfil ha sido creado exitosamente.",
      });
      setLocation("/");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo crear tu perfil. Inténtalo de nuevo.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.age || !formData.gender || !formData.personalEmail) {
      toast({
        title: "Campos requeridos",
        description: "Por favor completa todos los campos obligatorios.",
        variant: "destructive",
      });
      return;
    }

    // Prepare user data for submission
    const userData: InsertUser = {
      name: formData.name,
      age: formData.age,
      gender: formData.gender,
      guardianEmail: formData.guardianEmail || undefined,
      guardianName: formData.guardianName || undefined,
    };

    createUserMutation.mutate(userData);
  };

  const handleMasterCodeAccess = () => {
    if (masterCode === "23092309") {
      // Clear any existing user data and restart
      localStorage.removeItem("currentUserId");
      toast({
        title: "Acceso autorizado",
        description: "Reiniciando el diario emocional...",
      });
      setLocation("/admin");
    } else {
      toast({
        title: "Código incorrecto",
        description: "El código maestro ingresado no es válido.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-light-bg flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl text-dark-text">MindCare</CardTitle>
          <p className="text-sm text-muted-text mt-2">
            Tu compañero de bienestar emocional
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Nombre completo *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="¿Cómo te llamas?"
                required
              />
            </div>

            <div>
              <Label htmlFor="age">Edad *</Label>
              <Input
                id="age"
                type="number"
                value={formData.age || ""}
                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
                placeholder="Tu edad"
                min="13"
                max="120"
                required
              />
            </div>

            <div>
              <Label htmlFor="gender">Género *</Label>
              <Select 
                value={formData.gender} 
                onValueChange={(value) => setFormData({ ...formData, gender: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona tu género" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="masculino">Masculino</SelectItem>
                  <SelectItem value="femenino">Femenino</SelectItem>
                  <SelectItem value="otro">Otro</SelectItem>
                  <SelectItem value="prefiero-no-decir">Prefiero no decir</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="personalEmail">Tu correo electrónico *</Label>
              <Input
                id="personalEmail"
                type="email"
                value={formData.personalEmail}
                onChange={(e) => setFormData({ ...formData, personalEmail: e.target.value })}
                placeholder="tu-correo@ejemplo.com"
                required
              />
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-200">
              <div className="text-center">
                <h3 className="text-sm font-medium text-dark-text mb-2">Contacto de emergencia (Opcional)</h3>
                <p className="text-xs text-muted-text mb-4">
                  Para notificar en caso de detectar patrones preocupantes
                </p>
              </div>
              
              <div>
                <Label htmlFor="guardianName">Nombre del tutor/padre</Label>
                <Input
                  id="guardianName"
                  value={formData.guardianName || ""}
                  onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                  placeholder="Nombre completo"
                />
              </div>
              
              <div>
                <Label htmlFor="guardianEmail">Email del tutor/padre</Label>
                <Input
                  id="guardianEmail"
                  type="email"
                  value={formData.guardianEmail || ""}
                  onChange={(e) => setFormData({ ...formData, guardianEmail: e.target.value })}
                  placeholder="correo@ejemplo.com"
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={createUserMutation.isPending}
            >
              {createUserMutation.isPending ? "Creando perfil..." : "Comenzar mi diario"}
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="text-center mb-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowMasterCodeSection(!showMasterCodeSection)}
                className="text-xs text-muted-text hover:text-dark-text"
              >
                <Key className="w-3 h-3 mr-1" />
                Acceso administrativo
              </Button>
            </div>
            
            {showMasterCodeSection && (
              <div className="space-y-3">
                <div>
                  <Label htmlFor="masterCode" className="text-xs">Código maestro</Label>
                  <Input
                    id="masterCode"
                    type="password"
                    value={masterCode}
                    onChange={(e) => setMasterCode(e.target.value)}
                    placeholder="Ingresa el código"
                    className="text-sm"
                  />
                </div>
                <Button 
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleMasterCodeAccess}
                  className="w-full text-xs"
                >
                  <RotateCcw className="w-3 h-3 mr-1" />
                  Acceder y reiniciar diario
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}