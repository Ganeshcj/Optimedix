
import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { analyzeRetinalImage } from '../services/gemini';
import { ScreeningResult, DiseaseType, Severity } from '../types';
import { Camera, Upload, Eye, Zap, Loader2, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';

interface ScreeningViewProps {
  lang: 'EN' | 'HI';
  onResult: (r: ScreeningResult) => void;
}

const ScreeningView: React.FC<ScreeningViewProps> = ({ lang, onResult }) => {
  const { patientId } = useParams();
  const navigate = useNavigate();
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
      // Use the left eye image for analysis if available
      const data = await analyzeRetinalImage(images.left || images.right || '', patientId!);
      const finalResult = {
        ...data,
        leftEyeImage: images.left,
        rightEyeImage: images.right
      } as ScreeningResult;
      setResult(finalResult);
      onResult(finalResult);
    } catch (error) {
      console.error(error);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Retinal Image Capture</h2>
        <div className="flex gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${images.left ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>Left Eye {images.left ? '✓' : ''}</span>
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${images.right ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>Right Eye {images.right ? '✓' : ''}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image Capture Sections */}
        {(['left', 'right'] as const).map(eye => (
          <div 
            key={eye}
            onClick={() => setActiveEye(eye)}
            className={`relative aspect-square rounded-3xl border-4 transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center
              ${activeEye === eye ? 'border-blue-500 bg-blue-50 shadow-inner' : 'border-dashed border-gray-200 bg-gray-50 hover:bg-gray-100'}
            `}
          >
            {images[eye] ? (
              <>
                <img src={images[eye]} alt={`${eye} eye`} className="w-full h-full object-cover" />
                <button 
                  onClick={(e) => { e.stopPropagation(); setImages(prev => ({...prev, [eye]: undefined})); }}
                  className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600"
                >
                  <Zap className="w-4 h-4" />
                </button>
              </>
            ) : (
              <div className="text-center p-6 space-y-4">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border flex items-center justify-center mx-auto text-gray-400">
                  <Camera className="w-8 h-8" />
                </div>
                <div>
                  <p className="font-bold text-gray-700 uppercase tracking-widest text-sm">{eye} Eye</p>
                  <p className="text-xs text-gray-400 mt-1">Tap to capture or upload fundus image</p>
                </div>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-white px-4 py-2 rounded-lg border shadow-sm text-sm font-bold text-gray-600 hover:bg-gray-50"
                >
                  Upload Image
                </button>
              </div>
            )}
            <div className={`absolute bottom-4 left-4 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${activeEye === eye ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
              {eye === 'left' ? 'OS (Left)' : 'OD (Right)'}
            </div>
          </div>
        ))}
      </div>

      <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleFileUpload} />

      {/* AI Control & Results */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        {!result ? (
          <div className="p-8 text-center space-y-6">
            <p className="text-gray-500 max-w-sm mx-auto">Upload at least one retinal image to start the automated AI health assessment.</p>
            <button 
              disabled={analyzing || (!images.left && !images.right)}
              onClick={handleStartAnalysis}
              className={`w-full md:w-auto px-12 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-xl
                ${analyzing ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-ashoka-blue text-white hover:bg-blue-900 active:scale-95'}
                ${(!images.left && !images.right) ? 'opacity-50 grayscale' : ''}
              `}
            >
              {analyzing ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Running AI Models...
                </>
              ) : (
                <>
                  <Zap className="w-6 h-6 fill-current" />
                  Start AI Screening
                </>
              )}
            </button>
            {analyzing && (
              <p className="text-xs text-blue-600 font-bold animate-pulse">Detecting lesions, hemorrhages, and nerve health...</p>
            )}
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className={`p-8 ${result.disease === 'Normal' ? 'bg-green-50' : 'bg-red-50'} flex flex-col md:flex-row gap-8 items-start`}>
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em]">AI Diagnosis</h3>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5
                    ${result.severity === Severity.LOW ? 'bg-green-100 text-green-700' : 
                      result.severity === Severity.MEDIUM ? 'bg-orange-100 text-orange-700' : 
                      'bg-red-100 text-red-700'}
                  `}>
                    {result.severity} Risk
                  </div>
                </div>
                <h4 className={`text-4xl font-black ${result.disease === 'Normal' ? 'text-green-700' : 'text-red-700'}`}>
                  {result.disease}
                </h4>
                <p className="text-gray-600 leading-relaxed font-medium">
                  {result.abnormalities}
                </p>
                <div className="flex gap-6 pt-4">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Risk Score</p>
                    <p className="text-2xl font-black text-gray-800">{result.riskScore}%</p>
                  </div>
                  <div className="w-px h-10 bg-gray-200"></div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Confidence</p>
                    <p className="text-2xl font-black text-gray-800">{result.confidenceScore}%</p>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-64 space-y-3">
                <button 
                  onClick={() => navigate(`/report/${result.id}`)}
                  className="w-full py-3 bg-ashoka-blue text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-900 shadow-md transition-all"
                >
                  <ArrowRight className="w-5 h-5" />
                  Full Report
                </button>
                <button className="w-full py-3 bg-white border-2 border-orange-500 text-orange-600 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-orange-50 transition-all">
                  <AlertTriangle className="w-5 h-5" />
                  Referral Slip
                </button>
              </div>
            </div>
            
            <div className="p-8 bg-white border-t space-y-6">
              <h5 className="font-bold text-gray-800">Highlighted Regions of Interest</h5>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1,2,3,4].map(i => (
                  <div key={i} className="aspect-square bg-gray-100 rounded-xl overflow-hidden relative group cursor-zoom-in">
                    <img src={images.left || images.right} className="w-full h-full object-cover grayscale opacity-50 group-hover:opacity-100 transition-all" alt="ROI" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 border-2 border-red-500 rounded-full animate-pulse"></div>
                    </div>
                    <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[8px] px-1.5 py-0.5 rounded font-bold uppercase">ROI #{i}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScreeningView;
