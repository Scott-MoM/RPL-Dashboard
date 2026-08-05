import React, { useState, useMemo } from 'react';
import { 
  UserRole, 
  EventRecord, 
  PersonRecord, 
  OrganisationRecord, 
  PaymentRecord, 
  GrantRecord, 
  CaseStudy, 
  AuditLog, 
  Region 
} from '../types';
import { 
  X, 
  Search, 
  Filter, 
  ShieldCheck, 
  Lock, 
  Download, 
  Layers, 
  FileText, 
  Table2,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Info
} from 'lucide-react';

interface DrillDownModalProps {
  isOpen: boolean;
  onClose: () => void;
  metricTitle: string;
  category: string;
  userRole: UserRole;
  eventsData?: EventRecord[];
  peopleData?: PersonRecord[];
  organisationsData?: OrganisationRecord[];
  paymentsData?: PaymentRecord[];
  grantsData?: GrantRecord[];
  caseStudiesData?: CaseStudy[];
  auditLogsData?: AuditLog[];
}

export interface DetailedRecordRow {
  id: string;
  name: string;
  category: string;
  type: string;
  region: Region;
  date: string;
  metricDetail: string;
  status: string;
  rawItem?: any;
}

export const DrillDownModal: React.FC<DrillDownModalProps> = ({
  isOpen,
  onClose,
  metricTitle,
  category,
  userRole,
  eventsData = [],
  peopleData = [],
  organisationsData = [],
  paymentsData = [],
  grantsData = [],
  caseStudiesData = [],
  auditLogsData = []
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegionFilter, setSelectedRegionFilter] = useState<string>('All');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);

  const canSeePersonalDetails = ['Admin', 'Manager', 'ML'].includes(userRole);

  // Dynamically compile ALL matching dataset rows for the selected category & metric
  const allRows = useMemo(() => {
    const rows: DetailedRecordRow[] = [];

    // Helper to format name according to privacy permissions
    const formatName = (realName: string, idStr: string, entityType = 'Participant') => {
      if (canSeePersonalDetails) return realName;
      if (entityType === 'Organisation' || entityType === 'Grant' || entityType === 'Event' || entityType === 'Audit') {
        return realName;
      }
      return `[Anonymised ${entityType} ${idStr}]`;
    };

    const catLower = category.toLowerCase();
    const titleLower = metricTitle.toLowerCase();

    // 1. DELIVERY & PARTICIPANTS DATA
    if (catLower.includes('delivery') || titleLower.includes('participant') || titleLower.includes('walk') || titleLower.includes('event') || titleLower.includes('phq') || titleLower.includes('wemwbs') || titleLower.includes('attendee')) {
      // Add all events
      eventsData.forEach((ev) => {
        rows.push({
          id: ev.id,
          name: ev.name,
          category: 'Delivery',
          type: ev.type,
          region: ev.region,
          date: ev.date,
          metricDetail: `${ev.attendeesCount}/${ev.maxCapacity} Capacity • Leader: ${ev.leader}`,
          status: ev.status,
          rawItem: ev
        });

        // Add all event attendees
        if (ev.attendees && ev.attendees.length > 0) {
          ev.attendees.forEach((att, idx) => {
            rows.push({
              id: `${ev.id}-att-${idx + 1}`,
              name: formatName(att.name, att.id, 'Participant'),
              category: 'Delivery Roster',
              type: `Attendee (${att.gender}, ${att.ageGroup})`,
              region: ev.region,
              date: ev.date,
              metricDetail: `Event: ${ev.name} • Medical: ${att.medicalConditions || 'None'}`,
              status: 'Verified Attendee'
            });
          });
        }
      });

      // Add all people records
      peopleData.forEach((pr) => {
        rows.push({
          id: pr.id,
          name: formatName(pr.name, pr.id, pr.type),
          category: 'People Directory',
          type: pr.type,
          region: pr.region,
          date: pr.joinDate,
          metricDetail: `Email: ${canSeePersonalDetails ? pr.email : '[Protected]'} • ${pr.totalEventsAttended} Events Attended`,
          status: 'Active Profile',
          rawItem: pr
        });
      });
    }

    // 2. PARTNERSHIPS & ORGANISATIONS DATA
    if (catLower.includes('partner') || titleLower.includes('organisation') || titleLower.includes('nhs') || titleLower.includes('trust') || titleLower.includes('corporate') || titleLower.includes('charity')) {
      organisationsData.forEach((org) => {
        rows.push({
          id: org.id,
          name: org.name,
          category: 'Partnerships',
          type: org.type,
          region: org.region,
          date: '2026-01-01',
          metricDetail: `Funding: £${org.fundingProvided.toLocaleString('en-GB')} • Contact: ${canSeePersonalDetails ? org.contactPerson : '[Protected]'}`,
          status: org.status,
          rawItem: org
        });
      });
    }

    // 3. INCOME, PAYMENTS & GRANTS DATA
    if (catLower.includes('income') || titleLower.includes('grant') || titleLower.includes('payment') || titleLower.includes('donat') || titleLower.includes('ticket') || titleLower.includes('fund')) {
      paymentsData.forEach((pm) => {
        rows.push({
          id: pm.id,
          name: pm.payerName,
          category: 'Income Ledger',
          type: pm.type,
          region: pm.region,
          date: pm.date,
          metricDetail: `Amount: £${pm.amount.toLocaleString('en-GB')}`,
          status: 'Cleared & Synced',
          rawItem: pm
        });
      });

      grantsData.forEach((gr) => {
        rows.push({
          id: gr.id,
          name: `${gr.funderName} — ${gr.title}`,
          category: 'Grants Management',
          type: 'Funder Grant',
          region: gr.region,
          date: `${gr.startDate} to ${gr.endDate}`,
          metricDetail: `Awarded Amount: £${gr.amount.toLocaleString('en-GB')}`,
          status: gr.status,
          rawItem: gr
        });
      });
    }

    // 4. COMMS & CASE STUDIES DATA
    if (catLower.includes('comm') || catLower.includes('case') || titleLower.includes('story') || titleLower.includes('narrative') || titleLower.includes('media') || titleLower.includes('case study')) {
      caseStudiesData.forEach((cs) => {
        rows.push({
          id: cs.id,
          name: cs.title,
          category: 'Case Studies',
          type: 'Impact Story',
          region: cs.region,
          date: cs.date_added.split(' ')[0],
          metricDetail: `Author: ${cs.author || 'MOM Staff'} • Content: "${cs.content.substring(0, 70)}..."`,
          status: 'Published',
          rawItem: cs
        });
      });
    }

    // 5. GOVERNANCE & AUDIT LOGS DATA
    if (catLower.includes('govern') || titleLower.includes('audit') || titleLower.includes('compliance') || titleLower.includes('log') || titleLower.includes('access') || titleLower.includes('gdpr')) {
      auditLogsData.forEach((al) => {
        rows.push({
          id: al.id,
          name: `${al.action} (${al.user_email})`,
          category: 'Governance Audit',
          type: 'System Audit Entry',
          region: al.region,
          date: al.timestamp,
          metricDetail: al.details,
          status: 'Logged & Timestamped',
          rawItem: al
        });
      });
    }

    // Default Fallback: If no rows matched specific filters, bundle ALL datasets together so all data is accessible
    if (rows.length === 0) {
      eventsData.forEach((ev) => rows.push({
        id: ev.id,
        name: ev.name,
        category: 'Events',
        type: ev.type,
        region: ev.region,
        date: ev.date,
        metricDetail: `Attendees: ${ev.attendeesCount} / Leader: ${ev.leader}`,
        status: ev.status
      }));

      peopleData.forEach((pr) => rows.push({
        id: pr.id,
        name: formatName(pr.name, pr.id, pr.type),
        category: 'People',
        type: pr.type,
        region: pr.region,
        date: pr.joinDate,
        metricDetail: `Events Attended: ${pr.totalEventsAttended}`,
        status: 'Active'
      }));

      paymentsData.forEach((pm) => rows.push({
        id: pm.id,
        name: pm.payerName,
        category: 'Financial Payments',
        type: pm.type,
        region: pm.region,
        date: pm.date,
        metricDetail: `£${pm.amount.toLocaleString('en-GB')}`,
        status: 'Cleared'
      }));

      grantsData.forEach((gr) => rows.push({
        id: gr.id,
        name: gr.title,
        category: 'Grant Funding',
        type: 'Grant',
        region: gr.region,
        date: gr.startDate,
        metricDetail: `£${gr.amount.toLocaleString('en-GB')}`,
        status: gr.status
      }));

      organisationsData.forEach((org) => rows.push({
        id: org.id,
        name: org.name,
        category: 'Partners',
        type: org.type,
        region: org.region,
        date: '2026-01-01',
        metricDetail: `Funding: £${org.fundingProvided.toLocaleString('en-GB')}`,
        status: org.status
      }));

      caseStudiesData.forEach((cs) => rows.push({
        id: cs.id,
        name: cs.title,
        category: 'Narratives',
        type: 'Case Study',
        region: cs.region,
        date: cs.date_added.split(' ')[0],
        metricDetail: cs.content.substring(0, 60) + '...',
        status: 'Published'
      }));
    }

    return rows;
  }, [
    category,
    metricTitle,
    canSeePersonalDetails,
    eventsData,
    peopleData,
    organisationsData,
    paymentsData,
    grantsData,
    caseStudiesData,
    auditLogsData
  ]);

  // Apply Search, Region, and Category Filters across all synthesized rows
  const filteredRows = useMemo(() => {
    return allRows.filter((r) => {
      const matchesSearch = 
        r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.metricDetail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.status.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRegion = 
        selectedRegionFilter === 'All' || 
        r.region === selectedRegionFilter;

      const matchesCategory = 
        selectedCategoryFilter === 'All' || 
        r.category === selectedCategoryFilter;

      return matchesSearch && matchesRegion && matchesCategory;
    });
  }, [allRows, searchTerm, selectedRegionFilter, selectedCategoryFilter]);

  // Unique categories list for tab bar
  const availableCategories = useMemo(() => {
    const cats = Array.from(new Set(allRows.map(r => r.category)));
    return ['All', ...cats];
  }, [allRows]);

  // Export drill-down dataset to CSV
  const handleExportCSV = () => {
    if (filteredRows.length === 0) return;

    const headers = ['Record ID', 'Name / Entity', 'Category', 'Type', 'Region', 'Date', 'Details', 'Status'];
    const csvLines = [headers.join(',')];

    filteredRows.forEach(r => {
      const line = [
        `"${r.id}"`,
        `"${r.name.replace(/"/g, '""')}"`,
        `"${r.category}"`,
        `"${r.type}"`,
        `"${r.region}"`,
        `"${r.date}"`,
        `"${r.metricDetail.replace(/"/g, '""')}"`,
        `"${r.status}"`
      ];
      csvLines.push(line.join(','));
    });

    const blob = new Blob([csvLines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${category}_${metricTitle.replace(/[^a-zA-Z0-9]/g, '_')}_DrillDown.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="glass-card w-full max-w-5xl rounded-3xl p-6 space-y-4 border border-teal-500/30 shadow-2xl relative max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 font-mono">
                {category} Full Drill-Down
              </span>
              <span className="text-xs text-slate-400 font-medium">All Supporting Database Records ({allRows.length})</span>
            </div>
            <h3 className="text-lg font-bold text-slate-100 mt-1 flex items-center gap-2">
              <Table2 className="w-5 h-5 text-teal-400" />
              <span>{metricTitle}</span>
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Access Banner */}
        <div className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-3 shrink-0 ${
          canSeePersonalDetails 
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
            : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
        }`}>
          <div className="flex items-center gap-2">
            {canSeePersonalDetails ? (
              <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
            ) : (
              <Lock className="w-4 h-4 shrink-0 text-amber-400" />
            )}
            <span>
              {canSeePersonalDetails 
                ? `Unrestricted Access (${userRole}): Full names, emails, and medical notes unmasked.` 
                : `Governance Protection (${userRole}): Personal attendee names are anonymised.`}
            </span>
          </div>

          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-100 text-xs font-bold flex items-center gap-1.5 border border-white/10 transition-all shrink-0"
          >
            <Download className="w-3.5 h-3.5 text-teal-300" />
            <span>Export CSV</span>
          </button>
        </div>

        {/* Category Dimension Tabs */}
        {availableCategories.length > 2 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 shrink-0 scrollbar-none">
            <span className="text-[11px] font-bold text-slate-400 mr-1 flex items-center gap-1 shrink-0">
              <Layers className="w-3.5 h-3.5 text-teal-400" /> Dimension:
            </span>
            {availableCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategoryFilter(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all border ${
                  selectedCategoryFilter === cat
                    ? 'bg-teal-500/20 text-teal-300 border-teal-500/40 shadow-sm'
                    : 'bg-slate-900/60 text-slate-400 border-white/5 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                {cat} {cat !== 'All' ? `(${allRows.filter(r => r.category === cat).length})` : `(${allRows.length})`}
              </button>
            ))}
          </div>
        )}

        {/* Search & Region Filter Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 shrink-0">
          <div className="sm:col-span-2 relative">
            <input
              type="text"
              placeholder="Search all records by name, ID, status, or details..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-white/15 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold text-slate-100 focus:outline-none focus:border-teal-400"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          </div>

          <div className="relative">
            <select
              value={selectedRegionFilter}
              onChange={(e) => setSelectedRegionFilter(e.target.value)}
              className="w-full bg-slate-950 border border-white/15 rounded-xl px-3 py-2 text-xs font-semibold text-slate-100 focus:outline-none focus:border-teal-400"
            >
              <option value="All">All Regions ({allRows.length})</option>
              <option value="North of England">North of England</option>
              <option value="South of England">South of England</option>
              <option value="Midlands">Midlands</option>
              <option value="Wales">Wales</option>
              <option value="Global">Global</option>
            </select>
          </div>
        </div>

        {/* Complete Records Table */}
        <div className="overflow-y-auto rounded-xl border border-white/10 bg-slate-950/90 flex-1 min-h-[250px]">
          <table className="w-full text-left text-xs text-slate-200 border-collapse">
            <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] tracking-wider border-b border-white/10 sticky top-0 z-10">
              <tr>
                <th className="p-3"></th>
                <th className="p-3">Record ID</th>
                <th className="p-3">Entity / Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Type</th>
                <th className="p-3">Region</th>
                <th className="p-3">Date</th>
                <th className="p-3">Details / Metrics</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              {filteredRows.length > 0 ? (
                filteredRows.map((row) => {
                  const isExpanded = expandedRowId === row.id;
                  return (
                    <React.Fragment key={row.id}>
                      <tr 
                        onClick={() => setExpandedRowId(isExpanded ? null : row.id)}
                        className={`hover:bg-teal-500/10 cursor-pointer transition-colors ${
                          isExpanded ? 'bg-teal-500/15 border-l-2 border-teal-400' : ''
                        }`}
                      >
                        <td className="p-3 text-slate-500">
                          {isExpanded ? <ChevronUp className="w-4 h-4 text-teal-400" /> : <ChevronDown className="w-4 h-4" />}
                        </td>
                        <td className="p-3 font-bold text-teal-300 shrink-0">{row.id}</td>
                        <td className="p-3 text-slate-100 font-bold max-w-[180px] truncate">{row.name}</td>
                        <td className="p-3 text-slate-400 text-[10px] font-sans">
                          <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10">
                            {row.category}
                          </span>
                        </td>
                        <td className="p-3 text-slate-300">
                          <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-white/10">
                            {row.type}
                          </span>
                        </td>
                        <td className="p-3 text-amber-300 font-medium">{row.region}</td>
                        <td className="p-3 text-slate-400 text-[11px]">{row.date}</td>
                        <td className="p-3 text-slate-300 text-[11px] font-sans max-w-[220px] truncate" title={row.metricDetail}>
                          {row.metricDetail}
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-sans font-semibold">
                            {row.status}
                          </span>
                        </td>
                      </tr>

                      {/* Expanded Row Inspector Panel */}
                      {isExpanded && (
                        <tr className="bg-slate-900/90">
                          <td colSpan={9} className="p-4 border-y border-teal-500/30 font-sans text-xs">
                            <div className="p-4 rounded-2xl bg-slate-950 border border-teal-500/30 space-y-3">
                              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                                <div className="flex items-center gap-2 text-teal-300 font-bold">
                                  <Info className="w-4 h-4" />
                                  <span>Granular Inspection for {row.id}</span>
                                </div>
                                <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded">
                                  Category: {row.category}
                                </span>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-slate-300">
                                <div>
                                  <span className="text-[10px] font-bold uppercase text-slate-500 block">Record Title / Name</span>
                                  <span className="font-semibold text-slate-100">{row.name}</span>
                                </div>
                                <div>
                                  <span className="text-[10px] font-bold uppercase text-slate-500 block">Type Classification</span>
                                  <span className="font-semibold text-slate-200">{row.type}</span>
                                </div>
                                <div>
                                  <span className="text-[10px] font-bold uppercase text-slate-500 block">Geographic Region</span>
                                  <span className="font-semibold text-amber-300">{row.region}</span>
                                </div>
                                <div>
                                  <span className="text-[10px] font-bold uppercase text-slate-500 block">Effective Date</span>
                                  <span className="font-semibold text-slate-200 font-mono">{row.date}</span>
                                </div>
                                <div>
                                  <span className="text-[10px] font-bold uppercase text-slate-500 block">Status Flag</span>
                                  <span className="font-semibold text-emerald-400">{row.status}</span>
                                </div>
                                <div>
                                  <span className="text-[10px] font-bold uppercase text-slate-500 block">Audit Access Level</span>
                                  <span className="font-semibold text-slate-300">{userRole} Role Clearance</span>
                                </div>
                              </div>

                              <div className="pt-2 border-t border-white/10">
                                <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Full Detailed Attribute Narrative</span>
                                <div className="p-3 rounded-xl bg-slate-900 border border-white/10 font-mono text-xs text-teal-200 leading-relaxed whitespace-pre-wrap">
                                  {row.rawItem ? JSON.stringify(row.rawItem, null, 2) : row.metricDetail}
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-500 font-sans text-xs">
                    No matching records found for "{searchTerm}". Try adjusting your search query, dimension tab, or region filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-400 pt-3 border-t border-white/10 shrink-0 font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
            <span>
              Showing <strong className="text-teal-300">{filteredRows.length}</strong> of{' '}
              <strong className="text-slate-200">{allRows.length}</strong> total supporting records • Click any row to inspect full JSON attributes
            </span>
          </div>

          <button
            onClick={onClose}
            className="btn-gradient px-5 py-2 rounded-xl font-bold text-slate-950 text-xs shadow-md"
          >
            Close Drill-Down View
          </button>
        </div>
      </div>
    </div>
  );
};
