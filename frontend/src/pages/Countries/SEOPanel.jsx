import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '../../components/Common/Button';
import { countryApi, getImageUrl } from '../../services/countryApi';

export default function SEOPanel({ countryId }) {
  const [form, setForm]       = useState({ meta_title: '', meta_description: '', keywords: '', og_image: '' });
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [msg,     setMsg]     = useState(null);

  useEffect(() => {
    if (!countryId) return;
    setLoading(true);
    countryApi.getSEO(countryId)
      .then(data => {
        if (data && data.id) setForm({ meta_title: data.meta_title || '', meta_description: data.meta_description || '', keywords: data.keywords || '', og_image: data.og_image || '' });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [countryId]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    setMsg(null);
    try {
      await countryApi.saveSEO(countryId, form);
      setMsg({ type: 'success', text: 'SEO settings saved!' });
    } catch (e) {
      setMsg({ type: 'error', text: e.message || 'Save failed' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center gap-2 text-secondary-text text-sm py-8 justify-center">
      <Loader2 className="w-4 h-4 animate-spin" /> Loading SEO settings…
    </div>
  );

  const Field = ({ label, name, type = 'text', rows, placeholder }) => (
    <div className="space-y-1.5">
      <label className="text-[11px] font-bold uppercase tracking-wider text-secondary-text">{label}</label>
      {type === 'textarea'
        ? <textarea value={form[name]} onChange={e => set(name, e.target.value)} rows={rows || 3}
            className="w-full px-3 py-2 border border-border-color rounded-lg text-sm resize-none focus:outline-none focus:border-secondary-blue"
            placeholder={placeholder} />
        : <input type={type} value={form[name]} onChange={e => set(name, e.target.value)}
            className="w-full px-3 py-2 border border-border-color rounded-lg text-sm focus:outline-none focus:border-secondary-blue"
            placeholder={placeholder} />}
    </div>
  );

  return (
    <div className="space-y-5">
      <p className="text-xs text-secondary-text font-light">
        These fields populate <code className="bg-secondary-bg px-1 rounded">&lt;meta&gt;</code> tags for search engines and social sharing.
      </p>

      {msg && (
        <div className={`p-3 rounded-lg text-xs border ${msg.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-600'}`}>
          {msg.text}
        </div>
      )}

      <Field label="Meta Title" name="meta_title" placeholder="Study MBBS in Uzbekistan | SVET Overseas" />
      <Field label="Meta Description" name="meta_description" type="textarea" rows={3} placeholder="Affordable MBBS programs in Uzbekistan…" />
      <Field label="Keywords (comma separated)" name="keywords" placeholder="MBBS Uzbekistan, study medicine abroad, NMC approved" />
      <Field label="OG Image URL / Path" name="og_image" placeholder="/uploads/countries/heroes/uzbekistan.jpg" />

      {form.og_image && (
        <img src={getImageUrl(form.og_image)} alt="OG preview" className="rounded-lg border border-border-color h-28 object-cover" />
      )}

      <div className="flex justify-end">
        <Button variant="primary" onClick={handleSave} disabled={saving} className="text-xs py-2 px-5 gap-2">
          {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          Save SEO Settings
        </Button>
      </div>
    </div>
  );
}
