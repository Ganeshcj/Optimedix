
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Patient, User } from '../types';
import { ClipboardCheck, ArrowLeft, HeartPulse, Droplets } from 'lucide-react';

interface PatientFormProps {
  lang: 'EN' | 'HI';
  onSubmit: (p: Patient) => void;
}

const PatientForm: React.FC<PatientFormProps> = ({ onSubmit }) => {
  const navigate = useNavigate();
  const nurse: User = JSON.parse(localStorage.getItem('optimedix_user') || '{}');
  
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male',
    phone: '',
    email: '',
    diabetes: false,
    sugar: '',
    bp: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Fix: Removed 'phone' property which is not defined in the Patient or User types. 
    // The mobile number is correctly assigned to the 'mobile' property from formData.phone.
    const newPatient: Patient = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      mobile: formData.phone,
      email: formData.email,
      role: 'PATIENT',
      age: parseInt(formData.age),
      gender: formData.gender as any,
      diabetesHistory: formData.diabetes,
      bloodSugar: formData.sugar,
      bp: formData.bp,
      registeredDate: new Date().toISOString(),
      assignedNurseId: nurse.id
    };
    
    // Save to users for login too
    const users = JSON.parse(localStorage.getItem('opti_users') || '[]');
    localStorage.setItem('opti_users', JSON.stringify([...users, newPatient]));
    
    onSubmit(newPatient);
    navigate(`/screen/${newPatient.id}`);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 font-black text-sm mb-6 uppercase tracking-widest"><ArrowLeft className="w-4 h-4" /> Back</button>

      <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100">
        <div className="bg-ashoka-blue py-10 px-12 text-white">
          <h2 className="text-3xl font-black flex items-center gap-4">
            <ClipboardCheck className="w-8 h-8" /> New Patient Registration
          </h2>
          <p className="text-blue-100 text-sm mt-2 opacity-80 uppercase tracking-widest font-bold">Standard Health Screening Protocol</p>
        </div>

        <form onSubmit={handleSubmit} className="p-12 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-6">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b pb-2">Demographics</h3>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Full Name</label>
                <input required type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-ashoka-blue outline-none" 
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Age</label>
                  <input required type="number" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-ashoka-blue outline-none" 
                    value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Gender</label>
                  <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-ashoka-blue outline-none bg-white" 
                    value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value as any})}>
                    <option>Male</option><option>Female</option><option>Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Mobile</label>
                <input required type="tel" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-ashoka-blue outline-none" 
                  value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b pb-2">Vitals & History</h3>
              <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-black text-gray-700">Diabetes History?</span>
                  </div>
                  <input type="checkbox" className="w-6 h-6 rounded-lg text-ashoka-blue" 
                    checked={formData.diabetes} onChange={e => setFormData({...formData, diabetes: e.target.checked})} />
                </div>
                {formData.diabetes && (
                  <div className="animate-in slide-in-from-top-2 duration-300">
                    <label className="block text-[10px] font-bold text-blue-600 uppercase mb-1">Blood Sugar Level (mg/dL)</label>
                    <input type="text" className="w-full px-4 py-2 rounded-lg border-2 border-blue-100 outline-none focus:border-blue-300" 
                      value={formData.sugar} onChange={e => setFormData({...formData, sugar: e.target.value})} />
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <HeartPulse className="w-4 h-4 text-red-500" />
                    <label className="text-sm font-black text-gray-700">Blood Pressure (Systolic/Diastolic)</label>
                  </div>
                  <input type="text" placeholder="e.g. 120/80" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-ashoka-blue outline-none" 
                    value={formData.bp} onChange={e => setFormData({...formData, bp: e.target.value})} />
                </div>
              </div>
            </div>
          </div>

          <button type="submit" className="w-full bg-ashoka-blue text-white py-5 rounded-3xl font-black text-xl hover:bg-blue-900 shadow-2xl transition-all active:scale-95">
            Register & Proceed to Scanning
          </button>
        </form>
      </div>
    </div>
  );
};

export default PatientForm;
