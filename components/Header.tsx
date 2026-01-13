
import React from 'react';
import { User } from '../types';
import { TRANSLATIONS } from '../constants';
import { Eye, LogOut, Globe, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  user: User | null;
  lang: 'EN' | 'HI';
  onLangToggle: () => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, lang, onLangToggle, onLogout }) => {
  const t = TRANSLATIONS[lang];

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50 no-print">
      <div className="gov-gradient h-1.5 w-full"></div>
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-ashoka-blue p-2 rounded-lg">
            <Eye className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold ashoka-blue leading-tight uppercase tracking-tighter">Optimedix</h1>
            <p className="text-[10px] md:text-xs text-gray-500 font-medium uppercase tracking-wider">{t.tagline}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={onLangToggle}
            className="flex items-center gap-1 px-3 py-1.5 border rounded-full text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <Globe className="w-4 h-4 text-gray-600" />
            {lang === 'EN' ? 'हिन्दी' : 'English'}
          </button>

          {user && (
            <div className="flex items-center gap-3">
              <div className="hidden md:block text-right">
                <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                <p className="text-[10px] text-gray-500 uppercase font-bold">{user.role} • {user.clinicName}</p>
              </div>
              <button 
                onClick={onLogout}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
                title={t.logout}
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          )}
          
          {!user && (
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-green-600" />
              <span className="text-xs font-bold text-gray-400 hidden sm:inline">SECURE ACCESS</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
