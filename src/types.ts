export type UserRole = 'Admin' | 'Manager' | 'RPL' | 'ML' | 'Funder';

export type ViewMode = 
  | 'KPI Dashboard'
  | 'Custom Reports Dashboard'
  | 'Case Studies'
  | 'Data Request Form'
  | 'Admin Dashboard'
  | 'ML Dashboard'
  | 'Funder Dashboard';

export const ROLE_VIEW_PERMISSIONS: Record<UserRole, ViewMode[]> = {
  Admin: [
    'KPI Dashboard',
    'Custom Reports Dashboard',
    'Case Studies',
    'Data Request Form',
    'ML Dashboard',
    'Funder Dashboard',
    'Admin Dashboard'
  ],
  Manager: [
    'KPI Dashboard',
    'Custom Reports Dashboard',
    'Case Studies',
    'Data Request Form',
    'ML Dashboard',
    'Funder Dashboard'
  ],
  RPL: [
    'KPI Dashboard',
    'Custom Reports Dashboard',
    'Case Studies',
    'Data Request Form'
  ],
  ML: [
    'ML Dashboard',
    'Case Studies',
    'Data Request Form'
  ],
  Funder: [
    'Funder Dashboard',
    'Data Request Form'
  ]
};

export const isViewAllowedForRole = (role: UserRole, view: ViewMode): boolean => {
  return ROLE_VIEW_PERMISSIONS[role]?.includes(view) ?? false;
};

export type Region = 'Global' | 'North of England' | 'South of England' | 'Midlands' | 'Wales' | 'Other';

export type Timeframe = 'All Time' | 'Year' | 'Quarter' | 'Month' | 'Week' | 'Custom Range';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  region: Region;
  forcePasswordChange?: boolean;
}

export interface KPIMetric {
  id: string;
  title: string;
  value: string | number;
  change?: string;
  unit?: string;
  category: 'Governance' | 'Partnerships' | 'Delivery' | 'Income' | 'Comms' | 'Case Studies';
  description?: string;
  recordsCount?: number;
}

export interface CaseStudy {
  id: string;
  title: string;
  content: string;
  region: Region;
  date_added: string;
  author?: string;
}

export interface DataRequest {
  id: string;
  name: string;
  email: string;
  date: string;
  time: string;
  reason: string;
  status: 'Pending' | 'Granted' | 'Rejected';
  expiresAt?: string;
}

export interface EventRecord {
  id: string;
  name: string;
  region: Region;
  date: string;
  type: string;
  leader: string;
  attendeesCount: number;
  maxCapacity: number;
  status: 'Completed' | 'Upcoming' | 'In Progress';
  attendees: Attendee[];
  medicalNotes?: string;
  emergencyContactInfo?: string;
}

export interface Attendee {
  id: string;
  name: string;
  email?: string;
  gender: 'Men' | 'Women' | 'Trans / Non-binary / Gender diverse' | 'Prefer not to say' | 'Unknown';
  ageGroup: '18-30' | '30-40' | '40-45' | '45-65' | '65-75' | '75+' | 'Unknown Age';
  postcode?: string;
  medicalConditions?: string;
  emergencyContact?: string;
}

export interface PersonRecord {
  id: string;
  name: string;
  email: string;
  type: 'Participant' | 'Volunteer' | 'Leader' | 'Donor';
  region: Region;
  joinDate: string;
  totalEventsAttended: number;
}

export interface OrganisationRecord {
  id: string;
  name: string;
  type: 'NHS Trust' | 'Corporate' | 'Charity Partner' | 'Educational';
  region: Region;
  status: 'Active' | 'Prospect' | 'Inactive';
  fundingProvided: number;
  contactPerson: string;
}

export interface PaymentRecord {
  id: string;
  payerName: string;
  amount: number;
  type: 'Donated' | 'Ticket Sale' | 'Grant Disbursement' | 'Sponsorship';
  date: string;
  region: Region;
}

export interface GrantRecord {
  id: string;
  funderName: string;
  title: string;
  amount: number;
  status: 'Awarded' | 'Application Pending' | 'Reporting Due';
  startDate: string;
  endDate: string;
  region: Region;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user_email: string;
  action: string;
  region: Region;
  details: string;
}
