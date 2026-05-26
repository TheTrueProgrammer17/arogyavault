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

### Prerequisites (Things to Install)
Before you begin, ensure you have the following installed on your PC:
1. **Node.js**: You need Node.js (v18 or higher) to run the application. Download and install it from [nodejs.org](https://nodejs.org/). This will also install `npm` (Node Package Manager).
2. **Git**: Used to clone the repository. Download it from [git-scm.com](https://git-scm.com/).
3. **A Firebase Project**: You will need a free Firebase account to handle backend services (database, authentication, storage).

### 1. Set Up Firebase
1. Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
2. Enable **Authentication** (Email/Password), **Firestore Database**, and **Storage** in your Firebase project.
3. Register a Web App in the project settings to get your Firebase configuration keys.

### 2. Clone the Repository
Open your terminal (Command Prompt, PowerShell, or Terminal) and run:
```bash
git clone https://github.com/your-username/arogyavault.git
cd arogyavault
```

### 3. Install Dependencies
Run the following command to install all the necessary packages for the website:
```bash
npm install
```

### 4. Configure Environment Variables
You need to provide the app with your Firebase keys.
1. Copy the `.env.example` file and rename the copy to `.env`. 
   *(On Windows, you can just copy-paste the file and rename it, or run `copy .env.example .env` in Command Prompt. On Mac/Linux, you can run `cp .env.example .env`)*
2. Open `.env` in a text editor and fill in your Firebase project credentials:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 5. Start the Development Server
Once everything is set up, run the website locally with:
```bash
npm run dev
```
The app will start and typically be available in your browser at `http://localhost:5173/`.
## 🔐 Security Model

1. **Authentication:** Managed entirely by Firebase Auth. Sessions are observed globally.
2. **Zero-Trust Verification:** Doctors **cannot** browse patient profiles. They only see specific documents explicitly shared via temporary keys. Keys expire automatically and are marked "used" to prevent replay attacks.
3. **Public Emergency Route:** The `/emergency/:userId` route is public but restricts data to strictly necessary fields (blood group, allergies) to prevent severe data leaks while allowing instant first-responder access