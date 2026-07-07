import React from 'react';
import Sidebar from '../Sidebar';
import Navbar from '../Navbar';

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-[#f8fafc] dark:bg-[#0f172a] text-slate-800 dark:text-slate-100 transition-colors duration-200 overflow-hidden font-sans">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Panel Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <Navbar />

        {/* Dynamic Page Content Scroll container */}
        <main className="flex-1 overflow-y-auto bg-slate-50/50 dark:bg-slate-950/20 scrollbar">
          <div className="animate-fade-in py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
