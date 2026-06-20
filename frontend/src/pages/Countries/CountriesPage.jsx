import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, RefreshCw, Layers, ToggleLeft, ToggleRight, GripVertical, AlertCircle } from 'lucide-react';
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors
} from '@dnd-kit/core';
import {
  SortableContext, useSortable, verticalListSortingStrategy, arrayMove
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import AdminSidebar from '../../components/Admin/AdminSidebar';
import { Card } from '../../components/Common/Card';
import { Button } from '../../components/Common/Button';
import { countryApi, getImageUrl } from '../../services/countryApi';
import CountryFormModal from './CountryFormModal';

// ── Sortable row ─────────────────────────────────────────────────────────────
function SortableRow({ country, onEdit, onDelete, onToggle, onBuilder }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: country.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <tr ref={setNodeRef} style={style} className="hover:bg-primary-bg/40 transition-colors">
      <td className="px-4 py-3">
        <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-border-color hover:text-secondary-blue p-1">
          <GripVertical className="w-4 h-4" />
        </button>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg overflow-hidden bg-secondary-bg border border-border-color shrink-0">
            {country.flag_image
              ? <img src={getImageUrl(country.flag_image)} alt="" className="w-full h-full object-cover" />
              : <span className="text-lg flex items-center justify-center h-full">🌍</span>}
          </div>
          <div>
            <p className="font-bold text-sm text-primary-blue">{country.name}</p>
            <p className="text-[10px] text-secondary-text font-mono">{country.slug}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <button onClick={() => onToggle(country.id)} title="Toggle Active" className="cursor-pointer">
          {country.is_active
            ? <ToggleRight className="w-6 h-6 text-emerald-500" />
            : <ToggleLeft  className="w-6 h-6 text-secondary-text" />}
        </button>
      </td>
      <td className="px-4 py-3">
        <span className="text-xs font-mono text-secondary-text">{country.display_order}</span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <button onClick={() => onEdit(country)} className="p-1.5 rounded hover:bg-secondary-blue/10 text-secondary-text hover:text-secondary-blue transition-colors cursor-pointer border border-border-color" title="Edit">
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => onBuilder(country.id)} className="p-1.5 rounded hover:bg-secondary-blue/10 text-secondary-text hover:text-secondary-blue transition-colors cursor-pointer border border-border-color" title="Page Builder">
            <Layers className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => onDelete(country)} className="p-1.5 rounded hover:bg-red-50 text-secondary-text hover:text-red-600 transition-colors cursor-pointer border border-border-color" title="Delete">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function CountriesPage() {
  const navigate = useNavigate();
  const [countries, setCountries] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);
  const [saving,    setSaving]    = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing,   setEditing]   = useState(null); // country to edit

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await countryApi.getAdminCountries();
      setCountries(data);
    } catch (e) {
      setError(e.message || 'Failed to load countries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDragEnd = async ({ active, over }) => {
    if (!over || active.id === over.id) return;
    const oldIdx = countries.findIndex(c => c.id === active.id);
    const newIdx = countries.findIndex(c => c.id === over.id);
    const reordered = arrayMove(countries, oldIdx, newIdx);
    setCountries(reordered);
    try {
      await countryApi.reorderCountries(reordered.map(c => c.id));
    } catch {
      load(); // revert on failure
    }
  };

  const handleToggle = async (id) => {
    try {
      const res = await countryApi.toggleCountry(id);
      setCountries(prev => prev.map(c => c.id === id ? { ...c, is_active: res.is_active } : c));
    } catch (e) {
      alert(e.message);
    }
  };

  const handleDelete = async (country) => {
    if (!window.confirm(`Delete "${country.name}"? This will remove all its sections too.`)) return;
    setSaving(true);
    try {
      await countryApi.deleteCountry(country.id);
      setCountries(prev => prev.filter(c => c.id !== country.id));
    } catch (e) {
      alert(e.message || 'Delete failed');
    } finally {
      setSaving(false);
    }
  };

  const handleSaved = (saved) => {
    setCountries(prev => {
      const exists = prev.find(c => c.id === saved.id);
      return exists ? prev.map(c => c.id === saved.id ? saved : c) : [saved, ...prev];
    });
    setModalOpen(false);
    setEditing(null);
  };

  return (
    <div className="min-h-screen bg-primary-bg text-primary-text flex flex-col md:flex-row">
      <AdminSidebar />

      <main className="flex-grow p-6 md:p-10 space-y-6 overflow-y-auto max-h-screen">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display font-extrabold text-2xl md:text-3xl text-primary-blue">Country Management</h1>
            <p className="text-xs text-secondary-text font-light">Add, edit, reorder and manage country pages for the public website.</p>
          </div>
          <Button variant="primary" onClick={() => { setEditing(null); setModalOpen(true); }} className="gap-2 text-xs py-2 px-4 shrink-0">
            <Plus className="w-4 h-4" /> Add Country
          </Button>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" /> {error}
          </div>
        )}

        <Card className="border border-border-color bg-white p-0 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-primary-bg/75 border-b border-border-color text-secondary-text uppercase font-bold tracking-wider">
                  <th className="px-4 py-3 w-10"></th>
                  <th className="px-4 py-3">Country</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>

              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={countries.map(c => c.id)} strategy={verticalListSortingStrategy}>
                  <tbody className="divide-y divide-border-color">
                    {loading ? (
                      <tr><td colSpan={5} className="px-6 py-12 text-center text-secondary-text">
                        <div className="flex items-center justify-center gap-2">
                          <RefreshCw className="w-4 h-4 animate-spin text-secondary-blue" />
                          <span>Loading countries…</span>
                        </div>
                      </td></tr>
                    ) : countries.length === 0 ? (
                      <tr><td colSpan={5} className="px-6 py-10 text-center text-secondary-text">
                        No countries yet. Click "Add Country" to get started.
                      </td></tr>
                    ) : (
                      countries.map(country => (
                        <SortableRow
                          key={country.id}
                          country={country}
                          onEdit={(c) => { setEditing(c); setModalOpen(true); }}
                          onDelete={handleDelete}
                          onToggle={handleToggle}
                          onBuilder={(id) => navigate(`/admin/countries/${id}/builder`)}
                        />
                      ))
                    )}
                  </tbody>
                </SortableContext>
              </DndContext>
            </table>
          </div>
          <div className="p-4 bg-primary-bg/20 border-t border-border-color text-xs text-secondary-text flex items-center justify-between">
            <span>Drag rows to reorder. Changes save automatically.</span>
            <span>{countries.length} countries</span>
          </div>
        </Card>
      </main>

      {modalOpen && (
        <CountryFormModal
          country={editing}
          onClose={() => { setModalOpen(false); setEditing(null); }}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}
