
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { TRANSLATIONS } from '../constants';
import { User, Role } from '../types';
import { UserPlus, Building, MapPin, Shield, CheckCircle } from 'lucide-react';

interface SignupProps {
  onSignup: (user: User) => void;
  lang: 'EN' | 'HI';
}

const Signup: React.FC<SignupProps> = ({ onSignup, lang }) => {
  const t = TRANSLATIONS[lang];
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    role: 'NURSE' as Role,
    clinic: '',
    district: '',
    state: '',
    consent: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.consent) return;
    
    onSignup({
      id: Math.random().toString(),
      name: formData.name,
      mobile: formData.mobile,
      email: `${formData.name.toLowerCase().replace(/\s/g, '')}@health.gov.in`,
      role: formData.role,
      clinicName: formData.clinic,
      district: formData.district,
      state: formData.state
    });
  };

  return (
    <div className="max-w-2xl mx-auto mt-6 px-4">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-ashoka-blue py-6 px-8 text-white">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <UserPlus className="w-6 h-6" />
            NHM Personnel Registration
          </h2>
          <p className="text-blue-100 text-sm mt-1">Register for National Retinal Health Screening Program</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Shield className="w-3 h-3" />
                Personal Details
              </h3>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">{t.fullName}</label>
                <input 
                  type="text" required
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">{t.mobile}</label>
                <input 
                  type="tel" required
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.mobile}
                  onChange={e => setFormData({...formData, mobile: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">{t.role}</label>
                <select 
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  value={formData.role}
                  onChange={e => setFormData({...formData, role: e.target.value as Role})}
                >
                  <option value="NURSE">Nurse / Health Worker</option>
                  <option value="DOCTOR">Doctor / Specialist</option>
                  <option value="ADMIN">Clinic Administrator</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Building className="w-3 h-3" />
                Clinic Information
              </h3>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">{t.clinic}</label>
                <input 
                  type="text" required
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.clinic}
                  onChange={e => setFormData({...formData, clinic: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">{t.district}</label>
                  <input 
                    type="text" required
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.district}
                    onChange={e => setFormData({...formData, district: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">{t.state}</label>
                  <input 
                    type="text" required
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.state}
                    onChange={e => setFormData({...formData, state: e.target.value})}
                  />
                </div>
              </div>
              <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-dashed border-blue-200">
                <p className="text-[10px] text-blue-700 font-medium">Please upload Government ID or Hospital ID for verification.</p>
                <input type="file" className="mt-2 text-xs" />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <label className="flex items-start gap-3 cursor-pointer">
              <input 
                type="checkbox" required
                className="mt-1 w-4 h-4 text-blue-600 rounded"
                checked={formData.consent}
                onChange={e => setFormData({...formData, consent: e.target.checked})}
              />
              <span className="text-xs text-gray-600 leading-relaxed">
                I hereby declare that I am an authorized medical professional. I agree to abide by the <strong>National Digital Health Mission (NDHM)</strong> guidelines regarding patient privacy and data protection.
              </span>
            </label>
          </div>

          <button 
            type="submit"
            className="w-full bg-ashoka-blue text-white py-3.5 rounded-xl font-bold text-lg hover:bg-blue-900 shadow-lg active:scale-[0.98] transition-all"
          >
            Create Authorized Account
          </button>

          <p className="text-center text-gray-500 text-sm">
            Already have an account? <Link to="/login" className="text-blue-600 font-bold hover:underline">Sign In</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
