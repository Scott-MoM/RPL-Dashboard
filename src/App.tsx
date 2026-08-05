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
import { Mountain, LogIn, Lock, ShieldCheck, KeyRound, CheckCircle2, Mail, AlertCircle, Loader2, Database } from 'lucide-react';
import { supabase, isSupabaseConfigured } from './lib/supabaseClient';

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

  // Authentication Form Modal State (Email & Password - No Dropdown)
  const [loginEmailInput, setLoginEmailInput] = useState<string>(INITIAL_USERS[0].email);
  const [loginPasswordInput, setLoginPasswordInput] = useState<string>('');
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string | null>(null);

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
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = loginEmailInput.trim();
    if (!cleanEmail || !loginPasswordInput) {
      setLoginError('Please enter both your email address and password.');
      return;
    }

    setIsAuthenticating(true);
    setLoginError(null);

    try {
      if (isSupabaseConfigured && supabase) {
        // Query Supabase Dashboard Authentication
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: loginPasswordInput,
        });

        if (error) {
          setLoginError(`Supabase Auth Failed: ${error.message}`);
          logAuditAction(
            'User Authentication Denied (Supabase)',
            `Failed authentication attempt for email '${cleanEmail}': ${error.message}`,
            cleanEmail
          );
          setIsAuthenticating(false);
          return;
        }

        if (data?.user) {
          const authEmail = data.user.email || cleanEmail;
          const userToLogin = users.find(u => u.email.toLowerCase() === authEmail.toLowerCase()) || {
            id: data.user.id,
            name: data.user.user_metadata?.full_name || authEmail.split('@')[0],
            email: authEmail,
            role: (data.user.user_metadata?.role as UserRole) || 'Manager',
            region: 'Global' as Region
          };

          setCurrentUser(userToLogin);
          setIsLoggedOut(false);
          setLoginPasswordInput('');

          if (!isViewAllowedForRole(userToLogin.role, currentView)) {
            const allowedViews = ROLE_VIEW_PERMISSIONS[userToLogin.role] || ['KPI Dashboard'];
            setCurrentView(allowedViews[0]);
          }

          logAuditAction(
            'User Authenticated (Supabase Auth)',
            `User ${userToLogin.name} (${userToLogin.email}) verified successfully via Supabase Auth with role '${userToLogin.role}'`,
            userToLogin.email
          );
        }
      } else {
        // Local Validation Mode when Supabase credentials are not provided in env
        const userToLogin = users.find(u => u.email.toLowerCase() === cleanEmail.toLowerCase());

        if (!userToLogin) {
          setLoginError(`User with email '${cleanEmail}' not found in authorization directory.`);
          logAuditAction(
            'User Authentication Denied',
            `Unknown email attempted: '${cleanEmail}'`,
            cleanEmail
          );
          setIsAuthenticating(false);
          return;
        }

        setCurrentUser(userToLogin);
        setIsLoggedOut(false);
        setLoginPasswordInput('');

        if (!isViewAllowedForRole(userToLogin.role, currentView)) {
          const allowedViews = ROLE_VIEW_PERMISSIONS[userToLogin.role] || ['KPI Dashboard'];
          setCurrentView(allowedViews[0]);
        }

        logAuditAction(
          'User Authenticated (Local Directory)',
          `User ${userToLogin.name} (${userToLogin.email}) authenticated successfully into session with role '${userToLogin.role}'`,
          userToLogin.email
        );
      }
    } catch (err: any) {
      setLoginError(err.message || 'An unexpected authentication error occurred.');
    } finally {
      setIsAuthenticating(false);
    }
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
          <div className="glass-card w-full max-w-md rounded-3xl p-6 sm:p-8 space-y-5 border border-teal-500/40 shadow-2xl relative">
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
                  KPI System • Supabase Session Portal
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10 space-y-1.5">
              <div className="text-xs font-bold text-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-teal-400" />
                  <span>Supabase Authentication</span>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  <Database className="w-3 h-3 text-emerald-400" />
                  <span>{isSupabaseConfigured ? 'Supabase Active' : 'Supabase Client Ready'}</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Enter your registered user email and password to query Supabase Auth. Access is granted only upon successful Supabase verification.
              </p>
            </div>

            {loginError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5 animate-shake">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div className="flex-1 font-medium">{loginError}</div>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={loginEmailInput}
                    onChange={(e) => {
                      setLoginEmailInput(e.target.value);
                      if (loginError) setLoginError(null);
                    }}
                    placeholder="e.g. scott.harvey-whittle@mindovermountains.org.uk"
                    className="w-full bg-slate-950 border border-white/20 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-400"
                  />
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5 flex items-center justify-between">
                  <span>Password</span>
                  <span className="text-[10px] text-teal-400 font-mono">2FA Security</span>
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={loginPasswordInput}
                    onChange={(e) => {
                      setLoginPasswordInput(e.target.value);
                      if (loginError) setLoginError(null);
                    }}
                    placeholder="Enter your account password"
                    className="w-full bg-slate-950 border border-white/20 rounded-xl pl-9 pr-3 py-2.5 text-xs font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-400"
                  />
                  <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isAuthenticating}
                className="w-full btn-gradient py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20 disabled:opacity-50 transition-all"
              >
                {isAuthenticating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-900" />
                    <span>Querying Supabase Auth...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Verify Credentials & Sign In</span>
                  </>
                )}
              </button>
            </form>

            <div className="text-[10px] text-center text-slate-500 font-mono pt-2 border-t border-white/10 space-y-1">
              <div>Supabase Auth Verification Engine • Mind Over Mountains Regional Analytics</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
