import React, { useState, useEffect } from 'react';
import { UsersRound, Plus, Edit2, Trash2, Key, RefreshCw, AlertCircle, ToggleLeft, ToggleRight, X, Save, Eye, EyeOff } from 'lucide-react';
import AdminSidebar from '../../components/Admin/AdminSidebar';
import { Card } from '../../components/Common/Card';
import { Button } from '../../components/Common/Button';
import { apiClient } from '../../services/apiClient';

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  
  // Form states for Create/Edit
  const [editingUser, setEditingUser] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('LEAD_MANAGER');
  const [password, setPassword] = useState('');
  
  // Form states for password reset
  const [resettingUser, setResettingUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [saving, setSaving] = useState(false);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient('/users');
      setUsers(data || []);
    } catch (err) {
      setError(err.message || 'Failed to retrieve administrative users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleToggle = async (userId) => {
    try {
      const res = await apiClient(`/users/${userId}/toggle`, { method: 'PATCH' });
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, is_active: res.is_active } : u));
    } catch (err) {
      alert(err.message || 'Failed to toggle status.');
    }
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`Are you absolutely sure you want to delete administrator "${user.name}"?`)) return;
    try {
      await apiClient(`/users/${user.id}`, { method: 'DELETE' });
      setUsers(prev => prev.filter(u => u.id !== user.id));
    } catch (err) {
      alert(err.message || 'Deletion failed.');
    }
  };

  const openAddModal = () => {
    setEditingUser(null);
    setName('');
    setEmail('');
    setRole('LEAD_MANAGER');
    setPassword('');
    setModalOpen(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setName(user.name || '');
    setEmail(user.email || '');
    setRole(user.role || 'LEAD_MANAGER');
    setPassword(''); // leave blank when editing details
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      if (editingUser) {
        // Update details (excludes password)
        const updated = await apiClient(`/users/${editingUser.id}`, {
          method: 'PUT',
          body: JSON.stringify({ name, email, role }),
        });
        setUsers(prev => prev.map(u => u.id === editingUser.id ? updated : u));
      } else {
        // Create new user (includes password)
        if (!password.trim()) {
          throw new Error('Password is required for new users.');
        }
        const created = await apiClient('/users', {
          method: 'POST',
          body: JSON.stringify({ name, email, role, password }),
        });
        setUsers(prev => [...prev, created]);
      }
      setModalOpen(false);
    } catch (err) {
      setError(err.message || 'Failed to save administrator.');
    } finally {
      setSaving(false);
    }
  };

  const openResetModal = (user) => {
    setResettingUser(user);
    setNewPassword('');
    setShowPassword(false);
    setResetModalOpen(true);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword.trim()) {
      alert('Password cannot be empty.');
      return;
    }
    setSaving(true);
    try {
      await apiClient(`/users/${resettingUser.id}/reset-password`, {
        method: 'PATCH',
        body: JSON.stringify({ new_password: newPassword }),
      });
      alert(`Password updated successfully for ${resettingUser.name}.`);
      setResetModalOpen(false);
    } catch (err) {
      alert(err.message || 'Password reset failed.');
    } finally {
      setSaving(false);
    }
  };

  const roleLabels = {
    MASTER_ADMIN: 'Master Admin',
    LEAD_MANAGER: 'Lead Manager',
    COUNTRY_MANAGER: 'Country Manager'
  };

  const roleColors = {
    MASTER_ADMIN: 'bg-red-50 text-red-700 border-red-200',
    LEAD_MANAGER: 'bg-blue-50 text-blue-700 border-blue-200',
    COUNTRY_MANAGER: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  };

  return (
    <div className="min-h-screen bg-[#F9F7F7] text-[#112D4E] flex flex-col md:flex-row">
      <AdminSidebar />

      <main className="flex-grow p-6 md:p-10 space-y-6 overflow-y-auto max-h-screen">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display font-extrabold text-2xl md:text-3xl text-[#112D4E] flex items-center gap-2.5">
              <UsersRound className="w-8 h-8 text-[#3F72AF]" />
              User Management
            </h1>
            <p className="text-xs text-[#3F72AF] font-light">
              Add and manage administrative staff profiles, credentials, and access roles.
            </p>
          </div>
          <Button variant="primary" onClick={openAddModal} className="gap-2 text-xs py-2 px-4 shrink-0 font-semibold">
            <Plus className="w-4 h-4" /> Add Administrator
          </Button>
        </div>

        {error && (
          <div className="flex items-center gap-2.5 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="font-semibold">{error}</span>
          </div>
        )}

        {/* User List Table */}
        <Card className="border border-[#DBE2EF] bg-white p-0 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50/75 border-b border-[#DBE2EF] text-[#3F72AF] uppercase font-bold tracking-wider">
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Active</th>
                  <th className="px-6 py-4">Created Date</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DBE2EF]">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                      <div className="flex items-center justify-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin text-[#3F72AF]" />
                        <span>Loading user directory...</span>
                      </div>
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-gray-400 font-light">
                      No administrators created yet.
                    </td>
                  </tr>
                ) : (
                  users.map(u => (
                    <tr key={u.id} className="hover:bg-gray-50/40 transition-colors">
                      <td className="px-6 py-4 font-bold text-[#112D4E]">
                        {u.name}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-500">
                        {u.email}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${roleColors[u.role] || 'bg-gray-50 text-gray-500'}`}>
                          {roleLabels[u.role] || u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button onClick={() => handleToggle(u.id)} className="cursor-pointer">
                          {u.is_active ? (
                            <ToggleRight className="w-6 h-6 text-emerald-500" />
                          ) : (
                            <ToggleLeft className="w-6 h-6 text-gray-400" />
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-gray-500 font-medium">
                        {new Date(u.created_at).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2.5">
                          <button
                            onClick={() => openEditModal(u)}
                            className="p-1.5 rounded hover:bg-blue-50 text-gray-500 hover:text-blue-600 transition-colors border border-gray-200 hover:border-blue-200 cursor-pointer"
                            title="Edit Profile"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => openResetModal(u)}
                            className="p-1.5 rounded hover:bg-amber-50 text-gray-500 hover:text-amber-600 transition-colors border border-gray-200 hover:border-amber-200 cursor-pointer"
                            title="Reset Password"
                          >
                            <Key className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(u)}
                            className="p-1.5 rounded hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors border border-gray-200 hover:border-red-200 cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="p-4 bg-gray-50/50 border-t border-[#DBE2EF] text-[#3F72AF] font-light flex justify-between">
            <span>Admin status toggles are applied instantly to sessions.</span>
            <span>{users.length} accounts</span>
          </div>
        </Card>
      </main>

      {/* CREATE / EDIT USER MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#DBE2EF] w-full max-w-md overflow-hidden shadow-xl animate-in fade-in zoom-in-95 duration-200 text-left">
            <div className="px-6 py-4 border-b border-[#DBE2EF] flex items-center justify-between">
              <h3 className="font-display font-extrabold text-base text-[#112D4E]">
                {editingUser ? 'Edit Admin Settings' : 'Create Administrator Account'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-black cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#112D4E]">Staff Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-[#DBE2EF] focus:border-[#3F72AF] focus:outline-none focus:ring-1 focus:ring-[#3F72AF]/35"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#112D4E]">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. manager@svet.com"
                  className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-[#DBE2EF] focus:border-[#3F72AF] focus:outline-none focus:ring-1 focus:ring-[#3F72AF]/35"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#112D4E]">Access Control Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 rounded-lg border border-[#DBE2EF] focus:border-[#3F72AF] focus:outline-none font-medium text-gray-600 bg-white"
                >
                  <option value="MASTER_ADMIN">Master Admin</option>
                  <option value="LEAD_MANAGER">Lead Manager</option>
                  <option value="COUNTRY_MANAGER">Country Manager</option>
                </select>
              </div>

              {!editingUser && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#112D4E]">Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-[#DBE2EF] focus:border-[#3F72AF] focus:outline-none focus:ring-1 focus:ring-[#3F72AF]/35"
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#DBE2EF]">
                <Button type="button" variant="outline" onClick={() => setModalOpen(false)} className="text-xs py-2 px-4 cursor-pointer">
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={saving} className="gap-2 text-xs py-2 px-4 cursor-pointer">
                  {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  <span>{editingUser ? 'Save Details' : 'Create Account'}</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RESET PASSWORD MODAL */}
      {resetModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#DBE2EF] w-full max-w-md overflow-hidden shadow-xl animate-in fade-in zoom-in-95 duration-200 text-left">
            <div className="px-6 py-4 border-b border-[#DBE2EF] flex items-center justify-between">
              <h3 className="font-display font-extrabold text-base text-[#112D4E] flex items-center gap-2">
                <Key className="w-4 h-4 text-amber-500" />
                Reset Admin Password
              </h3>
              <button onClick={() => setResetModalOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-black cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleResetPassword} className="p-6 space-y-4">
              <p className="text-[11px] text-[#3F72AF] leading-relaxed">
                You are overriding the password credentials for <strong className="text-[#112D4E] font-bold">{resettingUser?.name}</strong> ({resettingUser?.email}). The user will be required to login using their new password.
              </p>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#112D4E]">New Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-[#DBE2EF] focus:border-[#3F72AF] focus:outline-none focus:ring-1 focus:ring-[#3F72AF]/35"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#DBE2EF]">
                <Button type="button" variant="outline" onClick={() => setResetModalOpen(false)} className="text-xs py-2 px-4 cursor-pointer">
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={saving} className="gap-2 text-xs py-2 px-4 cursor-pointer">
                  {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  <span>Update Password</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
