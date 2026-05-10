import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext, closestCenter, DragOverlay,
  PointerSensor, useSensor, useSensors,
} from '@dnd-kit/core';
import {
  SortableContext, verticalListSortingStrategy, useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Plus, Users, Settings, ChevronLeft } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper.jsx';
import Button from '../../components/common/Button.jsx';
import Modal from '../../components/common/Modal.jsx';
import Input from '../../components/common/Input.jsx';
import Avatar from '../../components/common/Avatar.jsx';
import Badge from '../../components/common/Badge.jsx';
import { useTasks } from '../../hooks/useTasks.js';
import { useAuth } from '../../hooks/useAuth.js';
import { projectsService } from '../../services/projects.js';
import { getPriorityColor, PRIORITY_CONFIG } from '../../utils/getPriorityColor.js';
import { formatShort, isOverdue } from '../../utils/formatDate.js';
import TaskModal from '../tasks/TaskModal.jsx';
import toast from 'react-hot-toast';

const COLUMNS = [
  { id: 'TODO',        label: 'To Do',       color: '#6B7280' },
  { id: 'IN_PROGRESS', label: 'In Progress',  color: '#2563EB' },
  { id: 'ON_HOLD',     label: 'On Hold',      color: '#D97706' },
  { id: 'DONE',        label: 'Done',         color: '#27AE60' },
];

// ─── Sortable Task Card ────────────────────────────────────────────
function SortableTaskCard({ task, onClick }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
  const cfg = getPriorityColor(task.priority);
  const overdue = isOverdue(task.dueDate) && task.status !== 'DONE';

  return (
    <motion.div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 }}
      whileHover={{ y: -2, boxShadow: '0 6px 20px rgba(0,0,0,0.1)' }}
      onClick={onClick}
      {...attributes}
      {...listeners}
      className="bg-white rounded-xl shadow-card p-3.5 cursor-pointer border border-transparent hover:border-accent/20 select-none"
    >
      <div className="flex items-start justify-between mb-2">
        <p className="text-sm font-medium text-gray-900 leading-snug">{task.title}</p>
        <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ml-2 shrink-0 ${cfg.class}`}>
          {cfg.icon}
        </span>
      </div>
      {task.description && (
        <p className="text-xs text-gray-400 line-clamp-2 mb-2">{task.description}</p>
      )}
      <div className="flex items-center justify-between">
        {task.dueDate ? (
          <span className={`text-xs ${overdue ? 'text-danger font-medium' : 'text-gray-400'}`}>
            {overdue ? '⚠ ' : ''}Due {formatShort(task.dueDate)}
          </span>
        ) : <span />}
        {task.assignee && <Avatar name={task.assignee.name} size="xs" />}
      </div>
    </motion.div>
  );
}

// ─── Column ─────────────────────────────────────────────────────────
function KanbanColumn({ column, tasks, onAddTask, myRole, onTaskClick }) {
  const ids = tasks.map(t => t.id);
  return (
    <div className="flex flex-col bg-gray-50 rounded-xl min-w-[260px] w-[260px] shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: column.color }} />
          <span className="text-sm font-semibold text-gray-700">{column.label}</span>
          <span className="text-xs text-gray-400 bg-gray-200 rounded-full px-1.5 py-0.5">{tasks.length}</span>
        </div>
        {myRole === 'ADMIN' && (
          <button
            onClick={() => onAddTask(column.id)}
            className="p-1 text-gray-400 hover:text-accent rounded transition-colors"
          >
            <Plus size={15} />
          </button>
        )}
      </div>

      {/* Cards */}
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        <div className="kanban-col p-3 space-y-2.5">
          <AnimatePresence>
            {tasks.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex items-center justify-center h-20 text-gray-300 text-sm"
              >
                No tasks
              </motion.div>
            ) : tasks.map(task => (
              <SortableTaskCard key={task.id} task={task} onClick={() => onTaskClick(task)} />
            ))}
          </AnimatePresence>
        </div>
      </SortableContext>
    </div>
  );
}

// ─── Main page ───────────────────────────────────────────────────────
export default function ProjectDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { tasks, setTasks, loading, createTask, updateTask, deleteTask } = useTasks(id);
  const [project, setProject] = useState(null);
  const [myRole, setMyRole] = useState('MEMBER');
  const [selectedTask, setSelectedTask] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newTaskStatus, setNewTaskStatus] = useState('TODO');
  const [newTaskForm, setNewTaskForm] = useState({ title: '', description: '', priority: 'MEDIUM', dueDate: '' });
  const [creating, setCreating] = useState(false);
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  useEffect(() => {
    projectsService.getOne(id)
      .then(res => {
        setProject(res.data.project);
        setMyRole(res.data.project.myRole);
      })
      .catch(() => toast.error('Failed to load project'));
  }, [id]);

  const tasksByColumn = (status) => tasks.filter(t => t.status === status);

  const handleDragEnd = async ({ active, over }) => {
    if (!over || active.id === over.id) { setActiveId(null); return; }

    // Find which column the card was dropped into
    const targetCol = COLUMNS.find(c => tasksByColumn(c.id).some(t => t.id === over.id));
    const targetStatus = targetCol?.id;
    if (!targetStatus) { setActiveId(null); return; }

    const task = tasks.find(t => t.id === active.id);
    if (!task || task.status === targetStatus) { setActiveId(null); return; }

    // Optimistic update
    setTasks(prev => prev.map(t => t.id === active.id ? { ...t, status: targetStatus } : t));
    try {
      await updateTask(active.id, { status: targetStatus });
    } catch {
      toast.error('Failed to update task');
      setTasks(prev => prev.map(t => t.id === active.id ? { ...t, status: task.status } : t));
    }
    setActiveId(null);
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await createTask({ ...newTaskForm, status: newTaskStatus, dueDate: newTaskForm.dueDate || null });
      toast.success('Task created!');
      setShowCreate(false);
      setNewTaskForm({ title: '', description: '', priority: 'MEDIUM', dueDate: '' });
    } catch (err) {
      toast.error(err.message || 'Failed to create task');
    } finally {
      setCreating(false);
    }
  };

  const activeTask = tasks.find(t => t.id === activeId);

  return (
    <PageWrapper title={project?.title || 'Project'}>
      <div className="max-w-full">
        {/* Sub-header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link to="/projects" className="text-gray-400 hover:text-gray-700 transition-colors">
              <ChevronLeft size={18} />
            </Link>
            {project && (
              <>
                <span className="w-3 h-3 rounded-full" style={{ background: project.color }} />
                <div>
                  <Badge variant={myRole === 'ADMIN' ? 'admin' : 'member'} className="text-xs">{myRole}</Badge>
                </div>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Link to={`/projects/${id}/members`}>
              <Button variant="outline" size="sm"><Users size={14} /> Members</Button>
            </Link>
            {myRole === 'ADMIN' && (
              <Button size="sm" onClick={() => { setNewTaskStatus('TODO'); setShowCreate(true); }}>
                <Plus size={14} /> Add Task
              </Button>
            )}
          </div>
        </div>

        {/* Kanban board */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={({ active }) => setActiveId(active.id)}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-4 overflow-x-auto pb-4">
            {COLUMNS.map(col => (
              <KanbanColumn
                key={col.id}
                column={col}
                tasks={tasksByColumn(col.id)}
                onAddTask={(status) => { setNewTaskStatus(status); setShowCreate(true); }}
                myRole={myRole}
                onTaskClick={setSelectedTask}
              />
            ))}
          </div>

          <DragOverlay>
            {activeTask && (
              <div className="bg-white rounded-xl shadow-card-hover p-3.5 opacity-90 rotate-1 w-[250px]">
                <p className="text-sm font-medium text-gray-900">{activeTask.title}</p>
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </div>

      {/* Create task modal */}
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="New Task">
        <form onSubmit={handleCreateTask} className="space-y-4">
          <Input label="Task title" placeholder="e.g. Design landing page" value={newTaskForm.title} onChange={e => setNewTaskForm({...newTaskForm, title: e.target.value})} required />
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-1">Description</label>
            <textarea className="w-full px-3 py-2 rounded-input border border-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-accent" rows={3} value={newTaskForm.description} onChange={e => setNewTaskForm({...newTaskForm, description: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-600 block mb-1">Priority</label>
              <select className="w-full px-3 py-2 rounded-input border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent" value={newTaskForm.priority} onChange={e => setNewTaskForm({...newTaskForm, priority: e.target.value})}>
                {Object.entries(PRIORITY_CONFIG).map(([k,v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
            <Input label="Due date" type="date" value={newTaskForm.dueDate} onChange={e => setNewTaskForm({...newTaskForm, dueDate: e.target.value})} />
          </div>
          <div className="flex gap-3 pt-1">
            <Button type="button" variant="outline" onClick={() => setShowCreate(false)} className="flex-1 justify-center">Cancel</Button>
            <Button type="submit" loading={creating} className="flex-1 justify-center">Create Task</Button>
          </div>
        </form>
      </Modal>

      {/* Task detail drawer */}
      <TaskModal
        task={selectedTask}
        projectId={id}
        myRole={myRole}
        members={project?.members || []}
        onClose={() => setSelectedTask(null)}
        onUpdate={async (tid, data) => { const t = await updateTask(tid, data); setSelectedTask(t); }}
        onDelete={async (tid) => { await deleteTask(tid); setSelectedTask(null); toast.success('Task deleted'); }}
      />
    </PageWrapper>
  );
}
