import React, { useState, useEffect } from 'react';
import { 
  User, 
  UserRole, 
  ViewMode, 
  Region, 
  Timeframe, 
  CaseStudy, 
  DataRequest, 
  EventRecord, 
  PersonRecord, 
  OrganisationRecord, 
  PaymentRecord, 
  GrantRecord, 
  AuditLog,
  ROLE_VIEW_PERMISSIONS,
  isViewAllowedForRole
} from './types';
import { 
  INITIAL_USERS, 
  INITIAL_CASE_STUDIES, 
  INITIAL_EVENTS, 
  INITIAL_PEOPLE, 
  INITIAL_ORGANISATIONS, 
  INITIAL_PAYMENTS, 
  INITIAL_GRANTS, 
  INITIAL_AUDIT_LOGS 
} from './data/mockData';

import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { KPIDashboard } from './components/KPIDashboard';
import { CustomReportsDashboard } from './components/CustomReportsDashboard';
import { CaseStudiesView } from './components/CaseStudiesView';
import { DataRequestFormView } from './components/DataRequestFormView';
import { MLDashboardView } from './components/MLDashboardView';
import { FunderDashboardView } from './components/FunderDashboardView';
import { AdminDashboardView } from './components/AdminDashboardView';
import { DrillDownModal } from './components/DrillDownModal';
import { Mountain, LogIn, Lock, ShieldCheck, KeyRound, CheckCircle2 } from 'lucide-react';

export function App() {
  // App state
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[0]);
  const [currentView, setCurrentView] = useState<ViewMode>('KPI Dashboard');
  const [selectedRegion, setSelectedRegion] = useState<Region>('Global');
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>('All Time');
  const [lastRefreshTime, setLastRefreshTime] = useState<string>('05/08/2026 03:00');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isLoggedOut, setIsLoggedOut] = useState<boolean>(false);

  // Authentication Form Modal State
  const [selectedLoginEmail, setSelectedLoginEmail] = useState<string>(INITIAL_USERS[0].email);
  const [passwordInput, setPasswordInput] = useState<string>('••••••••');

  // Data state
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>(INITIAL_CASE_STUDIES);
  const [dataRequests, setDataRequests] = useState<DataRequest[]>([]);
  const [events, setEvents] = useState<EventRecord[]>(INITIAL_EVENTS);
  const [people, setPeople] = useState<PersonRecord[]>(INITIAL_PEOPLE);
  const [organisations, setOrganisations] = useState<OrganisationRecord[]>(INITIAL_ORGANISATIONS);
  const [payments, setPayments] = useState<PaymentRecord[]>(INITIAL_PAYMENTS);
  const [grants, setGrants] = useState<GrantRecord[]>(INITIAL_GRANTS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);

  // Drill-down modal state
  const [drillDownOpen, setDrillDownOpen] = useState(false);
  const [drillDownMetric, setDrillDownMetric] = useState({ title: '', category: '' });

  // Centralized Audit Logging Helper
  const logAuditAction = (
    action: string, 
    details: string, 
    overrideEmail?: string, 
    overrideRegion?: Region
  ) => {
    const now = new Date();
    const timestamp = now.toISOString().replace('T', ' ').substring(0, 19);
    const newLog: AuditLog = {
      id: 'al-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      timestamp,
      user_email: overrideEmail || currentUser.email,
      action,
      region: overrideRegion || selectedRegion,
      details
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Enforce role-based view permissions whenever currentUser changes or view changes
  useEffect(() => {
    if (!isViewAllowedForRole(currentUser.role, currentView)) {
      const allowedViews = ROLE_VIEW_PERMISSIONS[currentUser.role] || ['KPI Dashboard'];
      const defaultAllowedView = allowedViews[0] || 'KPI Dashboard';
      setCurrentView(defaultAllowedView);
      logAuditAction(
        'Dashboard View Auto-Redirected',
        `Current view '${currentView}' prohibited for role '${currentUser.role}'. Auto-redirected to '${defaultAllowedView}'`
      );
    }
  }, [currentUser.role, currentUser.email]);

  // Handlers
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const userToLogin = users.find(u => u.email === selectedLoginEmail) || users[0];
    setCurrentUser(userToLogin);
    setIsLoggedOut(false);

    // Verify view permissions for newly logged in user
    if (!isViewAllowedForRole(userToLogin.role, currentView)) {
      const allowedViews = ROLE_VIEW_PERMISSIONS[userToLogin.role] || ['KPI Dashboard'];
      setCurrentView(allowedViews[0]);
    }

    logAuditAction(
      'User Authenticated / Logged In',
      `User ${userToLogin.name} (${userToLogin.email}) authenticated successfully into session with role '${userToLogin.role}'`,
      userToLogin.email
    );
  };

  const handleLogout = () => {
    logAuditAction(
      'User Signed Out / Logged Out',
      `User ${currentUser.name} (${currentUser.email}) logged out of active session.`
    );
    setIsLoggedOut(true);
  };

  const handleRoleChange = (role: UserRole) => {
    const matchUser = users.find(u => u.role === role) || { ...currentUser, role };
    const prevRole = currentUser.role;
    setCurrentUser(matchUser);

    logAuditAction(
      'User Role Context Switched',
      `User switched active role context from '${prevRole}' to '${role}'`
    );

    if (!isViewAllowedForRole(role, currentView)) {
      const allowedViews = ROLE_VIEW_PERMISSIONS[role] || ['KPI Dashboard'];
      setCurrentView(allowedViews[0]);
      logAuditAction('Dashboard View Auto-Navigated', `Auto-redirected to '${allowedViews[0]}' due to role restrictions for '${role}'`);
    }
  };

  const handleViewChange = (view: ViewMode) => {
    if (isViewAllowedForRole(currentUser.role, view)) {
      setCurrentView(view);
      logAuditAction('Dashboard View Navigated', `Navigated to view mode: '${view}'`);
    }
  };

  const handleRegionChange = (region: Region) => {
    setSelectedRegion(region);
    logAuditAction('Region Context Filtered', `Filtered active region context to '${region}'`);
  };

  const handleTimeframeChange = (timeframe: Timeframe) => {
    setSelectedTimeframe(timeframe);
    logAuditAction('Timeframe Window Filtered', `Set active timeframe window filter to '${timeframe}'`);
  };

  const handleManualSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      const nowStr = new Date().toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' });
      setLastRefreshTime(nowStr);

      logAuditAction(
        'Manual Beacon Sync Triggered',
        'Synchronized Beacon CRM records & updated local cache.'
      );
    }, 1500);
  };

  const handleResetAllData = () => {
    setEvents([]);
    setPeople([]);
    setOrganisations([]);
    setPayments([]);
    setGrants([]);
    setCaseStudies([]);
    setDataRequests([]);
    const nowStr = new Date().toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' });
    setLastRefreshTime(nowStr + ' (Data Cleared)');

    logAuditAction(
      'Dashboard Data Reset & Cleared',
      'Admin triggered full cache wipe: all cached events, participants, payments, grants & narratives cleared.'
    );
  };

  const handleRestoreDefaultData = () => {
    setEvents(INITIAL_EVENTS);
    setPeople(INITIAL_PEOPLE);
    setOrganisations(INITIAL_ORGANISATIONS);
    setPayments(INITIAL_PAYMENTS);
    setGrants(INITIAL_GRANTS);
    setCaseStudies(INITIAL_CASE_STUDIES);
    const nowStr = new Date().toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' });
    setLastRefreshTime(nowStr + ' (Defaults Restored)');

    logAuditAction(
      'Dashboard Default Data Restored',
      'Admin re-seeded initial default datasets & regional records.'
    );
  };

  const handleOpenDrillDown = (title: string, category: string) => {
    setDrillDownMetric({ title, category });
    setDrillDownOpen(true);
    logAuditAction(
      'Metric Drill-Down Inspected',
      `Opened granular audit records breakdown for metric '${title}' (${category})`
    );
  };

  const handleAddCaseStudy = (newStudy: Omit<CaseStudy, 'id'>) => {
    const studyWithId: CaseStudy = {
      ...newStudy,
      id: 'cs-' + Date.now()
    };
    setCaseStudies(prev => [studyWithId, ...prev]);

    logAuditAction(
      'Case Study Narrative Added',
      `Created case study: '${newStudy.title}'`,
      undefined,
      newStudy.region
    );
  };

  const handleAddDataRequest = (newReq: Omit<DataRequest, 'id' | 'status'>) => {
    const reqWithId: DataRequest = {
      ...newReq,
      id: 'dr-' + Date.now(),
      status: 'Pending'
    };
    setDataRequests(prev => [reqWithId, ...prev]);

    logAuditAction(
      'Data Access Requested',
      `Submitted formal GDPR access request for reason: ${newReq.reason}`
    );
  };

  const handleGrantAccess = (requestId: string, expiresAt: string) => {
    setDataRequests(prev => prev.map(req => req.id === requestId ? { ...req, status: 'Granted', expiresAt } : req));
    logAuditAction(
      'Data Access Granted',
      `Admin granted temporary access for data request ID '${requestId}' expiring ${expiresAt}`
    );
  };

  const handleUpdateRole = (userId: string, newRole: UserRole) => {
    const targetUser = users.find(u => u.id === userId);
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    logAuditAction(
      'User Account Role Updated',
      `Updated user role for ${targetUser?.name || userId} (${targetUser?.email}) to '${newRole}'`
    );
  };

  const handleResetPassword = (userId: string) => {
    const targetUser = users.find(u => u.id === userId);
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, forcePasswordChange: true } : u));
    logAuditAction(
      'Password Reset Dispatched',
      `Triggered force password reset flag for user ${targetUser?.name || userId} (${targetUser?.email})`
    );
  };

  return (
    <div className="min-h-screen st-bg-gradient flex flex-col text-slate-100 selection:bg-teal-400 selection:text-slate-900 relative">
      {/* Top Header */}
      <Header
        currentUser={currentUser}
        onRoleChange={handleRoleChange}
        selectedRegion={selectedRegion}
        currentView={currentView}
        onLogout={handleLogout}
        lastRefreshTime={lastRefreshTime}
      />

      {/* Main Layout Container */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto">
        {/* Sidebar */}
        <Sidebar
          currentView={currentView}
          onViewChange={handleViewChange}
          selectedRegion={selectedRegion}
          onRegionChange={handleRegionChange}
          selectedTimeframe={selectedTimeframe}
          onTimeframeChange={handleTimeframeChange}
          userRole={currentUser.role}
          lastRefreshTime={lastRefreshTime}
          onManualSync={handleManualSync}
          isSyncing={isSyncing}
        />

        {/* View Content Area */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          {!isViewAllowedForRole(currentUser.role, currentView) ? (
            <div className="p-8 text-center glass-card rounded-3xl border border-amber-500/30 max-w-xl mx-auto my-12 space-y-4">
              <div className="p-4 rounded-2xl bg-amber-500/20 text-amber-300 w-fit mx-auto">
                <Lock className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-100">Access Restricted for Role</h3>
              <p className="text-sm text-slate-300">
                Your current role <span className="text-amber-400 font-extrabold">{currentUser.role}</span> does not have permissions to access <span className="text-teal-300 font-bold">{currentView}</span>.
              </p>
              <button
                onClick={() => setCurrentView(ROLE_VIEW_PERMISSIONS[currentUser.role]?.[0] || 'KPI Dashboard')}
                className="px-5 py-2.5 rounded-xl btn-gradient text-slate-950 font-extrabold text-xs shadow-lg shadow-teal-500/20"
              >
                Go to {ROLE_VIEW_PERMISSIONS[currentUser.role]?.[0] || 'KPI Dashboard'}
              </button>
            </div>
          ) : (
            <>
              {currentView === 'KPI Dashboard' && (
                <KPIDashboard
                  selectedRegion={selectedRegion}
                  selectedTimeframe={selectedTimeframe}
                  userRole={currentUser.role}
                  onOpenDrillDown={handleOpenDrillDown}
                  onAuditLogAction={logAuditAction}
                />
              )}

              {currentView === 'Custom Reports Dashboard' && (
                <CustomReportsDashboard
                  selectedRegion={selectedRegion}
                  selectedTimeframe={selectedTimeframe}
                  userRole={currentUser.role}
                  peopleData={people}
                  organisationsData={organisations}
                  eventsData={events}
                  paymentsData={payments}
                  grantsData={grants}
                  onAuditLogAction={logAuditAction}
                />
              )}

              {currentView === 'Case Studies' && (
                <CaseStudiesView
                  caseStudies={caseStudies}
                  onAddCaseStudy={handleAddCaseStudy}
                  selectedRegion={selectedRegion}
                  userRole={currentUser.role}
                />
              )}

              {currentView === 'Data Request Form' && (
                <DataRequestFormView
                  currentUser={currentUser}
                  allUsers={users}
                  dataRequests={dataRequests}
                  onSubmitRequest={handleAddDataRequest}
                  onGrantAccess={handleGrantAccess}
                />
              )}

              {currentView === 'ML Dashboard' && (
                <MLDashboardView
                  events={events}
                  selectedRegion={selectedRegion}
                  userRole={currentUser.role}
                  onAuditLogAction={logAuditAction}
                />
              )}

              {currentView === 'Funder Dashboard' && (
                <FunderDashboardView
                  grants={grants}
                  selectedRegion={selectedRegion}
                />
              )}

              {currentView === 'Admin Dashboard' && (
                <AdminDashboardView
                  users={users}
                  auditLogs={auditLogs}
                  onUpdateRole={handleUpdateRole}
                  onResetPassword={handleResetPassword}
                  onManualSync={handleManualSync}
                  onResetAllData={handleResetAllData}
                  isSyncing={isSyncing}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Drill Down Modal */}
      <DrillDownModal
        isOpen={drillDownOpen}
        onClose={() => setDrillDownOpen(false)}
        metricTitle={drillDownMetric.title}
        category={drillDownMetric.category}
        userRole={currentUser.role}
        eventsData={events}
        peopleData={people}
        organisationsData={organisations}
        paymentsData={payments}
        grantsData={grants}
        caseStudiesData={caseStudies}
        auditLogsData={auditLogs}
      />

      {/* Authentication Login / Session Sign-in Modal */}
      {isLoggedOut && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-lg animate-fade-in">
          <div className="glass-card w-full max-w-md rounded-3xl p-6 sm:p-8 space-y-6 border border-teal-500/40 shadow-2xl relative">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-400 via-amber-400 to-pink-500 p-0.5 shadow-lg shadow-teal-500/30">
                <div className="w-full h-full bg-[#0a0a12] rounded-[14px] flex items-center justify-center">
                  <Mountain className="w-6 h-6 text-teal-300" />
                </div>
              </div>
              <div>
                <h2 className="text-base font-black bg-gradient-to-r from-teal-300 via-amber-200 to-pink-400 bg-clip-text text-transparent">
                  Mind Over Mountains
                </h2>
                <p className="text-xs text-slate-400 font-semibold">
                  KPI System • User Session Portal
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 space-y-2">
              <div className="text-xs font-bold text-slate-200 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-400" />
                <span>Audited Access Verification</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Sign in to resume active dashboard session. All authentication events are logged into the system audit trail.
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                  Select User Account
                </label>
                <select
                  value={selectedLoginEmail}
                  onChange={(e) => setSelectedLoginEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-white/20 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-100 focus:outline-none focus:border-teal-400"
                >
                  {users.map(u => (
                    <option key={u.id} value={u.email}>
                      {u.name} — {u.email} ({u.role})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5 flex items-center justify-between">
                  <span>Password</span>
                  <span className="text-[10px] text-teal-400 font-mono">2FA Enabled</span>
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full bg-slate-950 border border-white/20 rounded-xl pl-9 pr-3 py-2.5 text-xs font-mono text-slate-100 focus:outline-none focus:border-teal-400"
                  />
                  <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full btn-gradient py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In to Dashboard</span>
              </button>
            </form>

            <div className="text-[10px] text-center text-slate-500 font-mono pt-2 border-t border-white/10">
              Audit System Version 2.4 • Mind Over Mountains Regional Analytics
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
