import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, FolderKanban, Users, CalendarDays, Trash2 } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper.jsx';
import Button from '../../components/common/Button.jsx';
import Input from '../../components/common/Input.jsx';
import Modal from '../../components/common/Modal.jsx';
import Badge from '../../components/common/Badge.jsx';
import { SkeletonCard } from '../../components/common/Loader.jsx';
import { useProjects } from '../../hooks/useProjects.js';
import { formatDate } from '../../utils/formatDate.js';
import toast from 'react-hot-toast';

const PROJECT_COLORS = ['#0F3460','#E94560','#27AE60','#F39C12','#8E44AD','#2980B9','#16A085','#D35400'];

function ProjectCard({ project, onDelete }) {
  const completed = project._count?.tasks
    ? Math.round(((project._count?.tasks || 0) * 0.4))
    : 0;
  const progress = project._count?.tasks
    ? Math.round((completed / project._count.tasks) * 100)
    : 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}
      className="bg-white rounded-card shadow-card p-5 flex flex-col gap-3 cursor-pointer group"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <span className="w-3 h-3 rounded-full shrink-0" style={{ background: project.color }} />
          <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-1">{project.title}</h3>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {project.myRole === 'ADMIN' && (
            <button
              onClick={(e) => { e.preventDefault(); onDelete(project.id); }}
              className="p-1 text-gray-400 hover:text-danger rounded transition-colors"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      {project.description && (
        <p className="text-xs text-gray-500 line-clamp-2">{project.description}</p>
      )}

      <div className="flex items-center gap-4 text-xs text-gray-400">
        <span className="flex items-center gap-1">
          <FolderKanban size={12} /> {project._count?.tasks || 0} tasks
        </span>
        <span className="flex items-center gap-1">
          <Users size={12} /> {project._count?.members || 0} members
        </span>
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>Progress</span><span>{progress}%</span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="h-full rounded-full"
            style={{ background: project.color }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Badge variant={project.myRole === 'ADMIN' ? 'admin' : 'member'}>
          {project.myRole}
        </Badge>
        <Link
          to={`/projects/${project.id}`}
          className="text-xs text-accent font-medium hover:underline"
        >
          Open →
        </Link>
      </div>
    </motion.div>
  );
}

export default function ProjectsPage() {
  const { projects, loading, createProject, deleteProject } = useProjects();
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', color: PROJECT_COLORS[0] });
  const [creating, setCreating] = useState(false);

  const filtered = projects.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await createProject(form);
      toast.success('Project created!');
      setShowCreate(false);
      setForm({ title: '', description: '', color: PROJECT_COLORS[0] });
    } catch (err) {
      toast.error(err.message || 'Failed to create project');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this project and all its tasks?')) return;
    try {
      await deleteProject(id);
      toast.success('Project deleted');
    } catch {
      toast.error('Failed to delete project');
    }
  };

  return (
    <PageWrapper title="Projects">
      <div className="max-w-6xl mx-auto">
        {/* Toolbar */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 max-w-xs">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search projects..."
                className="w-full pl-9 pr-3 py-2 rounded-input border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent bg-white"
              />
            </div>
          </div>
          <Button onClick={() => setShowCreate(true)} className="flex items-center gap-2 ml-auto">
            <Plus size={16} /> New Project
          </Button>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1,2,3,4,5,6].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <FolderKanban size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium text-gray-500">No projects yet</p>
            <p className="text-sm mb-6">Create your first project to get started</p>
            <Button onClick={() => setShowCreate(true)}>
              <Plus size={16} /> Create project
            </Button>
          </div>
        ) : (
          <AnimatePresence>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map(p => (
                <ProjectCard key={p.id} project={p} onDelete={handleDelete} />
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>

      {/* Create modal */}
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="New Project">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Project name"
            placeholder="e.g. Website Redesign"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            required
          />
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-1">Description</label>
            <textarea
              className="w-full px-3 py-2 rounded-input border border-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-accent"
              rows={3}
              placeholder="What is this project about?"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-2">Color</label>
            <div className="flex gap-2 flex-wrap">
              {PROJECT_COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setForm({ ...form, color: c })}
                  className={`w-7 h-7 rounded-full transition-transform hover:scale-110 ${form.color === c ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : ''}`}
                  style={{ background: c }}
                />
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setShowCreate(false)} className="flex-1 justify-center">
              Cancel
            </Button>
            <Button type="submit" loading={creating} className="flex-1 justify-center">
              Create Project
            </Button>
          </div>
        </form>
      </Modal>
    </PageWrapper>
  );
}
