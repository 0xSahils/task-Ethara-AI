==================================================
 TEAM TASK MANAGER
==================================================
A full-stack, role-based project management app.
Built with Node.js, Express, Prisma, PostgreSQL, React 18, Vite, and Tailwind CSS.

=========================
 PREREQUISITES
=========================
- Node.js installed (v18+ recommended)
- A PostgreSQL database (e.g., Supabase)

=========================
 SETUP & CONFIGURATION
=========================
1. Backend Database Configuration
   Open `backend/.env` and ensure your Supabase connection strings are set:
   DATABASE_URL="your_supabase_pooler_url_port_5432"
   DIRECT_URL="your_supabase_pooler_url_port_5432"
   JWT_SECRET="your_secret"

2. Database Migration
   Open a terminal in the `backend` folder and run:
   > npx prisma db push

=========================
 HOW TO RUN (PRODUCTION MODE)
=========================
We have configured the application so the backend automatically serves the built frontend.

From the ROOT folder of the project, run:
1. > npm run build
   (This will install frontend/backend dependencies and build the frontend)

2. > npm run dev
   (This will start the backend server using nodemon, which will serve the frontend statically)

Open your browser and navigate to: http://localhost:5000

=========================
 APP USAGE
=========================
1. Create an account.
2. Create a project (you automatically become the Admin).
3. Open the project -> Members tab to invite other users.
4. Add tasks, drag them across the Kanban board, and track progress on the Dashboard!
