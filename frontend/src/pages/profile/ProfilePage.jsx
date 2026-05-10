import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Moon, Sun, Trash2, Save } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper.jsx';
import Button from '../../components/common/Button.jsx';
import Input from '../../components/common/Input.jsx';
import Avatar from '../../components/common/Avatar.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { useTheme } from '../../context/ThemeContext.jsx';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user } = useAuth();
  const { dark, toggle } = useTheme();
  const [nameForm, setNameForm] = useState({ name: user?.name || '', email: user?.email || '' });
  const [passForm, setPassForm] = useState({ current: '', newPass: '', confirm: '' });
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    toast.success('Profile updated (UI only)');
    setEditing(false);
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (passForm.newPass !== passForm.confirm) {
      toast.error('Passwords do not match');
      return;
    }
    toast.success('Password changed (UI only)');
    setPassForm({ current: '', newPass: '', confirm: '' });
  };

  const sections = [
    { id: 'profile',  label: 'Profile',   icon: User },
    { id: 'security', label: 'Security',  icon: Lock },
  ];

  const [activeSection, setActiveSection] = useState('profile');

  return (
    <PageWrapper title="Profile & Settings">
      <div className="max-w-3xl mx-auto">
        <div className="grid md:grid-cols-4 gap-6">
          {/* Sidebar nav */}
          <nav className="md:col-span-1">
            <ul className="space-y-1">
              {sections.map(({ id, label, icon: Icon }) => (
                <li key={id}>
                  <button
                    onClick={() => setActiveSection(id)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeSection === id ? 'bg-accent text-white' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon size={15} /> {label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Content */}
          <div className="md:col-span-3 space-y-5">
            {activeSection === 'profile' && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                {/* Avatar card */}
                <div className="bg-white rounded-card shadow-card p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <Avatar name={user?.name || 'U'} size="lg" />
                    <div>
                      <h2 className="font-bold text-gray-900">{user?.name}</h2>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                    </div>
                  </div>

                  <form onSubmit={handleSaveProfile} className="space-y-4">
                    <Input
                      label="Full name"
                      value={nameForm.name}
                      onChange={e => setNameForm({...nameForm, name: e.target.value})}
                      disabled={!editing}
                    />
                    <Input
                      label="Email"
                      type="email"
                      value={nameForm.email}
                      onChange={e => setNameForm({...nameForm, email: e.target.value})}
                      disabled={!editing}
                    />
                    <div className="flex gap-3">
                      {editing ? (
                        <>
                          <Button type="button" variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
                          <Button type="submit"><Save size={14} /> Save</Button>
                        </>
                      ) : (
                        <Button type="button" variant="outline" onClick={() => setEditing(true)}>Edit profile</Button>
                      )}
                    </div>
                  </form>
                </div>

                {/* Theme toggle */}
                <div className="bg-white rounded-card shadow-card p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Appearance</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Dark mode</p>
                      <p className="text-xs text-gray-400">Switch between light and dark interface</p>
                    </div>
                    <button
                      onClick={toggle}
                      className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${dark ? 'bg-accent' : 'bg-gray-200'}`}
                    >
                      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 flex items-center justify-center ${dark ? 'translate-x-6' : 'translate-x-0'}`}>
                        {dark ? <Moon size={10} className="text-accent" /> : <Sun size={10} className="text-warning" />}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Danger zone */}
                <div className="bg-white rounded-card shadow-card p-6 border border-red-100">
                  <h3 className="font-semibold text-danger mb-2">Danger Zone</h3>
                  <p className="text-sm text-gray-500 mb-4">Deleting your account is permanent and cannot be undone.</p>
                  {!confirmDelete ? (
                    <Button variant="danger" onClick={() => setConfirmDelete(true)}>
                      <Trash2 size={14} /> Delete account
                    </Button>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Button variant="outline" onClick={() => setConfirmDelete(false)}>Cancel</Button>
                      <Button variant="danger" onClick={() => toast.error('Account deletion not implemented in demo')}>
                        Yes, delete my account
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeSection === 'security' && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                <div className="bg-white rounded-card shadow-card p-6">
                  <h3 className="font-semibold text-gray-900 mb-5">Change Password</h3>
                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <Input label="Current password" type="password" placeholder="••••••••" value={passForm.current} onChange={e => setPassForm({...passForm, current: e.target.value})} required />
                    <Input label="New password" type="password" placeholder="Min. 6 characters" value={passForm.newPass} onChange={e => setPassForm({...passForm, newPass: e.target.value})} required />
                    <Input label="Confirm new password" type="password" placeholder="••••••••" value={passForm.confirm} onChange={e => setPassForm({...passForm, confirm: e.target.value})} required />
                    <Button type="submit"><Save size={14} /> Update password</Button>
                  </form>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
