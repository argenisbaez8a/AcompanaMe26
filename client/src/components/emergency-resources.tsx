import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Phone, MapPin } from "lucide-react";

interface EmergencyResourcesProps {
  onClose: () => void;
}

export default function EmergencyResources({ onClose }: EmergencyResourcesProps) {
  const emergencyContacts = [
    {
      name: "Línea Nacional de Prevención del Suicidio",
      phone: "988",
      description: "Apoyo emocional 24/7",
      type: "crisis",
    },
    {
      name: "Emergencias",
      phone: "911",
      description: "Para crisis médicas inmediatas",
      type: "emergency",
    },
    {
      name: "Línea de Crisis",
      phone: "1-800-273-8255",
      description: "Crisis de salud mental",
      type: "crisis",
    },
  ];

  const mentalHealthCenters = [
    {
      name: "Centro de Salud Mental Norte",
      address: "Calle Principal 123",
      phone: "(555) 123-4567",
      hours: "Lun-Vie: 8:00 AM - 6:00 PM",
    },
    {
      name: "Hospital General - Psiquiatría",
      address: "Av. Salud 456",
      phone: "(555) 987-6543",
      hours: "24 horas",
    },
    {
      name: "Clínica de Bienestar Mental",
      address: "Plaza Central 789",
      phone: "(555) 456-7890",
      hours: "Lun-Sab: 9:00 AM - 5:00 PM",
    },
  ];

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-sm max-h-[80vh] overflow-y-auto">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-dark-text">Recursos de Emergencia</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          <div className="space-y-4">
            {/* Crisis Support */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <h4 className="font-semibold text-emergency mb-2">Crisis Inmediata</h4>
              <p className="text-sm text-red-700 mb-3">
                Si tienes pensamientos de autolesión o suicidio
              </p>
              <div className="space-y-2">
                {emergencyContacts.map((contact, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-dark-text">{contact.name}</p>
                      <p className="text-xs text-muted-text">{contact.description}</p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleCall(contact.phone)}
                      className={
                        contact.type === 'emergency' 
                          ? "bg-emergency hover:bg-emergency/90"
                          : "bg-primary hover:bg-primary/90"
                      }
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      {contact.phone}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Mental Health Centers */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h4 className="font-semibold text-primary mb-2">Centros de Salud Mental</h4>
              <div className="space-y-3">
                {mentalHealthCenters.map((center, index) => (
                  <div key={index} className="border-b border-blue-200 last:border-b-0 pb-3 last:pb-0">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-dark-text">{center.name}</p>
                        <div className="flex items-center text-xs text-muted-text mt-1">
                          <MapPin className="w-3 h-3 mr-1" />
                          {center.address}
                        </div>
                        <p className="text-xs text-muted-text">{center.hours}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCall(center.phone)}
                        className="text-primary border-primary hover:bg-primary hover:text-white"
                      >
                        <Phone className="w-3 h-3 mr-1" />
                        Llamar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Important Notice */}
            <div className="bg-warning/10 border border-warning/20 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-warning rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
                <div>
                  <h4 className="font-medium text-warning text-sm mb-1">Importante</h4>
                  <p className="text-xs text-muted-text">
                    Si estás en peligro inmediato, llama al 911 o dirígete a la sala de emergencias más cercana.
                    No esperes si necesitas ayuda ahora.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Online Resources */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <h4 className="font-semibold text-success mb-2">Recursos en Línea</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="font-medium text-dark-text">Crisis Text Line</p>
                  <p className="text-xs text-muted-text">Envía "HELLO" al 741741</p>
                </div>
                <div>
                  <p className="font-medium text-dark-text">SAMHSA National Helpline</p>
                  <p className="text-xs text-muted-text">1-800-662-4357 (24/7)</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
