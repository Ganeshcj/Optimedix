
import React from 'react';
import { Link } from 'react-router-dom';
import { TRANSLATIONS } from '../constants';
import { User, Patient, ScreeningResult } from '../types';
import { 
  Users, Activity, ClipboardList, TrendingUp, Plus, 
  ChevronRight, Calendar, AlertCircle, Eye, CheckCircle2
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface DashboardProps {
  lang: 'EN' | 'HI';
  user: User;
  patients: Patient[];
  results: ScreeningResult[];
}

const Dashboard: React.FC<DashboardProps> = ({ lang, user, patients, results }) => {
  const t = TRANSLATIONS[lang];

  const stats = [
    { title: t.patientsScreened, value: results.length || '0', icon: Users, color: 'bg-blue-500' },
    { title: t.positiveCases, value: results.filter(r => r.disease !== 'Normal').length || '0', icon: AlertCircle, color: 'bg-orange-500' },
    { title: t.referrals, value: results.filter(r => r.riskScore > 70).length || '0', icon: Activity, color: 'bg-green-500' },
    { title: 'Goal Status', value: '78%', icon: CheckCircle2, color: 'bg-purple-500' },
  ];

  const chartData = [
    { name: 'Mon', count: 12 },
    { name: 'Tue', count: 18 },
    { name: 'Wed', count: 15 },
    { name: 'Thu', count: 24 },
    { name: 'Fri', count: 20 },
    { name: 'Sat', count: 10 },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Namaste, {user.name}</h2>
          <p className="text-gray-500 text-sm">Monitoring retinal health at {user.clinicName}, {user.district}</p>
        </div>
        <Link 
          to="/register-patient"
          className="bg-ashoka-blue text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-900 shadow-lg active:scale-95 transition-all"
        >
          <Plus className="w-5 h-5" />
          {t.registerPatient}
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, idx) => (
          <div key={idx} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className={`${s.color} p-3 rounded-xl text-white`}>
              <s.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">{s.title}</p>
              <p className="text-2xl font-bold text-gray-800">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Recent Patients & Activity */}
        <div className="lg:col-span-2 space-y-8">
          {/* Chart Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                Screening Trends
              </h3>
              <select className="text-sm border rounded-lg px-2 py-1 outline-none">
                <option>Weekly</option>
                <option>Monthly</option>
              </select>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip cursor={{fill: '#f1f5f9'}} />
                  <Bar dataKey="count" fill="#000080" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Patients */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="font-bold text-gray-800">Recent Patients</h3>
              <button className="text-blue-600 text-sm font-bold hover:underline">View All</button>
            </div>
            <div className="divide-y">
              {patients.length === 0 ? (
                <div className="p-10 text-center text-gray-400">
                  <ClipboardList className="w-12 h-12 mx-auto mb-2 opacity-20" />
                  <p>No patients registered yet</p>
                </div>
              ) : (
                patients.slice(0, 5).map(p => (
                  <div key={p.id} className="p-4 hover:bg-gray-50 flex items-center justify-between transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold">
                        {p.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">{p.name}</p>
                        <p className="text-xs text-gray-500">{p.age}y • {p.gender} • {p.phone}</p>
                      </div>
                    </div>
                    <Link 
                      to={`/screen/${p.id}`}
                      className="p-2 bg-gray-100 rounded-lg hover:bg-ashoka-blue hover:text-white transition-all"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Quick Stats & Logs */}
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-orange-500" />
              Clinic Schedule
            </h3>
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-xs font-bold text-blue-800">UPCOMING CAMP</p>
                <p className="text-sm font-semibold text-blue-900 mt-1">Village Screening - Paladi</p>
                <p className="text-[10px] text-blue-600 mt-0.5">Tomorrow, 09:00 AM</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-xs font-bold text-gray-500">STAFF MEETING</p>
                <p className="text-sm font-semibold text-gray-800 mt-1">Diagnosis Review</p>
                <p className="text-[10px] text-gray-500 mt-0.5">24 Nov, 04:00 PM</p>
              </div>
            </div>
          </div>

          <div className="bg-ashoka-blue p-6 rounded-2xl shadow-lg text-white">
            <h3 className="font-bold mb-4">Ayushman Bharat Tips</h3>
            <ul className="space-y-3 text-xs opacity-90 leading-relaxed list-disc pl-4">
              <li>Ensure retinal cameras are cleaned before every session.</li>
              <li>Always check patient blood sugar for better DR assessment.</li>
              <li>High-risk patients must be referred immediately via AB-HWC portal.</li>
            </ul>
            <button className="mt-6 w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg font-bold text-xs transition-all border border-white/20">
              Download Guidelines
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
