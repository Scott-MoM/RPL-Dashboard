import React, { useState } from 'react';
import { EventRecord, Region, UserRole } from '../types';
import { Compass, Calendar, Users, AlertTriangle, ShieldCheck, MapPin, UserCheck, HeartPulse, PhoneCall } from 'lucide-react';

interface MLDashboardViewProps {
  events: EventRecord[];
  selectedRegion: Region;
  userRole: UserRole;
  onAuditLogAction?: (action: string, details: string) => void;
}

export const MLDashboardView: React.FC<MLDashboardViewProps> = ({
  events,
  selectedRegion,
  userRole,
  onAuditLogAction
}) => {
  const filteredEvents = events.filter(ev => selectedRegion === 'Global' || ev.region === selectedRegion);
  const [selectedEventId, setSelectedEventId] = useState<string>(filteredEvents[0]?.id || events[0]?.id || '');

  const activeEvent = events.find(e => e.id === selectedEventId) || filteredEvents[0] || events[0];

  const handleEventSelect = (eId: string) => {
    setSelectedEventId(eId);
    const ev = events.find(item => item.id === eId);
    if (ev && onAuditLogAction) {
      onAuditLogAction('ML Roster Inspected', `Inspected Mountain Leader operational roster and medical notes for event: '${ev.name}'`);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="glass-card p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-l-4 border-l-teal-400">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Compass className="w-5 h-5 text-teal-400" />
            Mountain Leader Operational Dashboard
          </h2>
          <p className="text-xs text-slate-400">
            One-event-at-a-time operational view for mountain leaders, safeguarding checks, medical notes & emergency logs.
          </p>
        </div>

        {/* Event Selector */}
        <div className="w-full sm:w-72">
          <label className="text-[10px] uppercase font-bold text-teal-300 block mb-1">
            Select Active Event
          </label>
          <select
            value={selectedEventId}
            onChange={(e) => handleEventSelect(e.target.value)}
            className="w-full bg-slate-950 border border-teal-500/40 rounded-xl px-3 py-2 text-xs font-bold text-slate-100 focus:outline-none focus:border-teal-400"
          >
            {filteredEvents.map(e => (
              <option key={e.id} value={e.id}>
                {e.name} ({e.date})
              </option>
            ))}
          </select>
        </div>
      </div>

      {activeEvent ? (
        <div className="space-y-6">
          {/* Event Summary Banner */}
          <div className="glass-card p-6 rounded-2xl grid grid-cols-1 md:grid-cols-4 gap-4 divide-y md:divide-y-0 md:divide-x divide-white/10">
            <div className="pt-2 md:pt-0">
              <span className="text-[10px] uppercase text-slate-400 font-bold block mb-1">Event Name</span>
              <h3 className="text-sm font-bold text-slate-100">{activeEvent.name}</h3>
              <p className="text-xs text-teal-300 font-mono mt-1">{activeEvent.type}</p>
            </div>

            <div className="pt-2 md:pt-0 md:pl-4">
              <span className="text-[10px] uppercase text-slate-400 font-bold block mb-1">Date & Region</span>
              <div className="text-xs text-slate-200 font-semibold flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>{activeEvent.date}</span>
              </div>
              <div className="text-xs text-slate-300 flex items-center gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5 text-pink-400" />
                <span>{activeEvent.region}</span>
              </div>
            </div>

            <div className="pt-2 md:pt-0 md:pl-4">
              <span className="text-[10px] uppercase text-slate-400 font-bold block mb-1">Leader & Capacity</span>
              <div className="text-xs text-slate-200 font-semibold flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-teal-400" />
                <span>{activeEvent.leader}</span>
              </div>
              <div className="text-xs text-slate-300 flex items-center gap-1 mt-1">
                <Users className="w-3.5 h-3.5 text-amber-400" />
                <span>{activeEvent.attendeesCount} / {activeEvent.maxCapacity} Attendees</span>
              </div>
            </div>

            <div className="pt-2 md:pt-0 md:pl-4">
              <span className="text-[10px] uppercase text-slate-400 font-bold block mb-1">Status</span>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-500/40">
                {activeEvent.status}
              </span>
            </div>
          </div>

          {/* Medical Notes & Emergency Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-5 rounded-2xl border-l-4 border-l-amber-400 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                <HeartPulse className="w-4 h-4" />
                Leader Medical Briefing
              </h4>
              <p className="text-xs text-slate-200 leading-relaxed font-mono">
                {activeEvent.medicalNotes || 'No special medical conditions noted prior to launch.'}
              </p>
            </div>

            <div className="glass-card p-5 rounded-2xl border-l-4 border-l-rose-500 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-rose-300 flex items-center gap-1.5">
                <PhoneCall className="w-4 h-4" />
                Emergency Protocol & Duty Contacts
              </h4>
              <p className="text-xs text-slate-200 leading-relaxed font-mono">
                {activeEvent.emergencyContactInfo || 'Standard Mountain Rescue protocol active.'}
              </p>
            </div>
          </div>

          {/* Attendee Roster Table */}
          <div className="glass-card p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Users className="w-4 h-4 text-teal-400" />
                Attendee Roster & Medical Checklist
              </h3>
              <span className="text-xs text-slate-400">
                Showing {activeEvent.attendees.length} checked-in participants
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-white/10 bg-slate-950/80">
              <table className="w-full text-left text-xs text-slate-200">
                <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] tracking-wider border-b border-white/10">
                  <tr>
                    <th className="p-3">Participant Name</th>
                    <th className="p-3">Gender & Age</th>
                    <th className="p-3">Postcode</th>
                    <th className="p-3">Medical Notes</th>
                    <th className="p-3">Emergency Contact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono">
                  {activeEvent.attendees.map((att) => (
                    <tr key={att.id} className="hover:bg-white/5">
                      <td className="p-3 font-bold text-slate-100">{att.name}</td>
                      <td className="p-3">{att.gender} ({att.ageGroup})</td>
                      <td className="p-3">{att.postcode || 'N/A'}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          att.medicalConditions && att.medicalConditions !== 'None' 
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                            : 'text-slate-400'
                        }`}>
                          {att.medicalConditions || 'None'}
                        </span>
                      </td>
                      <td className="p-3 text-slate-300">{att.emergencyContact || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center glass-card rounded-2xl text-xs text-slate-400">
          No events available for the selected region filter.
        </div>
      )}
    </div>
  );
};
