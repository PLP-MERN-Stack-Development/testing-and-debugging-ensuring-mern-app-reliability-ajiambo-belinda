import React from 'react';
import BugsPage from './pages/BugsPage';
import { AuthProvider } from './context/AuthContext';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <BugsPage />
      </div>
    </AuthProvider>
  );
}

export default App;