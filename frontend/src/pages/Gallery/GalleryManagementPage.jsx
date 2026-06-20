import React, { useState, useEffect } from 'react';
import { Plus, RefreshCw, GripVertical, Eye, EyeOff, Edit2, Trash2, AlertCircle, Upload, X, Save } from 'lucide-react';
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
import { galleryApi } from '../../services/galleryApi';
import { getImageUrl } from '../../services/countryApi';

// ── Sortable Image Row ──────────────────────────────────────────────────────
function SortableImageRow({ item, onEdit, onDelete, onToggle }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-4 p-4 bg-white border border-border-color rounded-xl hover:border-secondary-blue/30 transition-colors"
    >
      {/* Drag Handle */}
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-border-color hover:text-secondary-blue p-1.5 shrink-0"
      >
        <GripVertical className="w-5 h-5" />
      </button>

      {/* Thumbnail */}
      <div className="w-20 h-12 rounded-lg overflow-hidden bg-secondary-bg border border-border-color shrink-0">
        <img
          src={getImageUrl(item.image_path)}
          alt={item.title || ''}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-bold text-primary-blue truncate">
          {item.title || <span className="text-secondary-text font-normal italic">Untitled Image</span>}
        </h4>
        <p className="text-[10px] text-secondary-text font-mono mt-0.5 truncate">
          Path: {item.image_path}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 shrink-0">
        {/* Toggle View Status */}
        <button
          onClick={() => onToggle(item.id)}
          title={item.is_active ? 'Hide from Homepage' : 'Show on Homepage'}
          className="p-2 rounded-lg hover:bg-primary-bg cursor-pointer text-secondary-text hover:text-secondary-blue transition-colors"
        >
          {item.is_active ? <Eye className="w-4 h-4 text-emerald-500" /> : <EyeOff className="w-4 h-4 text-red-400" />}
        </button>

        {/* Edit Details */}
        <button
          onClick={() => onEdit(item)}
          title="Edit Details"
          className="p-2 rounded-lg hover:bg-primary-bg cursor-pointer text-secondary-text hover:text-secondary-blue transition-colors"
        >
          <Edit2 className="w-4 h-4" />
        </button>

        {/* Delete */}
        <button
          onClick={() => onDelete(item)}
          title="Delete Image"
          className="p-2 rounded-lg hover:bg-red-50 cursor-pointer text-secondary-text hover:text-red-500 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ── Main Page Component ──────────────────────────────────────────────────────
export default function GalleryManagementPage() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  
  // Form states
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [existingPath, setExistingPath] = useState('');
  const [uploading, setUploading] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const loadGallery = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await galleryApi.getAdminGallery();
      setImages(data || []);
    } catch (e) {
      setError(e.message || 'Failed to load gallery images');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGallery();
  }, []);

  const handleDragEnd = async ({ active, over }) => {
    if (!over || active.id === over.id) return;
    const oldIdx = images.findIndex(img => img.id === active.id);
    const newIdx = images.findIndex(img => img.id === over.id);
    const reordered = arrayMove(images, oldIdx, newIdx);
    setImages(reordered);
    try {
      await galleryApi.reorderGalleryImages(reordered.map(img => img.id));
    } catch (e) {
      loadGallery(); // Rollback on failure
    }
  };

  const handleToggle = async (id) => {
    try {
      const res = await galleryApi.toggleGalleryImage(id);
      setImages(prev => prev.map(img => img.id === id ? { ...img, is_active: res.is_active } : img));
    } catch (e) {
      alert(e.message || 'Toggle failed');
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete gallery image "${item.title || 'Untitled'}"?`)) return;
    try {
      await galleryApi.deleteGalleryImage(item.id);
      setImages(prev => prev.filter(img => img.id !== item.id));
    } catch (e) {
      alert(e.message || 'Delete failed');
    }
  };

  const openAddModal = () => {
    setEditingImage(null);
    setTitle('');
    setFile(null);
    setExistingPath('');
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingImage(item);
    setTitle(item.title || '');
    setFile(null);
    setExistingPath(item.image_path);
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setUploading(true);
    setError(null);
    try {
      let finalPath = existingPath;

      // If a new file is uploaded
      if (file) {
        const uploadRes = await galleryApi.uploadGalleryImage(file);
        finalPath = uploadRes.image_path;
      }

      if (!finalPath) {
        throw new Error('Please upload an image file.');
      }

      if (editingImage) {
        // Update existing record
        const updated = await galleryApi.updateGalleryImage(editingImage.id, {
          title,
          image_path: finalPath,
        });
        setImages(prev => prev.map(img => img.id === editingImage.id ? updated : img));
      } else {
        // Create new record
        const nextOrder = images.length > 0 ? Math.max(...images.map(img => img.display_order)) + 1 : 0;
        const created = await galleryApi.createGalleryImage({
          title,
          image_path: finalPath,
          display_order: nextOrder,
          is_active: true
        });
        setImages(prev => [...prev, created]);
      }
      setModalOpen(false);
    } catch (e) {
      setError(e.message || 'Failed to save gallery image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary-bg text-primary-text flex flex-col md:flex-row">
      <AdminSidebar />

      <main className="flex-grow p-6 md:p-10 space-y-6 overflow-y-auto max-h-screen">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display font-extrabold text-2xl md:text-3xl text-primary-blue">
              Homepage Gallery Management
            </h1>
            <p className="text-xs text-secondary-text font-light">
              Add, remove, and reorder images displayed in the main landing page gallery.
            </p>
          </div>
          <Button
            variant="primary"
            onClick={openAddModal}
            className="gap-2 text-xs py-2 px-4 shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Gallery Image
          </Button>
        </div>

        {/* Global Error Banner */}
        {error && (
          <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" /> {error}
          </div>
        )}

        {/* Gallery Images List */}
        <Card className="bg-white border border-border-color p-5 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-12 text-secondary-text text-sm">
              <RefreshCw className="w-4 h-4 animate-spin text-secondary-blue" />
              Loading gallery images…
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-12 text-secondary-text text-sm font-light">
              No gallery images found. Click "Add Gallery Image" to get started.
            </div>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={images.map(img => img.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-3">
                  {images.map(img => (
                    <SortableImageRow
                      key={img.id}
                      item={img}
                      onEdit={openEditModal}
                      onDelete={handleDelete}
                      onToggle={handleToggle}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}

          {!loading && images.length > 0 && (
            <p className="text-[11px] text-secondary-text text-center font-light pt-2">
              Drag rows by their grip handles to reorder images on the homepage. Toggle the eye icon to show/hide images.
            </p>
          )}
        </Card>
      </main>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-border-color w-full max-w-md overflow-hidden shadow-xl animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-border-color flex items-center justify-between">
              <h3 className="font-display font-extrabold text-base text-primary-blue">
                {editingImage ? 'Edit Gallery Image' : 'Add Gallery Image'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-primary-bg text-secondary-text hover:text-primary-blue transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSave} className="p-6 space-y-4">
              {/* Title Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-primary-blue">Image Title / Caption</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Modern Biology Lab Setup"
                  className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-border-color focus:border-secondary-blue focus:outline-none transition-colors"
                />
              </div>

              {/* Image Upload Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-primary-blue block">Upload Image File</label>
                
                {/* Current Image Preview */}
                {existingPath && !file && (
                  <div className="relative w-full h-32 rounded-lg overflow-hidden border border-border-color bg-[#F9F7F7] mb-2">
                    <img
                      src={getImageUrl(existingPath)}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded font-mono">
                      Current
                    </div>
                  </div>
                )}

                {/* Upload Drop Zone / Input */}
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-border-color hover:border-secondary-blue/60 rounded-xl p-6 cursor-pointer bg-[#F9F7F7] hover:bg-secondary-bg/20 transition-all">
                  <Upload className="w-6 h-6 text-secondary-text mb-2" />
                  <span className="text-xs font-semibold text-primary-blue">
                    {file ? file.name : 'Select / Drag new image'}
                  </span>
                  <span className="text-[10px] text-secondary-text mt-1">
                    Accepts PNG, JPG, JPEG, WEBP (Max 5MB)
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Modal Footer / Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-color">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setModalOpen(false)}
                  className="text-xs py-2 px-4 cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={uploading}
                  className="gap-2 text-xs py-2 px-4 cursor-pointer"
                >
                  {uploading ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Save className="w-3.5 h-3.5" />
                  )}
                  <span>{editingImage ? 'Save Changes' : 'Add Image'}</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
