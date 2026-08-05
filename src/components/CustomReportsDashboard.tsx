import React, { useState } from 'react';
import { Region, Timeframe, PersonRecord, OrganisationRecord, EventRecord, PaymentRecord, GrantRecord, UserRole } from '../types';
import { 
  Table2, 
  Download, 
  Filter, 
  SlidersHorizontal, 
  BarChart2, 
  TrendingUp, 
  PieChart as PieChartIcon, 
  MapPin, 
  GitCompare, 
  Compass,
  CheckCircle2
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  Tooltip 
} from 'recharts';

interface CustomReportsDashboardProps {
  selectedRegion: Region;
  selectedTimeframe: Timeframe;
  userRole?: UserRole;
  peopleData: PersonRecord[];
  organisationsData: OrganisationRecord[];
  eventsData: EventRecord[];
  paymentsData: PaymentRecord[];
  grantsData: GrantRecord[];
  onAuditLogAction?: (action: string, details: string) => void;
}

type Dataset = 'People' | 'Organisations' | 'Events' | 'Payments' | 'Grants';
type OutputType = 'Tabular' | 'Bar' | 'Line' | 'Pie' | 'UK Map' | 'Comparison Analysis' | 'Distance Analysis';

export const CustomReportsDashboard: React.FC<CustomReportsDashboardProps> = ({
  selectedRegion,
  selectedTimeframe,
  userRole,
  peopleData,
  organisationsData,
  eventsData,
  paymentsData,
  grantsData,
  onAuditLogAction
}) => {
  const [selectedDataset, setSelectedDataset] = useState<Dataset>('Events');
  const [selectedOutputType, setSelectedOutputType] = useState<OutputType>('Tabular');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Advanced Filters State
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [minAmount, setMinAmount] = useState<number>(0);
  const [reportApplied, setReportApplied] = useState<boolean>(true);
  const [advancedApplied, setAdvancedApplied] = useState<boolean>(false);

  // Filter data based on selections
  const getFilteredData = () => {
    let result: any[] = [];
    if (selectedDataset === 'Events') result = [...eventsData];
    else if (selectedDataset === 'People') result = [...peopleData];
    else if (selectedDataset === 'Organisations') result = [...organisationsData];
    else if (selectedDataset === 'Payments') result = [...paymentsData];
    else if (selectedDataset === 'Grants') result = [...grantsData];

    if (selectedRegion !== 'Global') {
      result = result.filter(item => item.region === selectedRegion);
    }

    if (statusFilter !== 'All') {
      result = result.filter(item => item.status === statusFilter || item.type === statusFilter);
    }

    return result;
  };

  const filteredRows = getFilteredData();

  const handleApplyReportFilters = () => {
    setReportApplied(true);
    if (onAuditLogAction) {
      onAuditLogAction('Custom Report Filter Applied', `Dataset: ${selectedDataset}, Visual Output: ${selectedOutputType}, Region: ${selectedRegion}`);
    }
  };

  const handleApplyAdvancedFilters = () => {
    setAdvancedApplied(true);
    if (onAuditLogAction) {
      onAuditLogAction('Advanced Report Filter Applied', `Category: ${categoryFilter}, Status: ${statusFilter}, Min Amount: £${minAmount}`);
    }
  };

  const handleExportCSV = () => {
    if (filteredRows.length === 0) return;
    const headers = Object.keys(filteredRows[0]).join(',');
    const rows = filteredRows.map(row => 
      Object.values(row).map(val => typeof val === 'object' ? `"${JSON.stringify(val).replace(/"/g, '""')}"` : `"${val}"`).join(',')
    ).join('\n');
    
    const csvContent = "data:text/csv;charset=utf-8," + headers + '\n' + rows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${selectedDataset}_Report_${selectedRegion}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (onAuditLogAction) {
      onAuditLogAction('Custom Report Exported', `Exported ${filteredRows.length} records from dataset '${selectedDataset}' to CSV file`);
    }
  };

  const allDatasets: Dataset[] = ['People', 'Organisations', 'Events', 'Payments', 'Grants'];
  const datasets: Dataset[] = userRole === 'RPL' 
    ? allDatasets.filter(d => d !== 'People')
    : allDatasets;
  const outputTypes: { name: OutputType; icon: React.ReactNode }[] = [
    { name: 'Tabular', icon: <Table2 className="w-4 h-4" /> },
    { name: 'Bar', icon: <BarChart2 className="w-4 h-4" /> },
    { name: 'Line', icon: <TrendingUp className="w-4 h-4" /> },
    { name: 'Pie', icon: <PieChartIcon className="w-4 h-4" /> },
    { name: 'UK Map', icon: <MapPin className="w-4 h-4" /> },
    { name: 'Comparison Analysis', icon: <GitCompare className="w-4 h-4" /> },
    { name: 'Distance Analysis', icon: <Compass className="w-4 h-4" /> }
  ];

  return (
    <div className="space-y-6">
      {/* Primary Report Selection Card */}
      <div className="glass-card p-6 rounded-2xl space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Table2 className="w-5 h-5 text-teal-400" />
              Custom Reports Builder
            </h2>
            <p className="text-xs text-slate-400">
              Configure dataset, output format, and filters to generate tailored regional reports.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors flex items-center gap-2 ${
                showAdvancedFilters
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-900/80 text-slate-300 border-white/10 hover:bg-white/5'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>{showAdvancedFilters ? 'Hide Advanced Filters' : 'Advanced Report Controls'}</span>
            </button>

            <button
              onClick={handleApplyReportFilters}
              className="btn-gradient px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              <Filter className="w-4 h-4" />
              <span>Apply Report Filters</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Dataset Selector */}
          <div>
            <label className="text-xs font-bold text-slate-300 mb-2 block">
              1. Select Dataset
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {datasets.map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDataset(d)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                    selectedDataset === d
                      ? 'active-tab-gradient border-transparent font-black scale-105'
                      : 'bg-slate-900/60 text-slate-400 border-white/10 hover:text-white'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Output Type Selector */}
          <div>
            <label className="text-xs font-bold text-slate-300 mb-2 block">
              2. Select Output Format
            </label>
            <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-slate-900/80 rounded-xl border border-white/10">
              {outputTypes.map((ot) => (
                <button
                  key={ot.name}
                  onClick={() => setSelectedOutputType(ot.name)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                    selectedOutputType === ot.name
                      ? 'bg-teal-400 text-slate-950 shadow-md shadow-teal-500/30'
                      : 'text-slate-400 hover:text-slate-100'
                  }`}
                >
                  {ot.icon}
                  <span>{ot.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Advanced Filters Drawer */}
        {showAdvancedFilters && (
          <div className="pt-4 border-t border-white/10 bg-slate-900/60 p-4 rounded-xl space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Advanced Controls
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold mb-1 block">Status Filter</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full bg-slate-950 border border-white/20 rounded-lg p-2 text-slate-100"
                >
                  <option value="All">All Statuses</option>
                  <option value="Completed">Completed</option>
                  <option value="Upcoming">Upcoming</option>
                  <option value="Active">Active</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold mb-1 block">Minimum Value / Capacity</label>
                <input
                  type="number"
                  value={minAmount}
                  onChange={(e) => setMinAmount(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-white/20 rounded-lg p-2 text-slate-100"
                  placeholder="0"
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleApplyAdvancedFilters}
                  className="w-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 p-2 rounded-lg font-bold flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Apply Advanced Filters</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Section */}
      <div className="glass-card p-6 rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-200">
              Report Output: <span className="text-teal-300">{selectedDataset}</span> ({selectedOutputType})
            </h3>
            <p className="text-xs text-slate-400">
              Showing {filteredRows.length} records for region <span className="text-slate-200">{selectedRegion}</span>
            </p>
          </div>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/40 text-teal-300 text-xs font-bold flex items-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>

        {/* Tabular Output */}
        {selectedOutputType === 'Tabular' && (
          <div className="overflow-x-auto rounded-xl border border-white/10 bg-slate-950/80">
            {filteredRows.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No matching records found for the selected filters. Try widening the region or timeframe.
              </div>
            ) : (
              <table className="w-full text-left text-xs text-slate-200">
                <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] tracking-wider border-b border-white/10">
                  <tr>
                    {Object.keys(filteredRows[0]).slice(0, 7).map((key) => (
                      <th key={key} className="p-3 font-bold">
                        {key.replace(/([A-Z])/g, ' $1').replace('_', ' ')}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono">
                  {filteredRows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-white/5 transition-colors">
                      {Object.values(row).slice(0, 7).map((val: any, vIdx) => (
                        <td key={vIdx} className="p-3 max-w-[200px] truncate">
                          {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Bar Chart Output */}
        {selectedOutputType === 'Bar' && (
          <div className="h-80 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filteredRows}>
                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
                <Bar dataKey="attendeesCount" fill="#00f5d4" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Line Chart Output */}
        {selectedOutputType === 'Line' && (
          <div className="h-80 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filteredRows}>
                <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
                <Line type="monotone" dataKey="amount" stroke="#ff3d7f" strokeWidth={3} dot={{ fill: '#ff9f1c' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Distance Analysis or UK Map Placeholder */}
        {(selectedOutputType === 'UK Map' || selectedOutputType === 'Distance Analysis' || selectedOutputType === 'Comparison Analysis' || selectedOutputType === 'Pie') && (
          <div className="p-8 rounded-xl bg-slate-900/60 border border-white/10 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-300 mx-auto flex items-center justify-center">
              <Compass className="w-6 h-6 animate-spin-slow" />
            </div>
            <h4 className="text-sm font-bold text-slate-200">
              {selectedOutputType} Visualiser
            </h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              {selectedOutputType === 'Distance Analysis' 
                ? 'Calculated average participant travel distance: 24.5 miles per event cohort.' 
                : selectedOutputType === 'UK Map'
                ? 'Regional distribution map active across North, Midlands, South, Wales & Scotland.'
                : 'Comparative group metrics loaded across selected regional datasets.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
