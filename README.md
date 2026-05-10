# 🚀 Team Task Manager

A premium, full-stack, role-based project management application designed for clarity and flow. Built with **Node.js, Express, Prisma (PostgreSQL), React 18, Vite, and Tailwind CSS**.

## ✨ Features
- **📱 PWA Support**: Install the app on your desktop or mobile for a native experience.
- **🔐 Role-Based Access**: Manage projects as an Admin or Member with granular permissions.
- **📋 Kanban Board**: Interactive drag-and-drop task management.
- **📊 Live Analytics**: Real-time dashboard with completion charts and overdue alerts.
- **🎨 Premium UI**: Modern dark mode aesthetic with smooth Framer Motion animations.

---

## 🛠️ Prerequisites
- **Node.js**: v18+ recommended.
- **PostgreSQL**: A running instance (e.g., Supabase).

---

## ⚙️ Setup & Configuration

### 1. Database Configuration
Update `backend/.env` with your PostgreSQL connection strings:
```env
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
JWT_SECRET="your_secure_secret"
```

### 2. Database Migration
Initialize your database schema:
```bash
cd backend
npx prisma db push
```

---

## 📦 How to Run

### Production Mode (Serving Frontend from Backend)
1. **First-time Setup**: Run the custom PWA script to handle assets and initial build:
   - Double-click **`setup_pwa.bat`** in the root folder.
2. **Start the App**: From the root folder:
   ```bash
   npm run dev
   ```
3. **Access**: Visit [http://localhost:5000](http://localhost:5000)

### Development Mode
- **Backend**: `cd backend && npm run dev` (Port 5000)
- **Frontend**: `cd frontend && npm run dev` (Port 5173)

---

## 📱 Web App (PWA) Features
This application is a **Progressive Web App**. When visiting the site in a compatible browser (Chrome, Edge, Safari), you will see a premium **Install Prompt**. 
- **Offline Capable**: Basic caching ensures the app shell loads without internet.
- **Native Experience**: No browser address bar, custom splash screen, and desktop icon.

---

## 🤝 Collaboration Flow
1. **Sign Up**: Create your professional account.
2. **Project Creation**: Create a project and automatically become the **Admin**.
3. **Team Invites**: Navigate to *Project -> Members* to invite collaborators.
4. **Task Management**: Create tasks, assign priorities, and drag them through your workflow.

---
Built with ❤️ by TaskFlow Team © 2026
