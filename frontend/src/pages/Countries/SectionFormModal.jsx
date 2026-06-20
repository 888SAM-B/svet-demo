import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Upload, Loader2 } from 'lucide-react';
import { countryApi, getImageUrl } from '../../services/countryApi';
import { Button } from '../../components/Common/Button';
import RichTextEditor from '../../components/Admin/RichTextEditor';

const SECTION_TYPES = [
  { value: 'hero',         label: '🖼 Hero Banner' },
  { value: 'rich_text',    label: '📝 Rich Text' },
  { value: 'image',        label: '🏞 Single Image' },
  { value: 'gallery',      label: '🖼 Image Gallery' },
  { value: 'highlights',   label: '✅ Highlights' },
  { value: 'table',        label: '📊 Table' },
  { value: 'universities', label: '🏛 Universities' },
  { value: 'faq',          label: '❓ FAQ' },
  { value: 'cta',          label: '🔔 Call To Action' },
];

function ImageField({ label, subFolder, value, onChange }) {
  const [uploading, setUploading] = useState(false);
  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await countryApi.uploadCountryImage(file, subFolder);
      onChange(res.path);
    } catch (err) { alert(err.message || 'Upload failed'); }
    finally { setUploading(false); }
  };
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-bold uppercase tracking-wider text-secondary-text">{label}</label>
      <div className="flex items-center gap-3">
        {value && <img src={getImageUrl(value)} alt="" className="w-14 h-14 rounded-lg object-cover border border-border-color" />}
        <label className="flex items-center gap-2 px-3 py-2 border border-dashed border-border-color rounded-lg text-xs text-secondary-text hover:border-secondary-blue cursor-pointer bg-primary-bg">
          {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
          <span>{uploading ? 'Uploading…' : 'Choose Image'}</span>
          <input type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={uploading} />
        </label>
        {value && <button type="button" onClick={() => onChange('')} className="text-[10px] text-red-500 hover:underline cursor-pointer">Remove</button>}
      </div>
    </div>
  );
}

// Build empty default content_json for each section type
const defaultContent = (type) => {
  switch (type) {
    case 'hero':         return { title: '', subtitle: '', image: '' };
    case 'rich_text':    return { content: '' };
    case 'image':        return { image: '', caption: '' };
    case 'gallery':      return { images: [] };
    case 'highlights':   return { items: [''] };
    case 'table':        return { columns: ['Column 1', 'Column 2'], rows: [['', '']] };
    case 'universities': return { universities: [{ name: '', description: '' }] };
    case 'faq':          return { faqs: [{ question: '', answer: '' }] };
    case 'cta':          return { title: '', buttonText: 'Apply Now' };
    default:             return {};
  }
};

export default function SectionFormModal({ countryId, section, onClose, onSaved }) {
  const isEdit = !!section;
  const [type,    setType]    = useState(section?.section_type || 'hero');
  const [title,   setTitle]   = useState(section?.section_title || '');
  const [order,   setOrder]   = useState(section?.section_order ?? 0);
  const [active,  setActive]  = useState(section?.is_active ?? true);
  const [content, setContent] = useState(section?.content_json || defaultContent(section?.section_type || 'hero'));
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState(null);

  // Reset content when type changes (only for new sections)
  const handleTypeChange = (newType) => {
    setType(newType);
    if (!isEdit) setContent(defaultContent(newType));
  };

  const setC = (key, val) => setContent(prev => ({ ...prev, [key]: val }));

  const handleSubmit = async () => {
    setError(null);
    setSaving(true);
    try {
      const payload = { section_type: type, section_title: title, section_order: parseInt(order) || 0, content_json: content, is_active: active };
      const saved = isEdit
        ? await countryApi.updateSection(countryId, section.id, payload)
        : await countryApi.createSection(countryId, payload);
      onSaved(saved);
    } catch (e) {
      setError(e.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  // ── Dynamic form fields per section type ────────────────────────────────
  const renderFields = () => {
    switch (type) {
      case 'hero':
        return (
          <div className="space-y-3">
            <input value={content.title || ''} onChange={e => setC('title', e.target.value)} placeholder="Hero Title" className="w-full px-3 py-2 border border-border-color rounded-lg text-sm focus:outline-none focus:border-secondary-blue" />
            <input value={content.subtitle || ''} onChange={e => setC('subtitle', e.target.value)} placeholder="Subtitle (optional)" className="w-full px-3 py-2 border border-border-color rounded-lg text-sm focus:outline-none focus:border-secondary-blue" />
            <ImageField label="Hero Background Image" subFolder="heroes" value={content.image || ''} onChange={v => setC('image', v)} />
          </div>
        );

      case 'rich_text':
        return <RichTextEditor content={content.content || ''} onChange={v => setC('content', v)} />;

      case 'image':
        return (
          <div className="space-y-3">
            <ImageField label="Image" subFolder="gallery" value={content.image || ''} onChange={v => setC('image', v)} />
            <input value={content.caption || ''} onChange={e => setC('caption', e.target.value)} placeholder="Caption (optional)" className="w-full px-3 py-2 border border-border-color rounded-lg text-sm focus:outline-none focus:border-secondary-blue" />
          </div>
        );

      case 'gallery':
        return (
          <div className="space-y-3">
            <p className="text-xs text-secondary-text">Add multiple gallery images:</p>
            {(content.images || []).map((img, i) => (
              <div key={i} className="flex items-center gap-2">
                <ImageField label={`Image ${i + 1}`} subFolder="gallery" value={img} onChange={v => {
                  const imgs = [...(content.images || [])];
                  imgs[i] = v;
                  setC('images', imgs);
                }} />
                <button type="button" onClick={() => { const imgs = [...(content.images || [])]; imgs.splice(i, 1); setC('images', imgs); }} className="text-red-500 p-1.5 cursor-pointer hover:bg-red-50 rounded">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            <Button type="button" variant="secondary" onClick={() => setC('images', [...(content.images || []), ''])} className="text-xs py-1.5 gap-1.5">
              <Plus className="w-3.5 h-3.5" /> Add Image
            </Button>
          </div>
        );

      case 'highlights':
        return (
          <div className="space-y-2">
            {(content.items || []).map((item, i) => (
              <div key={i} className="flex gap-2">
                <input value={item} onChange={e => { const items = [...(content.items || [])]; items[i] = e.target.value; setC('items', items); }}
                  placeholder={`Highlight ${i + 1}`} className="flex-1 px-3 py-2 border border-border-color rounded-lg text-sm focus:outline-none focus:border-secondary-blue" />
                <button type="button" onClick={() => { const items = [...(content.items || [])]; items.splice(i, 1); setC('items', items); }} className="text-red-500 p-1.5 cursor-pointer">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            <Button type="button" variant="secondary" onClick={() => setC('items', [...(content.items || []), ''])} className="text-xs py-1.5 gap-1.5">
              <Plus className="w-3.5 h-3.5" /> Add Item
            </Button>
          </div>
        );

      case 'table':
        return (
          <div className="space-y-3 overflow-x-auto">
            <p className="text-xs text-secondary-text font-semibold">Columns:</p>
            <div className="flex gap-2 flex-wrap">
              {(content.columns || []).map((col, ci) => (
                <input key={ci} value={col} onChange={e => { const cols = [...(content.columns || [])]; cols[ci] = e.target.value; setC('columns', cols); }}
                  className="px-2 py-1 border border-border-color rounded text-xs w-28 focus:outline-none focus:border-secondary-blue" placeholder={`Col ${ci + 1}`} />
              ))}
              <Button type="button" variant="secondary" onClick={() => setC('columns', [...(content.columns || []), `Col ${(content.columns || []).length + 1}`])} className="text-xs py-1 px-2">+</Button>
            </div>
            <p className="text-xs text-secondary-text font-semibold">Rows:</p>
            {(content.rows || []).map((row, ri) => (
              <div key={ri} className="flex gap-2 items-center">
                {(content.columns || []).map((_, ci) => (
                  <input key={ci} value={row[ci] || ''} onChange={e => { const rows = (content.rows || []).map((r, i) => i === ri ? r.map((c, j) => j === ci ? e.target.value : c) : r); setC('rows', rows); }}
                    className="px-2 py-1 border border-border-color rounded text-xs w-28 focus:outline-none focus:border-secondary-blue" placeholder={`R${ri + 1}C${ci + 1}`} />
                ))}
                <button type="button" onClick={() => { const rows = [...(content.rows || [])]; rows.splice(ri, 1); setC('rows', rows); }} className="text-red-500 p-1 cursor-pointer">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            <Button type="button" variant="secondary" onClick={() => setC('rows', [...(content.rows || []), new Array((content.columns || []).length).fill('')])} className="text-xs py-1.5 gap-1.5">
              <Plus className="w-3.5 h-3.5" /> Add Row
            </Button>
          </div>
        );

      case 'universities':
        return (
          <div className="space-y-3">
            {(content.universities || []).map((uni, i) => (
              <div key={i} className="p-3 border border-border-color rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-secondary-text uppercase">University {i + 1}</span>
                  <button type="button" onClick={() => { const unis = [...(content.universities || [])]; unis.splice(i, 1); setC('universities', unis); }} className="text-red-500 p-1 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
                <input value={uni.name || ''} onChange={e => { const unis = (content.universities || []).map((u, j) => j === i ? { ...u, name: e.target.value } : u); setC('universities', unis); }}
                  placeholder="University Name" className="w-full px-3 py-2 border border-border-color rounded-lg text-sm focus:outline-none focus:border-secondary-blue" />
                <textarea value={uni.description || ''} onChange={e => { const unis = (content.universities || []).map((u, j) => j === i ? { ...u, description: e.target.value } : u); setC('universities', unis); }}
                  placeholder="Description (optional)" rows={2} className="w-full px-3 py-2 border border-border-color rounded-lg text-sm resize-none focus:outline-none focus:border-secondary-blue" />
              </div>
            ))}
            <Button type="button" variant="secondary" onClick={() => setC('universities', [...(content.universities || []), { name: '', description: '' }])} className="text-xs py-1.5 gap-1.5">
              <Plus className="w-3.5 h-3.5" /> Add University
            </Button>
          </div>
        );

      case 'faq':
        return (
          <div className="space-y-3">
            {(content.faqs || []).map((faq, i) => (
              <div key={i} className="p-3 border border-border-color rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-secondary-text uppercase">FAQ {i + 1}</span>
                  <button type="button" onClick={() => { const faqs = [...(content.faqs || [])]; faqs.splice(i, 1); setC('faqs', faqs); }} className="text-red-500 p-1 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
                <input value={faq.question || ''} onChange={e => { const faqs = (content.faqs || []).map((f, j) => j === i ? { ...f, question: e.target.value } : f); setC('faqs', faqs); }}
                  placeholder="Question" className="w-full px-3 py-2 border border-border-color rounded-lg text-sm focus:outline-none focus:border-secondary-blue" />
                <textarea value={faq.answer || ''} onChange={e => { const faqs = (content.faqs || []).map((f, j) => j === i ? { ...f, answer: e.target.value } : f); setC('faqs', faqs); }}
                  placeholder="Answer" rows={2} className="w-full px-3 py-2 border border-border-color rounded-lg text-sm resize-none focus:outline-none focus:border-secondary-blue" />
              </div>
            ))}
            <Button type="button" variant="secondary" onClick={() => setC('faqs', [...(content.faqs || []), { question: '', answer: '' }])} className="text-xs py-1.5 gap-1.5">
              <Plus className="w-3.5 h-3.5" /> Add FAQ
            </Button>
          </div>
        );

      case 'cta':
        return (
          <div className="space-y-3">
            <input value={content.title || ''} onChange={e => setC('title', e.target.value)} placeholder="CTA Title" className="w-full px-3 py-2 border border-border-color rounded-lg text-sm focus:outline-none focus:border-secondary-blue" />
            <input value={content.buttonText || ''} onChange={e => setC('buttonText', e.target.value)} placeholder="Button Text (e.g. Apply Now)" className="w-full px-3 py-2 border border-border-color rounded-lg text-sm focus:outline-none focus:border-secondary-blue" />
          </div>
        );

      default: return <p className="text-xs text-secondary-text">Unknown section type.</p>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-primary-blue/60 backdrop-blur-sm" />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-color shrink-0">
          <h3 className="font-display font-bold text-base text-primary-blue">
            {isEdit ? 'Edit Section' : 'Add Section'}
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-primary-bg text-secondary-text cursor-pointer"><X className="w-4 h-4" /></button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-xs">{error}</div>}

          {/* Section Type */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-secondary-text">Section Type *</label>
              <select value={type} onChange={e => handleTypeChange(e.target.value)} disabled={isEdit}
                className="w-full px-3 py-2 border border-border-color rounded-lg text-sm focus:outline-none focus:border-secondary-blue bg-white disabled:opacity-60">
                {SECTION_TYPES.map(st => <option key={st.value} value={st.value}>{st.label}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-secondary-text">Section Order</label>
              <input type="number" value={order} onChange={e => setOrder(e.target.value)} className="w-full px-3 py-2 border border-border-color rounded-lg text-sm focus:outline-none focus:border-secondary-blue" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-secondary-text">Section Title (optional)</label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Fee Structure" className="w-full px-3 py-2 border border-border-color rounded-lg text-sm focus:outline-none focus:border-secondary-blue" />
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={active} onChange={e => setActive(e.target.checked)} className="w-4 h-4 accent-secondary-blue" />
            <span className="text-sm font-medium text-primary-blue">Active (visible in modal)</span>
          </label>

          {/* Dynamic fields */}
          <div className="border-t border-border-color pt-4 space-y-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-secondary-text">Section Content</p>
            {renderFields()}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border-color bg-primary-bg/30 shrink-0">
          <Button variant="secondary" onClick={onClose} className="text-xs py-2 px-4">Cancel</Button>
          <Button variant="primary" onClick={handleSubmit} disabled={saving} className="text-xs py-2 px-4 gap-2">
            {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {isEdit ? 'Save Changes' : 'Add Section'}
          </Button>
        </div>
      </div>
    </div>
  );
}
