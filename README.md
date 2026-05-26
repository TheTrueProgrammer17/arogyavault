# 🏥 ArogyaVault

**Secure Emergency Medical Information Platform**

ArogyaVault (Medivault) is a modern, government-grade healthcare document management platform. It allows citizens to securely store their medical records and provides an emergency access system for first responders. Additionally, the platform features a highly secure Doctor Portal with a strict zero-trust verification workflow, granting temporary, key-based access to specific medical documents.

---

## 🚀 Key Features

* **Role-Based Access Control (RBAC):** Strict separation between Citizen (Patient) and Doctor portals with distinct UI themes.
* **Temporary Document Verification:** Zero-trust data sharing model where patients generate temporary access keys (`AV-XXXX-XXXX`) with expiration timers for doctors.
* **Emergency QR First-Responder Workflow:** Generates a printable, wallet-sized health card. The QR code links to a read-only public emergency profile containing critical data (blood group, allergies).
* **Medical Document Upload System:** Securely store prescriptions, lab reports, and scans in Firebase Storage with metadata tracking.
* **Family Dashboard:** Link family member accounts using a secure request/approval flow.

## 🛠️ Tech Stack

* **Frontend:** React 19, Vite, React Router DOM v7
* **Backend (BaaS):** Firebase (Authentication, Firestore NoSQL Database, Storage)
* **Styling:** Custom Vanilla CSS variables for dynamic Doctor/Patient theming
* **Utilities:** QRCode.react for dynamic QR generation

## 📂 Folder Structure

```text
├── src/
│   ├── assets/       # Static assets like images and icons
│   ├── components/   # Reusable UI elements (GovTopBar, Sidebar, Modals)
│   ├── contexts/     # Global state management (AuthContext)
│   ├── pages/        # Application routes (Dashboard, EmergencyQR, etc.)
│   ├── App.jsx       # Main routing logic (Public vs Private Routes)
│   ├── firebase.js   # Firebase initialization and service exports
│   └── index.css     # Global CSS variables and themes
├── .env.example      # Environment variables template
├── package.json      # Project dependencies and scripts
└── vite.config.js    # Vite bundler configuration
```

## ⚙️ Local Development Setup

Follow these steps to run ArogyaVault on your local machine.

### Prerequisites
- Node.js (v18 or higher)
- A Firebase project

### 1. Clone & Install
```bash
git clone https://github.com/your-username/arogyavault.git
cd arogyavault
npm install
```

### 2. Environment Variables
Copy the `.env.example` file and rename it to `.env`. 
```bash
cp .env.example .env
```
Fill in your Firebase project credentials in the `.env` file:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. Start Development Server
```bash
npm run dev
```
The app will typically be available at `http://localhost:5173/`.

## 🔐 Security Model

1. **Authentication:** Managed entirely by Firebase Auth. Sessions are observed globally.
2. **Zero-Trust Verification:** Doctors **cannot** browse patient profiles. They only see specific documents explicitly shared via temporary keys. Keys expire automatically and are marked "used" to prevent replay attacks.
3. **Public Emergency Route:** The `/emergency/:userId` route is public but restricts data to strictly necessary fields (blood group, allergies) to prevent severe data leaks while allowing instant first-responder access