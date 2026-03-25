import React from 'react';
import { Search, HelpCircle, ChevronDown } from 'lucide-react';

const Navbar: React.FC = () => {
  const user = JSON.parse(localStorage.getItem('user') || 'null') as { name?: string } | null;
  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <header className="h-14 bg-white border-b border-border flex items-center px-6 gap-4 shrink-0">
      {/* Search */}
      <div className="flex items-center gap-2 px-3 py-2 bg-[#F4F5F7] rounded-lg w-64 border border-border">
        <Search size={14} className="text-text-muted shrink-0" />
        <input
          type="text"
          placeholder="Search"
          className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none"
        />
        <div className="flex items-center gap-1 shrink-0">
          <kbd className="text-[10px] text-text-muted bg-white border border-border rounded px-1">⌘</kbd>
          <kbd className="text-[10px] text-text-muted bg-white border border-border rounded px-1">F</kbd>
        </div>
      </div>

      <div className="flex items-center gap-4 ml-auto">
        {/* Help Center */}
        <button className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition">
          <HelpCircle size={16} />
          <span className="hidden sm:inline">Help Center</span>
        </button>

        {/* User */}
        <button className="flex items-center gap-2 hover:bg-background px-2 py-1.5 rounded-lg transition">
          <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
            {initials}
          </div>
          <span className="text-sm font-medium text-text-primary hidden sm:inline">
            {user?.name?.split(' ')[0] ?? 'User'} {user?.name?.split(' ')[1]?.[0] ? user.name!.split(' ')[1][0] + '.' : ''}
          </span>
          <ChevronDown size={14} className="text-text-muted" />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
