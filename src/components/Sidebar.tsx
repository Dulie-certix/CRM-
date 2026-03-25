import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Bell, StickyNote, CheckSquare, Mail,
  Calendar, TrendingUp, Users, Building2, Puzzle, Settings,
  LogOut, ChevronDown, Zap,
} from 'lucide-react';

const NAV_MAIN = [
  { to: '/dashboard', label: 'Dashboard',     icon: LayoutDashboard },
  { to: '/notifications', label: 'Notifications', icon: Bell },
  { to: '/notes',     label: 'Notes',          icon: StickyNote },
  { to: '/tasks',     label: 'Tasks',          icon: CheckSquare },
  { to: '/emails',    label: 'Emails',         icon: Mail, hasArrow: true },
  { to: '/calendars', label: 'Calendars',      icon: Calendar },
];

const NAV_DB = [
  { to: '/analytics', label: 'Analytics', icon: TrendingUp },
  { to: '/contacts',  label: 'Contacts',  icon: Users },
  { to: '/companies', label: 'Companies', icon: Building2 },
];

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null') as { name?: string; email?: string } | null;
  const [teamOpen, setTeamOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  const link = (to: string, label: string, Icon: React.ElementType, hasArrow?: boolean) => (
    <NavLink
      key={to}
      to={to}
      className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
    >
      <Icon size={16} />
      <span className="flex-1">{label}</span>
      {hasArrow && <ChevronDown size={13} className="text-white/30" />}
    </NavLink>
  );

  return (
    <aside className="fixed inset-y-0 left-0 z-50 flex flex-col w-[200px] bg-sidebar shadow-sidebar">
      {/* Logo */}
      <div className="flex items-center gap-2 px-5 h-14 border-b border-white/8 shrink-0">
        <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary">
          <Zap size={14} className="text-white" />
        </div>
        <span className="text-white font-semibold text-base tracking-tight">Venture</span>
        <span className="ml-auto text-white/30 text-xs">&lt;/&gt;</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
        {NAV_MAIN.map(({ to, label, icon, hasArrow }) => link(to, label, icon, hasArrow))}

        <p className="px-3 pt-4 pb-1 text-[10px] font-semibold uppercase tracking-widest text-white/30">
          Database
        </p>
        {NAV_DB.map(({ to, label, icon }) => link(to, label, icon))}

        <div className="pt-2 space-y-0.5">
          {link('/integrations', 'Integrations', Puzzle)}
          {link('/settings', 'Settings', Settings)}
        </div>
      </nav>

      {/* Team footer */}
      <div className="px-2 py-3 border-t border-white/8 shrink-0">
        <button
          onClick={() => setTeamOpen(!teamOpen)}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/8 transition group"
        >
          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-white text-xs font-bold shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="text-xs font-medium text-white truncate">{user?.name ?? 'User'}</p>
            <p className="text-[10px] text-white/40 truncate">Marketing Team's</p>
          </div>
          <ChevronDown size={13} className="text-white/30" />
          <button onClick={(e) => { e.stopPropagation(); logout(); }} title="Logout"
            className="text-white/30 hover:text-red-400 transition opacity-0 group-hover:opacity-100">
            <LogOut size={13} />
          </button>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
