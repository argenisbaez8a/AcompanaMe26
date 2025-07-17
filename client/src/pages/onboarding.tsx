import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { InsertUser } from "@shared/schema";

interface OnboardingProps {
  onUserCreated: (userId: number) => void;
}

export default function Onboarding({ onUserCreated }: OnboardingProps) {
  const [formData, setFormData] = useState<InsertUser>({
    name: "",
    age: 0,
    gender: "",
  });
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
    if (!formData.name || !formData.age || !formData.gender) {
      toast({
        title: "Campos requeridos",
        description: "Por favor completa todos los campos.",
        variant: "destructive",
      });
      return;
    }
    createUserMutation.mutate(formData);
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
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="¿Cómo te llamas?"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="age">Edad</Label>
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
              <Label htmlFor="gender">Género</Label>
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
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={createUserMutation.isPending}
            >
              {createUserMutation.isPending ? "Creando perfil..." : "Comenzar mi viaje"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
