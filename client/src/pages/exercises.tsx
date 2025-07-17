import { Heart, Wind, Leaf, PlayCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BottomNav from "@/components/bottom-nav";
import BreathingExercise from "@/components/breathing-exercise";
import Meditation from "@/components/meditation";
import { useState } from "react";

interface ExercisesProps {
  userId: number;
}

export default function Exercises({ userId }: ExercisesProps) {
  const [showBreathing, setShowBreathing] = useState(false);
  const [showMeditation, setShowMeditation] = useState(false);

  const exercises = [
    {
      id: 1,
      title: "Respiración 4-7-8",
      description: "Técnica de respiración para reducir el estrés y la ansiedad",
      duration: "2-5 minutos",
      difficulty: "Fácil",
      icon: Wind,
      color: "bg-blue-500",
      benefits: [
        "Reduce el estrés inmediato",
        "Ayuda a conciliar el sueño",
        "Calma la mente ansiosa",
        "Fácil de hacer en cualquier lugar"
      ],
      instructions: [
        "Exhala completamente",
        "Inhala por la nariz durante 4 segundos",
        "Mantén la respiración por 7 segundos",
        "Exhala por la boca durante 8 segundos",
        "Repite el ciclo 3-4 veces"
      ],
      action: () => setShowBreathing(true)
    },
    {
      id: 2,
      title: "Meditación Mindfulness",
      description: "Meditación guiada para el momento presente",
      duration: "5 minutos",
      difficulty: "Principiante",
      icon: Leaf,
      color: "bg-green-500",
      benefits: [
        "Mejora la concentración",
        "Reduce la ansiedad",
        "Aumenta la autoconciencia",
        "Promueve la calma interior"
      ],
      instructions: [
        "Encuentra una posición cómoda",
        "Cierra los ojos suavemente",
        "Enfócate en tu respiración",
        "Observa tus pensamientos sin juzgar",
        "Regresa tu atención a la respiración"
      ],
      action: () => setShowMeditation(true)
    }
  ];

  return (
    <div className="min-h-screen bg-light-bg flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100 px-4 py-3">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-dark-text">Ejercicios</h1>
              <p className="text-sm text-muted-text">Herramientas para tu bienestar</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-md mx-auto w-full px-4 py-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-6 text-white mb-8">
          <h2 className="text-xl font-semibold mb-2">Encuentra tu Calma</h2>
          <p className="text-blue-100 text-sm">
            Ejercicios diseñados para ayudarte a relajarte y encontrar equilibrio
          </p>
        </div>

        {/* Exercise Cards */}
        <div className="space-y-6">
          {exercises.map((exercise) => {
            const IconComponent = exercise.icon;
            return (
              <Card key={exercise.id} className="overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`w-12 h-12 ${exercise.color} rounded-full flex items-center justify-center`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-dark-text">{exercise.title}</CardTitle>
                      <p className="text-sm text-muted-text">{exercise.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-muted-text">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{exercise.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>{exercise.difficulty}</span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  {/* Benefits */}
                  <div className="mb-4">
                    <h4 className="font-semibold text-dark-text mb-2">Beneficios:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {exercise.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm text-muted-text">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="mb-4">
                    <h4 className="font-semibold text-dark-text mb-2">Cómo hacerlo:</h4>
                    <ol className="space-y-1">
                      {exercise.instructions.map((instruction, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="text-sm text-primary font-medium">{index + 1}.</span>
                          <span className="text-sm text-muted-text">{instruction}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Action Button */}
                  <Button 
                    onClick={exercise.action}
                    className="w-full"
                    size="lg"
                  >
                    <PlayCircle className="w-5 h-5 mr-2" />
                    Comenzar Ejercicio
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Tips Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg text-dark-text">Consejos para Practicar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-yellow-600 text-sm">💡</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-dark-text">Encuentra el momento adecuado</p>
                  <p className="text-xs text-muted-text">Practica cuando te sientas estresado o antes de dormir</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 text-sm">🧘</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-dark-text">Crea un espacio tranquilo</p>
                  <p className="text-xs text-muted-text">Busca un lugar silencioso donde puedas concentrarte</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 text-sm">⏰</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-dark-text">Practica regularmente</p>
                  <p className="text-xs text-muted-text">La consistencia es clave para obtener mejores resultados</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Bottom Navigation */}
      <BottomNav currentPage="exercises" />

      {/* Modals */}
      {showBreathing && (
        <BreathingExercise 
          userId={userId} 
          onClose={() => setShowBreathing(false)} 
        />
      )}
      {showMeditation && (
        <Meditation 
          userId={userId} 
          onClose={() => setShowMeditation(false)} 
        />
      )}
    </div>
  );
}
