import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Phone, Heart, MessageCircle, AlertTriangle } from "lucide-react";

interface CriticalSupportAlertProps {
  onClose: () => void;
}

export default function CriticalSupportAlert({ onClose }: CriticalSupportAlertProps) {
  const supportOptions = [
    {
      title: "Llama a un amigo cercano",
      description: "Contacta a alguien en quien confíes",
      icon: MessageCircle,
      color: "bg-blue-500",
      action: "Abrir contactos"
    },
    {
      title: "Llama a un familiar",
      description: "Padres, hermanos o familiares cercanos",
      icon: Heart,
      color: "bg-green-500",
      action: "Contactar familia"
    },
    {
      title: "Llama a tu tutor/cuidador",
      description: "Persona responsable de tu bienestar",
      icon: Phone,
      color: "bg-purple-500",
      action: "Contactar tutor"
    }
  ];

  const handleContactOption = (option: string) => {
    // Open phone contacts or dialer
    if (navigator.userAgent.includes('Mobile')) {
      window.location.href = 'tel:';
    } else {
      // For desktop, show a message
      alert(`Abre tu aplicación de contactos para ${option.toLowerCase()}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-sm border-2 border-warning animate-pulse">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-warning rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-dark-text">Necesitas Apoyo</h3>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="rounded-full"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 mb-6">
              <p className="text-sm text-warning font-medium mb-2">
                ⚠️ Tu estado emocional ha mostrado un patrón preocupante
              </p>
              <p className="text-xs text-muted-text">
                Detectamos más de 3 registros que van de regular a muy mal. 
                Es importante que busques apoyo de personas cercanas.
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <h4 className="font-medium text-dark-text text-sm">
                Te sugerimos contactar a:
              </h4>
              
              {supportOptions.map((option, index) => {
                const IconComponent = option.icon;
                return (
                  <Card key={index} className="p-3 hover:bg-gray-50 cursor-pointer transition-colors">
                    <CardContent className="p-0">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 ${option.color} rounded-full flex items-center justify-center`}>
                          <IconComponent className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="text-sm font-medium text-dark-text">
                            {option.title}
                          </p>
                          <p className="text-xs text-muted-text">
                            {option.description}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleContactOption(option.action)}
                          className="text-xs"
                        >
                          {option.action}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-emergency flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-emergency mb-1">
                    ¿Necesitas ayuda inmediata?
                  </p>
                  <p className="text-xs text-red-600 mb-2">
                    Si tienes pensamientos de lastimarte, llama ahora:
                  </p>
                  <Button
                    size="sm"
                    onClick={() => window.location.href = 'tel:988'}
                    className="bg-emergency hover:bg-emergency/90 text-white"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Línea de Crisis 988
                  </Button>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-xs text-muted-text mb-3">
                Recuerda: Pedir ayuda es un acto de valentía, no de debilidad
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
                className="text-xs"
              >
                Entiendo, cerrar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}