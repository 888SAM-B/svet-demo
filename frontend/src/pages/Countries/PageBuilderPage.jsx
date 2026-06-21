import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, ArrowLeft, RefreshCw, GripVertical, Eye, EyeOff, Edit2, Trash2, AlertCircle } from 'lucide-react';
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
import { countryApi } from '../../services/countryApi';
import SectionFormModal from './SectionFormModal';
import SEOPanel from './SEOPanel';

const SECTION_LABELS = {
  hero: '🖼 Hero', rich_text: '📝 Rich Text', image: '🏞 Image',
  gallery: '🖼 Gallery', highlights: '✅ Highlights', table: '📊 Table',
  universities: '🏛 Universities', faq: '❓ FAQ', cta: '🔔 CTA',
};

// ── Sortable section row ──────────────────────────────────────────────────────
function SortableSection({ section, onEdit, onDelete, onToggle }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: section.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-3 p-3 bg-white border border-border-color rounded-lg hover:border-secondary-blue/30 transition-colors">
      <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-border-color hover:text-secondary-blue p-1 shrink-0">
        <GripVertical className="w-4 h-4" />
      </button>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-primary-blue">
          {SECTION_LABELS[section.section_type] || section.section_type}
          {section.section_title && <span className="text-secondary-text font-normal ml-2">— {section.section_title}</span>}
        </p>
        <p className="text-[10px] text-secondary-text font-mono">order: {section.section_order}</p>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <button onClick={() => onToggle(section.id)} title={section.is_active ? 'Hide' : 'Show'} className="p-1.5 rounded hover:bg-primary-bg cursor-pointer text-secondary-text hover:text-secondary-blue transition-colors">
          {section.is_active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 text-red-400" />}
        </button>
        <button onClick={() => onEdit(section)} className="p-1.5 rounded hover:bg-primary-bg cursor-pointer text-secondary-text hover:text-secondary-blue transition-colors">
          <Edit2 className="w-3.5 h-3.5" />
        </button>
        <button onClick={() => onDelete(section)} className="p-1.5 rounded hover:bg-red-50 cursor-pointer text-secondary-text hover:text-red-500 transition-colors">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function PageBuilderPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sections, setSections] = useState([]);
  const [country,  setCountry]  = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [tab,      setTab]      = useState('sections'); // 'sections' | 'seo'
  const [sectionModal, setSectionModal] = useState(false);
  const [editingSection, setEditingSection] = useState(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const loadSections = async () => {
    setLoading(true);
    setError(null);
    try {
      const [allCountries, secs] = await Promise.all([
        countryApi.getAdminCountries(),
        countryApi.getSections(id)
      ]);
      setCountry(allCountries.find(c => String(c.id) === String(id)) || null);
      setSections(secs);
    } catch (e) {
      setError(e.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadSections(); }, [id]);

  const handleDragEnd = async ({ active, over }) => {
    if (!over || active.id === over.id) return;
    const oldIdx = sections.findIndex(s => s.id === active.id);
    const newIdx = sections.findIndex(s => s.id === over.id);
    const reordered = arrayMove(sections, oldIdx, newIdx);
    setSections(reordered);
    try {
      await countryApi.reorderSections(id, reordered.map(s => s.id));
    } catch { loadSections(); }
  };

  const handleToggle = async (sectionId) => {
    try {
      const res = await countryApi.toggleSection(id, sectionId);
      setSections(prev => prev.map(s => s.id === sectionId ? { ...s, is_active: res.is_active } : s));
    } catch (e) { alert(e.message); }
  };

  const handleDelete = async (section) => {
    if (!window.confirm(`Delete section "${section.section_type}"?`)) return;
    try {
      await countryApi.deleteSection(id, section.id);
      setSections(prev => prev.filter(s => s.id !== section.id));
    } catch (e) { alert(e.message || 'Delete failed'); }
  };

  const handleSectionSaved = (saved) => {
    setSections(prev => {
      const exists = prev.find(s => s.id === saved.id);
      return exists ? prev.map(s => s.id === saved.id ? saved : s) : [...prev, saved];
    });
    setSectionModal(false);
    setEditingSection(null);
  };

  return (
    <div className="min-h-screen bg-primary-bg text-primary-text flex flex-col md:flex-row">
      <AdminSidebar />

      <main className="flex-grow p-6 md:p-10 space-y-6 overflow-y-auto max-h-screen">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/country-management')} className="p-2 rounded-lg hover:bg-secondary-bg text-secondary-text hover:text-primary-blue transition-colors cursor-pointer">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="font-display font-extrabold text-2xl text-primary-blue">
              Page Builder {country ? `— ${country.name}` : ''}
            </h1>
            <p className="text-xs text-secondary-text font-light">Build and manage sections that appear in the country detail modal.</p>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" /> {error}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 border-b border-border-color">
          {[['sections', '📋 Page Sections'], ['seo', '🔍 SEO Settings']].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-4 py-2.5 text-xs font-bold transition-colors cursor-pointer border-b-2 ${
                tab === key
                  ? 'border-secondary-blue text-secondary-blue'
                  : 'border-transparent text-secondary-text hover:text-primary-blue'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === 'seo' ? (
          <Card className="bg-white border border-border-color p-6">
            <SEOPanel countryId={id} />
          </Card>
        ) : (
          <>
            {/* Add Section Button */}
            <div className="flex justify-end">
              <Button variant="primary" onClick={() => { setEditingSection(null); setSectionModal(true); }} className="gap-2 text-xs py-2 px-4">
                <Plus className="w-4 h-4" /> Add Section
              </Button>
            </div>

            {/* Sections List */}
            <Card className="bg-white border border-border-color p-5 space-y-3">
              {loading ? (
                <div className="flex items-center justify-center gap-2 py-8 text-secondary-text text-sm">
                  <RefreshCw className="w-4 h-4 animate-spin text-secondary-blue" /> Loading sections…
                </div>
              ) : sections.length === 0 ? (
                <div className="text-center py-10 text-secondary-text text-sm">
                  No sections yet. Click "Add Section" to start building this country page.
                </div>
              ) : (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={sections.map(s => s.id)} strategy={verticalListSortingStrategy}>
                    {sections.map(section => (
                      <SortableSection
                        key={section.id}
                        section={section}
                        onEdit={(s) => { setEditingSection(s); setSectionModal(true); }}
                        onDelete={handleDelete}
                        onToggle={handleToggle}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
              )}
            </Card>
            <p className="text-[11px] text-secondary-text text-center">Drag sections to reorder. Toggle 👁 to show/hide without deleting.</p>
          </>
        )}
      </main>

      {sectionModal && (
        <SectionFormModal
          countryId={id}
          section={editingSection}
          onClose={() => { setSectionModal(false); setEditingSection(null); }}
          onSaved={handleSectionSaved}
        />
      )}
    </div>
  );
}
