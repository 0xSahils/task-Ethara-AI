import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckSquare, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.js';
import Button from '../../components/common/Button.jsx';
import Input from '../../components/common/Input.jsx';
import toast from 'react-hot-toast';

function PasswordStrength({ password }) {
  const strength = !password ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : /[A-Z]/.test(password) && /[0-9]/.test(password) ? 4 : 3;
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['', 'bg-danger', 'bg-warning', 'bg-blue-400', 'bg-success'];
  return password ? (
    <div className="mt-1.5">
      <div className="flex gap-1 mb-1">
        {[1,2,3,4].map(i => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength ? colors[strength] : 'bg-gray-200'}`} />
        ))}
      </div>
      <p className="text-xs text-gray-500">{labels[strength]}</p>
    </div>
  ) : null;
}

export default function SignupPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      toast.success('Account created! Welcome 🎉');
      navigate('/dashboard');
    } catch (err) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      toast.error(err.message || 'Registration failed');
      setErrors({ form: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 animated-gradient p-12 text-white">
        <div className="flex items-center gap-2 font-bold text-xl">
          <CheckSquare size={24} className="text-blue-300" /> TaskFlow
        </div>
        <div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-black leading-tight mb-4">
            One tool.<br /><span className="text-blue-300">Every team.</span>
          </motion.h2>
          <div className="space-y-3 mt-6">
            {['Role-based access control','Drag-and-drop Kanban','Live dashboard analytics','Invite your whole team'].map(f => (
              <div key={f} className="flex items-center gap-2 text-white/70 text-sm">
                <span className="w-4 h-4 rounded-full bg-green-400/30 flex items-center justify-center text-green-400 text-xs">✓</span>
                {f}
              </div>
            ))}
          </div>
        </div>
        <p className="text-white/30 text-sm">© 2026 TaskFlow</p>
      </div>

      {/* Right */}
      <div className="flex-1 flex items-center justify-center p-8 bg-surface">
        <motion.div
          animate={shake ? { x: [-8,8,-8,8,0] } : { x: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <div className="flex items-center gap-2 font-bold text-xl text-primary mb-8 lg:hidden">
            <CheckSquare size={22} className="text-accent" /> TaskFlow
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-1">Create an account</h1>
          <p className="text-gray-500 text-sm mb-8">Free forever for teams of up to 5</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full name"
              type="text"
              placeholder="Jane Smith"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
            />
            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
            />
            <div>
              <div className="relative">
                <Input
                  label="Password"
                  type={showPass ? 'text' : 'password'}
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required
                  className="pr-10"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-[34px] text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <PasswordStrength password={form.password} />
            </div>

            {errors.form && (
              <p className="text-sm text-danger bg-red-50 border border-red-100 rounded-input px-3 py-2">{errors.form}</p>
            )}

            <Button type="submit" loading={loading} className="w-full justify-center py-3">
              Create account
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-accent font-medium hover:underline">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
