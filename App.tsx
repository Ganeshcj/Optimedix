
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppState, User, Patient, ScreeningResult } from './types';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import PatientForm from './components/PatientForm';
import ScreeningView from './components/ScreeningView';
import ReportView from './components/ReportView';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('netra_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [patients, setPatients] = useState<Patient[]>([]);
  const [results, setResults] = useState<ScreeningResult[]>([]);
  const [lang, setLang] = useState<'EN' | 'HI'>('EN');

  useEffect(() => {
    if (user) {
      localStorage.setItem('netra_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('netra_user');
    }
  }, [user]);

  const handleLogin = (u: User) => setUser(u);
  const handleLogout = () => setUser(null);

  const addPatient = (p: Patient) => setPatients(prev => [...prev, p]);
  const addResult = (r: ScreeningResult) => setResults(prev => [...prev, r]);

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header user={user} lang={lang} onLangToggle={() => setLang(l => l === 'EN' ? 'HI' : 'EN')} onLogout={handleLogout} />
        
        <main className="flex-grow container mx-auto p-4 md:p-6">
          <Routes>
            <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} lang={lang} />} />
            <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <Signup onSignup={handleLogin} lang={lang} />} />
            
            <Route path="/dashboard" element={user ? <Dashboard lang={lang} user={user} patients={patients} results={results} /> : <Navigate to="/login" />} />
            <Route path="/register-patient" element={user ? <PatientForm lang={lang} onSubmit={addPatient} /> : <Navigate to="/login" />} />
            <Route path="/screen/:patientId" element={user ? <ScreeningView lang={lang} onResult={addResult} /> : <Navigate to="/login" />} />
            <Route path="/report/:resultId" element={user ? <ReportView lang={lang} results={results} patients={patients} /> : <Navigate to="/login" />} />
            
            <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
          </Routes>
        </main>

        <footer className="bg-white border-t p-4 text-center text-gray-500 text-sm">
          &copy; 2024 National Health Mission - Government of India. Powered by Netra AI.
        </footer>
      </div>
    </Router>
  );
};

export default App;
