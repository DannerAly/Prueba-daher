import { useState, useMemo } from 'react';
import { Plus, Edit2, Trash2, FolderOpen, Search, Hash } from 'lucide-react';
import { mockCategories, mockTags } from '../../data/mockData';
import type { Category, Tag } from '../../types';
import { slugify } from '../../utils/helpers';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import EmptyState from '../../components/ui/EmptyState';

interface CategoryFormData {
  name: string;
  slug: string;
  description: string;
  color: string;
}

const colorOptions = [
  '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b',
  '#ef4444', '#06b6d4', '#f97316', '#ec4899',
];

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [tags, setTags] = useState<Tag[]>(mockTags);
  const [activeTab, setActiveTab] = useState<'categories' | 'tags'>('categories');
  const [search, setSearch] = useState('');
  const [catModal, setCatModal] = useState(false);
  const [tagModal, setTagModal] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [deleteCatId, setDeleteCatId] = useState<string | null>(null);
  const [deleteTagId, setDeleteTagId] = useState<string | null>(null);
  const [catForm, setCatForm] = useState<CategoryFormData>({ name: '', slug: '', description: '', color: '#3b82f6' });
  const [tagName, setTagName] = useState('');

  const filteredCats = useMemo(() => categories.filter(c => c.name.toLowerCase().includes(search.toLowerCase())), [categories, search]);
  const filteredTags = useMemo(() => tags.filter(t => t.name.toLowerCase().includes(search.toLowerCase())), [tags, search]);

  const openCreateCat = () => {
    setEditingCat(null);
    setCatForm({ name: '', slug: '', description: '', color: '#3b82f6' });
    setCatModal(true);
  };

  const openEditCat = (cat: Category) => {
    setEditingCat(cat);
    setCatForm({ name: cat.name, slug: cat.slug, description: cat.description || '', color: cat.color });
    setCatModal(true);
  };

  const saveCat = () => {
    if (!catForm.name) return;
    if (editingCat) {
      setCategories(prev => prev.map(c => c.id === editingCat.id ? { ...c, ...catForm } : c));
    } else {
      setCategories(prev => [...prev, { id: Date.now().toString(), ...catForm, postCount: 0 }]);
    }
    setCatModal(false);
  };

  const saveTag = () => {
    if (!tagName) return;
    if (editingTag) {
      setTags(prev => prev.map(t => t.id === editingTag.id ? { ...t, name: tagName, slug: slugify(tagName) } : t));
    } else {
      setTags(prev => [...prev, { id: Date.now().toString(), name: tagName, slug: slugify(tagName), postCount: 0 }]);
    }
    setTagModal(false);
    setTagName('');
    setEditingTag(null);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Taxonomías</h2>
          <p className="text-sm text-gray-500">Organiza tu contenido con categorías y etiquetas</p>
        </div>
        <button
          className="btn-primary"
          onClick={activeTab === 'categories' ? openCreateCat : () => { setTagModal(true); setTagName(''); setEditingTag(null); }}
        >
          <Plus className="w-4 h-4" />
          {activeTab === 'categories' ? 'Nueva categoría' : 'Nueva etiqueta'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('categories')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'categories' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
        >
          <FolderOpen className="w-4 h-4" /> Categorías ({categories.length})
        </button>
        <button
          onClick={() => setActiveTab('tags')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'tags' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
        >
          <Hash className="w-4 h-4" /> Etiquetas ({tags.length})
        </button>
      </div>

      {/* Search */}
      <div className="card p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={`Buscar ${activeTab === 'categories' ? 'categorías' : 'etiquetas'}...`}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input pl-9"
          />
        </div>
      </div>

      {activeTab === 'categories' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCats.length === 0 ? (
            <div className="col-span-full">
              <EmptyState icon={FolderOpen} title="No se encontraron categorías" />
            </div>
          ) : filteredCats.map(cat => (
            <div key={cat.id} className="card p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${cat.color}20` }}
                  >
                    <FolderOpen className="w-5 h-5" style={{ color: cat.color }} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{cat.name}</p>
                    <p className="text-xs text-gray-400">/{cat.slug}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600"
                    onClick={() => openEditCat(cat)}
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600"
                    onClick={() => setDeleteCatId(cat.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              {cat.description && <p className="text-xs text-gray-500 mb-3">{cat.description}</p>}
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-900">{cat.postCount} entradas</span>
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: cat.color }} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card overflow-hidden">
          {filteredTags.length === 0 ? (
            <EmptyState icon={Hash} title="No se encontraron etiquetas" />
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Etiqueta</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Slug</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Entradas</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredTags.map(tag => (
                  <tr key={tag.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3">
                      <span className="inline-flex items-center gap-1.5">
                        <Hash className="w-3.5 h-3.5 text-gray-400" />
                        <span className="font-medium text-gray-900 text-sm">{tag.name}</span>
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-400 hidden md:table-cell">{tag.slug}</td>
                    <td className="px-5 py-3">
                      <span className="badge-blue">{tag.postCount}</span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600"
                          onClick={() => { setEditingTag(tag); setTagName(tag.name); setTagModal(true); }}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600"
                          onClick={() => setDeleteTagId(tag.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Category modal */}
      <Modal
        isOpen={catModal}
        onClose={() => setCatModal(false)}
        title={editingCat ? 'Editar categoría' : 'Nueva categoría'}
        size="md"
        footer={
          <>
            <button className="btn-secondary btn-sm" onClick={() => setCatModal(false)}>Cancelar</button>
            <button className="btn-primary btn-sm" onClick={saveCat}>Guardar</button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="label">Nombre *</label>
            <input
              type="text"
              value={catForm.name}
              onChange={e => setCatForm(prev => ({ ...prev, name: e.target.value, slug: slugify(e.target.value) }))}
              placeholder="Nombre de la categoría"
              className="input"
            />
          </div>
          <div>
            <label className="label">Slug</label>
            <input
              type="text"
              value={catForm.slug}
              onChange={e => setCatForm(prev => ({ ...prev, slug: e.target.value }))}
              placeholder="url-de-la-categoria"
              className="input font-mono text-sm"
            />
          </div>
          <div>
            <label className="label">Descripción</label>
            <textarea
              value={catForm.description}
              onChange={e => setCatForm(prev => ({ ...prev, description: e.target.value }))}
              rows={2}
              className="textarea"
              placeholder="Descripción opcional"
            />
          </div>
          <div>
            <label className="label">Color</label>
            <div className="flex items-center gap-2 flex-wrap">
              {colorOptions.map(color => (
                <button
                  key={color}
                  type="button"
                  className={`w-8 h-8 rounded-full transition-transform hover:scale-110 ${catForm.color === color ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setCatForm(prev => ({ ...prev, color }))}
                />
              ))}
            </div>
          </div>
        </div>
      </Modal>

      {/* Tag modal */}
      <Modal
        isOpen={tagModal}
        onClose={() => { setTagModal(false); setEditingTag(null); }}
        title={editingTag ? 'Editar etiqueta' : 'Nueva etiqueta'}
        size="sm"
        footer={
          <>
            <button className="btn-secondary btn-sm" onClick={() => { setTagModal(false); setEditingTag(null); }}>Cancelar</button>
            <button className="btn-primary btn-sm" onClick={saveTag}>Guardar</button>
          </>
        }
      >
        <div>
          <label className="label">Nombre *</label>
          <input
            type="text"
            value={tagName}
            onChange={e => setTagName(e.target.value)}
            placeholder="Nombre de la etiqueta"
            className="input"
            onKeyDown={e => e.key === 'Enter' && saveTag()}
          />
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteCatId}
        onClose={() => setDeleteCatId(null)}
        onConfirm={() => { deleteCatId && setCategories(prev => prev.filter(c => c.id !== deleteCatId)); setDeleteCatId(null); }}
        title="Eliminar categoría"
        message="¿Estás seguro? Las entradas en esta categoría quedarán sin categoría."
        confirmLabel="Eliminar"
        variant="danger"
      />
      <ConfirmDialog
        isOpen={!!deleteTagId}
        onClose={() => setDeleteTagId(null)}
        onConfirm={() => { deleteTagId && setTags(prev => prev.filter(t => t.id !== deleteTagId)); setDeleteTagId(null); }}
        title="Eliminar etiqueta"
        message="¿Estás seguro de que quieres eliminar esta etiqueta?"
        confirmLabel="Eliminar"
        variant="danger"
      />
    </div>
  );
}
