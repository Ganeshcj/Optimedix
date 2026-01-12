
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TRANSLATIONS } from '../constants';
import { Patient } from '../types';
import { User, ClipboardCheck, ArrowLeft } from 'lucide-react';

interface PatientFormProps {
  lang: 'EN' | 'HI';
  onSubmit: (p: Patient) => void;
}

const PatientForm: React.FC<PatientFormProps> = ({ lang, onSubmit }) => {
  const t = TRANSLATIONS[lang];
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male',
    phone: '',
    diabetes: false,
    sugar: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPatient: Patient = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      age: parseInt(formData.age),
      gender: formData.gender as any,
      phone: formData.phone,
      diabetesHistory: formData.diabetes,
      bloodSugar: formData.sugar,
      registeredDate: new Date().toISOString()
    };
    onSubmit(newPatient);
    navigate(`/screen/${newPatient.id}`);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 font-bold hover:text-gray-800 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Dashboard
      </button>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-blue-600 py-6 px-8 text-white flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <ClipboardCheck className="w-6 h-6" />
              New Patient Entry
            </h2>
            <p className="text-blue-100 text-sm mt-1">Fill basic details to start retinal screening</p>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold opacity-60">FORM ID</p>
            <p className="text-lg font-mono font-bold">#PT-{Date.now().toString().slice(-6)}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Patient Full Name</label>
                <input 
                  type="text" required
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. Ramesh Kumar"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Age</label>
                  <input 
                    type="number" required
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Years"
                    value={formData.age}
                    onChange={e => setFormData({...formData, age: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Gender</label>
                  <select 
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    value={formData.gender}
                    onChange={e => setFormData({...formData, gender: e.target.value})}
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number</label>
                <input 
                  type="tel" required
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="10-digit mobile"
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-5">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <h3 className="text-sm font-bold text-gray-800 mb-4">Medical History</h3>
                <div className="space-y-4">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        className="w-5 h-5 text-blue-600 rounded cursor-pointer"
                        checked={formData.diabetes}
                        onChange={e => setFormData({...formData, diabetes: e.target.checked})}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">Diabetes History?</span>
                  </label>
                  
                  {formData.diabetes && (
                    <div className="animate-in slide-in-from-top-2 fade-in duration-200">
                      <label className="block text-xs font-bold text-gray-500 mb-1">Last Blood Sugar Level (mg/dL)</label>
                      <input 
                        type="text"
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        placeholder="e.g. 140"
                        value={formData.sugar}
                        onChange={e => setFormData({...formData, sugar: e.target.value})}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 flex gap-4">
            <button 
              type="submit"
              className="flex-1 bg-ashoka-blue text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-900 shadow-lg active:scale-95 transition-all"
            >
              Register & Start Screening
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientForm;
