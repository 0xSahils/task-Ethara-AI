import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Clock, ListTodo } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import PageWrapper from '../../components/layout/PageWrapper.jsx';
import Avatar from '../../components/common/Avatar.jsx';
import { dashboardService } from '../../services/tasks.js';
import { formatRelative, formatDate, isOverdue } from '../../utils/formatDate.js';
import { getStatusColor } from '../../utils/getPriorityColor.js';

// ─── Animated counter ──────────────────────────────────────────────
function useCountUp(end, duration = 1500) {
  const [val, setVal] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (started.current || end === 0) return;
    started.current = true;
    let startTime = null;
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      setVal(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [end, duration]);

  return val;
}

function StatCard({ label, value, icon: Icon, color, delay }) {
  const count = useCountUp(value);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white rounded-card shadow-card p-5 flex items-center gap-4"
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0`} style={{ background: color + '18' }}>
        <Icon size={22} style={{ color }} />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{count}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </motion.div>
  );
}

const PIE_COLORS = ['#6B7280', '#2563EB', '#D97706', '#27AE60'];

export default function DashboardPage() {
  const [stats, setStats] = useState({ totalTasks: 0, inProgress: 0, completed: 0, overdue: 0 });
  const [daily, setDaily] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [s, r] = await Promise.all([dashboardService.getStats(), dashboardService.getRecent()]);
        setStats(s.data.stats);
        setDaily(s.data.dailyCompletions);
        setRecent(r.data.recent);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const pieData = [
    { name: 'To Do',       value: stats.totalTasks - stats.inProgress - stats.completed },
    { name: 'In Progress', value: stats.inProgress },
    { name: 'On Hold',     value: 0 },
    { name: 'Done',        value: stats.completed },
  ].filter(d => d.value > 0);

  return (
    <PageWrapper title="Dashboard">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Tasks"  value={stats.totalTasks} icon={ListTodo}     color="#0F3460" delay={0} />
          <StatCard label="In Progress"  value={stats.inProgress} icon={Clock}        color="#2563EB" delay={0.1} />
          <StatCard label="Completed"    value={stats.completed}  icon={CheckCircle2} color="#27AE60" delay={0.2} />
          <StatCard label="Overdue"      value={stats.overdue}    icon={AlertCircle}  color="#E94560" delay={0.3} />
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Bar chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 bg-white rounded-card shadow-card p-5"
          >
            <h3 className="font-semibold text-gray-900 mb-4">Completed per day (last 7 days)</h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={daily} barSize={28}>
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }}
                />
                <Bar dataKey="count" fill="#0F3460" radius={[6,6,0,0]} animationDuration={1200} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Donut chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-card shadow-card p-5"
          >
            <h3 className="font-semibold text-gray-900 mb-4">Task status</h3>
            {pieData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={140}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" animationDuration={1000}>
                      {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 8, border: 'none', fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-1 mt-2">
                  {pieData.map((d, i) => (
                    <div key={d.name} className="flex items-center gap-2 text-xs text-gray-600">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: PIE_COLORS[i] }} />
                      {d.name} <span className="ml-auto font-medium">{d.value}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-32 text-gray-400 text-sm">No tasks yet</div>
            )}
          </motion.div>
        </div>

        {/* Recent activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-card shadow-card p-5"
        >
          <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
          {loading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => <div key={i} className="h-12 skeleton rounded-lg" />)}
            </div>
          ) : recent.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm">No activity yet — create a project to get started!</div>
          ) : (
            <div className="divide-y divide-gray-50">
              {recent.map((task) => {
                const cfg = getStatusColor(task.status);
                const overdue = isOverdue(task.dueDate) && task.status !== 'DONE';
                return (
                  <div key={task.id} className="flex items-center gap-3 py-3">
                    <Avatar name={task.assignee?.name || 'U'} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{task.title}</p>
                      <p className="text-xs text-gray-400">
                        {task.project?.title} · {formatRelative(task.updatedAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {overdue && <AlertCircle size={14} className="text-danger" />}
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cfg.class}`}>
                        {cfg.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </PageWrapper>
  );
}
