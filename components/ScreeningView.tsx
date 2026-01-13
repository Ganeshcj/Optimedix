
import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { analyzeRetinalImages } from '../services/gemini';
import { ScreeningResult, EyeAnalysis, DiseaseType, Severity, User } from '../types';
import { Camera, Zap, Loader2, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';

interface ScreeningViewProps {
  lang: 'EN' | 'HI';
  onResult: (r: ScreeningResult) => void;
}

const ScreeningView: React.FC<ScreeningViewProps> = ({ onResult }) => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const nurse: User = JSON.parse(localStorage.getItem('optimedix_user') || '{}');
  
  const [images, setImages] = useState<{left?: string, right?: string}>({});
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<Partial<ScreeningResult> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeEye, setActiveEye] = useState<'left' | 'right'>('left');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => ({ ...prev, [activeEye]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStartAnalysis = async () => {
    if (!images.left && !images.right) return;
    setAnalyzing(true);
    try {
      const data = await analyzeRetinalImages(images.left, images.right, patientId!, nurse.id);
      setResult(data);
      if (data.id) {
         onResult(data as ScreeningResult);
      }
    } catch (error) {
      console.error(error);
      alert('AI Analysis failed. Please check your network and try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-800 tracking-tight">Retinal Analysis Center</h2>
          <p className="text-gray-500 font-medium">Bilateral Imaging Protocol • NHM Guidelines</p>
        </div>
        <div className="flex bg-white p-2 rounded-2xl border shadow-sm">
          <button onClick={() => setActiveEye('left')} className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${activeEye === 'left' ? 'bg-ashoka-blue text-white' : 'text-gray-400'}`}>LEFT EYE (OS)</button>
          <button onClick={() => setActiveEye('right')} className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${activeEye === 'right' ? 'bg-ashoka-blue text-white' : 'text-gray-400'}`}>RIGHT EYE (OD)</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className={`relative aspect-square rounded-[3rem] border-4 overflow-hidden transition-all shadow-2xl ${images[activeEye] ? 'border-ashoka-blue' : 'border-dashed border-gray-200 bg-gray-50/50'}`}>
           {images[activeEye] ? (
             <>
               <img src={images[activeEye]} className="w-full h-full object-cover" />
               <button onClick={() => setImages({...images, [activeEye]: undefined})} className="absolute top-6 right-6 p-3 bg-red-600 text-white rounded-2xl shadow-xl hover:scale-110 transition-all"><RefreshCw className="w-5 h-5" /></button>
             </>
           ) : (
             <div className="flex flex-col items-center justify-center h-full p-10 text-center">
               <div className="w-20 h-20 bg-white rounded-3xl shadow-lg flex items-center justify-center text-gray-400 mb-6">
                 <Camera className="w-10 h-10" />
               </div>
               <h4 className="font-black text-gray-700 text-xl uppercase tracking-widest">{activeEye} Eye</h4>
               <p className="text-sm text-gray-400 mt-2 max-w-[200px]">Capture high-resolution fundus image using integrated camera</p>
               <button onClick={() => fileInputRef.current?.click()} className="mt-8 bg-ashoka-blue text-white px-8 py-4 rounded-2xl font-black text-sm shadow-xl shadow-blue-100 hover:scale-105 transition-all">UPLOAD SCAN</button>
             </div>
           )}
           <div className="absolute bottom-6 left-6 px-4 py-2 bg-black/60 backdrop-blur-md rounded-xl text-[10px] font-black text-white uppercase tracking-widest">
             {activeEye === 'left' ? 'Ocular Sinister' : 'Ocular Dexter'}
           </div>
        </div>

        <div className="flex flex-col justify-center space-y-8">
           <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 space-y-6">
              <h3 className="font-black text-gray-800 text-xl">Analysis Command</h3>
              <p className="text-sm text-gray-500 leading-relaxed italic">"Our AI engine scans for early markers of Microaneurysms, Hemorrhages, and Excudates in the foveal and peripheral regions."</p>
              <div className="flex gap-4">
                 <div className={`flex-1 p-4 rounded-2xl border flex flex-col items-center gap-1 ${images.left ? 'bg-green-50 border-green-100 text-green-700' : 'bg-gray-50 border-gray-100 text-gray-300'}`}>
                    <span className="text-[10px] font-black uppercase">Left Scan</span>
                    <ShieldCheck className="w-5 h-5" />
                 </div>
                 <div className={`flex-1 p-4 rounded-2xl border flex flex-col items-center gap-1 ${images.right ? 'bg-green-50 border-green-100 text-green-700' : 'bg-gray-50 border-gray-100 text-gray-300'}`}>
                    <span className="text-[10px] font-black uppercase">Right Scan</span>
                    <ShieldCheck className="w-5 h-5" />
                 </div>
              </div>
              <button 
                disabled={analyzing || (!images.left && !images.right)}
                onClick={handleStartAnalysis}
                className={`w-full py-5 rounded-3xl font-black text-lg flex items-center justify-center gap-4 shadow-2xl transition-all
                  ${analyzing ? 'bg-gray-100 text-gray-300 cursor-wait' : 'bg-ashoka-blue text-white hover:bg-blue-900 active:scale-95'}
                `}
              >
                {analyzing ? <><Loader2 className="w-6 h-6 animate-spin" /> RUNNING BILATERAL AI...</> : <><Zap className="w-6 h-6 fill-current" /> START ANALYSIS</>}
              </button>
           </div>
           
           {result && (
             <div className="animate-in fade-in slide-in-from-right duration-500 bg-green-600 p-8 rounded-[2.5rem] text-white shadow-2xl">
               <div className="flex justify-between items-center mb-4">
                 <h4 className="font-black uppercase tracking-widest text-xs">Analysis Complete</h4>
                 <ShieldCheck className="w-6 h-6" />
               </div>
               <p className="text-xl font-bold leading-tight">Patient data has been prioritized. Detailed diagnostic report is now available.</p>
               <button onClick={() => navigate(`/report/${result.id}`)} className="mt-6 w-full bg-white text-green-700 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg flex items-center justify-center gap-2">VIEW FINDINGS <ArrowRight className="w-4 h-4" /></button>
             </div>
           )}
        </div>
      </div>

      <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleFileUpload} />
    </div>
  );
};

export default ScreeningView;
