import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, AlertTriangle } from "lucide-react";
import { useEffect } from "react";

interface CriticalSupportAlertProps {
  userId: number;
  onClose: () => void;
}

export default function CriticalSupportAlert({ userId, onClose }: CriticalSupportAlertProps) {
  
  // Handle immediate close with escape key
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [onClose]);

  // Simple close handler
  const handleClose = () => {
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50"
      onClick={(e) => {
        // Only close if clicking the backdrop, not the modal itself
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <Card className="w-full max-w-sm border-2 border-red-500 bg-white">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-dark-text">Necesitas Apoyo</h3>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="rounded-full hover:bg-gray-200 focus:bg-gray-200"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="mb-6">
              <p className="text-sm text-muted-text mb-4">
                He detectado que has tenido varios días difíciles seguidos. No estás solo en esto.
              </p>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <h4 className="text-sm font-medium text-red-800 mb-2">
                  🚨 Recursos de Crisis Inmediatos:
                </h4>
                <div className="text-sm text-red-700 space-y-1">
                  <p>• <strong>Línea de Crisis:</strong> 988 (24/7)</p>
                  <p>• <strong>Emergencia:</strong> 911</p>
                  <p>• <strong>Texto de Crisis:</strong> Envía "HOLA" al 741741</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-muted-text">
                Recuerda: Pedir ayuda es un acto de valentía, no de debilidad
              </p>
              
              <div className="flex flex-col space-y-2">
                <Button
                  size="sm"
                  onClick={handleClose}  
                  className="text-sm w-full bg-primary hover:bg-primary/90"
                >
                  Entiendo - Cerrar
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClose}
                  className="text-sm w-full"
                >
                  Hablaré con alguien
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}