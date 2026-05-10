import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckSquare, Users, BarChart3, ArrowRight, Github, Download, Laptop, Smartphone } from 'lucide-react';
import Button from '../components/common/Button.jsx';

const features = [
  { icon: CheckSquare, title: 'Task Boards', desc: 'Kanban-style task management with drag-and-drop columns and priority labels.' },
  { icon: Users,       title: 'Team Roles',  desc: 'Admin and Member roles per project — precise access control out of the box.' },
  { icon: BarChart3,   title: 'Analytics',   desc: 'Live dashboard with completion charts, overdue alerts, and activity feeds.' },
];

const stagger = { animate: { transition: { staggerChildren: 0.12 } } };
const fadeUp  = { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

export default function LandingPage() {
  return (
    <div className="min-h-screen animated-gradient text-white overflow-hidden">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5 max-w-6xl mx-auto">
        <div className="flex items-center gap-2 font-bold text-lg">
          <CheckSquare size={22} className="text-blue-300" />
          TaskFlow
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button variant="ghost" size="sm" className="border-white/30 text-white hover:bg-white/10">
              Log in
            </Button>
          </Link>
          <Link to="/signup">
            <Button variant="primary" size="sm" className="shadow-lg shadow-accent/20">
              Get Started
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <motion.section
        variants={stagger}
        initial="initial"
        animate="animate"
        className="text-center px-6 pt-20 pb-16 max-w-4xl mx-auto"
      >
        <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-sm text-blue-200 mb-6">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          Now in Beta — Free forever for small teams
        </motion.div>

        <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-black leading-tight tracking-tight mb-6">
          Ship faster.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-400">
            Together.
          </span>
        </motion.h1>

        <motion.p variants={fadeUp} className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-10">
          A role-based project management app for teams who value clarity.
          Assign tasks, track progress, and hit deadlines — no noise, just flow.
        </motion.p>

        <motion.div variants={fadeUp} className="flex items-center justify-center gap-4 flex-wrap">
          <Link to="/signup">
            <Button size="lg" className="px-10 py-4 text-base shadow-xl shadow-accent/20">
              Start for free <ArrowRight size={20} />
            </Button>
          </Link>
          <Link to="/login">
            <button className="px-7 py-3.5 rounded-xl border border-white/30 text-white/80 hover:bg-white/10 transition-colors font-medium">
              View demo
            </button>
          </Link>
        </motion.div>
      </motion.section>

      {/* Dashboard preview mockup */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="max-w-5xl mx-auto px-6 mb-20"
      >
        <div className="bg-white/10 border border-white/20 rounded-2xl p-4 backdrop-blur-sm">
          <div className="flex gap-1.5 mb-4">
            {['bg-red-400','bg-yellow-400','bg-green-400'].map((c,i) => (
              <div key={i} className={`w-2.5 h-2.5 rounded-full ${c}`} />
            ))}
          </div>
          <div className="grid grid-cols-4 gap-3">
            {/* Sidebar mockup */}
            <div className="col-span-1 bg-primary/80 rounded-xl p-3 space-y-2">
              {['Dashboard','Projects','Profile'].map(s => (
                <div key={s} className={`h-7 rounded-lg flex items-center px-2 text-xs text-white/60 ${s==='Projects'?'bg-accent':''}`}>
                  {s}
                </div>
              ))}
            </div>
            {/* Content mockup */}
            <div className="col-span-3 space-y-3">
              <div className="grid grid-cols-4 gap-2">
                {['Total Tasks','In Progress','Completed','Overdue'].map((l,i) => (
                  <div key={l} className="bg-white/15 rounded-xl p-3">
                    <div className="text-xs text-white/50 mb-1">{l}</div>
                    <div className="text-xl font-bold">{[24,8,13,3][i]}</div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-2">
                {['To Do','In Progress','Done'].map(col => (
                  <div key={col} className="bg-white/10 rounded-xl p-3">
                    <div className="text-xs font-semibold text-white/70 mb-2">{col}</div>
                    {[1,2].map(i => (
                      <div key={i} className="bg-white/15 rounded-lg p-2 mb-1.5 text-xs text-white/60 h-8" />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <motion.div
          variants={stagger}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-6"
        >
          {features.map(({ icon: Icon, title, desc }) => (
            <motion.div
              key={title}
              variants={fadeUp}
              whileHover={{ y: -6 }}
              className="glass rounded-2xl p-6 cursor-default"
            >
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mb-4">
                <Icon size={20} className="text-blue-300" />
              </div>
              <h3 className="font-bold text-lg mb-2">{title}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Download / PWA Section */}
      <section className="max-w-4xl mx-auto px-6 pb-24 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass rounded-3xl p-10 md:p-16 border border-white/20 relative overflow-hidden"
        >
          {/* Background glow effects */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />

          <h2 className="text-3xl md:text-4xl font-bold mb-4 relative z-10">
            Take TaskFlow everywhere.
          </h2>
          <p className="text-white/60 text-lg mb-10 max-w-xl mx-auto relative z-10">
            Install our Progressive Web App for a native experience on Desktop, iOS, and Android. No App Store required.
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 relative z-10">
            <Link to="/signup">
              <Button 
                size="lg" 
                className="w-full md:w-auto px-10 bg-white text-indigo-900 hover:bg-white/90 shadow-xl shadow-white/10"
              >
                <Download size={20} /> Get App Now
              </Button>
            </Link>
            
            <div className="flex gap-8 text-white/40">
              <div className="flex flex-col items-center gap-1.5">
                <Laptop size={24} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Desktop</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <Smartphone size={24} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Mobile</span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-6 text-center text-white/40 text-sm">
        <div className="flex items-center justify-center gap-4 mb-2">
          <a href="https://github.com" className="hover:text-white transition-colors"><Github size={16} /></a>
        </div>
        Built with React + Node.js + PostgreSQL · TaskFlow © 2026
      </footer>
    </div>
  );
}
