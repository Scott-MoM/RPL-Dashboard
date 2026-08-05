import React from 'react';
import { User, UserRole, Region, ViewMode } from '../types';
import { Mountain, UserCheck, Shield, RefreshCw, LogOut } from 'lucide-react';

interface HeaderProps {
  currentUser: User;
  onRoleChange: (role: UserRole) => void;
  selectedRegion: Region;
  currentView: ViewMode;
  onLogout: () => void;
  lastRefreshTime: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onRoleChange,
  selectedRegion,
  currentView,
  onLogout,
  lastRefreshTime
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#0e1726]/90 backdrop-blur-md border-b border-white/10 px-4 py-3 shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-400 via-amber-400 to-pink-500 p-0.5 shadow-md shadow-teal-500/20">
            <div className="w-full h-full bg-[#0a0a12] rounded-[10px] flex items-center justify-center">
              <Mountain className="w-5 h-5 text-teal-300" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-teal-300 via-amber-200 to-pink-400 bg-clip-text text-transparent">
                Mind Over Mountains
              </h1>
              <span className="text-xs px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 font-mono font-semibold">
                KPI System
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Regional KPI Dashboard • <span className="text-slate-200 font-medium">{currentView}</span> ({selectedRegion})
            </p>
          </div>
        </div>

        {/* User Info & Quick Role Selector */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Refresh badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 font-mono">
            <RefreshCw className="w-3.5 h-3.5 animate-spin-slow text-emerald-400" />
            <span>Synced: {lastRefreshTime}</span>
          </div>

          {/* Role badge */}
          <div className="flex items-center gap-1.5 bg-slate-900/80 border border-white/10 px-3 py-1.5 rounded-xl">
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs font-semibold text-slate-300">Role:</span>
            <span className="text-xs px-2.5 py-0.5 rounded-lg font-extrabold active-tab-gradient text-slate-900 shadow-sm">
              {currentUser.role}
            </span>
          </div>

          {/* User pill */}
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl text-xs">
            <UserCheck className="w-4 h-4 text-teal-400" />
            <div className="text-left">
              <div className="font-semibold text-slate-100">{currentUser.name}</div>
              <div className="text-[10px] text-slate-400 truncate max-w-[140px]">{currentUser.email}</div>
            </div>
            <button
              onClick={onLogout}
              title="Sign Out"
              className="ml-1 p-1 hover:bg-rose-500/20 hover:text-rose-300 rounded-lg text-slate-400 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
