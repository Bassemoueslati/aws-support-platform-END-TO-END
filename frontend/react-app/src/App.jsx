import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Search, Clock, CheckCircle2, AlertCircle, 
  ChevronRight, Mail, Filter, Activity, User, X,
  LayoutDashboard, Send, Bell, Settings, PieChart, 
  MapPin, LogOut, Ticket as TicketIcon, Calendar, Car, BookOpen, Wrench, AlertTriangle, ShieldCheck
} from 'lucide-react';
import axios from 'axios';

const API_BASE = "http://localhost:8000/api";

// --- Global Axios Config ---
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('support_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, error => Promise.reject(error));

// --- Components ---

const Navbar = ({ user, onLogout }) => (
  <header className="h-16 bg-white border-b border-[#e9e9e9] flex items-center justify-between px-8 fixed top-0 right-0 left-64 z-30">
    <div className="relative w-96">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
      <input 
        type="text" 
        placeholder="Search" 
        className="w-full bg-[#f5f6fa] border-none rounded-2xl pl-10 pr-4 py-2 text-sm focus:ring-1 focus:ring-blue-400 outline-none"
      />
    </div>
    
    <div className="flex items-center gap-6">
      <div className="relative cursor-pointer">
        <Bell className="w-5 h-5 text-slate-600" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white">4</span>
      </div>
      <div className="flex items-center gap-3 cursor-pointer">
        <div className="w-8 h-8 bg-blue-100 p-0.5 rounded-full">
           <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Moni" alt="avatar" className="rounded-full" />
        </div>
        <div className="hidden lg:block text-right">
          <p className="text-xs font-bold text-slate-800 leading-none">{user || 'Moni Roy'}</p>
          <p className="text-[10px] text-slate-500 font-semibold uppercase">Admin</p>
        </div>
      </div>
    </div>
  </header>
);

const Sidebar = ({ user, onLogout }) => (
  <aside className="w-64 bg-white h-screen fixed top-0 left-0 border-r border-[#e9e9e9] py-8 flex flex-col">
    <div className="px-8 mb-10 flex items-center gap-2">
      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
        <ShieldCheck className="text-white w-5 h-5" />
      </div>
      <h1 className="text-xl font-extrabold tracking-tight text-[#202224]">Co <span className="text-[#4379ee]">Ownership</span></h1>
    </div>

    <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
      <SidebarItem to="/" icon={LayoutDashboard} label="Dashboard" active />
      <SidebarItem to="/user" icon={User} label="User" />
      <SidebarItem to="/customer" icon={TicketIcon} label="Ticket" active />
      <SidebarItem to="/vehicle" icon={Car} label="Vehicle" />
      <SidebarItem to="/booking" icon={BookOpen} label="Booking" />
      <SidebarItem to="/maintenance" icon={Wrench} label="Maintenance" />
      <SidebarItem to="/penalty" icon={AlertTriangle} label="Penalty Management" />
      <SidebarItem to="/analytics" icon={PieChart} label="Analytics" />
      <SidebarItem to="/support" icon={Activity} label="Support" />
      <div className="my-6 border-t border-slate-100" />
      <SidebarItem to="/settings" icon={Settings} label="Settings" />
    </nav>

    {user && (
      <div className="px-4 mt-auto">
        <button onClick={onLogout} className="sidebar-item w-full text-rose-500 hover:bg-rose-50">
          <LogOut className="w-5 h-5" /> Logout
        </button>
      </div>
    )}
  </aside>
);

const SidebarItem = ({ to, icon: Icon, label, active }) => (
  <Link to={to} className={`sidebar-item ${active ? 'active' : 'hover:bg-slate-50'}`}>
    <Icon className="w-5 h-5" />
    {label}
  </Link>
);

// --- Pages ---

const StaffDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({ total_tickets: 0, open_tickets: 0, closed_tickets: 0 });
  const navigate = useNavigate();

  useEffect(() => { fetchData(); }, []);
  const fetchData = async () => {
    try {
      const [tRes, sRes] = await Promise.all([
        axios.get(`${API_BASE}/tickets/`),
        axios.get(`${API_BASE}/stats`)
      ]);
      setTickets(tRes.data);
      setStats(sRes.data);
    } catch (err) { navigate('/login'); }
  };

  const handleAction = async (id, status) => {
    await axios.patch(`${API_BASE}/tickets/${id}/`, { status });
    fetchData();
  };

  return (
    <div className="ml-64 mt-16 p-8 min-h-screen">
      <h2 className="text-3xl font-black text-[#202224] mb-8">Ticket Management</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (Main Stats & Tables) */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="bg-white p-8 rounded-2xl border border-[#e9e9e9]">
             <h3 className="text-lg font-bold mb-6">Tickets Overview</h3>
             <div className="grid grid-cols-2 gap-6">
                <StatCard icon={TicketIcon} color="blue" label="Total Issued Tickets" value={stats.total_tickets} link="View Details" />
                <StatCard icon={Clock} color="orange" label="Tickets Used Today" value="120" link="View Details" />
                <StatCard icon={AlertTriangle} color="red" label="Low-Ticket Users" value="48" link="Manage Users" />
                <StatCard icon={Settings} color="orange" label="Pending Transfers" value="14" link="View Details" />
             </div>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-[#e9e9e9]">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-lg font-bold">Ticket Transfer Management</h3>
              <div className="flex gap-4">
                 <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
                    <input placeholder="Search" className="bg-[#f5f6fa] text-xs border-none rounded-lg pl-9 pr-4 py-2 w-48 outline-none" />
                 </div>
                 <button className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-[#f5f6fa] px-4 py-2 rounded-lg border border-[#e9e9e9]">
                   <Filter className="w-3.5 h-3.5" /> Filters
                 </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-xs text-slate-400 font-bold uppercase border-b border-slate-50">
                  <tr>
                    <th className="pb-4 font-bold">Name</th>
                    <th className="pb-4 font-bold">Request ID</th>
                    <th className="pb-4 font-bold">Date</th>
                    <th className="pb-4 font-bold">Status</th>
                    <th className="pb-4 font-bold text-right pr-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {tickets.map((t, idx) => (
                    <tr key={t.id} className="group">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${idx}`} className="w-8 h-8 rounded-lg bg-blue-50" />
                          <div>
                            <p className="font-bold text-slate-800 leading-tight">{t.customer_email.split('@')[0]}</p>
                            <p className="text-[10px] text-slate-400">{t.customer_email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 font-bold text-slate-600">00{t.id}</td>
                      <td className="py-4 text-slate-500 font-semibold">{new Date(t.created_at).toLocaleDateString()}</td>
                      <td className="py-4">
                        <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${t.status === 'open' ? 'text-blue-500 bg-blue-50' : 'text-slate-400 bg-slate-50'}`}>
                          {t.status}
                        </span>
                      </td>
                      <td className="py-4 text-right pr-4">
                        <div className="flex gap-2 justify-end">
                           <button onClick={() => handleAction(t.id, 'closed')} className="px-4 py-1.5 border border-blue-600 text-blue-600 text-[10px] font-bold rounded-md hover:bg-blue-600 hover:text-white transition-all">Approve</button>
                           <button className="px-4 py-1.5 border border-slate-300 text-slate-600 text-[10px] font-bold rounded-md hover:bg-slate-50 transition-all">Reject</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column (Alerts & Reports) */}
        <div className="space-y-8">
           <div className="bg-white p-8 rounded-2xl border border-[#e9e9e9]">
              <h3 className="text-lg font-bold mb-6">Low-Ticket Alerts</h3>
              <div className="space-y-6">
                 {[1,2,3,4].map(idx => (
                    <div key={idx} className="flex justify-between items-center text-xs">
                       <div className="flex items-center gap-3 text-slate-800">
                          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Staff${idx}`} className="w-8 h-8 rounded-full bg-slate-100" />
                          <div className="font-bold leading-tight">Floyd Miles <br/><span className="text-[8px] text-slate-400 font-normal">staff@insightops.com</span></div>
                       </div>
                       <div className="text-center font-bold text-slate-700">12<br/><span className="text-[7px] text-slate-400 font-normal">Tickets Left</span></div>
                       <button className="text-blue-600 font-bold hover:underline">Notify</button>
                    </div>
                 ))}
              </div>
           </div>

           <div className="bg-white p-8 rounded-2xl border border-[#e9e9e9] relative overflow-hidden">
              <h3 className="text-lg font-bold mb-2">Statistics & Reports</h3>
              <div className="flex gap-2 mb-8 bg-[#f5f6fa] p-1.5 rounded-xl">
                 <button className="flex-1 text-[10px] font-bold py-1.5 rounded-lg bg-white shadow-sm text-blue-600">Daily</button>
                 <button className="flex-1 text-[10px] font-bold py-1.5 text-slate-500">Weekly</button>
                 <button className="flex-1 text-[10px] font-bold py-1.5 text-slate-500">Monthly</button>
              </div>
              <div className="mb-6">
                 <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Ticket Usage</p>
                 <p className="text-3xl font-black text-slate-800">34.5% <span className="text-xs text-emerald-500 font-bold ml-2">Increase</span></p>
              </div>
              {/* Fake Chart Illustration */}
              <div className="h-24 w-full mb-8 relative">
                 <svg viewBox="0 0 400 100" className="w-full h-full">
                    <path d="M0,80 Q50,70 100,50 T200,60 T300,30 T400,10" fill="none" stroke="#4379ee" strokeWidth="4" />
                    <path d="M0,80 Q50,70 100,50 T200,60 T300,30 T400,10 V100 H0 Z" fill="url(#grad)" opacity="0.1" />
                    <defs>
                      <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#4379ee" />
                        <stop offset="100%" stopColor="transparent" />
                      </linearGradient>
                    </defs>
                 </svg>
              </div>
              <button className="w-full py-3 border border-blue-600 text-blue-600 text-xs font-bold rounded-xl hover:bg-blue-50">Export Reports</button>
           </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, color, label, value, link }) => {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    orange: 'bg-orange-50 text-orange-600',
    red: 'bg-red-50 text-red-600'
  };
  return (
    <div className="p-1 rounded-2xl">
      <div className="flex items-start justify-between mb-4">
         <div className={`p-3 rounded-2xl ${colors[color]}`}>
            <Icon className="w-5 h-5" />
         </div>
         <span className="text-[10px] font-bold text-blue-600 cursor-pointer hover:underline">{link}</span>
      </div>
      <p className="text-[10px] text-slate-400 font-bold mb-1">{label}</p>
      <p className="text-3xl font-black text-slate-800 italic">{value}</p>
    </div>
  );
};

const CustomerPortal = () => {
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', customer_email: '', priority: 'medium' });

  const handleCreate = async (e) => {
    e.preventDefault();
    await axios.post(`${API_BASE}/tickets/`, formData);
    setSuccess(true);
    setFormData({ title: '', description: '', customer_email: '', priority: 'medium' });
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="ml-64 mt-16 p-8 min-h-screen flex flex-col items-center justify-center bg-[#f5f6fa]">
      <div className="w-full max-w-2xl text-center mb-12">
        <h2 className="text-5xl font-black text-slate-900 uppercase italic mb-4 tracking-tighter">Public <span className="text-blue-600">Assistance</span></h2>
        <p className="text-slate-500 font-bold">Instantly connect with our staff.</p>
      </div>
      <div className="bg-white p-12 rounded-[3rem] w-full max-w-xl border border-[#e9e9e9] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-blue-600" />
        {success ? (
          <div className="text-emerald-500 font-bold text-center py-6 text-xl">Ticket submitted! We'll email you shortly.</div>
        ) : (
          <form onSubmit={handleCreate} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Contact Email</label>
              <input required placeholder="Email Address" className="w-full bg-[#f5f6fa] border-none rounded-2xl px-6 py-4 text-slate-800 outline-none focus:ring-2 focus:ring-blue-100" value={formData.customer_email} onChange={e => setFormData({...formData, customer_email: e.target.value})} />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Description</label>
              <textarea required placeholder="Problem Description" rows="5" className="w-full bg-[#f5f6fa] border-none rounded-2xl px-6 py-4 text-slate-800 resize-none outline-none focus:ring-2 focus:ring-blue-100" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value, title: `Support from ${formData.customer_email}`})} />
            </div>
            <button type="submit" className="w-full py-5 bg-blue-600 text-white font-black rounded-full shadow-lg shadow-blue-500/30 uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all">Submit Request</button>
          </form>
        )}
      </div>
    </div>
  );
};

const App = () => {
  const [user, setUser] = useState(localStorage.getItem('support_user'));
  const onLogout = () => { localStorage.removeItem('support_token'); localStorage.removeItem('support_user'); setUser(null); };

  return (
    <Router>
      <div className="min-h-screen bg-[#f5f6fa] text-slate-800">
        <Sidebar user={user} onLogout={onLogout} />
        <Navbar user={user} onLogout={onLogout} />
        <Routes>
          <Route path="/" element={user ? <StaffDashboard /> : <Navigate to="/login" />} />
          <Route path="/login" element={<Login onLogin={(u) => { localStorage.setItem('support_user', u); setUser(u); }} />} />
          <Route path="/customer" element={<CustomerPortal />} />
        </Routes>
      </div>
    </Router>
  );
};

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('agent');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE}/token/`, { username, password });
      localStorage.setItem('support_token', res.data.access);
      onLogin(username);
      navigate('/');
    } catch (err) { setError('Login failed.'); }
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-[#f5f6fa] ml-64 min-h-[90vh]">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-12 rounded-[3.5rem] w-full max-w-md border border-[#e9e9e9] shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16" />
        <ShieldCheck className="w-12 h-12 text-blue-600 mb-6 relative z-10" />
        <h2 className="text-3xl font-black text-slate-900 mb-2 uppercase tracking-tight relative z-10 italic">Staff <span className="text-blue-600">Secure</span></h2>
        <p className="text-slate-400 mb-8 text-sm font-semibold italic relative z-10">Access the internal ticket matrix.</p>
        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <input required placeholder="Username" className="w-full bg-[#f5f6fa] border-none rounded-2xl px-6 py-4 text-slate-800" value={username} onChange={e => setUsername(e.target.value)} />
          <input required type="password" placeholder="Password" className="w-full bg-[#f5f6fa] border-none rounded-2xl px-6 py-4 text-slate-800" value={password} onChange={e => setPassword(e.target.value)} />
          {error && <p className="text-red-500 text-xs font-bold text-center">{error}</p>}
          <button type="submit" className="w-full py-5 bg-blue-600 text-white font-black rounded-full hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 uppercase tracking-widest">Sign In</button>
        </form>
      </motion.div>
    </div>
  );
};

export default App;
