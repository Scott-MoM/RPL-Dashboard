# Mind Over Mountains - Impact & Operations Dashboard

An operational and impact analytics web application built for **Mind Over Mountains** to streamline regional delivery, outcome reporting, governance data requests, and funder transparency.

---

## 🌟 Overview

The Mind Over Mountains Dashboard provides role-tailored insights and tools for managing outdoor therapeutic mental health programmes across the UK. It enables real-time tracking of participant well-being improvements, financial grants, event delivery, and compliance logging across regions including the **North of England**, **South of England**, **Midlands**, **Wales**, and **Global** oversight.

---

## 🔐 Role-Based Access Control (RBAC) & View Permissions

Access levels are strictly configured to align with organizational roles and compliance standards:

| View / Module | Admin | Manager | RPL (Regional Programme Lead) | ML (Mountain Leader) | Funder |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **KPI Dashboard** | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Custom Reports Dashboard** | ✅ | ✅ | ✅ *(restricted)* | ❌ | ❌ |
| **Case Studies** | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Data Request Form** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **ML Dashboard** | ✅ | ✅ | ❌ | ✅ | ❌ |
| **Funder Dashboard** | ✅ | ✅ | ❌ | ❌ | ✅ |
| **Admin Dashboard** | ✅ | ❌ | ❌ | ❌ | ❌ |

---

## 📊 Core Features & Views

### 1. 📈 KPI Dashboard
- **Executive Metrics**: Total attendees, wellbeing score gains, funded places, and active grant utilization.
- **Granular Timeframe Filtering**: Filter by All Time, Year, Quarter, Month, Week, or Custom Date Ranges with 7-day, 30-day, 90-day, and YTD presets.
- **Interactive Drill-Downs**: Inspect underlying records with automatic PII masking based on user clearance level.

### 2. 📋 Custom Reports Dashboard
- **Multi-Dataset Querying**: Filter and extract insights from People, Organisations, Events, Payments, and Grants.
- **Export & Visualisations**: Render dataset outputs as Tabular tables, Bar charts, Line charts, or Pie distributions with CSV export capabilities.

### 3. 📖 Case Studies & Qualitative Impact
- **Impact Storytelling**: Document participant journeys, qualitative outcomes, and location-tagged stories.
- **Media & Evidence Attachments**: Attach imagery and testimonials to support funding requests and outcome validation.

### 4. 📝 Governance Data Request Form
- **Structured Request Workflow**: Submit formal requests for sensitive audit or research datasets.
- **Access Delegation**: Formal review, approval, and permission granting for data governance compliance.

### 5. 🏔️ ML (Mountain Leader) Dashboard
- **Event Operations**: Event walk logs, attendee headcounts, weather safety check-ins, and route notes.
- **Feedback Collection**: Track post-walk participant feedback and safety incidents.

### 6. 🏛️ Funder Dashboard
- **Executive Grant Summaries**: High-level impact reports tailored for major donors and trust funders.
- **Grant Utilisation & Status**: Direct tracking of active grant funds, milestone progress, and beneficiary impact spotlights.

### 7. 🛡️ Admin Dashboard
- **User & Role Management**: Real-time user role assignments and regional access controls.
- **Audit Logs**: Comprehensive activity logging for system auditing and data protection compliance.
- **Data Synchronization**: Database sync tools and test data resets.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Visualisations**: Recharts, D3.js
- **Icons**: Lucide React
- **Animations**: Motion (`motion/react`)

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn / bun package manager

### Local Development

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Dev Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

3. **Build for Production**:
   ```bash
   npm run build
   ```

4. **Start Production Server**:
   ```bash
   npm run start
   ```

---

## 📚 Documentation & Manuals

Detailed user guides and operational manuals are available in the `/docs/manuals/` directory:

- `ADMIN-MANUAL.md` - Complete system administration guide
- `MANAGER-MANUAL.md` - Operational management & team reporting guide
- `RPL-MANUAL.md` - Regional Programme Lead workflow guide
- `ML-MANUAL.md` - Mountain Leader event & walk log guide
- `FUNDER-MANUAL.md` - Funder grant tracking & reporting guide
- `FULL-DASHBOARD-MANUAL.md` - Comprehensive dashboard reference guide
