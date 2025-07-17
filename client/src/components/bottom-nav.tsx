import { Home, TrendingUp, Dumbbell, User } from "lucide-react";
import { Link, useLocation } from "wouter";

interface BottomNavProps {
  currentPage: string;
}

export default function BottomNav({ currentPage }: BottomNavProps) {
  const [location] = useLocation();

  const navItems = [
    { path: "/", icon: Home, label: "Inicio", id: "home" },
    { path: "/progress", icon: TrendingUp, label: "Progreso", id: "progress" },
    { path: "/exercises", icon: Dumbbell, label: "Ejercicios", id: "exercises" },
    { path: "/profile", icon: User, label: "Perfil", id: "profile" },
  ];

  return (
    <nav className="bg-white border-t border-gray-100 px-4 py-2 sticky bottom-0">
      <div className="max-w-md mx-auto flex justify-around">
        {navItems.map(({ path, icon: Icon, label, id }) => {
          const isActive = currentPage === id;
          
          return (
            <Link key={id} href={path}>
              <button
                className={`flex flex-col items-center space-y-1 py-2 px-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-primary bg-opacity-10 text-primary"
                    : "text-muted-text hover:bg-gray-100"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{label}</span>
              </button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
