import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, User, AlertCircle, Loader2, GraduationCap } from 'lucide-react';
import { Button } from '../../components/Common/Button';
import { Card } from '../../components/Common/Card';
import { authApi } from '../../services/authApi';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please fill out all fields.');
      return;
    }

    setLoading(true);

    try {
      const result = await authApi.login(username.trim(), password.trim());
      localStorage.setItem('svet_admin_token', result.access_token);
      navigate('/admin/dashboard');
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Invalid username or password.');
    }
  };

  return (
    <div className="min-h-screen bg-primary-bg text-primary-text relative flex flex-col justify-center items-center p-6">
      
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md relative z-10 space-y-6"
      >
        {/* Back Link */}
        <div className="text-left">
          <Link to="/" className="text-xs font-semibold text-secondary-text hover:text-primary-blue transition-colors">
            ← Back to Home
          </Link>
        </div>

        {/* Logo Branding */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-secondary-blue/10 flex items-center justify-center border border-secondary-blue/20 mx-auto">
            <GraduationCap className="w-6 h-6 text-secondary-blue" />
          </div>
          <h2 className="font-display font-extrabold text-2xl text-primary-blue">
            SVET Admin Portal
          </h2>
          <p className="text-xs text-secondary-text font-light">
            Sri Venkateshwara Educational Trust Overseas Admissions
          </p>
        </div>

        {/* Form Card */}
        <Card className="p-8 bg-white border border-border-color shadow-md">
          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="p-3.5 rounded-lg bg-red-50 border border-red-100 flex items-center gap-2.5 text-xs text-red-600">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span className="font-semibold">{error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[11px] uppercase font-bold tracking-wider text-secondary-text">Username</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full bg-white border border-border-color rounded-lg pl-10 pr-4 py-3 text-sm text-primary-text focus:outline-none focus:border-secondary-blue focus:ring-1 focus:ring-secondary-blue/30 h-12"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] uppercase font-bold tracking-wider text-secondary-text">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white border border-border-color rounded-lg pl-10 pr-4 py-3 text-sm text-primary-text focus:outline-none focus:border-secondary-blue focus:ring-1 focus:ring-secondary-blue/30 h-12"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="w-full py-3 mt-2 font-bold flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </Button>
          </form>
        </Card>

        {/* Demo Note */}
        <div className="text-center text-[10px] text-secondary-text/80">
          Credentials: <code className="text-secondary-blue bg-white border border-border-color px-1.5 py-0.5 rounded font-bold">admin</code> / <code className="text-secondary-blue bg-white border border-border-color px-1.5 py-0.5 rounded font-bold">admin123</code>
        </div>
      </motion.div>

    </div>
  );
}
