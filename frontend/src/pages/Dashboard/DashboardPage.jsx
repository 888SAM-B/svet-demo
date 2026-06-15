import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Globe2, 
  FileText, 
  Clock, 
  RefreshCw, 
  LogOut,
  GraduationCap
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Legend
} from 'recharts';
import { useApplication } from '../../context/ApplicationContext';
import { Card } from '../../components/Common/Card';
import { Button } from '../../components/Common/Button';
import { dashboardApi } from '../../services/dashboardApi';

// Recharts theme colors - strictly shades of blue
const COLORS = [
  '#112D4E', // Primary Blue
  '#3F72AF', // Secondary Blue
  '#93C5FD', // Light Blue
  '#DBE2EF', // Subtle Grey/Blue
  '#1E3A8A', // Deep Navy
  '#2563EB', // Royal Blue
  '#60A5FA', // Sky Blue
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const { applications, isLoading } = useApplication();
  const [whatsappNum, setWhatsappNum] = useState(
    localStorage.getItem('svet_whatsapp_number') || '919876543210'
  );
  const [saveStatus, setSaveStatus] = useState('');

  const handleSaveWhatsapp = () => {
    const cleaned = whatsappNum.replace(/\D/g, '');
    if (cleaned.length < 10) {
      setSaveStatus('Error: Please enter a valid mobile number with country code (e.g. 919876543210).');
      return;
    }
    localStorage.setItem('svet_whatsapp_number', cleaned);
    setWhatsappNum(cleaned);
    setSaveStatus('WhatsApp QR settings updated successfully!');
    setTimeout(() => setSaveStatus(''), 4000);
  };

  useEffect(() => {
    const token = localStorage.getItem('svet_admin_token');
    if (!token) {
      navigate('/admin');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('svet_admin_token');
    navigate('/admin');
  };



  const [stats, setStats] = useState({
    total_registrations: 0,
    today_registrations: 0,
    pending_files: 0,
    total_countries: 10,
    country_distribution: [],
    application_trends: [],
    status_distribution: []
  });
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setStatsLoading(true);
      try {
        const data = await dashboardApi.getStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to load dashboard stats', error);
      } finally {
        setStatsLoading(false);
      }
    };
    fetchStats();
  }, [applications]);

  const totalApps = stats.total_registrations;
  const todayApps = stats.today_registrations;
  const uniqueCountries = stats.total_countries;
  const pendingApps = stats.pending_files;

  const countryChartData = stats.country_distribution.map(item => ({
    name: item.country,
    value: item.count
  })).sort((a, b) => b.value - a.value);

  const trendsChartData = stats.application_trends.map(item => ({
    date: item.date,
    Applications: item.count
  }));

  return (
    <div className="min-h-screen bg-primary-bg text-primary-text flex flex-col md:flex-row">
      
      {/* SIDEBAR PANEL */}
      <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-border-color flex flex-col justify-between p-6">
        <div className="space-y-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-secondary-blue/10 flex items-center justify-center border border-secondary-blue/20">
              <GraduationCap className="w-5 h-5 text-secondary-blue" />
            </div>
            <div>
              <span className="font-display font-extrabold text-lg text-primary-blue">SVET CRM</span>
              <span className="text-[9px] text-secondary-text uppercase tracking-widest block font-light">Management Panel</span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="flex flex-col gap-1.5">
            <Link 
              to="/admin/dashboard" 
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm bg-secondary-blue/10 text-secondary-blue font-bold border border-secondary-blue/15"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>
            <Link 
              to="/admin/leads" 
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-secondary-text hover:text-primary-blue hover:bg-secondary-bg transition-all font-semibold"
            >
              <Users className="w-4 h-4" />
              <span>Leads Management</span>
            </Link>
          </nav>
        </div>

        {/* Action buttons footer */}
        <div className="pt-6 border-t border-border-color flex flex-col gap-3 mt-6 md:mt-0">
          <button 
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 border border-red-200 hover:border-red-300 text-red-600 rounded-lg text-xs font-bold cursor-pointer transition-all duration-200"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-grow p-6 md:p-10 space-y-8 overflow-y-auto max-h-screen">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="font-display font-extrabold text-2xl md:text-3xl text-primary-blue">
              Admissions Overview & Analytics
            </h1>
            <p className="text-xs text-secondary-text font-light">
              Monitoring of medical school registrations and leading country preferences.
            </p>
          </div>
          <div className="flex items-center gap-2.5 text-xs bg-white border border-border-color px-4 py-2 rounded-lg shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-secondary-text font-semibold">CRM Status: <strong className="text-emerald-600">Live</strong></span>
          </div>
        </div>

        {/* KPI METRIC CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <Card className="flex items-center justify-between border-secondary-bg bg-white p-6 relative overflow-hidden shadow-sm">
            {/* Left accent bar */}
            <div className="absolute top-0 left-0 w-1.5 h-full bg-primary-blue" />
            
            <div className="space-y-1 pl-2">
              <span className="text-[10px] uppercase tracking-wider text-secondary-text font-bold">Total Applications</span>
              <h3 className="font-display font-extrabold text-3xl text-primary-blue">{isLoading || statsLoading ? '...' : totalApps}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-primary-blue/10 flex items-center justify-center border border-primary-blue/20 shrink-0">
              <FileText className="w-5 h-5 text-primary-blue" />
            </div>
          </Card>

          <Card className="flex items-center justify-between border-secondary-bg bg-white p-6 relative overflow-hidden shadow-sm">
            {/* Left accent bar */}
            <div className="absolute top-0 left-0 w-1.5 h-full bg-secondary-blue" />
            
            <div className="space-y-1 pl-2">
              <span className="text-[10px] uppercase tracking-wider text-secondary-text font-bold">Today's Applications</span>
              <h3 className="font-display font-extrabold text-3xl text-primary-blue">{isLoading || statsLoading ? '...' : todayApps}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-secondary-blue/10 flex items-center justify-center border border-secondary-blue/20 shrink-0">
              <Clock className="w-5 h-5 text-secondary-blue" />
            </div>
          </Card>

          <Card className="flex items-center justify-between border-secondary-bg bg-white p-6 relative overflow-hidden shadow-sm">
            {/* Left accent bar */}
            <div className="absolute top-0 left-0 w-1.5 h-full bg-sky-500" />
            
            <div className="space-y-1 pl-2">
              <span className="text-[10px] uppercase tracking-wider text-secondary-text font-bold">Countries Offered</span>
              <h3 className="font-display font-extrabold text-3xl text-primary-blue">{isLoading || statsLoading ? '...' : uniqueCountries}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-sky-500/10 flex items-center justify-center border border-sky-500/20 shrink-0">
              <Globe2 className="w-5 h-5 text-sky-600" />
            </div>
          </Card>

          <Card className="flex items-center justify-between border-secondary-bg bg-white p-6 relative overflow-hidden shadow-sm">
            {/* Left accent bar */}
            <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500" />
            
            <div className="space-y-1 pl-2">
              <span className="text-[10px] uppercase tracking-wider text-secondary-text font-bold">Pending Review</span>
              <h3 className="font-display font-extrabold text-3xl text-primary-blue">{isLoading || statsLoading ? '...' : pendingApps}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 shrink-0">
              <Users className="w-5 h-5 text-amber-600" />
            </div>
          </Card>

        </div>

        {/* WHATSAPP QR SETTINGS CARD */}
        <Card className="bg-white border border-border-color p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-left">
            <div>
              <h4 className="font-display font-bold text-sm text-primary-blue uppercase tracking-wider mb-1">
                WhatsApp QR Configurator
              </h4>
              <p className="text-[11px] text-secondary-text font-light">
                Update the official WhatsApp mobile number displayed in the contact section and generated QR code. Include country code without "+" (e.g. 919876543210).
              </p>
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-grow sm:flex-grow-0">
                <input
                  type="text"
                  placeholder="e.g. 919876543210"
                  value={whatsappNum}
                  onChange={(e) => setWhatsappNum(e.target.value)}
                  className="px-3 py-2 text-xs border border-border-color rounded-lg bg-primary-bg text-primary-text focus:outline-none focus:border-secondary-blue font-semibold w-full sm:w-48"
                />
              </div>
              <Button
                variant="primary"
                onClick={handleSaveWhatsapp}
                className="px-4 py-2 text-xs shrink-0 whitespace-nowrap bg-secondary-blue hover:bg-secondary-blue/95 border-none rounded-lg text-white"
              >
                Save Number
              </Button>
            </div>
          </div>
          {saveStatus && (
            <p className={`text-[11px] font-semibold mt-2 ${saveStatus.startsWith('Error') ? 'text-red-600' : 'text-emerald-600'}`}>
              {saveStatus}
            </p>
          )}
        </Card>

        {/* RECHARTS SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Pie Chart: Country Wise Applications */}
          <Card className="lg:col-span-5 bg-white border border-border-color p-6 flex flex-col justify-between min-h-[400px] shadow-sm">
            <div>
              <h4 className="font-display font-bold text-sm text-primary-blue uppercase tracking-wider mb-1">
                Country wise share
              </h4>
              <p className="text-[11px] text-secondary-text font-light">Breakdown of student applications across destinations.</p>
            </div>
            
            <div className="w-full h-64 mt-4 flex items-center justify-center">
              {isLoading || statsLoading ? (
                <div className="flex items-center gap-2 text-secondary-text text-sm">
                  <RefreshCw className="w-4 h-4 animate-spin text-secondary-blue" />
                  <span>Loading charts...</span>
                </div>
              ) : countryChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={countryChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {countryChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#FFFFFF', 
                        borderColor: '#D6DCE5',
                        borderRadius: '8px',
                        color: '#112D4E',
                        fontSize: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
                      }} 
                    />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36} 
                      iconSize={10} 
                      wrapperStyle={{ fontSize: '10px', color: '#5B6475' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <span className="text-xs text-secondary-text">No country data available.</span>
              )}
            </div>
          </Card>

          {/* Bar Chart: Registration trends */}
          <Card className="lg:col-span-7 bg-white border border-border-color p-6 flex flex-col justify-between min-h-[400px] shadow-sm">
            <div>
              <h4 className="font-display font-bold text-sm text-primary-blue uppercase tracking-wider mb-1">
                Application Trend
              </h4>
              <p className="text-[11px] text-secondary-text font-light">Lead creation volume over time.</p>
            </div>

            <div className="w-full h-64 mt-4">
              {isLoading || statsLoading ? (
                <div className="flex items-center justify-center h-full gap-2 text-secondary-text text-sm">
                  <RefreshCw className="w-4 h-4 animate-spin text-secondary-blue" />
                  <span>Loading charts...</span>
                </div>
              ) : trendsChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trendsChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#5B6475" 
                      fontSize={10}
                      tickLine={false}
                    />
                    <YAxis 
                      stroke="#5B6475" 
                      fontSize={10}
                      tickLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#FFFFFF', 
                        borderColor: '#D6DCE5',
                        borderRadius: '8px',
                        color: '#112D4E',
                        fontSize: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
                      }} 
                    />
                    <Bar dataKey="Applications" fill="#3F72AF" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <span className="text-xs text-secondary-text">No trend data available.</span>
                </div>
              )}
            </div>
          </Card>

        </div>

      </main>

    </div>
  );
}
