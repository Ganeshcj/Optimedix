
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Patient, ScreeningResult } from '../types';
import { Printer, Download, Share2, ArrowLeft, ShieldCheck, CheckSquare } from 'lucide-react';

interface ReportViewProps {
  lang: 'EN' | 'HI';
  results: ScreeningResult[];
  patients: Patient[];
}

const ReportView: React.FC<ReportViewProps> = ({ lang, results, patients }) => {
  const { resultId } = useParams();
  const navigate = useNavigate();
  const result = results.find(r => r.id === resultId);
  const patient = patients.find(p => p.id === result?.patientId);

  if (!result || !patient) {
    return <div className="p-20 text-center text-gray-500">Report not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="flex items-center justify-between mb-8 print:hidden">
        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-gray-500 font-bold">
          <ArrowLeft className="w-5 h-5" /> Back
        </button>
        <div className="flex gap-2">
          <button onClick={() => window.print()} className="px-4 py-2 bg-white border rounded-xl font-bold flex items-center gap-2 hover:bg-gray-50">
            <Printer className="w-4 h-4" /> Print
          </button>
          <button className="px-4 py-2 bg-ashoka-blue text-white rounded-xl font-bold flex items-center gap-2 hover:bg-blue-900">
            <Download className="w-4 h-4" /> Download PDF
          </button>
        </div>
      </div>

      <div className="bg-white p-8 md:p-12 shadow-2xl rounded-sm border-t-8 border-ashoka-blue print:shadow-none print:border-none">
        {/* Report Header */}
        <div className="flex flex-col md:flex-row justify-between gap-6 pb-8 border-b-2 border-gray-100">
          <div className="flex gap-4">
            <div className="w-16 h-16 bg-ashoka-blue text-white flex items-center justify-center rounded font-black text-2xl">N</div>
            <div>
              <h1 className="text-2xl font-black text-gray-800">Netra AI Medical Report</h1>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Ayushman Bharat Digital Mission (ABDM)</p>
              <div className="flex items-center gap-1.5 mt-2 text-green-600">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase">Verified AI Analysis</span>
              </div>
            </div>
          </div>
          <div className="text-right flex items-center md:items-start md:flex-col gap-4">
             <div className="bg-gray-50 p-2 rounded-lg border">
                <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center text-[10px] text-gray-500 font-bold uppercase text-center">QR CODE<br/>#REF-{result.id.slice(0,5)}</div>
             </div>
             <div className="text-right hidden md:block">
                <p className="text-[10px] font-black text-gray-400 uppercase">Screening Date</p>
                <p className="font-bold text-sm">{new Date(result.date).toLocaleDateString()}</p>
             </div>
          </div>
        </div>

        {/* Patient Details */}
        <div className="py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase">Patient Name</p>
            <p className="font-bold text-gray-800">{patient.name}</p>
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase">Age / Gender</p>
            <p className="font-bold text-gray-800">{patient.age}Y / {patient.gender}</p>
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase">Phone</p>
            <p className="font-bold text-gray-800">{patient.phone}</p>
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase">Patient ID</p>
            <p className="font-bold text-gray-800">#PT-{patient.id.slice(0,6)}</p>
          </div>
        </div>

        {/* Diagnosis Results */}
        <div className="py-10 border-t-2 border-gray-100 space-y-8">
          <div>
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Clinical Findings</h3>
            <div className={`p-6 rounded-2xl border-2 flex flex-col md:flex-row gap-6 items-center
              ${result.disease === 'Normal' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}
            `}>
              <div className="text-center md:text-left">
                <p className="text-[10px] font-black uppercase text-gray-500">Detected Condition</p>
                <h4 className={`text-3xl font-black ${result.disease === 'Normal' ? 'text-green-700' : 'text-red-700'}`}>
                  {result.disease}
                </h4>
              </div>
              <div className="hidden md:block w-px h-12 bg-gray-300"></div>
              <div className="flex-1">
                <p className="text-[10px] font-black uppercase text-gray-500">Risk Severity</p>
                <p className="font-bold text-gray-800">{result.severity} ({result.riskScore}%)</p>
              </div>
              <div className="px-6 py-2 bg-white rounded-xl border shadow-sm">
                 <p className="text-[10px] font-black text-blue-600 uppercase">AI Confidence</p>
                 <p className="text-xl font-black text-blue-900">{result.confidenceScore}%</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-xs font-black text-gray-400 uppercase">Observations</h4>
              <p className="text-gray-700 text-sm leading-relaxed bg-gray-50 p-4 rounded-xl border italic">
                "{result.abnormalities}"
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="text-xs font-black text-gray-400 uppercase">Recommended Actions</h4>
              <ul className="space-y-2">
                {[
                  { label: 'Refer to Vitreoretinal Specialist', active: result.severity !== 'Low' },
                  { label: 'Immediate Ophthalmologist Consultation', active: result.severity === 'Critical' || result.severity === 'High' },
                  { label: 'Re-screen in 6 Months', active: result.severity === 'Low' },
                  { label: 'Blood Glucose Control Management', active: patient.diabetesHistory }
                ].map((item, i) => (
                  <li key={i} className={`flex items-center gap-2 text-sm ${item.active ? 'text-gray-800 font-bold' : 'text-gray-300'}`}>
                    <CheckSquare className={`w-4 h-4 ${item.active ? 'text-blue-500' : 'text-gray-200'}`} />
                    {item.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Retinal Images */}
        <div className="py-10 border-t-2 border-gray-100">
           <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">Submitted Retinal Fundus Scans</h3>
           <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2 text-center">
                <div className="aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden border">
                  {result.leftEyeImage ? <img src={result.leftEyeImage} className="w-full h-full object-cover" alt="Left Eye" /> : <div className="flex items-center justify-center h-full text-gray-400 font-bold uppercase text-xs">No Scan</div>}
                </div>
                <p className="text-[10px] font-bold text-gray-500 uppercase">Left Eye (OS)</p>
              </div>
              <div className="space-y-2 text-center">
                <div className="aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden border">
                  {result.rightEyeImage ? <img src={result.rightEyeImage} className="w-full h-full object-cover" alt="Right Eye" /> : <div className="flex items-center justify-center h-full text-gray-400 font-bold uppercase text-xs">No Scan</div>}
                </div>
                <p className="text-[10px] font-bold text-gray-500 uppercase">Right Eye (OD)</p>
              </div>
           </div>
        </div>

        {/* Signature & Disclaimer */}
        <div className="pt-10 border-t-2 border-gray-100 flex flex-col md:flex-row justify-between items-end gap-8">
           <div className="max-w-md">
             <p className="text-[10px] font-black text-gray-400 uppercase">Medical Disclaimer</p>
             <p className="text-[9px] text-gray-500 leading-tight mt-1">
               This report is generated by Netra AI screening system. It is an automated screening tool and does not constitute a final clinical diagnosis. Results should be verified by a board-certified ophthalmologist. Patient data is encrypted and handled per National Data Governance Policy.
             </p>
           </div>
           <div className="text-center">
              <div className="w-40 border-b-2 border-gray-300 h-10 mb-2"></div>
              <p className="text-[10px] font-black text-gray-800 uppercase">Digital Signature</p>
              <p className="text-[8px] text-gray-400 font-mono mt-1">SGN-HW-2024-9981-A2</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ReportView;
