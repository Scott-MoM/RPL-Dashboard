import React, { useState } from 'react';
import { DataRequest, User, UserRole } from '../types';
import { FileText, Clock, Calendar, Send, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface DataRequestFormViewProps {
  currentUser: User;
  allUsers: User[];
  dataRequests: DataRequest[];
  onSubmitRequest: (newReq: Omit<DataRequest, 'id' | 'status'>) => void;
  onGrantAccess?: (requestId: string, expiresAt: string) => void;
}

export const DataRequestFormView: React.FC<DataRequestFormViewProps> = ({
  currentUser,
  allUsers,
  dataRequests,
  onSubmitRequest,
  onGrantAccess
}) => {
  const [selectedUserEmail, setSelectedUserEmail] = useState(currentUser.email);
  const selectedUserObj = allUsers.find(u => u.email === selectedUserEmail) || currentUser;
  const [reqDate, setReqDate] = useState(new Date().toISOString().split('T')[0]);
  const [reqTime, setReqTime] = useState('12:00');
  const [reason, setReason] = useState('');
  const [submittedMessage, setSubmittedMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    onSubmitRequest({
      name: selectedUserObj.name,
      email: selectedUserObj.email,
      date: reqDate,
      time: reqTime,
      reason
    });

    setReason('');
    setSubmittedMessage('Formal Data Access Request submitted and logged successfully!');
    setTimeout(() => setSubmittedMessage(''), 4000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Introduction Card */}
      <div className="glass-card p-6 rounded-2xl flex items-center gap-4 border-l-4 border-l-pink-500">
        <div className="p-3 rounded-2xl bg-pink-500/20 text-pink-300">
          <FileText className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-100">Formal Data Access Request Form</h2>
          <p className="text-xs text-slate-400">
            Submit a formal request to inspect restricted participant, clinical, or financial dataset records.
            All requests are logged for GDPR compliance.
          </p>
        </div>
      </div>

      {submittedMessage && (
        <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-xs font-bold text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{submittedMessage}</span>
        </div>
      )}

      {/* Main Request Form Card */}
      <form onSubmit={handleSubmit} className="glass-card p-6 rounded-2xl space-y-5">
        <h3 className="text-sm font-bold text-slate-100 pb-2 border-b border-white/10">
          Request Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="text-slate-300 font-semibold mb-1 block">Requesting User Name</label>
            <select
              value={selectedUserEmail}
              onChange={(e) => setSelectedUserEmail(e.target.value)}
              className="w-full bg-slate-950 border border-white/20 rounded-xl p-2.5 text-slate-100 font-medium"
            >
              {allUsers.map(u => (
                <option key={u.id} value={u.email}>{u.name} ({u.role})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-slate-300 font-semibold mb-1 block">Email Address</label>
            <input
              type="email"
              readOnly
              value={selectedUserObj.email}
              className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-slate-400 font-mono"
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold mb-1 block flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-teal-400" />
              Required Date
            </label>
            <input
              type="date"
              required
              value={reqDate}
              onChange={(e) => setReqDate(e.target.value)}
              className="w-full bg-slate-950 border border-white/20 rounded-xl p-2.5 text-slate-100"
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold mb-1 block flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              Required Time
            </label>
            <input
              type="time"
              required
              value={reqTime}
              onChange={(e) => setReqTime(e.target.value)}
              className="w-full bg-slate-950 border border-white/20 rounded-xl p-2.5 text-slate-100"
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-slate-300 font-semibold mb-1 block">
            Reason for Data Request (e.g. Funder Audit, Safeguarding Review)
          </label>
          <textarea
            required
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Please specify why access to participant-level data is required..."
            className="w-full bg-slate-950 border border-white/20 rounded-xl p-2.5 text-xs text-slate-100 resize-none"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="btn-gradient px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>Submit Data Request</span>
          </button>
        </div>
      </form>

      {/* Logged Requests Table */}
      <div className="glass-card p-6 rounded-2xl space-y-4">
        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
          <Clock className="w-4 h-4 text-teal-400" />
          Recent Data Requests Log
        </h3>

        <div className="overflow-x-auto rounded-xl border border-white/10 bg-slate-950/80">
          {dataRequests.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400">
              No previous data requests logged in session.
            </div>
          ) : (
            <table className="w-full text-left text-xs text-slate-200">
              <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] tracking-wider border-b border-white/10">
                <tr>
                  <th className="p-3">User</th>
                  <th className="p-3">Date & Time</th>
                  <th className="p-3">Reason</th>
                  <th className="p-3">Status</th>
                  {currentUser.role === 'Admin' && <th className="p-3">Action</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                {dataRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-white/5">
                    <td className="p-3">
                      <div className="font-bold text-slate-100">{req.name}</div>
                      <div className="text-[10px] text-slate-400">{req.email}</div>
                    </td>
                    <td className="p-3">{req.date} at {req.time}</td>
                    <td className="p-3 max-w-xs truncate">{req.reason}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        req.status === 'Granted' 
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    {currentUser.role === 'Admin' && (
                      <td className="p-3">
                        {req.status !== 'Granted' ? (
                          <button
                            onClick={() => onGrantAccess && onGrantAccess(req.id, '2026-12-31 23:59')}
                            className="px-2.5 py-1 rounded-lg bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/40 text-teal-300 font-bold text-[10px] flex items-center gap-1"
                          >
                            <ShieldCheck className="w-3 h-3" />
                            <span>Grant Temp Access</span>
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-400">Granted until {req.expiresAt}</span>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
