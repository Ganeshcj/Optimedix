
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Patient, ScreeningResult, DiseaseType, Severity, User, Prescription } from '../types';
import { Printer, Download, ArrowLeft, ShieldCheck, CheckSquare, FileText, Stethoscope, Send, Plus } from 'lucide-react';

interface ReportViewProps {
  lang: 'EN' | 'HI';
}

const ReportView: React.FC<ReportViewProps> = () => {
  const { resultId } = useParams();
  const navigate = useNavigate();
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
  
  // Local state for persistence mock
  const results: ScreeningResult[] = JSON.parse(localStorage.getItem('opti_results') || '[]');
  const patients: Patient[] = JSON.parse(localStorage.getItem('opti_patients') || '[]');
  const currentUser: User = JSON.parse(localStorage.getItem('optimedix_user') || '{}');
  
  const resultIdx = results.findIndex(r => r.id === resultId);
  const result = results[resultIdx];
  const patient = patients.find(p => p.id === result?.patientId);

  // Prescription Form State
  const [prescription, setPrescription] = useState({
    diagnosis: '',
    notes: '',
    followUp: '',
    meds: [{ name: '', dosage: '', frequency: '' }]
  });

  if (!result || !patient) return <div className="p-20 text-center text-gray-500">Report not found.</div>;

  const handleRefer = () => {
    const updated = [...results];
    updated[resultIdx].status = 'REFERRED';
    localStorage.setItem('opti_results', JSON.stringify(updated));
    alert('Case successfully referred to network specialists.');
    navigate('/dashboard');
  };

  const handleSavePrescription = (e: React.FormEvent) => {
    e.preventDefault();
    const newPresc: Prescription = {
      id: Math.random().toString(36).substr(2, 9),
      patientId: patient.id,
      doctorId: currentUser.id,
      date: new Date().toISOString(),
      diagnosis: prescription.diagnosis,
      medications: prescription.meds,
      followUp: prescription.followUp,
      notes: prescription.notes
    };
    const prescs = JSON.parse(localStorage.getItem('opti_prescriptions') || '[]');
    localStorage.setItem('opti_prescriptions', JSON.stringify([...prescs, newPresc]));
    
    // Mark result as reviewed
    const updated = [...results];
    updated[resultIdx].status = 'REVIEWED';
    localStorage.setItem('opti_results', JSON.stringify(updated));
    
    alert('Digital Prescription Generated Successfully!');
    setShowPrescriptionForm(false);
  };

  const EyeDetailCard = ({ eye, data, image }: { eye: string, data?: any, image?: string }) => {
    if (!data) return null;
    const isNormal = data.disease === DiseaseType.NORMAL;
    return (
      <div className={`p-6 rounded-3xl border-2 ${isNormal ? 'bg-green-50/30 border-green-100' : 'bg-red-50/30 border-red-100'}`}>
        <div className="flex justify-between items-start mb-4">
           <div>
             <span className="text-[10px] font-black uppercase text-gray-500">{eye} Assessment</span>
             <h4 className={`text-xl font-black mt-1 ${isNormal ? 'text-green-700' : 'text-red-700'}`}>{data.disease}</h4>
           </div>
           <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${data.riskScore > 70 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
             {data.severity} Risk
           </span>
        </div>
        <div className="grid grid-cols-2 gap-4">
           <div className="aspect-square bg-black rounded-2xl overflow-hidden shadow-inner">
             {image && <img src={image} className="w-full h-full object-cover" />}
           </div>
           <div className="flex flex-col justify-between">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase">Risk Score</p>
                <p className="text-3xl font-black text-gray-800">{data.riskScore}%</p>
              </div>
              <p className="text-[10px] text-gray-600 italic">"{data.abnormalities}"</p>
           </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto pb-20 px-4">
      <div className="flex items-center justify-between mb-8 no-print">
        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-gray-500 font-bold hover:text-ashoka-blue transition-all">
          <ArrowLeft className="w-5 h-5" /> Back to Portal
        </button>
        <div className="flex gap-3">
          {currentUser.role === 'NURSE' && result.status === 'PENDING' && (
            <button onClick={handleRefer} className="bg-orange-600 text-white px-6 py-3 rounded-xl font-black text-sm flex items-center gap-2 shadow-xl shadow-orange-100">
              <Send className="w-4 h-4" /> Refer to Doctor
            </button>
          )}
          {currentUser.role === 'DOCTOR' && (
            <button onClick={() => setShowPrescriptionForm(true)} className="bg-ashoka-blue text-white px-6 py-3 rounded-xl font-black text-sm flex items-center gap-2 shadow-xl shadow-blue-100">
              <Stethoscope className="w-4 h-4" /> Write Prescription
            </button>
          )}
          <button onClick={() => window.print()} className="px-6 py-3 bg-white border rounded-xl font-black text-sm flex items-center gap-2">
            <Printer className="w-4 h-4" /> Print Report
          </button>
        </div>
      </div>

      {showPrescriptionForm ? (
        <div className="bg-white p-10 rounded-3xl shadow-2xl border animate-in zoom-in-95 duration-300">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-black text-gray-800">Digital Prescription</h3>
            <button onClick={() => setShowPrescriptionForm(false)} className="text-gray-400 font-bold">Cancel</button>
          </div>
          <form onSubmit={handleSavePrescription} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Diagnosis</label>
                <input required className="w-full px-4 py-3 border rounded-xl" value={prescription.diagnosis} onChange={e => setPrescription({...prescription, diagnosis: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Follow-up Date</label>
                <input required type="date" className="w-full px-4 py-3 border rounded-xl" value={prescription.followUp} onChange={e => setPrescription({...prescription, followUp: e.target.value})} />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-black text-gray-400 uppercase">Medications</h4>
                <button type="button" onClick={() => setPrescription({...prescription, meds: [...prescription.meds, {name: '', dosage: '', frequency: ''}]})} className="text-ashoka-blue text-xs font-bold flex items-center gap-1"><Plus className="w-3 h-3" /> Add Med</button>
              </div>
              {prescription.meds.map((med, i) => (
                <div key={i} className="grid grid-cols-3 gap-4">
                  <input placeholder="Medicine Name" className="px-4 py-2 border rounded-lg text-sm" value={med.name} onChange={e => {
                    const newMeds = [...prescription.meds];
                    newMeds[i].name = e.target.value;
                    setPrescription({...prescription, meds: newMeds});
                  }} />
                  <input placeholder="Dosage" className="px-4 py-2 border rounded-lg text-sm" value={med.dosage} onChange={e => {
                    const newMeds = [...prescription.meds];
                    newMeds[i].dosage = e.target.value;
                    setPrescription({...prescription, meds: newMeds});
                  }} />
                  <input placeholder="Frequency" className="px-4 py-2 border rounded-lg text-sm" value={med.frequency} onChange={e => {
                    const newMeds = [...prescription.meds];
                    newMeds[i].frequency = e.target.value;
                    setPrescription({...prescription, meds: newMeds});
                  }} />
                </div>
              ))}
            </div>

            <button type="submit" className="w-full bg-ashoka-blue text-white py-4 rounded-2xl font-black text-lg shadow-xl">Generate & Send Prescription</button>
          </form>
        </div>
      ) : (
        <div className="bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-100 print:shadow-none">
          <div className="gov-gradient h-2"></div>
          <div className="p-12">
            <div className="flex justify-between items-start mb-12 border-b pb-8">
              <div className="flex gap-6">
                <div className="w-20 h-20 bg-ashoka-blue text-white flex items-center justify-center rounded-3xl text-4xl font-black">O</div>
                <div>
                  <h1 className="text-4xl font-black tracking-tighter">OPTIMEDIX</h1>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.3em]">Bilateral Retinal Health Screening</p>
                  <div className="flex items-center gap-2 mt-4">
                    <span className="px-2 py-0.5 bg-green-50 text-green-700 text-[10px] font-black rounded border">VERIFIED AI ASSESSMENT</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-gray-400 uppercase">Case Status</p>
                <p className={`text-xl font-black ${result.status === 'REFERRED' ? 'text-orange-600' : 'text-green-600'}`}>{result.status}</p>
                <p className="text-[10px] text-gray-400 font-mono mt-2">ID: #R-{result.id.toUpperCase()}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 bg-gray-50/50 p-8 rounded-3xl border border-gray-100">
               <div><p className="text-[10px] font-black text-gray-400 uppercase">Patient Name</p><p className="font-black text-gray-800">{patient.name}</p></div>
               <div><p className="text-[10px] font-black text-gray-400 uppercase">Age/Gender</p><p className="font-black text-gray-800">{patient.age} / {patient.gender}</p></div>
               <div><p className="text-[10px] font-black text-gray-400 uppercase">DM Status</p><p className="font-black text-gray-800">{patient.diabetesHistory ? 'Positive' : 'None'}</p></div>
               <div><p className="text-[10px] font-black text-gray-400 uppercase">Screening Date</p><p className="font-black text-gray-800">{new Date(result.date).toLocaleDateString()}</p></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
               <EyeDetailCard eye="Left Eye (OS)" data={result.leftEye} image={result.leftEyeImage} />
               <EyeDetailCard eye="Right Eye (OD)" data={result.rightEye} image={result.rightEyeImage} />
            </div>

            <div className="pt-8 border-t border-dashed text-center">
              <p className="text-[10px] text-gray-400 font-medium max-w-2xl mx-auto">This report is for screening purposes. A positive flag indicates the need for specialized ophthalmological examination. All data is handled under national health data protection policies.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportView;
