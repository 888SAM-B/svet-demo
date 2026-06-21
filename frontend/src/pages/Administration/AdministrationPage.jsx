import React, { useState, useEffect } from 'react';
import { ShieldCheck, RefreshCw, AlertCircle, Terminal, User, FileText, Globe, Image } from 'lucide-react';
import AdminSidebar from '../../components/Admin/AdminSidebar';
import { Card } from '../../components/Common/Card';
import { Button } from '../../components/Common/Button';
import { apiClient } from '../../services/apiClient';

export default function AdministrationPage() {
  const [metrics, setMetrics] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [metricsData, logsData] = await Promise.all([
        apiClient('/admin-stats/metrics'),
        apiClient('/admin-stats/logs')
      ]);
      setMetrics(metricsData);
      setLogs(logsData || []);
    } catch (err) {
      setError(err.message || 'Failed to retrieve administrative data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getActionBadgeClass = (action) => {
    switch (action) {
      case 'User Login':
        return 'bg-blue-50 text-blue-700 border-blue-150';
      case 'User Creation':
        return 'bg-emerald-50 text-emerald-700 border-emerald-150';
      case 'User Updates':
        return 'bg-amber-50 text-amber-700 border-amber-150';
      case 'Country Updates':
        return 'bg-purple-50 text-purple-700 border-purple-150';
      case 'Lead Updates':
        return 'bg-cyan-50 text-cyan-700 border-cyan-150';
      case 'Gallery Updates':
        return 'bg-indigo-50 text-indigo-700 border-indigo-150';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-150';
    }
  };

  const filteredLogs = logs.filter(log => {
    const term = searchTerm.toLowerCase();
    const matchesUser = 
      (log.user_name && log.user_name.toLowerCase().includes(term)) ||
      (log.user_email && log.user_email.toLowerCase().includes(term)) ||
      (!log.user_email && 'system'.includes(term));
    const matchesAction = log.action && log.action.toLowerCase().includes(term);
    const matchesMetadata = log.metadata ? JSON.stringify(log.metadata).toLowerCase().includes(term) : false;
    
    return matchesUser || matchesAction || matchesMetadata;
  });

  return (
    <div className="min-h-screen bg-[#F9F7F7] text-[#112D4E] flex flex-col md:flex-row">
      <AdminSidebar />

      <main className="flex-grow p-6 md:p-10 space-y-8 overflow-y-auto max-h-screen">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display font-extrabold text-2xl md:text-3xl text-[#112D4E] flex items-center gap-2.5">
              <ShieldCheck className="w-8 h-8 text-[#3F72AF]" />
              System Administration
            </h1>
            <p className="text-xs text-[#3F72AF] font-light">
              System monitoring, database statistics, and unified audit logs.
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={loadData}
            className="gap-2 text-xs py-2 px-4 shrink-0 font-semibold"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reload Logs</span>
          </Button>
        </div>

        {error && (
          <div className="flex items-center gap-2.5 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="font-semibold">{error}</span>
          </div>
        )}

        {/* METRICS CARDS */}
        {metrics && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-5 bg-white border border-[#DBE2EF] flex items-center justify-between shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
              <div className="pl-1 text-left">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#3F72AF]">System Users</span>
                <h3 className="font-display font-extrabold text-2xl text-[#112D4E] mt-1">{metrics.users_count}</h3>
              </div>
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center border border-blue-100 shrink-0">
                <User className="w-5 h-5 text-blue-600" />
              </div>
            </Card>

            <Card className="p-5 bg-white border border-[#DBE2EF] flex items-center justify-between shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500" />
              <div className="pl-1 text-left">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#3F72AF]">Total Leads</span>
                <h3 className="font-display font-extrabold text-2xl text-[#112D4E] mt-1">{metrics.leads_count}</h3>
              </div>
              <div className="w-10 h-10 rounded-lg bg-cyan-50 flex items-center justify-center border border-cyan-100 shrink-0">
                <FileText className="w-5 h-5 text-cyan-600" />
              </div>
            </Card>

            <Card className="p-5 bg-white border border-[#DBE2EF] flex items-center justify-between shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
              <div className="pl-1 text-left">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#3F72AF]">Active Countries</span>
                <h3 className="font-display font-extrabold text-2xl text-[#112D4E] mt-1">{metrics.countries_count}</h3>
              </div>
              <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center border border-emerald-100 shrink-0">
                <Globe className="w-5 h-5 text-emerald-600" />
              </div>
            </Card>

            <Card className="p-5 bg-white border border-[#DBE2EF] flex items-center justify-between shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-purple-500" />
              <div className="pl-1 text-left">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#3F72AF]">Gallery Slides</span>
                <h3 className="font-display font-extrabold text-2xl text-[#112D4E] mt-1">{metrics.gallery_count}</h3>
              </div>
              <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center border border-purple-100 shrink-0">
                <Image className="w-5 h-5 text-purple-600" />
              </div>
            </Card>
          </div>
        )}

        {/* AUDIT LOGS CONTAINER */}
        <Card className="bg-white border border-[#DBE2EF] p-0 shadow-sm overflow-hidden flex flex-col">
          {/* Top Search bar */}
          <div className="p-5 border-b border-[#DBE2EF] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[#3F72AF]" />
              <span className="font-display font-bold text-sm text-[#112D4E] uppercase tracking-wider">
                System Activity Log & Audit Trail
              </span>
            </div>
            <input 
              type="text" 
              placeholder="Search logs by action, admin, metadata..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3.5 py-2 text-xs border border-[#DBE2EF] rounded-lg focus:outline-none focus:border-[#3F72AF] focus:ring-1 focus:ring-[#3F72AF]/30 w-full sm:w-80 bg-white"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50/75 border-b border-[#DBE2EF] text-[#3F72AF] uppercase font-bold tracking-wider">
                  <th className="px-6 py-3.5">Timestamp</th>
                  <th className="px-6 py-3.5">Administrator</th>
                  <th className="px-6 py-3.5">Action Event</th>
                  <th className="px-6 py-3.5">Metadata Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DBE2EF]">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                      <div className="flex items-center justify-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin text-[#3F72AF]" />
                        <span>Loading audit trails...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-400 font-light">
                      No logs match search query.
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map(log => (
                    <tr key={log.id} className="hover:bg-gray-50/45 transition-colors">
                      <td className="px-6 py-4 text-[#3F72AF] whitespace-nowrap font-mono">
                        {new Date(log.timestamp).toLocaleString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit'
                        })}
                      </td>
                      <td className="px-6 py-4">
                        {log.user_email ? (
                          <div>
                            <span className="font-bold text-[#112D4E]">{log.user_name || 'Admin'}</span>
                            <span className="block text-[10px] text-gray-400 mt-0.5">{log.user_email}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400 italic">System Auto / Deleted User</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getActionBadgeClass(log.action)}`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="px-6 py-4 max-w-xs md:max-w-md">
                        <pre className="font-mono text-[10px] text-gray-500 whitespace-pre-wrap break-all leading-normal bg-gray-50 p-2 border border-[#DBE2EF] rounded-md overflow-x-auto max-h-24">
                          {JSON.stringify(log.metadata, null, 2)}
                        </pre>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-[#DBE2EF] text-gray-400 flex items-center justify-between font-light">
            <span>Showing {filteredLogs.length} audit logs</span>
            <span>Logs Limit: 100 entries</span>
          </div>
        </Card>
      </main>
    </div>
  );
}
