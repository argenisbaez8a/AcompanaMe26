import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, XCircle, CheckCircle, AlertTriangle } from "lucide-react";

interface DepressionInfoProps {
  onClose: () => void;
}

export default function DepressionInfo({ onClose }: DepressionInfoProps) {
  const myths = [
    "La depresión es solo tristeza",
    "Solo afecta a personas débiles",
    "Se puede superar solo con voluntad",
    "Es una fase que pasará sola",
    "Los medicamentos cambian tu personalidad",
  ];

  const realities = [
    "Es una enfermedad médica real con síntomas físicos y mentales",
    "Puede afectar a cualquier persona, independientemente de su fortaleza",
    "Requiere tratamiento profesional y es completamente tratable",
    "Sin tratamiento, los síntomas pueden empeorar",
    "Los medicamentos ayudan a restaurar el equilibrio químico del cerebro",
  ];

  const warningSignals = [
    "Tristeza persistente por más de 2 semanas",
    "Pérdida de interés en actividades antes placenteras",
    "Cambios significativos en el sueño o apetito",
    "Fatiga o pérdida de energía",
    "Dificultad para concentrarse o tomar decisiones",
    "Sentimientos de inutilidad o culpa excesiva",
    "Pensamientos de muerte o suicidio",
    "Síntomas físicos sin causa médica aparente",
  ];

  const treatmentOptions = [
    {
      title: "Psicoterapia",
      description: "Terapia cognitivo-conductual, interpersonal o psicodinámica",
    },
    {
      title: "Medicamentos",
      description: "Antidepresivos prescritos por un profesional",
    },
    {
      title: "Cambios de estilo de vida",
      description: "Ejercicio regular, alimentación saludable, sueño adecuado",
    },
    {
      title: "Apoyo social",
      description: "Grupos de apoyo, familia y amigos",
    },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-sm max-h-[80vh] overflow-y-auto">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-dark-text">Sobre la Depresión</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          <div className="space-y-6">
            {/* Myths */}
            <div>
              <h4 className="font-semibold text-dark-text mb-3 flex items-center">
                <XCircle className="w-5 h-5 text-red-500 mr-2" />
                Mitos Comunes
              </h4>
              <div className="space-y-2">
                {myths.map((myth, index) => (
                  <div key={index} className="bg-red-50 border-l-4 border-red-400 p-3 rounded-r-lg">
                    <p className="text-sm text-red-700">{myth}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Realities */}
            <div>
              <h4 className="font-semibold text-dark-text mb-3 flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                Realidades
              </h4>
              <div className="space-y-2">
                {realities.map((reality, index) => (
                  <div key={index} className="bg-green-50 border-l-4 border-green-400 p-3 rounded-r-lg">
                    <p className="text-sm text-green-700">{reality}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Warning Signals */}
            <div>
              <h4 className="font-semibold text-dark-text mb-3 flex items-center">
                <AlertTriangle className="w-5 h-5 text-warning mr-2" />
                Señales de Alerta
              </h4>
              <div className="space-y-2">
                {warningSignals.map((signal, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-warning rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-muted-text">{signal}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Treatment Options */}
            <div>
              <h4 className="font-semibold text-dark-text mb-3">Opciones de Tratamiento</h4>
              <div className="space-y-3">
                {treatmentOptions.map((option, index) => (
                  <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <h5 className="font-medium text-primary text-sm mb-1">{option.title}</h5>
                    <p className="text-xs text-muted-text">{option.description}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Important Notice */}
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">i</span>
                </div>
                <div>
                  <h4 className="font-medium text-purple-700 text-sm mb-1">Busca Ayuda Profesional</h4>
                  <p className="text-xs text-purple-600">
                    Si experimentas varios de estos síntomas durante más de dos semanas, 
                    es importante consultar con un profesional de salud mental. 
                    La depresión es tratable y la recuperación es posible.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
