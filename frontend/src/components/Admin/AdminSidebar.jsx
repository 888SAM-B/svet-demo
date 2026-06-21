import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Globe, 
  GraduationCap, 
  LogOut, 
  Image, 
  ShieldAlert, 
  UsersRound, 
  Settings, 
  ShieldCheck 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const NAV_LINKS = [
  { path: '/dashboard',          label: 'Dashboard',          icon: LayoutDashboard, roles: ['MASTER_ADMIN', 'LEAD_MANAGER'] },
  { path: '/manage-leads',       label: 'Leads Management',   icon: Users,           roles: ['MASTER_ADMIN', 'LEAD_MANAGER'] },
  { path: '/country-management', label: 'Country Management', icon: Globe,           roles: ['MASTER_ADMIN', 'COUNTRY_MANAGER'] },
  { path: '/gallery',           label: 'Homepage Gallery',   icon: Image,           roles: ['MASTER_ADMIN', 'LEAD_MANAGER'] },
  { path: '/users',             label: 'User Management',    icon: UsersRound,      roles: ['MASTER_ADMIN'] },
  { path: '/administration',    label: 'System Control',     icon: ShieldCheck,     roles: ['MASTER_ADMIN'] },
  { path: '/settings',          label: 'Settings',           icon: Settings,        roles: ['MASTER_ADMIN'] }
];

export default function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (!user) return null;

  // Filter links based on user role
  const visibleLinks = NAV_LINKS.filter(link => link.roles.includes(user.role));

  const roleLabels = {
    MASTER_ADMIN: 'Master Admin',
    LEAD_MANAGER: 'Lead Manager',
    COUNTRY_MANAGER: 'Country Manager'
  };

  const roleColors = {
    MASTER_ADMIN: 'bg-red-50 text-red-600 border-red-100',
    LEAD_MANAGER: 'bg-blue-50 text-blue-600 border-blue-100',
    COUNTRY_MANAGER: 'bg-emerald-50 text-emerald-600 border-emerald-100'
  };

  return (
    <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-[#DBE2EF] flex flex-col justify-between p-6 shrink-0 shadow-sm">
      <div className="space-y-8">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#3F72AF]/10 flex items-center justify-center border border-[#3F72AF]/20">
            <GraduationCap className="w-5 h-5 text-[#3F72AF]" />
          </div>
          <div>
            <span className="font-display font-extrabold text-lg text-[#112D4E]">SVET Control</span>
            <span className="text-[9px] text-[#3F72AF] uppercase tracking-widest block font-bold leading-none mt-0.5">Control Center</span>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex flex-col gap-1">
          {visibleLinks.map(({ path, label, icon: Icon }) => {
            const isActive =
              location.pathname === path ||
              (path !== '/dashboard' && location.pathname.startsWith(path));
            return (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all font-semibold ${
                  isActive
                    ? 'bg-[#3F72AF]/15 text-[#112D4E] border border-[#3F72AF]/10'
                    : 'text-gray-500 hover:text-[#112D4E] hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Info & Logout */}
      <div className="pt-6 border-t border-[#DBE2EF] flex flex-col gap-4 mt-6 md:mt-0">
        <div className="px-1 text-left space-y-1">
          <p className="text-sm font-bold text-[#112D4E] truncate">{user.name}</p>
          <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full border inline-block ${roleColors[user.role] || 'bg-gray-50 text-gray-500'}`}>
            {roleLabels[user.role] || user.role}
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 hover:bg-red-100 border border-red-200 hover:border-red-300 text-red-600 rounded-lg text-xs font-bold cursor-pointer transition-all duration-200"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
}
