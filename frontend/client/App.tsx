import "./global.css";
import React from "react";
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/auth/AuthProvider";
import PWAInstallPrompt from "./components/PWAInstallPrompt";
import Index from "./pages/Index";
import Login from "./pages/Login";
import LoginSuccess from "./pages/LoginSuccess";
import Dashboard from "./pages/Dashboard";
import DAFSession from "./pages/DAFSession";
import SpeechTherapy from "./pages/SpeechTherapy";
import AIPodcast from "./pages/AIPodcast";
import Blog from "./pages/Blog";
import Progress from "./pages/Progress";
import Passages from "./pages/Passages";
import Jams from "./pages/Jams";
import JAM from "./pages/JAM";
import SpeechAnalysis from "./pages/SpeechAnalysis";
import AnalysisDetail from "./pages/AnalysisDetail";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();



export const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/login/success" element={<LoginSuccess />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/daf-session" element={<DAFSession />} />
            <Route path="/speech-therapy" element={<SpeechTherapy />} />
            <Route path="/ai-podcast" element={<AIPodcast />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/passages" element={<Passages />} />
            <Route path="/jams" element={<Jams />} />
            <Route path="/jam" element={<JAM />} />
            <Route path="/speech-analysis" element={<SpeechAnalysis />} />
            <Route path="/analysis/:sessionId" element={<AnalysisDetail />} />
            <Route path="/profile" element={<Profile />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <PWAInstallPrompt />
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);
