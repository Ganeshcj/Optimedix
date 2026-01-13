
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Role, User } from '../types';
import { Shield, UserPlus, Stethoscope, Users, UserCog, Building } from 'lucide-react';

interface SignupProps {
  onSignup: (user: User) => void;
  lang: 'EN' | 'HI';
}

const Signup: React.FC<SignupProps> = ({ onSignup }) => {
  const [activeTab, setActiveTab] = useState<Role>('NURSE');
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    password: '',
    clinic: '',
    district: '',
    specialization: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      mobile: formData.mobile,
      email: formData.email,
      role: activeTab,
      clinicName: formData.clinic,
      district: formData.district,
      specialization: formData.specialization
    };
    
    // In a real app, we'd save to DB. Here we use localStorage.
    const users = JSON.parse(localStorage.getItem('opti_users') || '[]');
    localStorage.setItem('opti_users', JSON.stringify([...users, newUser]));
    
    onSignup(newUser);
    navigate('/dashboard');
  };

  const tabs: { id: Role, icon: any, label: string }[] = [
    { id: 'NURSE', icon: Users, label: 'Nurse' },
    { id: 'DOCTOR', icon: Stethoscope, label: 'Doctor' },
    { id: 'PATIENT', icon: Users, label: 'Patient' },
    { id: 'ADMIN', icon: UserCog, label: 'Admin' }
  ];

  return (
    <div className="max-w-2xl mx-auto mt-6 px-4">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        <div className="bg-ashoka-blue p-8 text-white text-center">
          <Shield className="w-12 h-12 mx-auto mb-4 opacity-80" />
          <h2 className="text-3xl font-black">Join Optimedix</h2>
          <p className="text-blue-100 text-sm mt-2">Select your role to register on the platform</p>
        </div>

        <div className="flex border-b">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-4 flex flex-col items-center gap-1 transition-all border-b-4 ${activeTab === tab.id ? 'border-ashoka-blue bg-blue-50 text-ashoka-blue' : 'border-transparent text-gray-400 hover:bg-gray-50'}`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="text-[10px] font-black uppercase tracking-widest">{tab.label}</span>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Full Name</label>
                <input required type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-ashoka-blue outline-none" 
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Mobile Number</label>
                <input required type="tel" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-ashoka-blue outline-none" 
                  value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Email Address</label>
                <input required type="email" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-ashoka-blue outline-none" 
                  value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Password</label>
                <input required type="password" placeholder="••••••••" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-ashoka-blue outline-none" 
                  value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
              </div>
              {activeTab !== 'PATIENT' && (
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Facility / Clinic Name</label>
                  <input required type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-ashoka-blue outline-none" 
                    value={formData.clinic} onChange={e => setFormData({...formData, clinic: e.target.value})} />
                </div>
              )}
              {activeTab === 'DOCTOR' && (
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Specialization</label>
                  <input required type="text" placeholder="e.g. Vitreoretinal Surgeon" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-ashoka-blue outline-none" 
                    value={formData.specialization} onChange={e => setFormData({...formData, specialization: e.target.value})} />
                </div>
              )}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">District</label>
                <input required type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-ashoka-blue outline-none" 
                  value={formData.district} onChange={e => setFormData({...formData, district: e.target.value})} />
              </div>
            </div>
          </div>

          <button type="submit" className="w-full bg-ashoka-blue text-white py-4 rounded-2xl font-black text-lg hover:bg-blue-900 shadow-xl transition-all flex items-center justify-center gap-3">
            <UserPlus className="w-6 h-6" /> Create {activeTab} Account
          </button>
          
          <p className="text-center text-gray-500 text-sm">
            Already registered? <Link to="/login" className="text-ashoka-blue font-black hover:underline">Sign In here</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
