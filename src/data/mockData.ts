import { 
  User, 
  KPIMetric, 
  CaseStudy, 
  DataRequest, 
  EventRecord, 
  PersonRecord, 
  OrganisationRecord, 
  PaymentRecord, 
  GrantRecord, 
  AuditLog 
} from '../types';

export const INITIAL_USERS: User[] = [
  { id: 'u1', name: 'Scott Whittle', email: 'scott.harvey-whittle@mindovermountains.org.uk', role: 'Admin', region: 'Global' },
  { id: 'u2', name: 'Vicky (Manager)', email: 'vicky.manager@mindovermountains.org.uk', role: 'Manager', region: 'North of England' },
  { id: 'u3', name: 'RPL User Sarah', email: 'sarah.rpl@mindovermountains.org.uk', role: 'RPL', region: 'South of England' },
  { id: 'u4', name: 'Leader Dave (ML)', email: 'dave.ml@mindovermountains.org.uk', role: 'ML', region: 'Midlands' },
  { id: 'u5', name: 'Funder Rep', email: 'funder@nationaltrust.org.uk', role: 'Funder', region: 'Global' }
];

export const INITIAL_CASE_STUDIES: CaseStudy[] = [
  {
    id: 'cs1',
    title: 'A Life Changed in the Lake District',
    content: 'One of our participants, John, joined the wellbeing walk after suffering from severe social isolation. After 6 weeks, he reported a 40% improvement in his mood scores and has now volunteered to lead the beginner group.',
    region: 'North of England',
    date_added: '2023-10-15 14:30:00',
    author: 'Dave Leader'
  },
  {
    id: 'cs2',
    title: 'South Downs Mindful Hike Impact',
    content: 'Our weekend retreat brought together 18 participants facing burnout. 100% of attendees stated they felt significantly less anxious and better equipped with coping mechanisms for work stress.',
    region: 'South of England',
    date_added: '2024-02-10 11:15:00',
    author: 'Sarah RPL'
  },
  {
    id: 'cs3',
    title: 'Peak District NHS Referral Success',
    content: 'In partnership with Derbyshire NHS Trust, 12 social prescribing referrals completed the 4-stage outdoor resilience course. 10 participants scored improved PHQ-9 wellness metrics.',
    region: 'Midlands',
    date_added: '2024-05-22 09:45:00',
    author: 'Manager Alex'
  }
];

export const INITIAL_EVENTS: EventRecord[] = [
  {
    id: 'ev101',
    name: 'Helvellyn Mindful Ridge Walk',
    region: 'North of England',
    date: '2026-07-12',
    type: 'Day Walk',
    leader: 'Dave Leader',
    attendeesCount: 16,
    maxCapacity: 20,
    status: 'Completed',
    medicalNotes: 'Two participants noted mild asthma; inhalers checked prior to ascent.',
    emergencyContactInfo: 'Duty Officer: 07700 900123 / Keswick MRT on standby.',
    attendees: [
      { id: 'p1', name: 'John Doe', email: 'john@example.com', gender: 'Men', ageGroup: '45-65', postcode: 'LA22 9SU', medicalConditions: 'Mild Asthma', emergencyContact: 'Wife - 07700 900111' },
      { id: 'p2', name: 'Emma Watson', email: 'emma@example.com', gender: 'Women', ageGroup: '30-40', postcode: 'CA12 5XJ', medicalConditions: 'None', emergencyContact: 'Husband - 07700 900222' },
      { id: 'p3', name: 'Alex Smith', email: 'alex@example.com', gender: 'Trans / Non-binary / Gender diverse', ageGroup: '18-30', postcode: 'LA9 4HE', medicalConditions: 'Penicillin Allergy', emergencyContact: 'Parent - 07700 900333' }
    ]
  },
  {
    id: 'ev102',
    name: 'South Downs Wellbeing Ramblers',
    region: 'South of England',
    date: '2026-08-01',
    type: 'Day Walk',
    leader: 'Sarah RPL',
    attendeesCount: 14,
    maxCapacity: 15,
    status: 'Completed',
    medicalNotes: 'No acute medical issues reported.',
    emergencyContactInfo: 'Duty Officer: 07700 900456',
    attendees: [
      { id: 'p4', name: 'Claire Bennet', email: 'claire@example.com', gender: 'Women', ageGroup: '40-45', postcode: 'BN1 1AA', medicalConditions: 'Knee arthritis', emergencyContact: 'Sister - 07700 900444' },
      { id: 'p5', name: 'David Miller', email: 'david@example.com', gender: 'Men', ageGroup: '65-75', postcode: 'SO14 0AB', medicalConditions: 'High Blood Pressure', emergencyContact: 'Daughter - 07700 900555' }
    ]
  },
  {
    id: 'ev103',
    name: 'Snowdonia Resilience Weekend',
    region: 'Wales',
    date: '2026-08-20',
    type: 'Weekend Retreat',
    leader: 'Dave Leader',
    attendeesCount: 12,
    maxCapacity: 12,
    status: 'Upcoming',
    medicalNotes: 'Requires dietary preparation for vegetarian/gluten free.',
    emergencyContactInfo: 'Llanberis MRT',
    attendees: [
      { id: 'p6', name: 'Gareth Thomas', email: 'gareth@example.com', gender: 'Men', ageGroup: '30-40', postcode: 'LL55 4TY', medicalConditions: 'Diabetes Type 2', emergencyContact: 'Partner - 07700 900666' }
    ]
  }
];

export const INITIAL_PEOPLE: PersonRecord[] = [
  { id: 'pr1', name: 'John Doe', email: 'john@example.com', type: 'Participant', region: 'North of England', joinDate: '2023-01-15', totalEventsAttended: 8 },
  { id: 'pr2', name: 'Emma Watson', email: 'emma@example.com', type: 'Volunteer', region: 'North of England', joinDate: '2022-06-10', totalEventsAttended: 14 },
  { id: 'pr3', name: 'Alex Smith', email: 'alex@example.com', type: 'Participant', region: 'North of England', joinDate: '2023-09-01', totalEventsAttended: 4 },
  { id: 'pr4', name: 'Claire Bennet', email: 'claire@example.com', type: 'Participant', region: 'South of England', joinDate: '2023-11-20', totalEventsAttended: 5 },
  { id: 'pr5', name: 'Gareth Thomas', email: 'gareth@example.com', type: 'Participant', region: 'Wales', joinDate: '2024-01-10', totalEventsAttended: 3 }
];

export const INITIAL_ORGANISATIONS: OrganisationRecord[] = [
  { id: 'org1', name: 'Derbyshire Healthcare NHS Trust', type: 'NHS Trust', region: 'Midlands', status: 'Active', fundingProvided: 15000, contactPerson: 'Dr. Rachel Green' },
  { id: 'org2', name: 'Patagonia Environmental Fund', type: 'Corporate', region: 'Global', status: 'Active', fundingProvided: 25000, contactPerson: 'Mark Vance' },
  { id: 'org3', name: 'Lake District National Park Authority', type: 'Charity Partner', region: 'North of England', status: 'Active', fundingProvided: 8000, contactPerson: 'Simon Hill' },
  { id: 'org4', name: 'Cardiff Mind Wellbeing Hub', type: 'Charity Partner', region: 'Wales', status: 'Prospect', fundingProvided: 0, contactPerson: 'Elin Davies' }
];

export const INITIAL_PAYMENTS: PaymentRecord[] = [
  { id: 'pay1', payerName: 'Derbyshire Healthcare NHS Trust', amount: 7500, type: 'Grant Disbursement', date: '2026-06-01', region: 'Midlands' },
  { id: 'pay2', payerName: 'Patagonia Environmental Fund', amount: 25000, type: 'Sponsorship', date: '2026-05-15', region: 'Global' },
  { id: 'pay3', payerName: 'Individual Supporters Drive', amount: 3450, type: 'Donated', date: '2026-07-02', region: 'South of England' },
  { id: 'pay4', payerName: 'Helvellyn Walk Ticket Sales', amount: 1200, type: 'Ticket Sale', date: '2026-07-10', region: 'North of England' }
];

export const INITIAL_GRANTS: GrantRecord[] = [
  { id: 'gr1', funderName: 'National Lottery Community Fund', title: 'Northern Wellbeing Outdoor Trails', amount: 50000, status: 'Awarded', startDate: '2025-09-01', endDate: '2027-08-31', region: 'North of England' },
  { id: 'gr2', funderName: 'Sport England Outdoor Fund', title: 'Southern Green Exercise Access', amount: 35000, status: 'Awarded', startDate: '2026-01-01', endDate: '2026-12-31', region: 'South of England' },
  { id: 'gr3', funderName: 'Welsh Government Health Trust', title: 'Cymru Mountain Mind Project', amount: 20000, status: 'Application Pending', startDate: '2026-10-01', endDate: '2027-09-30', region: 'Wales' }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  { id: 'al1', timestamp: '2026-08-05 02:15:10', user_email: 'scott.harvey-whittle@mindovermountains.org.uk', action: 'Beacon Sync Triggered', region: 'Global', details: 'Imported 124 records from Beacon CRM API' },
  { id: 'al2', timestamp: '2026-08-04 18:40:22', user_email: 'alex.manager@mindovermountains.org.uk', action: 'Custom Report Exported', region: 'North of England', details: 'Exported Events dataset (14 rows)' },
  { id: 'al3', timestamp: '2026-08-03 11:05:00', user_email: 'sarah.rpl@mindovermountains.org.uk', action: 'Case Study Created', region: 'South of England', details: 'Added: South Downs Mindful Hike Impact' }
];
