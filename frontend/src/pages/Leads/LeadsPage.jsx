import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Users, 
  LayoutDashboard, 
  Search, 
  Download, 
  Eye, 
  Trash2, 
  LogOut, 
  RefreshCw,
  GraduationCap,
  Filter,
  FileEdit
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { useApplication } from '../../context/ApplicationContext';
import { Card } from '../../components/Common/Card';
import { Button } from '../../components/Common/Button';
import StudentDetailDrawer from './StudentDetailDrawer';

export default function LeadsPage() {
  const navigate = useNavigate();
  const { applications, isLoading, deleteApplication, updateApplication, loadStudents } = useApplication();

  const [searchTerm, setSearchTerm] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  
  const [editingStatusId, setEditingStatusId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('svet_admin_token');
    if (!token) {
      navigate('/admin');
    } else {
      loadStudents();
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('svet_admin_token');
    navigate('/admin');
  };

  // Reset preview state if student changes
  const [selectedStudent, setSelectedStudent] = useState(null);

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete lead for: ${name}?`)) {
      await deleteApplication(id);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    await updateApplication(id, { status: newStatus });
    setEditingStatusId(null);
  };

  const filteredLeads = applications.filter(app => {
    const sTerm = searchTerm.toLowerCase();
    const matchesSearch = 
      app.personal.name.toLowerCase().includes(sTerm) ||
      app.parent.mobile1.includes(sTerm) ||
      app.neet.applicationNumber.toLowerCase().includes(sTerm);

    const matchesCountry = countryFilter ? app.neet.interestedCountry === countryFilter : true;
    const matchesStatus = statusFilter ? app.status === statusFilter : true;

    let matchesDate = true;
    if (dateFilter !== 'all') {
      const createdDate = new Date(app.createdDate);
      const today = new Date();
      const diffTime = Math.abs(today - createdDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (dateFilter === 'today') {
        matchesDate = createdDate.toDateString() === today.toDateString();
      } else if (dateFilter === 'last7') {
        matchesDate = diffDays <= 7;
      } else if (dateFilter === 'last30') {
        matchesDate = diffDays <= 30;
      }
    }

    return matchesSearch && matchesCountry && matchesStatus && matchesDate;
  });

  const handleExport = () => {
    if (filteredLeads.length === 0) {
      alert('No records available to export.');
      return;
    }

    const dataToExport = filteredLeads.map(lead => ({
      'Application ID': lead.id,
      'Student Name': lead.personal.name,
      'Gender': lead.personal.gender,
      'DOB': lead.personal.dob,
      'Aadhaar': lead.personal.aadhaar,
      'Community': lead.personal.community,
      'Passport No': lead.personal.passportNo || 'N/A',
      'Parent Name': lead.parent.parentName,
      'Mobile 1': lead.parent.mobile1,
      'Mobile 2': lead.parent.mobile2 || 'N/A',
      'Address': lead.parent.address,
      'District': lead.parent.district,
      'Pincode': lead.parent.pincode,
      'HSC Group': lead.academic.hscGroup,
      'HSC Reg No': lead.academic.hscRegisterNo,
      'Physics Marks': lead.academic.physicsMarks,
      'Chemistry Marks': lead.academic.chemistryMarks,
      'Biology Marks': lead.academic.biologyMarks,
      'HSC Total Marks': lead.academic.totalMarks,
      'NEET Score': lead.neet.score,
      'NEET App Number': lead.neet.applicationNumber,
      'Interested Country': lead.neet.interestedCountry,
      'Application Date': new Date(lead.createdDate).toLocaleDateString(),
      'Status': lead.status
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Filtered Leads');
    XLSX.writeFile(workbook, 'svet_applications.xlsx');
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Pending Review':
        return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'Document Verification':
        return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'Visa Processing':
        return 'bg-violet-50 text-violet-700 border border-violet-200';
      case 'Admitted':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'Rejected':
        return 'bg-red-50 text-red-700 border border-red-200';
      default:
        return 'bg-slate-50 text-slate-700 border border-slate-200';
    }
  };

  return (
    <div className="min-h-screen bg-primary-bg text-primary-text flex flex-col md:flex-row">
      
      {/* SIDEBAR PANEL */}
      <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-border-color flex flex-col justify-between p-6 shrink-0">
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
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-secondary-text hover:text-primary-blue hover:bg-secondary-bg transition-all font-semibold"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>
            <Link 
              to="/admin/leads" 
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm bg-secondary-blue/10 text-secondary-blue font-bold border border-secondary-blue/15"
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

      {/* LEADS LIST MAIN */}
      <main className="flex-grow p-6 md:p-10 space-y-6 overflow-y-auto max-h-screen">
        
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display font-extrabold text-2xl md:text-3xl text-primary-blue">Leads Management</h1>
            <p className="text-xs text-secondary-text font-light">Search, filter, update statuses, and export student applications.</p>
          </div>

          <Button 
            variant="primary" 
            onClick={handleExport}
            className="gap-2 text-xs py-2 px-4 shrink-0 font-semibold"
          >
            <Download className="w-4 h-4 text-white" />
            <span>Export Excel</span>
          </Button>
        </div>

        {/* SEARCH AND FILTERS PANEL */}
        <Card className="p-4 bg-white border border-border-color flex flex-col md:flex-row md:items-center gap-4 shadow-sm">
          
          {/* Search bar */}
          <div className="relative flex-grow">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
              <Search className="w-4 h-4" />
            </span>
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by student name, mobile, or NEET number..."
              className="w-full bg-white border border-border-color rounded-lg pl-10 pr-4 py-2.5 text-xs text-primary-text placeholder-slate-400 focus:outline-none focus:border-secondary-blue focus:ring-1 focus:ring-secondary-blue/30"
            />
          </div>

          {/* Filters controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 shrink-0">
            {/* Country filter */}
            <div className="flex items-center gap-2 border border-border-color rounded-lg bg-white px-3 py-1">
              <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <select 
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
                className="bg-transparent border-0 text-xs text-secondary-text focus:outline-none py-1.5 w-full font-semibold"
              >
                <option value="">All Countries</option>
                {['Uzbekistan', 'Malaysia', 'Russia', 'UK', 'Germany', 'USA', 'Kyrgyzstan', 'Philippines', 'Georgia', 'Singapore'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Status filter */}
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border border-border-color text-xs rounded-lg px-3 py-2 text-secondary-text focus:outline-none font-semibold"
            >
              <option value="">All Statuses</option>
              {['Pending Review', 'Document Verification', 'Visa Processing', 'Admitted', 'Rejected'].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            {/* Date filter */}
            <select 
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="bg-white border border-border-color text-xs rounded-lg px-3 py-2 text-secondary-text focus:outline-none font-semibold"
            >
              <option value="all">All Dates</option>
              <option value="today">Today's Leads</option>
              <option value="last7">Last 7 Days</option>
              <option value="last30">Last 30 Days</option>
            </select>
          </div>

        </Card>

        {/* LEADS LIST TABLE */}
        <Card className="border border-border-color bg-white p-0 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              
              <thead>
                <tr className="bg-primary-bg/75 border-b border-border-color text-secondary-text uppercase font-bold tracking-wider">
                  <th className="px-6 py-4">Student Name</th>
                  <th className="px-6 py-4">Contact Number</th>
                  <th className="px-6 py-4">Preferred Country</th>
                  <th className="px-6 py-4 text-center">NEET Score</th>
                  <th className="px-6 py-4">Application Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border-color">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-secondary-text">
                      <div className="flex items-center justify-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin text-secondary-blue" />
                        <span>Loading lead profiles...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredLeads.length > 0 ? (
                  filteredLeads.map((app) => (
                    <tr key={app.id} className="hover:bg-primary-bg/40 transition-colors">
                      {/* Name */}
                      <td className="px-6 py-4 font-bold text-primary-blue">
                        <div>
                          <span>{app.personal.name}</span>
                          <span className="block text-[10px] text-secondary-text font-normal font-mono mt-0.5">{app.id}</span>
                        </div>
                      </td>
                      
                      {/* Mobile */}
                      <td className="px-6 py-4 font-medium text-secondary-text">
                        {app.parent.mobile1}
                      </td>

                      {/* Country */}
                      <td className="px-6 py-4 font-medium text-secondary-text">
                        {app.neet.interestedCountry}
                      </td>

                      {/* NEET score */}
                      <td className="px-6 py-4 text-center font-bold text-secondary-blue">
                        {app.neet.score}
                      </td>

                      {/* Created date */}
                      <td className="px-6 py-4 text-secondary-text font-medium">
                        {new Date(app.createdDate).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        {editingStatusId === app.id ? (
                          <select
                            value={app.status}
                            onChange={(e) => handleStatusChange(app.id, e.target.value)}
                            onBlur={() => setEditingStatusId(null)}
                            className="bg-white border border-border-color text-xs rounded px-2 py-1 focus:outline-none focus:border-secondary-blue"
                            autoFocus
                          >
                            {['Pending Review', 'Document Verification', 'Visa Processing', 'Admitted', 'Rejected'].map(s => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        ) : (
                          <div 
                            className="flex items-center gap-1.5 cursor-pointer group"
                            onClick={() => setEditingStatusId(app.id)}
                          >
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide ${getStatusBadgeClass(app.status)}`}>
                              {app.status}
                            </span>
                            <FileEdit className="w-3.5 h-3.5 text-secondary-text/40 group-hover:text-secondary-blue transition-colors opacity-0 group-hover:opacity-100 shrink-0" />
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={() => setSelectedStudent(app)}
                            className="p-1.5 rounded bg-primary-bg hover:bg-secondary-blue/15 text-secondary-text hover:text-secondary-blue transition-all cursor-pointer border border-border-color/60"
                            title="View Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(app.id, app.personal.name)}
                            className="p-1.5 rounded bg-primary-bg hover:bg-red-50 text-secondary-text hover:text-white transition-all cursor-pointer border border-border-color/60 hover:border-red-200"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-secondary-text font-light">
                      No leads matched your search/filter criteria.
                    </td>
                  </tr>
                )}
              </tbody>

            </table>
          </div>
          
          {/* Table footer count */}
          <div className="p-4 bg-primary-bg/20 border-t border-border-color flex items-center justify-between text-secondary-text font-medium">
            <span>Showing {filteredLeads.length} leads</span>
            <span>Total Database: {applications.length}</span>
          </div>
        </Card>

      </main>

      {/* DETAIL DRAWER COMPONENT */}
      <StudentDetailDrawer 
        student={selectedStudent} 
        onClose={() => setSelectedStudent(null)} 
      />

    </div>
  );
}
