import React, { useState } from 'react';
import { Settings, Save, AlertCircle, RefreshCw, Key } from 'lucide-react';
import AdminSidebar from '../../components/Admin/AdminSidebar';
import { Card } from '../../components/Common/Card';
import { Button } from '../../components/Common/Button';
import { useAuth } from '../../context/AuthContext';
import { apiClient } from '../../services/apiClient';

export default function SettingsPage() {
  const { user } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!password.trim()) {
      setError('Password cannot be blank.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSaving(true);
    try {
      await apiClient(`/users/${user.id}/reset-password`, {
        method: 'PATCH',
        body: JSON.stringify({ new_password: password }),
      });
      setSuccess('Your administrator credentials have been successfully updated.');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.message || 'Failed to update credentials.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F7F7] text-[#112D4E] flex flex-col md:flex-row">
      <AdminSidebar />

      <main className="flex-grow p-6 md:p-10 space-y-6 overflow-y-auto max-h-screen text-left">
        {/* Header */}
        <div>
          <h1 className="font-display font-extrabold text-2xl md:text-3xl text-[#112D4E] flex items-center gap-2.5">
            <Settings className="w-8 h-8 text-[#3F72AF]" />
            Control Center Settings
          </h1>
          <p className="text-xs text-[#3F72AF] font-light mt-0.5">
            Manage your administrative account preferences and passwords.
          </p>
        </div>

        <div className="max-w-xl">
          <Card className="bg-white border border-[#DBE2EF] p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-[#DBE2EF]">
              <Key className="w-4 h-4 text-[#3F72AF]" />
              <h2 className="font-display font-bold text-sm text-[#112D4E] uppercase tracking-wider">
                Change Password
              </h2>
            </div>

            {error && (
              <div className="p-3.5 rounded-lg bg-red-50 border border-red-100 flex items-center gap-2.5 text-xs text-red-600">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span className="font-semibold">{error}</span>
              </div>
            )}

            {success && (
              <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center gap-2.5 text-xs text-emerald-700">
                <AlertCircle className="w-4 h-4 shrink-0 text-emerald-500" />
                <span className="font-semibold">{success}</span>
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#112D4E]">New Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-[#DBE2EF] focus:border-[#3F72AF] focus:outline-none focus:ring-1 focus:ring-[#3F72AF]/35"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#112D4E]">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-[#DBE2EF] focus:border-[#3F72AF] focus:outline-none focus:ring-1 focus:ring-[#3F72AF]/35"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={saving}
                  className="gap-2 text-xs py-2 px-5 font-semibold"
                >
                  {saving ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Save className="w-3.5 h-3.5" />
                  )}
                  <span>Save Password</span>
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </main>
    </div>
  );
}
