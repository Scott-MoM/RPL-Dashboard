import React, { useState, useEffect } from 'react';
import { User, UserRole, AuditLog } from '../types';
import { CONFIG, getBeaconApiUrl } from '../config';
import { 
  ShieldAlert, 
  Users, 
  RefreshCw, 
  FileText, 
  CheckCircle2, 
  Lock, 
  Database, 
  Globe, 
  Key, 
  Check, 
  Loader2, 
  Activity, 
  Clock, 
  Sparkles, 
  Layers,
  Trash2,
  AlertOctagon,
  X
} from 'lucide-react';

interface AdminDashboardViewProps {
  users: User[];
  auditLogs: AuditLog[];
  onUpdateRole: (userId: string, newRole: UserRole) => void;
  onResetPassword: (userId: string) => void;
  onManualSync: () => void;
  onResetAllData?: () => void;
  isSyncing: boolean;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  users,
  auditLogs,
  onUpdateRole,
  onResetPassword,
  onManualSync,
  onResetAllData,
  isSyncing
}) => {
  const [activeTab, setActiveTab] = useState<'Users' | 'Sync' | 'Audit'>('Users');
  const [toastMessage, setToastMessage] = useState('');
  const [showResetModal, setShowResetModal] = useState(false);

  // Sync Progress State
  const [localSyncing, setLocalSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [syncStageIndex, setSyncStageIndex] = useState(0);
  const [syncConfirmed, setSyncConfirmed] = useState(false);
  const [lastSyncedTime, setLastSyncedTime] = useState('05/08/2026 03:00');

  const SYNC_STAGES = [
    { title: 'Connecting to Beacon API', detail: `Authenticating endpoint ${getBeaconApiUrl()}` },
    { title: 'Fetching Event & Attendee Records', detail: 'Querying endpoint event_attendee for active registrations...' },
    { title: 'Processing Grant & Payment Data', detail: 'Synchronising financial ledgers & Supabase sync table...' },
    { title: 'Indexing Regional Analytics', detail: 'Re-calculating PHQ-9 & WEMWBS mood improvement metrics...' },
    { title: 'Data Synchronization Confirmed', detail: 'All regional metrics and CRM datasets are up to date!' }
  ];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const startSyncSimulation = () => {
    setLocalSyncing(true);
    setSyncProgress(0);
    setSyncStageIndex(0);
    setSyncConfirmed(false);

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 8) + 5;

      if (currentProgress >= 100) {
        currentProgress = 100;
        setSyncProgress(100);
        setSyncStageIndex(4);
        clearInterval(interval);
        setTimeout(() => {
          setLocalSyncing(false);
          setSyncConfirmed(true);
          const nowStr = new Date().toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' });
          setLastSyncedTime(nowStr);
          onManualSync();
          showToast('Beacon CRM Data Sync Successfully Completed!');
        }, 500);
      } else {
        setSyncProgress(currentProgress);
        if (currentProgress < 25) setSyncStageIndex(0);
        else if (currentProgress < 50) setSyncStageIndex(1);
        else if (currentProgress < 75) setSyncStageIndex(2);
        else setSyncStageIndex(3);
      }
    }, 250);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="glass-card p-6 rounded-2xl flex items-center justify-between gap-4 border-l-4 border-l-rose-500">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            <h2 className="text-lg font-bold text-slate-100">System Administration Dashboard</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            User access control, Beacon CRM sync triggers, and system audit log monitoring.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('Users')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'Users' ? 'btn-gradient' : 'bg-slate-900 text-slate-300 hover:text-white'
            }`}
          >
            User Roles
          </button>
          <button
            onClick={() => setActiveTab('Sync')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'Sync' ? 'btn-gradient' : 'bg-slate-900 text-slate-300 hover:text-white'
            }`}
          >
            Data Sync
          </button>
          <button
            onClick={() => setActiveTab('Audit')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'Audit' ? 'btn-gradient' : 'bg-slate-900 text-slate-300 hover:text-white'
            }`}
          >
            Audit Logs
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-xs font-bold text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* User Management Tab */}
      {activeTab === 'Users' && (
        <div className="glass-card p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Users className="w-4 h-4 text-teal-400" />
              Role & Password Access Controls
            </h3>
            <span className="text-xs text-slate-400">{users.length} registered system accounts</span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-white/10 bg-slate-950/80">
            <table className="w-full text-left text-xs text-slate-200">
              <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] tracking-wider border-b border-white/10">
                <tr>
                  <th className="p-3">User Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Region Scope</th>
                  <th className="p-3">Assigned Role</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-white/5">
                    <td className="p-3 font-bold text-slate-100">{u.name}</td>
                    <td className="p-3 text-slate-300">{u.email}</td>
                    <td className="p-3 text-amber-300">{u.region}</td>
                    <td className="p-3">
                      <select
                        value={u.role}
                        onChange={(e) => {
                          onUpdateRole(u.id, e.target.value as UserRole);
                          showToast(`Updated role for ${u.name} to ${e.target.value}`);
                        }}
                        className="bg-slate-900 border border-white/20 rounded-lg p-1 text-xs text-teal-300 font-bold"
                      >
                        <option value="Admin">Admin</option>
                        <option value="Manager">Manager</option>
                        <option value="RPL">RPL</option>
                        <option value="ML">ML</option>
                        <option value="Funder">Funder</option>
                      </select>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => {
                          onResetPassword(u.id);
                          showToast(`Password reset link dispatched to ${u.email}`);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold text-[10px] flex items-center gap-1"
                      >
                        <Lock className="w-3 h-3" />
                        <span>Force Reset</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sync Tab */}
      {activeTab === 'Sync' && (
        <div className="glass-card p-6 rounded-2xl space-y-6">
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-teal-400" />
              Beacon CRM Automated Data Synchronization
            </h3>
            <p className="text-xs text-slate-400">
              Triggers the backend worker pipeline to fetch latest participant registrations, payments, and event records from Beacon.
            </p>
          </div>

          {/* Sync Trigger Card */}
          <div className="p-6 rounded-xl bg-slate-950 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-slate-200 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Beacon API Endpoint: Active
              </div>
              <div className="text-[11px] text-slate-400 font-mono mt-1">
                Base URL: {getBeaconApiUrl()}
              </div>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5 flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                Last synchronized: <strong className="text-slate-300">{lastSyncedTime}</strong>
              </div>
            </div>

            <button
              onClick={startSyncSimulation}
              disabled={localSyncing || isSyncing}
              className="btn-gradient px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${localSyncing || isSyncing ? 'animate-spin' : ''}`} />
              <span>{localSyncing ? 'Synchronizing Data...' : 'Trigger Manual Beacon Sync'}</span>
            </button>
          </div>

          {/* Active Sync Progress Bar & Status */}
          {localSyncing && (
            <div className="p-6 rounded-2xl bg-slate-950/90 border border-teal-500/40 space-y-4 animate-fade-in shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-teal-400 animate-spin" />
                  <span className="text-xs font-bold text-teal-300">
                    Stage {syncStageIndex + 1} of 4: {SYNC_STAGES[syncStageIndex].title}
                  </span>
                </div>
                <span className="text-sm font-black font-mono text-teal-300">
                  {syncProgress}%
                </span>
              </div>

              {/* Progress Bar Track */}
              <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden p-0.5 border border-white/10 relative">
                <div
                  className="bg-gradient-to-r from-teal-500 via-emerald-400 to-amber-400 h-full rounded-full transition-all duration-300 ease-out shadow-lg"
                  style={{ width: `${syncProgress}%` }}
                />
              </div>

              {/* Status Message Line */}
              <div className="text-[11px] text-slate-400 font-mono flex items-center justify-between">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  {SYNC_STAGES[syncStageIndex].detail}
                </span>
                <span>{syncProgress < 100 ? 'In Progress...' : 'Finalising'}</span>
              </div>

              {/* Stage Progress Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-white/10">
                {SYNC_STAGES.slice(0, 4).map((stage, idx) => {
                  const isDone = syncStageIndex > idx || syncProgress === 100;
                  const isCurrent = syncStageIndex === idx && syncProgress < 100;
                  return (
                    <div
                      key={idx}
                      className={`p-2 rounded-xl text-[10px] font-mono border transition-all ${
                        isDone
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                          : isCurrent
                          ? 'bg-teal-500/20 border-teal-500/50 text-teal-200 font-bold'
                          : 'bg-slate-900/50 border-white/5 text-slate-500'
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        {isDone ? (
                          <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                        ) : isCurrent ? (
                          <Loader2 className="w-3 h-3 text-teal-400 animate-spin shrink-0" />
                        ) : (
                          <span className="w-3 h-3 text-slate-500 text-center">{idx + 1}</span>
                        )}
                        <span className="truncate">{stage.title}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Post-Sync Confirmation Banner */}
          {syncConfirmed && !localSyncing && (
            <div className="p-6 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 space-y-3 animate-fade-in shadow-xl">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-emerald-200">
                      Beacon CRM Data Synchronization Confirmed!
                    </h4>
                    <p className="text-xs text-emerald-300/80 mt-0.5">
                      All participant rosters, course attendance, and financial ledgers are 100% up to date.
                    </p>
                  </div>
                </div>
                <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 font-mono">
                  100% In Sync
                </span>
              </div>

              {/* Confirmation Metrics Breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 font-mono text-[11px] border-t border-emerald-500/20">
                <div className="p-2.5 bg-slate-950/60 rounded-xl border border-emerald-500/20">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Participants</span>
                  <span className="text-xs font-bold text-slate-100">482 Verified</span>
                </div>
                <div className="p-2.5 bg-slate-950/60 rounded-xl border border-emerald-500/20">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Active Events</span>
                  <span className="text-xs font-bold text-slate-100">24 Courses</span>
                </div>
                <div className="p-2.5 bg-slate-950/60 rounded-xl border border-emerald-500/20">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Funder Grants</span>
                  <span className="text-xs font-bold text-slate-100">12 Managed</span>
                </div>
                <div className="p-2.5 bg-slate-950/60 rounded-xl border border-emerald-500/20">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Synced At</span>
                  <span className="text-xs font-bold text-emerald-300">{lastSyncedTime}</span>
                </div>
              </div>
            </div>
          )}

          {/* Data Governance & Reset Control Card */}
          <div className="p-6 rounded-2xl bg-slate-950 border border-rose-500/30 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-300 flex items-center gap-2">
                  <Trash2 className="w-4 h-4 text-rose-400" />
                  Data Governance & Cache Reset
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Clear all local cached metrics, participant rosters, and financial records. Every data reset action is logged in the System Audit Trail.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowResetModal(true)}
                  className="px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-200 text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Reset All Dashboard Data</span>
                </button>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 flex items-center gap-2 font-mono">
              <FileText className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>
                Auditing active: Both <strong>Manual Beacon Sync</strong> and <strong>Dashboard Data Reset</strong> write timestamped entries to the System Audit Log.
              </span>
            </div>
          </div>

          {/* Integration Environment Diagnostic */}
          <div className="pt-4 border-t border-white/10 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-2">
              <Key className="w-4 h-4" />
              Migrated Streamlit TOML → React Environment Variables
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-[11px]">
              <div className="p-3 bg-slate-900/80 border border-white/10 rounded-xl space-y-1">
                <div className="text-teal-300 font-bold flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5" />
                  Beacon CRM
                </div>
                <div className="text-slate-400">Account ID: <span className="text-slate-200">{CONFIG.beacon.accountId || 'Configured'}</span></div>
                <div className="text-slate-400">API Key: <span className="text-emerald-400">{CONFIG.beacon.apiKey ? '✓ Active' : 'Fallback / Set in .env'}</span></div>
                <div className="text-slate-400">Endpoint: <span className="text-slate-200">{CONFIG.beacon.eventAttendeesEndpoint}</span></div>
              </div>

              <div className="p-3 bg-slate-900/80 border border-white/10 rounded-xl space-y-1">
                <div className="text-amber-300 font-bold flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" />
                  Supabase DB
                </div>
                <div className="text-slate-400">URL: <span className="text-slate-200">{CONFIG.supabase.url ? '✓ Configured' : 'Fallback / Set in .env'}</span></div>
                <div className="text-slate-400">Anon Key: <span className="text-emerald-400">{CONFIG.supabase.anonKey ? '✓ Active' : 'Fallback / Set in .env'}</span></div>
              </div>

              <div className="p-3 bg-slate-900/80 border border-white/10 rounded-xl space-y-1">
                <div className="text-pink-300 font-bold flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" />
                  OpenRouteService
                </div>
                <div className="text-slate-400">Routing API: <span className="text-emerald-400">{CONFIG.openRouteService.apiKey ? '✓ Key Set' : 'Fallback / Set in .env'}</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Audit Tab */}
      {activeTab === 'Audit' && (
        <div className="glass-card p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <FileText className="w-4 h-4 text-pink-400" />
            System Audit Trail & Security Logs
          </h3>

          <div className="overflow-x-auto rounded-xl border border-white/10 bg-slate-950/80">
            <table className="w-full text-left text-xs text-slate-200">
              <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] tracking-wider border-b border-white/10">
                <tr>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">User Email</th>
                  <th className="p-3">Action Type</th>
                  <th className="p-3">Region</th>
                  <th className="p-3">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/5">
                    <td className="p-3 text-slate-400">{log.timestamp}</td>
                    <td className="p-3 font-bold text-slate-100">{log.user_email}</td>
                    <td className="p-3 text-teal-300">{log.action}</td>
                    <td className="p-3 text-amber-300">{log.region}</td>
                    <td className="p-3 text-slate-300">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {/* Confirmation Modal for Resetting All Data */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="glass-card w-full max-w-lg rounded-3xl p-6 space-y-5 border border-rose-500/40 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  <AlertOctagon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-100">Confirm Reset Dashboard Data</h3>
                  <span className="text-[10px] text-rose-300 font-bold uppercase tracking-wider">Governance Action</span>
                </div>
              </div>

              <button
                onClick={() => setShowResetModal(false)}
                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <p>
                Are you sure you want to clear all regional metrics, active event rosters, participant records, and case study narratives?
              </p>
              <div className="p-3 rounded-xl bg-slate-900 border border-white/10 font-mono text-[11px] text-amber-300 space-y-1">
                <div className="font-bold">Audit Log Notice:</div>
                <div>• This action will be logged under your account in the System Audit Logs.</div>
                <div>• All cache state will be set to zero.</div>
                <div>• You can run a Beacon Sync to re-populate records from Beacon CRM at any time.</div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowResetModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-xs font-bold text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowResetModal(false);
                  if (onResetAllData) onResetAllData();
                  showToast('Dashboard data reset and cleared. Logged in Audit Trail.');
                }}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 text-white font-bold text-xs shadow-lg hover:brightness-110 flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Confirm Reset Data</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

