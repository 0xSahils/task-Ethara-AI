export const PRIORITY_CONFIG = {
  LOW:      { label: 'Low',      class: 'priority-low',      bg: '#EBF5FB', color: '#2980B9', icon: '↓' },
  MEDIUM:   { label: 'Medium',   class: 'priority-medium',   bg: '#FEF9E7', color: '#F39C12', icon: '—' },
  HIGH:     { label: 'High',     class: 'priority-high',     bg: '#FEF0E6', color: '#E67E22', icon: '↑' },
  CRITICAL: { label: 'Critical', class: 'priority-critical', bg: '#FDEDEC', color: '#E94560', icon: '🔥' },
};

export const STATUS_CONFIG = {
  TODO:        { label: 'To Do',       class: 'status-todo',        color: '#6B7280' },
  IN_PROGRESS: { label: 'In Progress', class: 'status-in_progress', color: '#2563EB' },
  ON_HOLD:     { label: 'On Hold',     class: 'status-on_hold',     color: '#D97706' },
  DONE:        { label: 'Done',        class: 'status-done',        color: '#27AE60' },
};

export const getPriorityColor = (priority) => PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.MEDIUM;
export const getStatusColor   = (status)   => STATUS_CONFIG[status]     || STATUS_CONFIG.TODO;

export const avatarUrl = (seed) =>
  `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
