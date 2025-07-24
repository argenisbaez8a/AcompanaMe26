import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, Key, RotateCcw } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import type { InsertUser } from "@shared/schema";

interface LoginProps {
  onUserCreated: (userId: number) => void;
}

interface UserFormData {
  username: string;
  age: number;
  gender: string;
  guardianEmail?: string;
  guardianName?: string;
  personalEmail: string;
}

export default function Login({ onUserCreated }: LoginProps) {
  const [formData, setFormData] = useState<UserFormData>({
    username: "",
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
    mutationFn: async (userData: InsertUser) => {
      const response = await fetch(`/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      if (!response.ok) {
        throw new Error("Failed to create user");
      }
      return response.json();
    },
    onSuccess: (user) => {
      localStorage.setItem("mindcare_current_user", user.id.toString());
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
    if (!formData.username || !formData.age || !formData.gender || !formData.personalEmail) {
      toast({
        title: "Campos requeridos",
        description: "Por favor completa todos los campos obligatorios.",
        variant: "destructive",
      });
      return;
    }

    // Prepare user data for submission
    const userData: InsertUser = {
      username: formData.username,
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
      localStorage.removeItem("mindcare_current_user");
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
          <CardTitle className="text-2xl text-dark-text">AcompañaMe</CardTitle>
          <p className="text-sm text-muted-text mt-2">
            Tu compañero de bienestar emocional
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username">Nombre de usuario *</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="¿Cómo te llamas?"
                required
                disabled={createUserMutation.isPending}
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
                disabled={createUserMutation.isPending}
              />
            </div>

            <div>
              <Label htmlFor="gender">Género *</Label>
              <Select 
                value={formData.gender} 
                onValueChange={(value) => setFormData({ ...formData, gender: value })}
                disabled={createUserMutation.isPending}
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
                placeholder="tu@email.com"
                required
                disabled={createUserMutation.isPending}
              />
            </div>

            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-muted-text mb-4">
                <strong>Opcional:</strong> Información de contacto para emergencias
              </p>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="guardianName">Nombre del tutor/padre</Label>
                  <Input
                    id="guardianName"
                    value={formData.guardianName}
                    onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                    placeholder="Nombre del tutor o padre"
                    disabled={createUserMutation.isPending}
                  />
                </div>

                <div>
                  <Label htmlFor="guardianEmail">Email del tutor/padre</Label>
                  <Input
                    id="guardianEmail"
                    type="email"
                    value={formData.guardianEmail}
                    onChange={(e) => setFormData({ ...formData, guardianEmail: e.target.value })}
                    placeholder="tutor@email.com"
                    disabled={createUserMutation.isPending}
                  />
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full mt-6"
              disabled={createUserMutation.isPending}
            >
              {createUserMutation.isPending ? "Creando perfil..." : "Crear mi perfil"}
            </Button>
          </form>

          {/* Master Code Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Key className="w-4 h-4 text-muted-text" />
                <span className="text-sm text-muted-text">Acceso administrativo</span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowMasterCodeSection(!showMasterCodeSection)}
                className="text-xs"
              >
                {showMasterCodeSection ? "Ocultar" : "Mostrar"}
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
                    placeholder="Ingresa el código maestro"
                    className="text-sm"
                  />
                </div>
                <Button
                  type="button"
                  onClick={handleMasterCodeAccess}
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                >
                  <RotateCcw className="w-3 h-3 mr-2" />
                  Acceso administrativo
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}