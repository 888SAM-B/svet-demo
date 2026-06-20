import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Globe, GraduationCap, LogOut, Image } from 'lucide-react';

const NAV_LINKS = [
  { path: '/admin/dashboard', label: 'Dashboard',          icon: LayoutDashboard },
  { path: '/admin/leads',     label: 'Leads Management',   icon: Users           },
  { path: '/admin/countries', label: 'Country Management', icon: Globe           },
  { path: '/admin/gallery',   label: 'Homepage Gallery',   icon: Image           },
];

export default function AdminSidebar() {
  const location = useLocation();
  const navigate  = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('svet_admin_token');
    navigate('/admin');
  };

  return (
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
          {NAV_LINKS.map(({ path, label, icon: Icon }) => {
            const isActive =
              location.pathname === path ||
              (path !== '/admin/dashboard' && location.pathname.startsWith(path));
            return (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all font-semibold ${
                  isActive
                    ? 'bg-secondary-blue/10 text-secondary-blue border border-secondary-blue/15'
                    : 'text-secondary-text hover:text-primary-blue hover:bg-secondary-bg'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout */}
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
  );
}
