import React, { useState } from 'react';
import { ViewMode, Region, Timeframe, UserRole, isViewAllowedForRole } from '../types';
import { 
  BarChart3, 
  Table2, 
  BookOpen, 
  FileText, 
  ShieldAlert, 
  Compass, 
  Building2, 
  MapPin, 
  Calendar, 
  RefreshCw,
  Clock,
  CalendarDays,
  Sliders
} from 'lucide-react';

interface SidebarProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  selectedRegion: Region;
  onRegionChange: (region: Region) => void;
  selectedTimeframe: Timeframe;
  onTimeframeChange: (timeframe: Timeframe) => void;
  userRole: UserRole;
  lastRefreshTime: string;
  onManualSync: () => void;
  isSyncing: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onViewChange,
  selectedRegion,
  onRegionChange,
  selectedTimeframe,
  onTimeframeChange,
  userRole,
  lastRefreshTime,
  onManualSync,
  isSyncing
}) => {
  // Sub-filter options state
  const [selectedMonth, setSelectedMonth] = useState('August 2026');
  const [selectedWeek, setSelectedWeek] = useState('Week 32 (04 Aug - 10 Aug 2026)');
  const [selectedQuarter, setSelectedQuarter] = useState('Q3 2026 (Jul - Sep)');
  const [selectedYearOption, setSelectedYearOption] = useState('2026');
  const [customPreset, setCustomPreset] = useState('Last 90 Days');
  const [customStartDate, setCustomStartDate] = useState('2026-05-07');
  const [customEndDate, setCustomEndDate] = useState('2026-08-05');

  // Available views by role
  const allViews: { name: ViewMode; icon: React.ReactNode }[] = [
    { name: 'KPI Dashboard', icon: <BarChart3 className="w-4 h-4" /> },
    { name: 'Custom Reports Dashboard', icon: <Table2 className="w-4 h-4" /> },
    { name: 'Case Studies', icon: <BookOpen className="w-4 h-4" /> },
    { name: 'Data Request Form', icon: <FileText className="w-4 h-4" /> },
    { name: 'ML Dashboard', icon: <Compass className="w-4 h-4" /> },
    { name: 'Funder Dashboard', icon: <Building2 className="w-4 h-4" /> },
    { name: 'Admin Dashboard', icon: <ShieldAlert className="w-4 h-4" /> }
  ];

  const filteredViews = allViews.filter(v => isViewAllowedForRole(userRole, v.name));

  const REGION_OPTIONS: Region[] = ["Global", "North of England", "South of England", "Midlands", "Wales", "Other"];
  const TIMEFRAME_OPTIONS: Timeframe[] = ["All Time", "Year", "Quarter", "Month", "Week", "Custom Range"];

  // Helper for preset date calculation
  const handlePresetChange = (preset: string) => {
    setCustomPreset(preset);
    if (preset === 'Last 7 Days') {
      setCustomStartDate('2026-07-29');
      setCustomEndDate('2026-08-05');
    } else if (preset === 'Last 30 Days') {
      setCustomStartDate('2026-07-06');
      setCustomEndDate('2026-08-05');
    } else if (preset === 'Last 90 Days') {
      setCustomStartDate('2026-05-07');
      setCustomEndDate('2026-08-05');
    } else if (preset === 'Year to Date') {
      setCustomStartDate('2026-01-01');
      setCustomEndDate('2026-08-05');
    }
  };

  return (
    <aside className="w-full md:w-64 bg-slate-900/95 border-r border-white/10 p-4 flex flex-col gap-6 shrink-0">
      {/* View Mode Section */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-teal-400 mb-2 block">
          View Mode
        </label>
        <div className="space-y-1">
          {filteredViews.map((item) => {
            const isActive = currentView === item.name;
            return (
              <button
                key={item.name}
                onClick={() => onViewChange(item.name)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all text-left ${
                  isActive
                    ? 'btn-gradient text-slate-950 font-extrabold shadow-lg shadow-teal-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <span className={isActive ? 'text-slate-950' : 'text-teal-400'}>{item.icon}</span>
                <span className="truncate">{item.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      <hr className="border-white/10" />

      {/* Region Selector */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5" />
          Region Context
        </label>
        <select
          value={selectedRegion}
          onChange={(e) => onRegionChange(e.target.value as Region)}
          className="w-full bg-slate-950 border border-white/20 rounded-xl px-3 py-2 text-xs font-semibold text-slate-100 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400"
        >
          {REGION_OPTIONS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      {/* Timeframe Selector & Secondary Fields */}
      <div className="space-y-3">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-pink-400 mb-2 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            Timeframe Granularity
          </label>
          <select
            value={selectedTimeframe}
            onChange={(e) => onTimeframeChange(e.target.value as Timeframe)}
            className="w-full bg-slate-950 border border-white/20 rounded-xl px-3 py-2 text-xs font-semibold text-slate-100 focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400"
          >
            {TIMEFRAME_OPTIONS.map((tf) => (
              <option key={tf} value={tf}>
                {tf}
              </option>
            ))}
          </select>
        </div>

        {/* Conditional Secondary Fields based on selectedTimeframe */}
        {selectedTimeframe === 'Month' && (
          <div className="p-2.5 rounded-xl bg-pink-500/10 border border-pink-500/30 space-y-1.5 animate-fade-in">
            <label className="text-[11px] font-bold text-pink-300 flex items-center gap-1">
              <CalendarDays className="w-3 h-3 text-pink-400" />
              Select Month & Year
            </label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full bg-slate-950 border border-pink-500/30 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-100 focus:outline-none focus:border-pink-400"
            >
              <option value="August 2026">August 2026 (Current)</option>
              <option value="July 2026">July 2026</option>
              <option value="June 2026">June 2026</option>
              <option value="May 2026">May 2026</option>
              <option value="April 2026">April 2026</option>
              <option value="March 2026">March 2026</option>
              <option value="February 2026">February 2026</option>
              <option value="January 2026">January 2026</option>
              <option value="December 2025">December 2025</option>
              <option value="November 2025">November 2025</option>
              <option value="October 2025">October 2025</option>
            </select>
            <div className="text-[10px] text-pink-200/80 font-mono">
              Scope: 01 - 31 {selectedMonth}
            </div>
          </div>
        )}

        {selectedTimeframe === 'Week' && (
          <div className="p-2.5 rounded-xl bg-pink-500/10 border border-pink-500/30 space-y-1.5 animate-fade-in">
            <label className="text-[11px] font-bold text-pink-300 flex items-center gap-1">
              <Clock className="w-3 h-3 text-pink-400" />
              Select Specific Week
            </label>
            <select
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(e.target.value)}
              className="w-full bg-slate-950 border border-pink-500/30 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-100 focus:outline-none focus:border-pink-400"
            >
              <option value="Week 32 (04 Aug - 10 Aug 2026)">Week 32 (04 Aug - 10 Aug 2026)</option>
              <option value="Week 31 (28 Jul - 03 Aug 2026)">Week 31 (28 Jul - 03 Aug 2026)</option>
              <option value="Week 30 (21 Jul - 27 Jul 2026)">Week 30 (21 Jul - 27 Jul 2026)</option>
              <option value="Week 29 (14 Jul - 20 Jul 2026)">Week 29 (14 Jul - 20 Jul 2026)</option>
              <option value="Week 28 (07 Jul - 13 Jul 2026)">Week 28 (07 Jul - 13 Jul 2026)</option>
              <option value="Week 27 (30 Jun - 06 Jul 2026)">Week 27 (30 Jun - 06 Jul 2026)</option>
            </select>
            <div className="text-[10px] text-pink-200/80 font-mono">
              7-day activity window selected
            </div>
          </div>
        )}

        {selectedTimeframe === 'Quarter' && (
          <div className="p-2.5 rounded-xl bg-pink-500/10 border border-pink-500/30 space-y-1.5 animate-fade-in">
            <label className="text-[11px] font-bold text-pink-300 flex items-center gap-1">
              <Sliders className="w-3 h-3 text-pink-400" />
              Select Quarter & Year
            </label>
            <select
              value={selectedQuarter}
              onChange={(e) => setSelectedQuarter(e.target.value)}
              className="w-full bg-slate-950 border border-pink-500/30 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-100 focus:outline-none focus:border-pink-400"
            >
              <option value="Q3 2026 (Jul - Sep)">Q3 2026 (Jul - Sep)</option>
              <option value="Q2 2026 (Apr - Jun)">Q2 2026 (Apr - Jun)</option>
              <option value="Q1 2026 (Jan - Mar)">Q1 2026 (Jan - Mar)</option>
              <option value="Q4 2025 (Oct - Dec)">Q4 2025 (Oct - Dec)</option>
              <option value="Q3 2025 (Jul - Sep)">Q3 2025 (Jul - Sep)</option>
              <option value="Q2 2025 (Apr - Jun)">Q2 2025 (Apr - Jun)</option>
              <option value="Q1 2025 (Jan - Mar)">Q1 2025 (Jan - Mar)</option>
            </select>
            <div className="text-[10px] text-pink-200/80 font-mono">
              Quarterly aggregate reporting context
            </div>
          </div>
        )}

        {selectedTimeframe === 'Year' && (
          <div className="p-2.5 rounded-xl bg-pink-500/10 border border-pink-500/30 space-y-1.5 animate-fade-in">
            <label className="text-[11px] font-bold text-pink-300 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-pink-400" />
              Select Calendar Year
            </label>
            <select
              value={selectedYearOption}
              onChange={(e) => setSelectedYearOption(e.target.value)}
              className="w-full bg-slate-950 border border-pink-500/30 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-100 focus:outline-none focus:border-pink-400"
            >
              <option value="2026">2026 (Current Year)</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
            </select>
            <div className="text-[10px] text-pink-200/80 font-mono">
              Full 12-month annual scope: {selectedYearOption}
            </div>
          </div>
        )}

        {selectedTimeframe === 'Custom Range' && (
          <div className="p-2.5 rounded-xl bg-pink-500/10 border border-pink-500/30 space-y-2.5 animate-fade-in">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-pink-300 flex items-center gap-1">
                <Sliders className="w-3 h-3 text-pink-400" />
                Quick Preset Range
              </label>
              <select
                value={customPreset}
                onChange={(e) => handlePresetChange(e.target.value)}
                className="w-full bg-slate-950 border border-pink-500/30 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-100 focus:outline-none focus:border-pink-400"
              >
                <option value="Last 7 Days">Last 7 Days</option>
                <option value="Last 30 Days">Last 30 Days</option>
                <option value="Last 90 Days">Last 90 Days</option>
                <option value="Year to Date">Year to Date</option>
                <option value="Custom Dates">Custom Specific Dates</option>
              </select>
            </div>

            <div className="space-y-2 pt-1 border-t border-pink-500/20">
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Start Date</label>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => {
                    setCustomStartDate(e.target.value);
                    setCustomPreset('Custom Dates');
                  }}
                  className="w-full bg-slate-950 border border-pink-500/30 rounded-lg px-2 py-1 text-xs text-slate-100 font-mono focus:outline-none focus:border-pink-400"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">End Date</label>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => {
                    setCustomEndDate(e.target.value);
                    setCustomPreset('Custom Dates');
                  }}
                  className="w-full bg-slate-950 border border-pink-500/30 rounded-lg px-2 py-1 text-xs text-slate-100 font-mono focus:outline-none focus:border-pink-400"
                />
              </div>
            </div>

            <div className="text-[10px] text-pink-200/90 font-mono bg-slate-950/80 p-1.5 rounded border border-white/10">
              Active: <span className="text-teal-300 font-bold">{customStartDate}</span> to <span className="text-teal-300 font-bold">{customEndDate}</span>
            </div>
          </div>
        )}
      </div>

      <hr className="border-white/10" />

      {/* Data Refresh Card */}
      <div className="glass-card p-3 rounded-2xl border border-emerald-500/30 bg-emerald-950/20">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-bold text-emerald-300 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Last Data Refresh
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
            Live
          </span>
        </div>
        <p className="text-xs text-slate-200 font-mono font-medium mb-3">
          {lastRefreshTime}
        </p>

        {userRole === 'Admin' && (
          <button
            onClick={onManualSync}
            disabled={isSyncing}
            className="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/40 text-teal-300 font-bold text-xs transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing Beacon...' : 'Sync Beacon Data'}</span>
          </button>
        )}
      </div>
    </aside>
  );
};

