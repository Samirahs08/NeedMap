# NeedMap - Crisis Response & Volunteer Coordination Platform

NeedMap is a comprehensive web platform designed for NGOs and emergency response coordinators. It allows for real-time tracking of community needs, intelligent volunteer matching, dynamic data visualization, and seamless communication during crisis situations.

## 🚀 Key Features

*   **Interactive Dashboard**: Real-time overview of active needs, volunteer availability, and response metrics.
*   **Community Needs Management**: Log, track, and categorize community needs with automated urgency scoring. Includes geographic plotting and bulk resolution capabilities.
*   **Smart Volunteer Matching**: Register volunteers with specific skills, availability, and geographic zones. The system intelligently suggests the best-matched volunteers for critical needs based on proximity and skill sets.
*   **Assignments Kanban Board**: A drag-and-drop interactive board to track the lifecycle of assignments (Notified → Accepted → On Site → Completed).
*   **Smart Upload (AI Parsing)**: Upload raw CSV data or images of field logs, and the system's parser will automatically extract and categorize Providers (Volunteers) and Receivers (Needs), with direct integration into the database.
*   **Automated Reporting**: Generate real-time analytics, charts (via Recharts), and automated email reports for donors and stakeholders.
*   **Real-time Notifications**: Dynamic top-bar notifications alerting coordinators of new critical needs, escalated assignments, and newly registered volunteers.

## 🛠️ Technology Stack

*   **Frontend**: React 19, Vite
*   **Styling**: Custom CSS (Vanilla CSS structure without external frameworks) + modern glassmorphism UI design.
*   **Icons**: Lucide React
*   **Charts**: Recharts
*   **Routing**: React Router DOM
*   **Database & Authentication**: Firebase (Firestore Database, Firebase Authentication)
*   **Integrations**: 
    *   **Firebase Trigger Email Extension**: Automated donor and system emails via SMTP.
    *   **(Planned) Google Cloud Vision API**: For OCR parsing of image uploads.
    *   **(Planned) Twilio WhatsApp API**: For automated volunteer dispatch notifications.

## 📦 Project Structure

```text
src/
├── components/          # Reusable UI components
│   ├── assignments/     # Kanban boards and assignment modals
│   ├── auth/            # Protected routes and login wrappers
│   ├── dashboard/       # Sidebar, TopBar, Maps, and high-level UI
│   ├── needs/           # Need drawers and creation modals
│   └── volunteers/      # Volunteer profile and registration modals
├── context/             # React Context providers (AuthContext)
├── pages/               # Main route views
│   ├── AuthPage.jsx            # Login/Registration
│   ├── DashboardPage.jsx       # Main overview
│   ├── NeedsManagementPage.jsx # Needs tracking
│   ├── VolunteerManagementPage.jsx # Volunteer CRM
│   ├── AssignmentsPage.jsx     # Kanban task board
│   ├── ReportsPage.jsx         # Analytics and email dispatch
│   ├── SmartUploadPage.jsx     # AI File/Image parsing
│   ├── SettingsPage.jsx        # App configurations
│   └── LandingPage.jsx         # Public facing promotional site
├── services/            # Core business logic and API connections
│   ├── firebase.js             # Firebase initialization config
│   ├── dataService.js          # Firestore CRUD operations & metrics
│   └── uploadParser.js         # CSV and Text parsing logic
└── styles/              # Global CSS stylesheets
```

## 💻 Getting Started

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

### 2. Installation
Clone the repository and install the dependencies:
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory and add your Firebase configuration variables. (Ensure these match the variables initialized in `src/services/firebase.js`).

### 4. Running the Development Server
Start the Vite development server:
```bash
npm run dev
```
The application will be accessible at `http://localhost:5173`.

## 📧 Setting Up Email Notifications
NeedMap uses the Firebase **Trigger Email** extension to dispatch automated reports.
1. Navigate to the Firebase Console -> Build -> Extensions.
2. Install the `firestore-send-email` extension.
3. Configure the extension to listen to the `mail` collection.
4. Provide your SMTP credentials (e.g., SendGrid, Mailgun, or Gmail App Password).

## 🤝 Contributing
Contributions are welcome! Please ensure all pull requests align with the existing dark-themed, glassmorphic UI design language.

---
*Built with ❤️ for rapid community response.*
