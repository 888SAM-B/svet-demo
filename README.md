# Sri Venkateshwara Educational Trust (SVET) - Full-Stack Application

This is the full-stack version of the Sri Venkateshwara Educational Trust (SVET) student registration and lead management portal. The project features a responsive Vite + React frontend and a robust FastAPI + MySQL backend.

---

## 1. Monorepo Project Structure

```
svet-demo/
├── README.md               # Main project guide (this file)
├── database/
│   └── svet_db.sql         # MySQL database schema & admin seed script
├── backend/
│   ├── .env.example        # Backend template environment configuration
│   ├── .env                # Active backend configuration (git-ignored)
│   ├── requirements.txt    # Python library dependencies
│   ├── run.py              # Backend development server runner
│   └── app/
│       ├── main.py         # FastAPI main entry point & CORS configuration
│       ├── core/
│       │   ├── config.py   # Settings manager reading from environment variables
│       │   ├── database.py # SQLAlchemy engine, session maker, & db session provider
│       │   └── security.py # Bcrypt password hashing & JWT generation helpers
│       ├── models/
│       │   ├── admin.py    # Admin SQL table model
│       │   ├── student.py  # Student & StudentDocument models (Cascade delete)
│       │   └── contact.py  # ContactEnquiry SQL table model
│       ├── schemas/
│       │   ├── auth_schema.py   # Pydantic auth validation schemas
│       │   ├── student_schema.py# Pydantic student payload & status update schemas
│       │   └── contact_schema.py# Pydantic contact enquiry validation schemas
│       ├── routes/
│       │   ├── auth_routes.py     # Auth endpoint (/api/v1/auth/login)
│       │   ├── student_routes.py  # Lead queries, delete, apply, reset, & files_router
│       │   ├── dashboard_routes.py# Recharts aggregate stats endpoints & Excel exporter
│       │   └── contact_routes.py  # Contact enquiry handler (/api/v1/contact)
│       └── services/
│           ├── email_service.py   # Brevo API email forwarding gateway
│           └── file_service.py    # Path traversal validation & secure upload system
└── frontend/
    ├── .env                # Frontend environment configuration
    ├── package.json        # Frontend React/Vite/Tailwind build configuration
    ├── vite.config.js      # Vite dev/build configuration
    ├── index.html          # Web application HTML entrypoint
    └── src/
        ├── App.jsx         # Primary router config & layout provider
        ├── context/        # Application Context substituting localStorage
        ├── services/       # API integration client (apiClient, authApi, studentApi)
        ├── pages/          # Home, ApplyForm, Leads, Dashboard, AdminLogin pages
        └── components/     # UI reusable components & contact form layout
```

---

## 2. Environment Configurations (`.env`)

### Backend Configuration
Create `backend/.env` file with the following variables:
```ini
# Server Settings
JWT_SECRET_KEY=b3d95c478aef22e8964ccb708e1a1df6d3e467ef6310166a72336c7b8272513a

# Database Configuration (MySQL)
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=root
DATABASE_PASSWORD=your_mysql_root_password
DATABASE_NAME=svet_db

# Brevo Mail Gateway Configurations
BREVO_API_KEY=your_brevo_api_key_here
BREVO_SENDER_NAME=SVET Admissions
BREVO_SENDER_EMAIL=your_verified_sender_email@gmail.com
BREVO_RECEIVER_EMAIL=your_admissions_inbox@gmail.com
```

### Frontend Configuration
Create `frontend/.env` file. To protect API keys, Brevo API integration has been moved fully to the backend. The frontend configuration requires only:
```ini
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

---

## 3. Database Setup (MySQL)

Ensure MySQL is running on your machine (default port `3306`). To set up the database structure and default admin credentials:

1. Open a terminal or MySQL client.
2. Log in using your credentials.
3. Import the SQL script found in `database/svet_db.sql`:
   ```bash
   mysql -u root -p < database/svet_db.sql
   ```
4. This script will:
   - Create the database `svet_db` (if it does not exist).
   - Set up `admins`, `students`, `student_documents`, and `contact_enquiries` tables.
   - Seed the default administrator account:
     - **Username:** `admin`
     - **Password:** `admin123` (hashed securely using Bcrypt)

---

## 4. Backend Setup & Startup

To run the backend server:

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment (recommended):
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```
3. Install the dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the server using the development runner:
   ```bash
   python run.py
   ```
5. The API will start and be available at: `http://localhost:8000`. You can access interactive Swagger documentation at `http://localhost:8000/docs`.

*Note: The backend also has built-in auto-seeding. If the database tables exist but the `admins` table has no entries, a default `admin`/`admin123` account will be automatically added on server startup.*

---

## 5. Frontend Setup & Startup

To run the React user interface:

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. The application will be launched at `http://localhost:5173`.

---

## 6. Default Admin Credentials

To access the protected counselor panel (Leads lists, status updates, Recharts metrics dashboard, and document downloads):

* **Login Route:** `/admin`
* **Username:** `admin`
* **Password:** `admin123`

---

## 7. Key API Endpoints

The FastAPI backend exposes the following endpoint routing under `/api/v1`:

### Authentication
* `POST /api/v1/auth/login`: Authenticate admin credentials. Returns a JWT Bearer access token.

### Student Applications
* `POST /api/v1/students/apply`: Submit student details as form-data field `payload` (JSON string) and file uploads mapped as multipart documents (`marksheet`, `neetApp`, `neetScore`, `photo`, `tc`, `passportFront`).
* `GET /api/v1/students`: Get all student leads (Supports search, country filter, status filter, and date_range query parameters). *Requires Admin Auth*.
* `GET /api/v1/students/{student_id}`: Retrieve a specific application form record. *Requires Admin Auth*.
* `PATCH /api/v1/students/{student_id}/status`: Update a candidate application review status (e.g. "Admitted", "Interview Scheduled") or add administrative notes. *Requires Admin Auth*.
* `DELETE /api/v1/students/{student_id}`: Safely remove a student record from the database and wipe their file folder from disk (with path traversal guards). *Requires Admin Auth*.
* `POST /api/v1/students/reset`: Reset the database table to clear demo entries and clean the file uploads folder. *Requires Admin Auth*.

### Secure Document Serving
* `GET /api/v1/files/students/{application_id}/{filename}`: Authenticated file serve route. Returns the file as binary response. *Requires Admin Auth*.

### Contact Inquiries
* `POST /api/v1/contact`: Submit public inquiries from the website contact form. Saves details to MySQL database and relays notification emails to the admin inbox via Brevo API gateway.

### Dashboard Stats & Analytics
* `GET /api/v1/dashboard/stats`: Returns dashboard statistics (lead metrics, country preferences, status distribution, daily application trends). *Requires Admin Auth*.
* `GET /api/v1/dashboard/stats/export`: Generates an excel spreadsheet of all database entries and downloads it. *Requires Admin Auth*.
