import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Save } from "lucide-react";
import { LocalStorage } from "@/lib/localStorage";

interface MoodTrackerProps {
  userId: number;
}

export default function MoodTracker({ userId }: MoodTrackerProps) {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const moodOptions = [
    { value: 1, label: "Muy mal", color: "bg-red-500", emoji: "😢" },
    { value: 2, label: "Mal", color: "bg-orange-500", emoji: "😔" },
    { value: 3, label: "Regular", color: "bg-yellow-500", emoji: "😐" },
    { value: 4, label: "Bien", color: "bg-green-500", emoji: "😊" },
    { value: 5, label: "Excelente", color: "bg-green-600", emoji: "😄" },
  ];

  const handleSave = () => {
    if (!selectedMood) {
      toast({
        title: "Selecciona tu estado",
        description: "Por favor selecciona cómo te sientes hoy.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    
    try {
      LocalStorage.addMoodEntry({
        userId,
        mood: selectedMood,
        notes: notes.trim() || undefined,
        date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
      });

      toast({
        title: "Estado guardado",
        description: "Tu estado de ánimo ha sido registrado localmente.",
      });
      
      setSelectedMood(null);
      setNotes("");
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar tu estado de ánimo.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="mb-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-dark-text">
            Diario Emocional
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Mood Scale */}
          <div className="mb-6">
            <p className="text-sm text-muted-text mb-4">Selecciona cómo te sientes:</p>
            <div className="flex justify-between items-center space-x-2">
              {moodOptions.map((option) => (
                <div key={option.value} className="flex flex-col items-center space-y-2">
                  <button
                    onClick={() => setSelectedMood(option.value)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
                      selectedMood === option.value
                        ? `${option.color} ring-2 ring-offset-2 ring-blue-500`
                        : `${option.color} hover:scale-110`
                    }`}
                  >
                    <span className="text-white text-lg">{option.emoji}</span>
                  </button>
                  <span className="text-xs text-muted-text text-center">
                    {option.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="mb-4">
            <Label htmlFor="notes" className="text-sm font-medium text-dark-text mb-2">
              Notas adicionales (opcional)
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="¿Qué ha influido en tu estado de ánimo hoy?"
              rows={3}
              className="resize-none"
            />
          </div>

          <Button
            onClick={handleSave}
            className="w-full"
            disabled={isSaving}
          >
            {isSaving ? (
              "Guardando..."
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Guardar Entrada
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}