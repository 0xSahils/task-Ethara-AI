import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckSquare, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.js';
import Button from '../../components/common/Button.jsx';
import Input from '../../components/common/Input.jsx';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      toast.error(err.message || 'Login failed');
      setErrors({ form: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 animated-gradient p-12 text-white">
        <div className="flex items-center gap-2 font-bold text-xl">
          <CheckSquare size={24} className="text-blue-300" />
          TaskFlow
        </div>
        <div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-black leading-tight mb-4"
          >
            Manage projects.<br />
            <span className="text-blue-300">Empower teams.</span>
          </motion.h2>
          <p className="text-white/60 text-lg">500+ teams already trust TaskFlow to ship on time.</p>
          <div className="flex -space-x-2 mt-6">
            {['Alice','Bob','Carol','Dan','Eve'].map(name => (
              <img
                key={name}
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${name}&backgroundColor=b6e3f4`}
                className="w-9 h-9 rounded-full ring-2 ring-white bg-white"
                alt={name}
              />
            ))}
            <div className="w-9 h-9 rounded-full ring-2 ring-white bg-accent flex items-center justify-center text-xs font-bold">
              +99
            </div>
          </div>
        </div>
        <p className="text-white/30 text-sm">© 2026 TaskFlow</p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-surface">
        <motion.div
          animate={shake ? { x: [-8, 8, -8, 8, 0] } : { x: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-2 font-bold text-xl text-primary mb-8 lg:hidden">
            <CheckSquare size={22} className="text-accent" />
            TaskFlow
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome back</h1>
          <p className="text-gray-500 text-sm mb-8">Sign in to your account</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <div className="relative">
              <Input
                label="Password"
                type={showPass ? 'text' : 'password'}
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-[34px] text-gray-400 hover:text-gray-600"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {errors.form && (
              <p className="text-sm text-danger bg-red-50 border border-red-100 rounded-input px-3 py-2">
                {errors.form}
              </p>
            )}

            <Button type="submit" loading={loading} className="w-full justify-center py-3">
              Sign in
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-accent font-medium hover:underline">
              Sign up free
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
