import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import type { InsertUser } from "@shared/schema";

interface OnboardingProps {
  onUserCreated: (userId: number) => void;
}

interface UserFormData {
  username: string;
  age: number;
  gender: string;
  guardianEmail?: string;
  guardianName?: string;
}

export default function Onboarding({ onUserCreated }: OnboardingProps) {
  const [formData, setFormData] = useState<UserFormData>({
    username: "",
    age: 0,
    gender: "",
    guardianEmail: "",
    guardianName: "",
  });
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const createUser = useMutation({
    mutationFn: async (data: InsertUser) => {
      const response = await fetch(`/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Failed to create user");
      }
      return response.json();
    },
    onSuccess: (user) => {
      localStorage.setItem('mindcare_current_user', user.id.toString());
      toast({
        title: "¡Bienvenido!",
        description: "Tu perfil ha sido creado exitosamente.",
      });
      onUserCreated(user.id);
      setLocation("/home");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo crear tu perfil.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username || !formData.age || !formData.gender) {
      toast({
        title: "Campos requeridos",
        description: "Por favor completa todos los campos obligatorios.",
        variant: "destructive",
      });
      return;
    }

    if (formData.age < 1 || formData.age > 120) {
      toast({
        title: "Edad inválida",
        description: "Por favor ingresa una edad válida.",
        variant: "destructive",
      });
      return;
    }

    createUser.mutate({
      username: formData.username.trim(),
      age: formData.age,
      gender: formData.gender,
      guardianEmail: formData.guardianEmail?.trim() || undefined,
      guardianName: formData.guardianName?.trim() || undefined,
    });
  };

  return (
    <div className="min-h-screen bg-light-bg flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl text-dark-text">Bienvenido a AcompañaMe</CardTitle>
          <p className="text-sm text-muted-text mt-2">
            Tu compañero de bienestar emocional personalizado
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
                disabled={createUser.isPending}
              />
            </div>

            <div>
              <Label htmlFor="age">Edad *</Label>
              <Input
                id="age"
                type="number"
                min="1"
                max="120"
                value={formData.age || ""}
                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
                placeholder="Tu edad"
                required
                disabled={createUser.isPending}
              />
            </div>

            <div>
              <Label htmlFor="gender">Género *</Label>
              <Select
                value={formData.gender}
                onValueChange={(value) => setFormData({ ...formData, gender: value })}
                disabled={createUser.isPending}
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
                    disabled={createUser.isPending}
                  />
                </div>

                <div>
                  <Label htmlFor="guardianEmail">Email del tutor/padre</Label>
                  <Input
                    id="guardianEmail"
                    type="email"
                    value={formData.guardianEmail}
                    onChange={(e) => setFormData({ ...formData, guardianEmail: e.target.value })}
                    placeholder="email@ejemplo.com"
                    disabled={createUser.isPending}
                  />
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full mt-6"
              disabled={createUser.isPending}
            >
              {createUser.isPending ? "Creando perfil..." : "Crear mi perfil"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}