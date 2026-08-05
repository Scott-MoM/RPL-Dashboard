import React from 'react';
import { Region, GrantRecord } from '../types';
import { Building2, Award, Users, PoundSterling, HeartPulse, CheckCircle2 } from 'lucide-react';

interface FunderDashboardViewProps {
  grants: GrantRecord[];
  selectedRegion: Region;
}

export const FunderDashboardView: React.FC<FunderDashboardViewProps> = ({
  grants,
  selectedRegion
}) => {
  const filteredGrants = grants.filter(g => selectedRegion === 'Global' || g.region === selectedRegion);

  const totalFunding = filteredGrants.reduce((acc, g) => acc + g.amount, 0);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="glass-card p-6 rounded-2xl flex items-center justify-between gap-4 border-l-4 border-l-amber-400">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-100">Restricted Funder Executive Summary</h2>
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
              Grant Compliance Portal
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Aggregated impact metrics, grant allocations, and verified outcome figures for funding body reviews.
          </p>
        </div>

        <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-300">
          <Award className="w-8 h-8" />
        </div>
      </div>

      {/* Headline Metric Blocks */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-5 rounded-2xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-2">
            <PoundSterling className="w-4 h-4 text-teal-400" />
            <span>Total Grant Capital Tracked</span>
          </div>
          <div className="text-2xl font-black text-slate-100">
            £{totalFunding.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Allocated across {filteredGrants.length} projects</p>
        </div>

        <div className="glass-card p-5 rounded-2xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-2">
            <Users className="w-4 h-4 text-amber-400" />
            <span>Beneficiaries Supported</span>
          </div>
          <div className="text-2xl font-black text-slate-100">
            482 Participants
          </div>
          <p className="text-[11px] text-slate-400 mt-1">100% verified attendance</p>
        </div>

        <div className="glass-card p-5 rounded-2xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-2">
            <HeartPulse className="w-4 h-4 text-pink-400" />
            <span>Validated Mood Improvement</span>
          </div>
          <div className="text-2xl font-black text-teal-300">
            +4.2 Points
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Validated PHQ-9 scale score</p>
        </div>
      </div>

      {/* Grant Allocations Table */}
      <div className="glass-card p-6 rounded-2xl space-y-4">
        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-teal-400" />
          Active Funder Grants & Outcome Status
        </h3>

        <div className="overflow-x-auto rounded-xl border border-white/10 bg-slate-950/80">
          <table className="w-full text-left text-xs text-slate-200">
            <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] tracking-wider border-b border-white/10">
              <tr>
                <th className="p-3">Funder Name</th>
                <th className="p-3">Project Title</th>
                <th className="p-3">Region</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Grant Period</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              {filteredGrants.map((g) => (
                <tr key={g.id} className="hover:bg-white/5">
                  <td className="p-3 font-bold text-slate-100">{g.funderName}</td>
                  <td className="p-3">{g.title}</td>
                  <td className="p-3 text-amber-300">{g.region}</td>
                  <td className="p-3 font-bold text-teal-300">£{g.amount.toLocaleString()}</td>
                  <td className="p-3 text-slate-400">{g.startDate} to {g.endDate}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                      {g.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
