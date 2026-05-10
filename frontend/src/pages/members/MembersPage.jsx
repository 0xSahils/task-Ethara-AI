import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, Trash2, Shield, Search } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper.jsx';
import Button from '../../components/common/Button.jsx';
import Modal from '../../components/common/Modal.jsx';
import Badge from '../../components/common/Badge.jsx';
import Avatar from '../../components/common/Avatar.jsx';
import { projectsService } from '../../services/projects.js';
import api from '../../services/api.js';
import { useAuth } from '../../hooks/useAuth.js';
import { formatDate } from '../../utils/formatDate.js';
import toast from 'react-hot-toast';

const rowVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: (i) => ({ opacity: 1, x: 0, transition: { delay: i * 0.07 } }),
};

export default function MembersPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [members, setMembers] = useState([]);
  const [myRole, setMyRole] = useState('MEMBER');
  const [loading, setLoading] = useState(true);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteForm, setInviteForm] = useState({ email: '', role: 'MEMBER' });
  const [inviting, setInviting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searching, setSearching] = useState(false);
  const searchRef = useRef(null);

  // Live search as user types
  useEffect(() => {
    if (searchQuery.length < 2) { setSuggestions([]); return; }
    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await api.get(`/users/search?q=${encodeURIComponent(searchQuery)}`);
        setSuggestions(res.data.users || []);
      } catch { setSuggestions([]); }
      finally { setSearching(false); }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const load = async () => {
    try {
      const [mRes, pRes] = await Promise.all([
        projectsService.getMembers(id),
        projectsService.getOne(id),
      ]);
      setMembers(mRes.data.members);
      setMyRole(pRes.data.project.myRole);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  const handleInvite = async (e) => {
    e.preventDefault();
    const emailToInvite = selectedUser?.email || searchQuery;
    if (!emailToInvite) { toast.error('Select a user to invite'); return; }
    setInviting(true);
    try {
      await projectsService.addMember(id, { email: emailToInvite, role: inviteForm.role });
      toast.success('Member added!');
      setShowInvite(false);
      setSearchQuery(''); setSuggestions([]); setSelectedUser(null);
      setInviteForm({ email: '', role: 'MEMBER' });
      load();
    } catch (err) {
      toast.error(err.message || 'Failed to add member');
    } finally {
      setInviting(false);
    }
  };

  const handleRoleChange = async (memberId, role) => {
    try {
      await projectsService.updateMemberRole(id, memberId, { role });
      setMembers(prev => prev.map(m => m.id === memberId ? { ...m, role } : m));
      toast.success('Role updated');
    } catch (err) {
      toast.error(err.message || 'Failed to update role');
    }
  };

  const handleRemove = async (memberId) => {
    if (!confirm('Remove this member from the project?')) return;
    try {
      await projectsService.removeMember(id, memberId);
      setMembers(prev => prev.filter(m => m.id !== memberId));
      toast.success('Member removed');
    } catch (err) {
      toast.error(err.message || 'Failed to remove member');
    }
  };

  return (
    <PageWrapper title="Team Members">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-500">{members.length} member{members.length !== 1 ? 's' : ''}</p>
          {myRole === 'ADMIN' && (
            <Button onClick={() => setShowInvite(true)}>
              <UserPlus size={15} /> Invite Member
            </Button>
          )}
        </div>

        <div className="bg-white rounded-card shadow-card overflow-hidden">
          {loading ? (
            <div className="p-6 space-y-4">
              {[1,2,3].map(i => <div key={i} className="h-14 skeleton rounded-xl" />)}
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-50">
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-6 py-3">Member</th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3">Role</th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3">Joined</th>
                  {myRole === 'ADMIN' && (
                    <th className="text-right text-xs font-semibold text-gray-400 uppercase tracking-wide px-6 py-3">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {members.map((m, i) => (
                  <motion.tr
                    key={m.id}
                    custom={i}
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={m.user?.name || 'U'} size="sm" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{m.user?.name}</p>
                          <p className="text-xs text-gray-400">{m.user?.email}</p>
                        </div>
                        {m.userId === user?.id && (
                          <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">You</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {myRole === 'ADMIN' && m.userId !== user?.id ? (
                        <select
                          value={m.role}
                          onChange={e => handleRoleChange(m.id, e.target.value)}
                          className="text-xs px-2 py-1 rounded-full border border-gray-200 focus:outline-none focus:ring-1 focus:ring-accent"
                        >
                          <option value="ADMIN">Admin</option>
                          <option value="MEMBER">Member</option>
                        </select>
                      ) : (
                        <Badge variant={m.role === 'ADMIN' ? 'admin' : 'member'}>
                          {m.role === 'ADMIN' && <Shield size={10} />}
                          {m.role}
                        </Badge>
                      )}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-400">{formatDate(m.joinedAt)}</td>
                    {myRole === 'ADMIN' && (
                      <td className="px-6 py-4 text-right">
                        {m.userId !== user?.id && (
                          <button
                            onClick={() => handleRemove(m.id)}
                            className="p-1.5 text-gray-400 hover:text-danger hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </td>
                    )}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <Modal open={showInvite} onClose={() => { setShowInvite(false); setSearchQuery(''); setSuggestions([]); setSelectedUser(null); }} title="Invite Member">
        <form onSubmit={handleInvite} className="space-y-4">
          {/* User search with autocomplete */}
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-1">Search by name or email</label>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              {selectedUser ? (
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-input border border-accent bg-accent/5">
                  <Avatar name={selectedUser.name} size="xs" />
                  <span className="text-sm font-medium text-gray-900 flex-1">{selectedUser.name}</span>
                  <span className="text-xs text-gray-400">{selectedUser.email}</span>
                  <button type="button" onClick={() => { setSelectedUser(null); setSearchQuery(''); }}
                    className="text-gray-400 hover:text-danger ml-1 text-base leading-none">×</button>
                </div>
              ) : (
                <input
                  ref={searchRef}
                  type="text"
                  className="w-full pl-9 pr-3 py-2.5 rounded-input border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="Type name or email..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  autoComplete="off"
                />
              )}

              {/* Suggestions dropdown */}
              {!selectedUser && suggestions.length > 0 && (
                <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-gray-100 rounded-xl shadow-card-hover z-20 overflow-hidden">
                  {searching && (
                    <div className="px-4 py-2 text-xs text-gray-400">Searching...</div>
                  )}
                  {suggestions.map(u => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => { setSelectedUser(u); setSearchQuery(''); setSuggestions([]); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left"
                    >
                      <Avatar name={u.name} size="xs" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{u.name}</p>
                        <p className="text-xs text-gray-400 truncate">{u.email}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              {!selectedUser && searchQuery.length >= 2 && suggestions.length === 0 && !searching && (
                <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-gray-100 rounded-xl shadow-card z-20 px-4 py-3 text-xs text-gray-400">
                  No users found for "{searchQuery}"
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600 block mb-1">Role</label>
            <select className="w-full px-3 py-2 rounded-input border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent" value={inviteForm.role} onChange={e => setInviteForm({...inviteForm, role: e.target.value})}>
              <option value="MEMBER">Member</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <div className="flex gap-3 pt-1">
            <Button type="button" variant="outline" onClick={() => setShowInvite(false)} className="flex-1 justify-center">Cancel</Button>
            <Button type="submit" loading={inviting} className="flex-1 justify-center"><UserPlus size={14} /> Invite</Button>
          </div>
        </form>
      </Modal>
    </PageWrapper>
  );
}
