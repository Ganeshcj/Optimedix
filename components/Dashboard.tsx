
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Patient, ScreeningResult, Role, Prescription } from '../types';
import { 
  Users, Activity, ClipboardList, Plus, 
  ChevronRight, Calendar, AlertCircle, Eye, 
  Stethoscope, ShieldCheck, Download, FileText, Settings
} from 'lucide-react';

interface DashboardProps {
  lang: 'EN' | 'HI';
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [results, setResults] = useState<ScreeningResult[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Load data from local persistence
    setPatients(JSON.parse(localStorage.getItem('opti_patients') || '[]'));
    setResults(JSON.parse(localStorage.getItem('opti_results') || '[]'));
    setPrescriptions(JSON.parse(localStorage.getItem('opti_prescriptions') || '[]'));
  }, []);

  const NurseView = () => (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-gray-800 tracking-tight">Nurse Portal</h2>
          <p className="text-gray-500 font-medium">Managing screening workflow at {user.clinicName}</p>
        </div>
        <Link to="/register-patient" className="bg-ashoka-blue text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3 shadow-xl hover:scale-105 transition-all">
          <Plus className="w-6 h-6" /> Register New Patient
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <Users className="w-8 h-8 text-blue-600 mb-4" />
          <p className="text-xs font-black text-gray-400 uppercase mb-1">Total Screenings</p>
          <p className="text-4xl font-black text-gray-800">{results.length}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <AlertCircle className="w-8 h-8 text-orange-600 mb-4" />
          <p className="text-xs font-black text-gray-400 uppercase mb-1">Pending Referrals</p>
          <p className="text-4xl font-black text-gray-800">{results.filter(r => r.status === 'REFERRED').length}</p>
        </div>
        <div className="bg-ashoka-blue p-6 rounded-3xl shadow-xl text-white">
          <ShieldCheck className="w-8 h-8 mb-4 opacity-80" />
          <p className="text-xs font-bold opacity-70 uppercase mb-1">System Status</p>
          <p className="text-xl font-bold">AI Engine Active</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
          <h3 className="font-black text-gray-800 uppercase tracking-widest text-xs">Recently Screened Patients</h3>
        </div>
        <div className="divide-y">
          {results.length === 0 ? (
            <div className="p-20 text-center text-gray-400 font-bold uppercase text-xs">No records found</div>
          ) : (
            results.map(r => {
              const p = patients.find(pat => pat.id === r.patientId);
              return (
                <div key={r.id} className="p-6 flex items-center justify-between hover:bg-blue-50/30 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-700 font-black">{p?.name.charAt(0)}</div>
                    <div>
                      <p className="font-black text-gray-800 text-lg">{p?.name || 'Unknown Patient'}</p>
                      <p className="text-xs font-bold text-gray-400">ID: #{r.id.slice(0,5)} • Status: <span className={r.status === 'REFERRED' ? 'text-orange-600' : 'text-green-600'}>{r.status}</span></p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => navigate(`/report/${r.id}`)} className="px-4 py-2 border-2 border-ashoka-blue text-ashoka-blue rounded-xl font-black text-xs hover:bg-ashoka-blue hover:text-white transition-all">VIEW AI REPORT</button>
                    <button onClick={() => navigate(`/screen/${p?.id}`)} className="px-4 py-2 bg-ashoka-blue text-white rounded-xl font-black text-xs shadow-lg shadow-blue-100">RE-SCREEN</button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );

  const DoctorView = () => (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-gray-800 tracking-tight">Doctor Review Portal</h2>
          <p className="text-gray-500 font-medium">Vitreoretinal Specialist: {user.name}</p>
        </div>
        <div className="flex gap-4">
          <button className="bg-white border-2 border-gray-100 px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-2 hover:bg-gray-50">
            <Calendar className="w-5 h-5 text-blue-600" /> Appointments
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="p-6 border-b bg-orange-50/50 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-orange-600" />
          <h3 className="font-black text-orange-900 uppercase tracking-widest text-xs">Cases Referred for Urgent Review</h3>
        </div>
        <div className="divide-y">
          {results.filter(r => r.status === 'REFERRED').length === 0 ? (
            <div className="p-20 text-center text-gray-400 font-bold uppercase text-xs">No pending referrals</div>
          ) : (
            results.filter(r => r.status === 'REFERRED').map(r => {
              const p = patients.find(pat => pat.id === r.patientId);
              return (
                <div key={r.id} className="p-6 flex items-center justify-between hover:bg-orange-50/20">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-700 font-black">{p?.name.charAt(0)}</div>
                    <div>
                      <p className="font-black text-gray-800 text-lg">{p?.name}</p>
                      <p className="text-xs font-bold text-gray-400">Diagnosis: {r.leftEye?.disease} / {r.rightEye?.disease}</p>
                    </div>
                  </div>
                  <button onClick={() => navigate(`/report/${r.id}`)} className="bg-orange-600 text-white px-6 py-3 rounded-xl font-black text-xs shadow-lg shadow-orange-100 flex items-center gap-2">
                    <Stethoscope className="w-4 h-4" /> REVIEW CASE
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );

  const PatientView = () => {
    const myResults = results.filter(r => r.patientId === user.id);
    const myPrescriptions = prescriptions.filter(p => p.patientId === user.id);
    
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-black text-gray-800 tracking-tight">Patient Health Record</h2>
          <p className="text-gray-500 font-medium">Welcome back, {user.name}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
            <h3 className="font-black text-gray-800 text-xl mb-6 flex items-center gap-3">
              <Eye className="w-6 h-6 text-blue-600" /> My Screening History
            </h3>
            <div className="space-y-4">
              {myResults.length === 0 ? (
                <p className="text-gray-400 text-sm font-bold italic">No screening results found.</p>
              ) : (
                myResults.map(r => (
                  <div key={r.id} className="p-4 bg-gray-50 rounded-2xl border flex items-center justify-between">
                    <div>
                      <p className="font-black text-gray-800">{new Date(r.date).toLocaleDateString()}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Retinal Scan #R-{r.id.slice(0,5)}</p>
                    </div>
                    <button onClick={() => navigate(`/report/${r.id}`)} className="text-ashoka-blue font-black text-xs hover:underline">VIEW REPORT</button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
            <h3 className="font-black text-gray-800 text-xl mb-6 flex items-center gap-3">
              <FileText className="w-6 h-6 text-green-600" /> Digital Prescriptions
            </h3>
            <div className="space-y-4">
              {myPrescriptions.length === 0 ? (
                <p className="text-gray-400 text-sm font-bold italic">No prescriptions found.</p>
              ) : (
                myPrescriptions.map(p => (
                  <div key={p.id} className="p-4 bg-green-50/30 border border-green-100 rounded-2xl flex items-center justify-between">
                    <div>
                      <p className="font-black text-gray-800">{p.diagnosis}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">DR. REVIEW DATE: {new Date(p.date).toLocaleDateString()}</p>
                    </div>
                    <button className="bg-green-600 text-white p-2 rounded-lg"><Download className="w-4 h-4" /></button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const AdminView = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-black text-gray-800 tracking-tight">Administrator Panel</h2>
        <p className="text-gray-500 font-medium">Optimedix Network Statistics</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Active Nurses', value: '24', icon: Users, color: 'bg-blue-600' },
          { label: 'Board Doctors', value: '8', icon: Stethoscope, color: 'bg-indigo-600' },
          { label: 'Positive Flags', value: '142', icon: AlertCircle, color: 'bg-red-600' },
          { label: 'Referral Rate', value: '89%', icon: Activity, color: 'bg-green-600' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <stat.icon className={`w-8 h-8 ${stat.color} text-white p-2 rounded-xl mb-4`} />
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
            <p className="text-3xl font-black text-gray-800">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
        <h3 className="font-black text-gray-800 text-xl mb-6 flex items-center gap-3">
          <Settings className="w-6 h-6 text-gray-400" /> Platform Management
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="p-6 border-2 border-dashed border-gray-200 rounded-3xl hover:bg-gray-50 transition-all text-left">
            <p className="font-black text-gray-800">Approve New Clinicians</p>
            <p className="text-xs text-gray-400 mt-1">12 pending requests for verification</p>
          </button>
          <button className="p-6 border-2 border-dashed border-gray-200 rounded-3xl hover:bg-gray-50 transition-all text-left">
            <p className="font-black text-gray-800">System Logs & Audits</p>
            <p className="text-xs text-gray-400 mt-1">View all data access records</p>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="pb-20">
      {user.role === 'NURSE' && <NurseView />}
      {user.role === 'DOCTOR' && <DoctorView />}
      {user.role === 'PATIENT' && <PatientView />}
      {user.role === 'ADMIN' && <AdminView />}
    </div>
  );
};

export default Dashboard;
