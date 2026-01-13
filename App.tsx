
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { User, Patient, ScreeningResult } from './types';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import PatientForm from './components/PatientForm';
import ScreeningView from './components/ScreeningView';
import ReportView from './components/ReportView';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('optimedix_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [lang, setLang] = useState<'EN' | 'HI'>('EN');

  useEffect(() => {
    if (user) {
      localStorage.setItem('optimedix_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('optimedix_user');
    }
  }, [user]);

  const handleLogin = (u: User) => setUser(u);
  const handleLogout = () => setUser(null);

  const addPatient = (p: Patient) => {
    const existing = JSON.parse(localStorage.getItem('opti_patients') || '[]');
    localStorage.setItem('opti_patients', JSON.stringify([...existing, p]));
  };

  const addResult = (r: ScreeningResult) => {
    const existing = JSON.parse(localStorage.getItem('opti_results') || '[]');
    localStorage.setItem('opti_results', JSON.stringify([...existing, r]));
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header user={user} lang={lang} onLangToggle={() => setLang(l => l === 'EN' ? 'HI' : 'EN')} onLogout={handleLogout} />
        
        <main className="flex-grow container mx-auto p-4 md:p-6">
          <Routes>
            <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} lang={lang} />} />
            <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <Signup onSignup={handleLogin} lang={lang} />} />
            
            <Route path="/dashboard" element={user ? <Dashboard lang={lang} user={user} /> : <Navigate to="/login" />} />
            <Route path="/register-patient" element={user ? <PatientForm lang={lang} onSubmit={addPatient} /> : <Navigate to="/login" />} />
            <Route path="/screen/:patientId" element={user ? <ScreeningView lang={lang} onResult={addResult} /> : <Navigate to="/login" />} />
            <Route path="/report/:resultId" element={user ? <ReportView lang={lang} /> : <Navigate to="/login" />} />
            
            <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
          </Routes>
        </main>

        <footer className="bg-white border-t p-6 text-center text-gray-500 text-xs no-print">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <p>&copy; 2024 National Health Mission - Government of India. Powered by Optimedix AI.</p>
            <div className="flex gap-4 font-bold uppercase tracking-widest text-[10px]">
              <a href="#" className="hover:text-ashoka-blue">Privacy Policy</a>
              <a href="#" className="hover:text-ashoka-blue">Security Standards</a>
              <a href="#" className="hover:text-ashoka-blue">Help Center</a>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
