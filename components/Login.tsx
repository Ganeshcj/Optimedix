
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { TRANSLATIONS } from '../constants';
import { User, Role } from '../types';
import { Phone, Lock, Eye, EyeOff, AlertTriangle } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
  lang: 'EN' | 'HI';
}

const Login: React.FC<LoginProps> = ({ onLogin, lang }) => {
  const t = TRANSLATIONS[lang];
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login
    const mockUser: User = {
      id: '1',
      name: 'Nurse Priya Sharma',
      mobile,
      email: 'priya@nhm.gov.in',
      role: 'NURSE',
      clinicName: 'PHC Chandwaji',
      district: 'Jaipur',
      state: 'Rajasthan'
    };
    onLogin(mockUser);
  };

  return (
    <div className="max-w-md mx-auto mt-10 md:mt-20 px-4">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-ashoka-blue py-6 px-8 text-white text-center">
          <h2 className="text-2xl font-bold">{t.login}</h2>
          <p className="text-blue-100 text-sm mt-1">Authorized Personnel Only</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t.mobile}</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="tel"
                  required
                  placeholder="Enter 10-digit mobile"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type={showPass ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <button type="button" className="text-blue-600 font-medium hover:underline">OTP Login?</button>
            <button type="button" className="text-gray-500 hover:underline">Forgot Password?</button>
          </div>

          <button 
            type="submit"
            className="w-full bg-ashoka-blue text-white py-3.5 rounded-xl font-bold text-lg hover:bg-blue-900 shadow-lg shadow-blue-200 active:scale-[0.98] transition-all"
          >
            {t.login}
          </button>

          <div className="bg-red-50 border border-red-100 rounded-lg p-3 flex gap-3 items-start">
            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-[11px] text-red-800 leading-normal">
              <strong>Emergency Mode:</strong> This access is for registered government clinicians only. All actions are logged under NHM Digital Audit.
            </p>
          </div>

          <p className="text-center text-gray-500 text-sm mt-4">
            Don't have an account? <Link to="/signup" className="text-blue-600 font-bold hover:underline">Request Access</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
