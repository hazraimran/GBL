import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '../context/AuthProvider';
import GameProvider from '../context/GameProvider';
import { AnalyticsProvider } from '../context/AnalyticsContext';
import Landing from '../pages/Landing';
import GameScene from '../pages/GameScene';
import Levels from '../pages/Levels';
import LevelCreator from '../pages/LevelCreator';
import { Toaster } from "../components/ui/toaster";
import JumpConnector from '../components/InstructionPanel/JumpConnector';
import ButtonScene from '../components/ButtonScene';
import GameContext from '../context/GameContext';
import AudioPlayer from '../components/AudioPlayer';
import AdminNav from '../components/admin/AdminNav';

// Main game wrapper component
const GameWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentScene } = React.useContext(GameContext);

  const Modal: React.FC = () => {
    const { showModal } = React.useContext(GameContext);
    return <div
      className={`fixed inset-0 z-[1000] h-[100vh] w-[100vw] transition-opacity duration-500 ease-linear ${showModal ? 'backdrop-blur-sm' : ''}`}
      style={{
        opacity: showModal ? 1 : 0,
        pointerEvents: showModal ? 'auto' : 'none',
      }}
    />
  };

  return (
    <div className='h-[100vh] w-[100vw] relative'>
      {children}
      <Toaster />
      <JumpConnector />
      <ButtonScene />
      <Modal />
    </div>
  );
};

// Admin route component - defined inside provider hierarchy
const AdminLevelCreator: React.FC = () => {
  const { user } = useAuth();
  
  // Check if user is admin
  const isAdmin = user?.email?.includes('admin') || user?.email?.includes('creator');
  
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <>
      <AdminNav currentPage="level-creator" />
      <LevelCreator />
    </>
  );
};

const AppRouter: React.FC = () => {
  return (
    <AuthProvider>
      <GameProvider>
        <AnalyticsProvider>
          <AudioPlayer />
          <Routes>
            {/* Admin Routes */}
            <Route 
              path="/admin/level-creator" 
              element={<AdminLevelCreator />}
            />
            
            {/* Main Game Routes */}
            <Route 
              path="/" 
              element={
                <GameWrapper>
                  <AdminNav currentPage="game" />
                  <Landing />
                  <GameScene />
                  <Levels />
                </GameWrapper>
              } 
            />
            
            {/* Redirect any unknown routes to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnalyticsProvider>
      </GameProvider>
    </AuthProvider>
  );
};

export default AppRouter;
