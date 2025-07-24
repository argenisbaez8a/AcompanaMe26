import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import Login from "@/pages/login";
import Admin from "@/pages/admin";
import Progress from "@/pages/progress";
import Exercises from "@/pages/exercises";
import Profile from "@/pages/profile";
import NotFound from "@/pages/not-found";
import { useState, useEffect } from "react";

function Router() {
  const [currentUser, setCurrentUser] = useState<number | null>(null);
  
  useEffect(() => {
    const storedUserId = localStorage.getItem("mindcare_current_user");
    if (storedUserId) {
      setCurrentUser(parseInt(storedUserId));
    }
  }, []);

  return (
    <Switch>
      <Route path="/admin">
        <Admin />
      </Route>
      <Route path="/">
        {currentUser ? <Home userId={currentUser} /> : <Login onUserCreated={setCurrentUser} />}
      </Route>
      <Route path="/home">
        {currentUser ? <Home userId={currentUser} /> : <Login onUserCreated={setCurrentUser} />}
      </Route>
      <Route path="/progress">
        {currentUser ? <Progress userId={currentUser} /> : <Login onUserCreated={setCurrentUser} />}
      </Route>
      <Route path="/exercises">
        {currentUser ? <Exercises userId={currentUser} /> : <Login onUserCreated={setCurrentUser} />}
      </Route>
      <Route path="/profile">
        {currentUser ? <Profile userId={currentUser} /> : <Login onUserCreated={setCurrentUser} />}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-light-bg">
          <Toaster />
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
