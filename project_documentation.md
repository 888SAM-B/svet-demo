# SVET Overseas Medical Admissions CRM - Technical Documentation

This document provides a comprehensive technical overview and architectural blueprint of the SVET Overseas Medical Admissions CRM system, including its Role-Based Access Control (RBAC) security framework.

---

## 1. Executive Summary
The SVET Overseas Medical Admissions CRM is a state-of-the-art administrative and lead conversion platform built to streamline student inquiries, applications, and university allocations for study-abroad medical programs (MBBS). The system unifies a public-facing informative website with a secure, multi-tenant administrative workspace. By automating data capture, integrating dynamic Country Page CMS builders, and implementing strict Role-Based Access Control (RBAC), the platform ensures data security, operational agility, and an enhanced user experience for both applicants and administrative personnel.

---

## 2. Project Objectives
- **Centralize Lead Management**: Capture, track, and process admissions leads and application forms securely in one dashboard.
- **Dynamic Content Administration**: Empower non-technical admins to build, reorder, and update country pages and landing website galleries dynamically.
- **Implement Robust Security**: Secure student records and operational actions using modern, granular Role-Based Access Control (RBAC).
- **Ensure Full Auditability**: Log all administrative actions (creation, deletion, updates, settings changes) for compliance and tracking.
- **Deliver Responsive Design**: Provide an optimized UI for mobile, tablet, and desktop viewports.

---

## 3. Business Challenges
- **Scattered Communication**: Student details, document uploads, and follow-up notes were historically maintained in siloed spreadsheets, causing follow-up delays.
- **Rigid Content Management**: Creating or updating country information (e.g., fee changes, university additions) required developer intervention.
- **Security Vulnerabilities**: Lack of access control meant all administrative staff had unrestricted access to sensitive student databases, including passport copies and marksheets.
- **No Operational History**: Lack of audit logs made it impossible to trace who modified records or changed system configurations.

---

## 4. Proposed Solution
A unified, web-based CRM solution that consolidates student information and administrative operations:
- **Unified Portal**: A single admin login route (`/login`) that automatically detects roles and adjusts navigation layouts accordingly.
- **Dynamic CMS**: Modular component builders for country pages (Hero, FAQs, Highlights, Tables, Universities, Rich Text, CTA).
- **Granular Security Controls**: Route-level guards in React and FastAPI middleware to prevent unauthorized data exposure.
- **Automated Audit Logs**: A background tracking pipeline that logs key mutations to a persistent database.

---

## 5. System Modules

### 5.1 Landing Website
- **Public Informative Pages**: Clean, high-performance landing page displaying medical education value propositions, statistics, and journey timelines.
- **Dynamic Destinations Grid**: Renders country cards with quick stats (flag, fee, language, course duration). Clicking "Learn More" displays a modal populated via dynamic backend queries.
- **Student Application Form**: A multi-step form for eligibility checks, supporting user uploads for academic transcripts.

### 5.2 Lead Management
- **Centralized Board**: Real-time leads grid indicating processing status (New, Under Review, Accepted, Rejected).
- **Document Manager**: Secure view and download interface for uploaded student documents (Passport, 10th/12th Marksheets).
- **Status & Notes Updates**: Allows administrative managers to update processing states and append follow-up comments.

### 5.3 Country Management
- **Country Listing CRUD**: Manage country metadata (Name, Slug, Starting Fee, Flag Image, Card Background Image).
- **Dynamic Page Builder**: Allows reordering, creating, updating, and toggling page sections (Hero, FAQs, Tables, Rich Text).
- **SEO Configurations**: Configurable meta-titles, keywords, and description parameters per destination page.

### 5.4 Gallery Management
- **Dynamic Homepage Slider**: Admin-manageable gallery image uploads with custom overlay captions and ordering.
- **File Asset Management**: Secure file upload system validating extensions, file sizes (max 5MB), and preventing path-traversal attacks.

---

## 6. Technology Stack

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Frontend** | React.js | Dynamic single-page application rendering. |
| | React Router | Flat, clean dashboard routing and auth guards. |
| | TailwindCSS | Premium responsive design system. |
| | Framer Motion | Smooth page transitions and micro-animations. |
| **Backend** | FastAPI | High-performance asynchronous Python API. |
| | SQLAlchemy | Object-Relational Mapper (ORM) for SQL abstraction. |
| | JWT (PyJWT) | Secure stateless session management. |
| | Passlib (bcrypt) | Strong password hashing algorithm. |
| **Database** | MySQL | Robust relational database. |

---

## 7. System Architecture

```
                  +-----------------------------------+
                  |        React Frontend SPA         |
                  |     (LocalPort: 5173 / 5174)      |
                  +-----------------+-----------------+
                                    |
                                    | REST API Calls (JSON / Bearer JWT)
                                    v
                  +-----------------+-----------------+
                  |      FastAPI Backend Engine       |
                  |         (LocalPort: 8000)         |
                  +--------+-----------------+--------+
                           |                 |
     SQL queries via ORM   |                 | Log audit events
                           v                 v
                  +--------+--------+      +-+----------------+
                  |  MySQL Database |      |  Activity Log   |
                  |    (svet_db)    |      |  Service Pipeline|
                  +-----------------+      +------------------+
```

---

## 8. Role Based Access Control (RBAC)

The system restricts features based on three defined administrative roles:

1. **`MASTER_ADMIN`**: Full administrative access. Can manage users, view system audit logs, handle settings, update countries, manage leads, and edit galleries.
2. **`LEAD_MANAGER`**: Focused on processing student inquiries. Authorized to access the Leads dashboard, change application states, add notes, and manage the Homepage Gallery.
3. **`COUNTRY_MANAGER`**: Focused on CMS updates. Authorized to manage country details, reorder page builders, upload assets, and adjust SEO settings.

### Route Permission Matrix

| Module / Route | API Route Prefix | MASTER_ADMIN | LEAD_MANAGER | COUNTRY_MANAGER |
| :--- | :--- | :---: | :---: | :---: |
| **User CRUD** | `/api/v1/users` | ✅ Yes | ❌ No | ❌ No |
| **System Audit Logs** | `/api/v1/admin-stats` | ✅ Yes | ❌ No | ❌ No |
| **Leads & Applications** | `/api/v1/students` | ✅ Yes | ✅ Yes | ❌ No |
| **Gallery Slider** | `/api/v1/admin/gallery` | ✅ Yes | ✅ Yes | ❌ No |
| **Country Page Builder**| `/api/v1/admin/countries`| ✅ Yes | ❌ No | ✅ Yes |

---

## 9. Security Features
- **Stateless JWT Claims**: Authentication tokens carry the user's role and database ID in their payload, which is decoded and verified on each request.
- **FastAPI Security Dependencies**: The backend uses a centralized dependency injection checker `require_role(allowed_roles)` to validate operations server-side.
- **Route Gates (Frontend)**: Protected routes redirect unauthorized access requests to a dedicated `403 Unauthorized` page.
- **Input Validation**: Automatic payload verification using Pydantic schemas.
- **Secure File Uploads**: Subfolder validation limits, extension checks, and path-traversal prevention.
- **Self-Deactivation Guard**: Masters Admins are blocked from self-deactivating or self-deleting to prevent accidental lockouts.

---

## 10. Benefits to SVET
- **Efficiency**: Reduces student application processing time by keeping documentation and communications centralized.
- **Autonomy**: Non-technical staff can update fees, universities, and FAQs on the live site without developer assistance.
- **Trust & Compliance**: Audited logs ensure accountability for changes to student records or destination data.
- **Security**: Sensitive student data is protected, and staff access is limited to what is required for their specific role.

---

## 11. Future Scalability
- **Multi-Branch Expansion**: The system's relational database can adapt to track leads by SVET regional branch offices.
- **Notification Gateways**: Built-in support for Brevo SMTP allows for future integrations with automated WhatsApp or SMS alerts for status updates.
- **Advanced Reporting**: The statistics endpoint can be expanded to generate exportable PDF or Excel files showing application conversion rates over time.

---

## 12. Conclusion
The SVET CRM is a modern, secure, and highly scalable enterprise platform. Through the implementation of a unified RBAC system, audited backend logs, and a dynamic CMS, the platform secures student data while making website content management simple and straightforward for administrators.
