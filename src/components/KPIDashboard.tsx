import React, { useState } from 'react';
import { Region, Timeframe, UserRole } from '../types';
import { 
  Building2, 
  Handshake, 
  TrendingUp, 
  PoundSterling, 
  MessageSquare, 
  BookOpen, 
  Users, 
  MousePointerClick, 
  Sparkles,
  PieChart as PieChartIcon
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Cell, 
  PieChart, 
  Pie 
} from 'recharts';

interface KPIDashboardProps {
  selectedRegion: Region;
  selectedTimeframe: Timeframe;
  userRole: UserRole;
  onOpenDrillDown: (metricTitle: string, category: string) => void;
  onAuditLogAction?: (action: string, details: string) => void;
}

export const KPIDashboard: React.FC<KPIDashboardProps> = ({
  selectedRegion,
  selectedTimeframe,
  userRole,
  onOpenDrillDown,
  onAuditLogAction
}) => {
  const [activeTab, setActiveTab] = useState<'Governance' | 'Partnerships' | 'Delivery' | 'Income' | 'Comms' | 'Case Studies'>('Governance');

  const handleTabChange = (tabName: 'Governance' | 'Partnerships' | 'Delivery' | 'Income' | 'Comms' | 'Case Studies') => {
    setActiveTab(tabName);
    if (onAuditLogAction) {
      onAuditLogAction('KPI Metric Category Selected', `Switched active KPI view tab to '${tabName}'`);
    }
  };

  const categories = [
    { name: 'Governance', icon: <Building2 className="w-4 h-4" /> },
    { name: 'Partnerships', icon: <Handshake className="w-4 h-4" /> },
    { name: 'Delivery', icon: <TrendingUp className="w-4 h-4" /> },
    { name: 'Income', icon: <PoundSterling className="w-4 h-4" /> },
    { name: 'Comms', icon: <MessageSquare className="w-4 h-4" /> },
    { name: 'Case Studies', icon: <BookOpen className="w-4 h-4" /> }
  ] as const;

  // Region multipliers for dynamic numbers when region changes
  const regMultiplier = selectedRegion === 'Global' ? 1 : selectedRegion === 'North of England' ? 0.45 : selectedRegion === 'South of England' ? 0.25 : 0.15;

  const getMetricsForTab = () => {
    switch (activeTab) {
      case 'Governance':
        return [
          { title: 'Active Board Trustees', value: '7', change: '+1 this year', desc: 'Compliant with Charity Commission guidelines' },
          { title: 'Policy Audits Completed', value: '100%', change: 'All 12 policies current', desc: 'Safeguarding, Data & Financial Controls' },
          { title: 'Volunteer ML Compliance', value: Math.round(96 * regMultiplier) + '%', change: '+4%', desc: 'First Aid & Mountain Leader certified' },
          { title: 'Data Requests Processed', value: Math.round(14 * regMultiplier), change: '100% SLA met', desc: 'Formal data access requests logged' }
        ];
      case 'Partnerships':
        return [
          { title: 'Active Partner Organisations', value: Math.round(28 * regMultiplier), change: '+3 this quarter', desc: 'NHS Trusts, Corporate & Charities' },
          { title: 'NHS Referral Pathways', value: Math.round(12 * regMultiplier), change: 'Active in 4 trusts', desc: 'Social prescribing wellbeing walks' },
          { title: 'Corporate Partners', value: Math.round(8 * regMultiplier), change: '£45k committed', desc: 'CSR sponsorship & team volunteering' },
          { title: 'Community Alliances', value: Math.round(16 * regMultiplier), change: 'Regional networks', desc: 'Local outdoor groups & mental health hubs' }
        ];
      case 'Delivery':
        return [
          { title: 'Total Event Participants', value: Math.round(482 * regMultiplier), change: '+18% vs prev year', desc: 'Unique attendees across all walks & retreats' },
          { title: 'Events Delivered', value: Math.round(34 * regMultiplier), change: '100% safety record', desc: 'Day walks, weekend courses & retreats' },
          { title: 'Mountain Leader Hours', value: Math.round(1240 * regMultiplier) + ' hrs', change: '84% volunteer led', desc: 'Qualified leadership time on hill' },
          { title: 'Average PHQ-9 Improvement', value: '+4.2 pts', change: 'Clinical impact', desc: 'Validated mental health outcome score' }
        ];
      case 'Income':
        return [
          { title: 'Total Funds Raised', value: '£' + (Math.round(184500 * regMultiplier)).toLocaleString(), change: '+12% target', desc: 'Grants, donations & ticket sales' },
          { title: 'Grant Income Secured', value: '£' + (Math.round(105000 * regMultiplier)).toLocaleString(), change: '3 major grants', desc: 'National Lottery & Sport England' },
          { title: 'Individual Donations', value: '£' + (Math.round(42000 * regMultiplier)).toLocaleString(), change: '620 donors', desc: 'Recurring monthly & one-off' },
          { title: 'Event Ticket Revenue', value: '£' + (Math.round(37500 * regMultiplier)).toLocaleString(), change: 'Subsidised rate', desc: 'Participant ticket contributions' }
        ];
      case 'Comms':
        return [
          { title: 'Social Media Impressions', value: Math.round(245000 * regMultiplier).toLocaleString(), change: '+32% growth', desc: 'LinkedIn, Instagram & Facebook reach' },
          { title: 'Newsletter Subscribers', value: Math.round(8400 * regMultiplier).toLocaleString(), change: '42% open rate', desc: 'Monthly supporter bulletin' },
          { title: 'Press & Media Features', value: Math.round(18 * regMultiplier), change: 'BBC & Outdoor Mag', desc: 'National and regional coverage' },
          { title: 'Website Unique Visitors', value: Math.round(52000 * regMultiplier).toLocaleString(), change: 'Top referrals: Search & Social', desc: 'Direct impact portal traffic' }
        ];
      case 'Case Studies':
        return [
          { title: 'Published Case Studies', value: Math.round(15 * regMultiplier), change: 'Qualitative stories', desc: 'Participant journey transformation' },
          { title: 'Video Testimonials', value: Math.round(6 * regMultiplier), change: 'High engagement', desc: 'Recorded participant reflections' },
          { title: 'Funder Impact Spotlights', value: Math.round(8 * regMultiplier), change: 'Quarterly reports', desc: 'Direct evidence for trust grants' },
          { title: 'NHS Case Evaluations', value: Math.round(4 * regMultiplier), change: 'Peer reviewed', desc: 'Clinical outcome summaries' }
        ];
      default:
        return [];
    }
  };

  // Demographics Data for Delivery Tab
  const genderData = [
    { name: 'Women', value: Math.round(240 * regMultiplier), color: '#00f5d4' },
    { name: 'Men', value: Math.round(190 * regMultiplier), color: '#5a4dff' },
    { name: 'Trans / Non-binary / Gender diverse', value: Math.round(32 * regMultiplier), color: '#ff3d7f' },
    { name: 'Prefer not to say', value: Math.round(12 * regMultiplier), color: '#ffd166' },
    { name: 'Unknown / Not provided', value: Math.round(8 * regMultiplier), color: '#94a3b8' }
  ];

  const ageData = [
    { age: '18-30', count: Math.round(75 * regMultiplier), color: '#00f5d4' },
    { age: '30-40', count: Math.round(125 * regMultiplier), color: '#7bff6b' },
    { age: '40-45', count: Math.round(98 * regMultiplier), color: '#ff9f1c' },
    { age: '45-65', count: Math.round(112 * regMultiplier), color: '#ff3d7f' },
    { age: '65-75', count: Math.round(48 * regMultiplier), color: '#5a4dff' },
    { age: '75+', count: Math.round(18 * regMultiplier), color: '#ffd166' },
    { age: 'Unknown Age', count: Math.round(6 * regMultiplier), color: '#64748b' }
  ];

  return (
    <div className="space-y-6">
      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto p-1.5 rounded-2xl bg-slate-900/80 border border-white/10">
        {categories.map((cat) => {
          const isActive = activeTab === cat.name;
          return (
            <button
              key={cat.name}
              onClick={() => handleTabChange(cat.name as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'active-tab-gradient font-black'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Guidance Banner */}
      <div className="glass-card p-4 rounded-2xl flex items-center justify-between gap-4 border-l-4 border-l-teal-400">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-teal-500/20 text-teal-300">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">
              {activeTab} Overview • <span className="text-teal-300">{selectedRegion}</span> ({selectedTimeframe})
            </h3>
            <p className="text-xs text-slate-400">
              Click any KPI card below to open the supporting records drill-down view.
            </p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-white/10">
          <MousePointerClick className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
          <span>Interactive Cards</span>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {getMetricsForTab().map((m, idx) => (
          <div
            key={idx}
            onClick={() => onOpenDrillDown(m.title, activeTab)}
            className="glass-card metric-card-bg p-5 rounded-2xl glass-card-hover cursor-pointer group relative overflow-hidden"
          >
            {/* Top accent bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-400 via-amber-400 to-pink-500 opacity-60 group-hover:opacity-100 transition-opacity" />

            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-slate-300 group-hover:text-teal-300 transition-colors">
                {m.title}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-semibold border border-teal-500/30">
                {m.change}
              </span>
            </div>

            <div className="text-3xl font-black text-slate-100 my-2 tracking-tight group-hover:scale-105 transition-transform origin-left">
              {m.value}
            </div>

            <p className="text-[11px] text-slate-400 line-clamp-2">
              {m.desc}
            </p>

            <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-teal-400 font-bold opacity-80 group-hover:opacity-100">
              <span>View supporting records</span>
              <span>→</span>
            </div>
          </div>
        ))}
      </div>

      {/* Special Demographics Breakdown Section for Delivery Tab */}
      {activeTab === 'Delivery' && (
        <div className="mt-8 space-y-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-pink-400" />
            <h3 className="text-base font-bold text-slate-100">Participant Demographics Breakdown</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gender Card */}
            <div className="glass-card p-5 rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <PieChartIcon className="w-4 h-4 text-teal-400" />
                  Gender Distribution
                </h4>
                <span className="text-xs text-slate-400">Synced from Beacon</span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={genderData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {genderData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc' }}
                      itemStyle={{ color: '#00f5d4' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-white/10">
                {genderData.map((g) => (
                  <div key={g.name} className="flex items-center justify-between p-1.5 rounded bg-slate-900/50">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: g.color }} />
                      <span className="text-slate-300 truncate">{g.name}</span>
                    </div>
                    <span className="font-bold text-slate-100">{g.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Age Card */}
            <div className="glass-card p-5 rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <BarChart className="w-4 h-4 text-amber-400" />
                  Age Cohorts
                </h4>
                <span className="text-xs text-slate-400">Registered Participants</span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ageData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="age" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                    <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc' }}
                    />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                      {ageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="text-[11px] text-slate-400 mt-2 italic bg-slate-900/60 p-2.5 rounded-xl border border-white/5">
                Note: Demographics are sourced directly from synced attendee forms and tagged cohort surveys.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
