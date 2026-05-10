import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Save, Calendar, Flag } from 'lucide-react';
import Button from '../../components/common/Button.jsx';
import Avatar from '../../components/common/Avatar.jsx';
import { PRIORITY_CONFIG, STATUS_CONFIG } from '../../utils/getPriorityColor.js';
import { formatDate } from '../../utils/formatDate.js';
import toast from 'react-hot-toast';

export default function TaskModal({ task, projectId, myRole, members, onClose, onUpdate, onDelete }) {
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Reset form when task changes
  if (task && (!form || form._id !== task.id)) {
    setForm({
      _id: task.id,
      title: task.title,
      description: task.description || '',
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate ? task.dueDate.slice(0, 10) : '',
      assigneeId: task.assignee?.id || '',
    });
  }

  const handleSave = async () => {
    setSaving(true);
    try {
      await onUpdate(task.id, {
        title: form.title,
        description: form.description,
        status: form.status,
        priority: form.priority,
        dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : null,
        assigneeId: form.assigneeId || null,
      });
      toast.success('Task saved');
    } catch (err) {
      toast.error(err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await onDelete(task.id);
    } catch (err) {
      toast.error(err.message || 'Failed to delete');
    }
  };

  return (
    <AnimatePresence>
      {task && form && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.aside
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
              <h2 className="font-semibold text-gray-900">Task Details</h2>
              <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
                <X size={16} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Title */}
              <input
                className="w-full text-lg font-bold text-gray-900 border-0 border-b-2 border-transparent focus:border-accent focus:outline-none pb-1 transition-colors"
                value={form.title}
                onChange={e => setForm({...form, title: e.target.value})}
                readOnly={myRole !== 'ADMIN'}
              />

              {/* Status */}
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-2">Status</label>
                <div className="flex gap-2 flex-wrap">
                  {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                    <button
                      key={k}
                      onClick={() => setForm({...form, status: k})}
                      className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                        form.status === k ? `border-current ${v.class}` : 'border-gray-200 text-gray-400 hover:border-gray-300'
                      }`}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Priority */}
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-2">
                  <Flag size={11} className="inline mr-1" />Priority
                </label>
                <div className="flex gap-2 flex-wrap">
                  {Object.entries(PRIORITY_CONFIG).map(([k, v]) => (
                    <button
                      key={k}
                      onClick={() => setForm({...form, priority: k})}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                        form.priority === k ? v.class : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                      }`}
                    >
                      {v.icon} {v.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Assignee */}
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-2">Assignee</label>
                <select
                  className="w-full px-3 py-2 rounded-input border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  value={form.assigneeId}
                  onChange={e => setForm({...form, assigneeId: e.target.value})}
                >
                  <option value="">Unassigned</option>
                  {members.map(m => (
                    <option key={m.userId} value={m.userId}>{m.user?.name} ({m.role})</option>
                  ))}
                </select>
                {form.assigneeId && (
                  <div className="flex items-center gap-2 mt-2">
                    <Avatar name={members.find(m => m.userId === form.assigneeId)?.user?.name || 'U'} size="sm" />
                    <span className="text-sm text-gray-600">
                      {members.find(m => m.userId === form.assigneeId)?.user?.name}
                    </span>
                  </div>
                )}
              </div>

              {/* Due date */}
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-2">
                  <Calendar size={11} className="inline mr-1" />Due Date
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 rounded-input border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  value={form.dueDate}
                  onChange={e => setForm({...form, dueDate: e.target.value})}
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-2">Description</label>
                <textarea
                  className="w-full px-3 py-2.5 rounded-input border border-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-accent"
                  rows={4}
                  placeholder="Add a description..."
                  value={form.description}
                  onChange={e => setForm({...form, description: e.target.value})}
                  maxLength={1000}
                />
                <p className="text-xs text-gray-400 text-right">{form.description.length}/1000</p>
              </div>
            </div>

            {/* Footer actions */}
            <div className="px-6 py-4 border-t border-gray-100 shrink-0 flex items-center gap-3">
              {myRole === 'ADMIN' && (
                <>
                  {!confirmDelete ? (
                    <button
                      onClick={() => setConfirmDelete(true)}
                      className="flex items-center gap-1.5 text-sm text-danger hover:bg-red-50 px-3 py-2 rounded-lg transition-colors"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  ) : (
                    <button
                      onClick={handleDelete}
                      className="flex items-center gap-1.5 text-sm text-white bg-danger px-3 py-2 rounded-lg animate-pulse"
                    >
                      Confirm delete?
                    </button>
                  )}
                </>
              )}
              <Button onClick={handleSave} loading={saving} className="ml-auto gap-1.5">
                <Save size={14} /> Save changes
              </Button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
