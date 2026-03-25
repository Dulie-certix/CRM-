import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children, title, subtitle, actions }) => (
  <div className="flex h-screen bg-background overflow-hidden font-sans">
    <Sidebar />
    <div className="flex flex-col flex-1 min-w-0 ml-[200px]">
      <Navbar />
      <main className="flex-1 overflow-y-auto p-6">
        {(title || actions) && (
          <div className="flex items-start justify-between mb-6 gap-4">
            <div>
              {title && <h1 className="text-3xl font-bold text-text-primary">{title}</h1>}
              {subtitle && <p className="text-sm text-text-secondary mt-1">{subtitle}</p>}
            </div>
            {actions && <div className="shrink-0">{actions}</div>}
          </div>
        )}
        {children}
      </main>
    </div>
  </div>
);

export default Layout;
