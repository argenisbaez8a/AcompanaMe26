import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { LocalStorage } from "@/lib/localStorage";

interface OnboardingProps {
  onUserCreated: (userId: number) => void;
}

interface UserFormData {
  name: string;
  age: number;
  gender: string;
  guardianEmail?: string;
  guardianName?: string;
}

export default function Onboarding({ onUserCreated }: OnboardingProps) {
  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    age: 0,
    gender: "",
    guardianEmail: "",
    guardianName: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.age || !formData.gender) {
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

    setIsSubmitting(true);

    try {
      const user = LocalStorage.addUser({
        name: formData.name.trim(),
        age: formData.age,
        gender: formData.gender,
        guardianEmail: formData.guardianEmail?.trim() || undefined,
        guardianName: formData.guardianName?.trim() || undefined,
      });

      // Set current user session
      LocalStorage.setCurrentUser(user.id);
      
      toast({
        title: "¡Bienvenido!",
        description: "Tu perfil ha sido creado exitosamente y guardado localmente.",
      });
      
      onUserCreated(user.id);
      setLocation("/");
    } catch (error) {
      console.error('Error creating user:', error);
      toast({
        title: "Error",
        description: "No se pudo crear tu perfil. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-light-bg flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl text-dark-text">Bienvenido a AcompañaMe </CardTitle>
          <p className="text-sm text-muted-text mt-2">
            Tu compañero de bienestar emocional personalizado
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Nombre *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="¿Cómo te llamas?"
                required
                disabled={isSubmitting}
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
                placeholder="¿Cuántos años tienes?"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <Label htmlFor="gender">Género *</Label>
              <Select 
                value={formData.gender} 
                onValueChange={(value) => setFormData({ ...formData, gender: value })}
                disabled={isSubmitting}
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
              <h4 className="font-medium text-sm text-dark-text mb-3">
                Información del Tutor/Cuidador (Opcional)
              </h4>
              <p className="text-xs text-muted-text mb-4">
                Si eres menor de edad o deseas que alguien sea notificado en caso de patrones preocupantes
              </p>
              
              <div className="space-y-3">
                <div>
                  <Label htmlFor="guardianName">Nombre del tutor/cuidador</Label>
                  <Input
                    id="guardianName"
                    value={formData.guardianName || ""}
                    onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                    placeholder="Nombre del padre/madre/tutor"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <Label htmlFor="guardianEmail">Email del tutor/cuidador</Label>
                  <Input
                    id="guardianEmail"
                    type="email"
                    value={formData.guardianEmail || ""}
                    onChange={(e) => setFormData({ ...formData, guardianEmail: e.target.value })}
                    placeholder="ejemplo@correo.com"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creando perfil..." : "Comenzar mi viaje"}
              </Button>
            </div>

            <div className="text-center">
              <p className="text-xs text-muted-text">
                Tus datos se guardan de forma segura en tu dispositivo
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}