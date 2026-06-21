import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, AlertCircle, Loader2, GraduationCap } from 'lucide-react';
import { Button } from '../../components/Common/Button';
import { Card } from '../../components/Common/Card';
import { useAuth } from '../../context/AuthContext';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    const emailClean = email.trim();
    if (!emailClean || !password.trim()) {
      setError('Please fill out all fields.');
      return;
    }

    setLoading(true);

    try {
      const user = await login(emailClean, password.trim());

      // Determine landing page based on role
      const from = location.state?.from?.pathname;
      if (from && from !== '/login') {
        navigate(from, { replace: true });
      } else if (user.role === 'COUNTRY_MANAGER') {
        navigate('/country-management', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Invalid email or password.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F7F7] text-[#112D4E] relative flex flex-col justify-center items-center p-6">

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md relative z-10 space-y-6"
      >
        {/* Back Link */}
        <div className="text-left">
          <Link to="/" className="text-xs font-semibold text-[#3F72AF] hover:text-[#112D4E] transition-colors">
            ← Back to Home
          </Link>
        </div>

        {/* Logo Branding */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-[#3F72AF]/10 flex items-center justify-center border border-[#3F72AF]/20 mx-auto">
            <GraduationCap className="w-6 h-6 text-[#3F72AF]" />
          </div>
          <h2 className="font-display font-extrabold text-2xl text-[#112D4E]">
            SVET Control Panel
          </h2>
          <p className="text-xs text-[#3F72AF] font-light">
            Sri Venkateshwara Educational Trust Administrative Login
          </p>
        </div>

        {/* Form Card */}
        <Card className="p-8 bg-white border border-[#DBE2EF] shadow-md">
          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="p-3.5 rounded-lg bg-red-50 border border-red-100 flex items-center gap-2.5 text-xs text-red-600">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span className="font-semibold">{error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[11px] uppercase font-bold tracking-wider text-[#3F72AF]">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="User Email"
                  className="w-full bg-white border border-[#DBE2EF] rounded-lg pl-10 pr-4 py-3 text-sm text-[#112D4E] focus:outline-none focus:border-[#3F72AF] focus:ring-1 focus:ring-[#3F72AF]/30 h-12"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] uppercase font-bold tracking-wider text-[#3F72AF]">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white border border-[#DBE2EF] rounded-lg pl-10 pr-4 py-3 text-sm text-[#112D4E] focus:outline-none focus:border-[#3F72AF] focus:ring-1 focus:ring-[#3F72AF]/30 h-12"
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


      </motion.div>

    </div>
  );
}
