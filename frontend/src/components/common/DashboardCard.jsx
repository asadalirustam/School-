import React from 'react';

const DashboardCard = ({ title, value, icon: Icon, color = 'blue', subtext }) => {
  const colorMap = {
    blue: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800',
    green: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
    yellow: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800',
    purple: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800',
    rose: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800',
    indigo: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800'
  };

  const selectedColor = colorMap[color] || colorMap.blue;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-slate-800 dark:text-white leading-none mb-1">{value}</h3>
          {subtext && <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400">{subtext}</p>}
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${selectedColor}`}>
          <Icon className="w-6 h-6 shrink-0" />
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
