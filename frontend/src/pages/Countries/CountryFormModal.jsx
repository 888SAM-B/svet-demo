import React, { useState, useEffect } from 'react';
import { X, Upload, Loader2 } from 'lucide-react';
import { countryApi, getImageUrl } from '../../services/countryApi';
import { Button } from '../../components/Common/Button';

const slugify = (text) =>
  text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

function ImageUploadField({ label, subFolder, value, onChange }) {
  const [uploading, setUploading] = useState(false);
  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await countryApi.uploadCountryImage(file, subFolder);
      onChange(res.path);
    } catch (err) {
      alert(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-bold uppercase tracking-wider text-secondary-text">{label}</label>
      <div className="flex items-center gap-3">
        {value && (
          <img src={getImageUrl(value)} alt="" className="w-12 h-12 rounded-lg object-cover border border-border-color" />
        )}
        <label className="flex items-center gap-2 px-3 py-2 border border-border-color rounded-lg text-xs text-secondary-text hover:border-secondary-blue hover:text-secondary-blue transition-colors cursor-pointer bg-primary-bg">
          {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
          <span>{uploading ? 'Uploading…' : 'Upload Image'}</span>
          <input type="file" accept="image/*,.pdf" className="hidden" onChange={handleFile} disabled={uploading} />
        </label>
        {value && (
          <button onClick={() => onChange('')} className="text-[10px] text-red-500 hover:underline cursor-pointer">Remove</button>
        )}
      </div>
      {value && <p className="text-[10px] text-secondary-text font-mono truncate">{value}</p>}
    </div>
  );
}

export default function CountryFormModal({ country, onClose, onSaved }) {
  const isEdit = !!country;
  const [form, setForm] = useState({
    name: country?.name || '',
    slug: country?.slug || '',
    short_description: country?.short_description || '',
    starting_fee: country?.starting_fee || '',
    flag_image: country?.flag_image || '',
    card_image: country?.card_image || '',
    is_active: country?.is_active ?? true,
    display_order: country?.display_order ?? 0,
  });
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState(null);

  // Auto-generate slug from name (only for new countries)
  useEffect(() => {
    if (!isEdit && form.name) {
      setForm(f => ({ ...f, slug: slugify(f.name) }));
    }
  }, [form.name, isEdit]);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const payload = {
        ...form,
        starting_fee: form.starting_fee ? parseFloat(form.starting_fee) : null,
        display_order: parseInt(form.display_order) || 0,
      };
      const saved = isEdit
        ? await countryApi.updateCountry(country.id, payload)
        : await countryApi.createCountry(payload);
      onSaved(saved);
    } catch (err) {
      setError(err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-primary-blue/60 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-color">
          <h3 className="font-display font-bold text-base text-primary-blue">
            {isEdit ? `Edit: ${country.name}` : 'Add New Country'}
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-primary-bg text-secondary-text cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-xs">{error}</div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-secondary-text">Country Name *</label>
              <input
                required
                value={form.name}
                onChange={e => set('name', e.target.value)}
                className="w-full px-3 py-2 border border-border-color rounded-lg text-sm focus:outline-none focus:border-secondary-blue"
                placeholder="e.g. Uzbekistan"
              />
            </div>

            <div className="col-span-2 space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-secondary-text">Slug (URL key) *</label>
              <input
                required
                value={form.slug}
                onChange={e => set('slug', e.target.value)}
                className="w-full px-3 py-2 border border-border-color rounded-lg text-sm font-mono focus:outline-none focus:border-secondary-blue"
                placeholder="e.g. uzbekistan"
              />
            </div>

            <div className="col-span-2 space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-secondary-text">Short Description</label>
              <textarea
                value={form.short_description}
                onChange={e => set('short_description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-border-color rounded-lg text-sm resize-none focus:outline-none focus:border-secondary-blue"
                placeholder="Brief summary for the country card…"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-secondary-text">Starting Fee (₹/year)</label>
              <input
                type="number"
                value={form.starting_fee}
                onChange={e => set('starting_fee', e.target.value)}
                className="w-full px-3 py-2 border border-border-color rounded-lg text-sm focus:outline-none focus:border-secondary-blue"
                placeholder="250000"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-secondary-text">Display Order</label>
              <input
                type="number"
                value={form.display_order}
                onChange={e => set('display_order', e.target.value)}
                className="w-full px-3 py-2 border border-border-color rounded-lg text-sm focus:outline-none focus:border-secondary-blue"
              />
            </div>
          </div>

          <ImageUploadField label="Flag Image" subFolder="flags" value={form.flag_image} onChange={v => set('flag_image', v)} />
          <ImageUploadField label="Card Background Image" subFolder="cards" value={form.card_image} onChange={v => set('card_image', v)} />

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={e => set('is_active', e.target.checked)}
              className="w-4 h-4 accent-secondary-blue"
            />
            <span className="text-sm font-medium text-primary-blue">Active (show on public website)</span>
          </label>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border-color bg-primary-bg/30">
          <Button variant="secondary" onClick={onClose} className="text-xs py-2 px-4">Cancel</Button>
          <Button variant="primary" onClick={handleSubmit} disabled={saving} className="text-xs py-2 px-4 gap-2">
            {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {isEdit ? 'Save Changes' : 'Create Country'}
          </Button>
        </div>
      </div>
    </div>
  );
}
