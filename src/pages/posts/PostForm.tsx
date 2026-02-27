import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, Save, Globe, Clock, Tag,
  Image, X, Plus, AlertCircle
} from 'lucide-react';
import { mockPosts, mockCategories, mockTags } from '../../data/mockData';
import type { PostStatus } from '../../types';
import { slugify } from '../../utils/helpers';

interface PostFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  status: PostStatus;
  categoryId: string;
  tagIds: string[];
  featuredImage: string;
  seoTitle: string;
  seoDescription: string;
}

export default function PostForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id && id !== 'new';
  const existingPost = isEditing ? mockPosts.find(p => p.id === id) : null;

  const [form, setForm] = useState<PostFormData>({
    title: existingPost?.title || '',
    slug: existingPost?.slug || '',
    excerpt: existingPost?.excerpt || '',
    content: existingPost?.content || '',
    status: existingPost?.status || 'draft',
    categoryId: existingPost?.categoryId || '',
    tagIds: existingPost?.tags.map(t => t.id) || [],
    featuredImage: existingPost?.featuredImage || '',
    seoTitle: existingPost?.seo?.title || '',
    seoDescription: existingPost?.seo?.description || '',
  });
  const [activeTab, setActiveTab] = useState<'content' | 'seo' | 'settings'>('content');
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState<Partial<PostFormData>>({});

  useEffect(() => {
    if (!isEditing && form.title) {
      setForm(prev => ({ ...prev, slug: slugify(prev.title) }));
    }
  }, [form.title, isEditing]);

  const validate = (): boolean => {
    const errs: Partial<PostFormData> = {};
    if (!form.title) errs.title = 'El título es requerido';
    if (!form.excerpt) errs.excerpt = 'El resumen es requerido';
    if (!form.categoryId) errs.categoryId = 'Selecciona una categoría';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = (status?: PostStatus) => {
    if (!validate()) return;
    const newStatus = status || form.status;
    setForm(prev => ({ ...prev, status: newStatus }));
    setSaved(true);
    setTimeout(() => { setSaved(false); navigate('/posts'); }, 1200);
  };

  const toggleTag = (tagId: string) => {
    setForm(prev => ({
      ...prev,
      tagIds: prev.tagIds.includes(tagId)
        ? prev.tagIds.filter(id => id !== tagId)
        : [...prev.tagIds, tagId],
    }));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            className="btn-ghost btn-sm"
            onClick={() => navigate('/posts')}
          >
            <ArrowLeft className="w-4 h-4" /> Volver
          </button>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {isEditing ? 'Editar entrada' : 'Nueva entrada'}
            </h2>
            <p className="text-sm text-gray-500">
              {isEditing ? `Editando: ${existingPost?.title}` : 'Crea una nueva entrada para tu blog'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {saved && (
            <span className="text-sm text-green-600 font-medium flex items-center gap-1 fade-in">
              <AlertCircle className="w-4 h-4" /> ¡Guardado!
            </span>
          )}
          <button className="btn-secondary btn-sm" onClick={() => handleSave('draft')}>
            <Save className="w-3.5 h-3.5" /> Guardar borrador
          </button>
          <button className="btn-primary btn-sm" onClick={() => handleSave('published')}>
            <Globe className="w-3.5 h-3.5" /> Publicar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-4">
          {/* Tabs */}
          <div className="card p-1 flex gap-1 w-fit">
            {(['content', 'seo', 'settings'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                  activeTab === tab ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab === 'content' ? 'Contenido' : tab === 'seo' ? 'SEO' : 'Ajustes'}
              </button>
            ))}
          </div>

          {activeTab === 'content' && (
            <div className="card p-5 space-y-4">
              {/* Title */}
              <div>
                <label className="label">Título *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Escribe el título de la entrada..."
                  className={`input text-lg font-medium ${errors.title ? 'border-red-400 ring-red-400' : ''}`}
                />
                {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
              </div>

              {/* Slug */}
              <div>
                <label className="label">URL amigable (slug)</label>
                <div className="flex items-center rounded-lg border border-gray-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
                  <span className="px-3 py-2 text-sm text-gray-400 bg-gray-50 border-r border-gray-300 rounded-l-lg">
                    /blog/
                  </span>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={e => setForm(prev => ({ ...prev, slug: e.target.value }))}
                    className="flex-1 px-3 py-2 text-sm focus:outline-none rounded-r-lg"
                  />
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label className="label">Resumen / Extracto *</label>
                <textarea
                  value={form.excerpt}
                  onChange={e => setForm(prev => ({ ...prev, excerpt: e.target.value }))}
                  rows={3}
                  placeholder="Breve descripción de la entrada..."
                  className={`textarea ${errors.excerpt ? 'border-red-400' : ''}`}
                />
                {errors.excerpt && <p className="text-xs text-red-500 mt-1">{errors.excerpt}</p>}
              </div>

              {/* Content */}
              <div>
                <label className="label">Contenido</label>
                <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
                  {/* Toolbar */}
                  <div className="flex items-center gap-1 px-3 py-2 bg-gray-50 border-b border-gray-200 flex-wrap">
                    {['B', 'I', 'U', 'H1', 'H2', '"', '≡', '•', '⓪'].map(tool => (
                      <button
                        key={tool}
                        className="px-2 py-1 text-xs font-medium rounded hover:bg-gray-200 text-gray-600 transition-colors"
                        type="button"
                      >
                        {tool}
                      </button>
                    ))}
                    <div className="w-px h-4 bg-gray-300 mx-1" />
                    <button className="px-2 py-1 text-xs rounded hover:bg-gray-200 text-gray-600 flex items-center gap-1" type="button">
                      <Image className="w-3 h-3" /> Imagen
                    </button>
                  </div>
                  <textarea
                    value={form.content}
                    onChange={e => setForm(prev => ({ ...prev, content: e.target.value }))}
                    rows={14}
                    placeholder="Escribe el contenido de la entrada aquí..."
                    className="w-full px-4 py-3 text-sm focus:outline-none resize-none font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'seo' && (
            <div className="card p-5 space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Vista previa en Google</h3>
                <div className="border border-gray-200 rounded-lg p-4 bg-white">
                  <p className="text-blue-700 text-base font-medium truncate">
                    {form.seoTitle || form.title || 'Título de la entrada'}
                  </p>
                  <p className="text-green-700 text-xs mt-0.5">
                    tudominio.com/blog/{form.slug || 'url-de-la-entrada'}
                  </p>
                  <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                    {form.seoDescription || form.excerpt || 'Descripción de la entrada que aparece en los resultados de búsqueda...'}
                  </p>
                </div>
              </div>
              <div>
                <label className="label">Título SEO</label>
                <input
                  type="text"
                  value={form.seoTitle}
                  onChange={e => setForm(prev => ({ ...prev, seoTitle: e.target.value }))}
                  placeholder={form.title || 'Título para motores de búsqueda'}
                  className="input"
                  maxLength={60}
                />
                <div className="flex justify-between mt-1">
                  <p className="text-xs text-gray-400">Recomendado: 50–60 caracteres</p>
                  <p className={`text-xs ${form.seoTitle.length > 55 ? 'text-orange-500' : 'text-gray-400'}`}>
                    {form.seoTitle.length}/60
                  </p>
                </div>
              </div>
              <div>
                <label className="label">Meta descripción</label>
                <textarea
                  value={form.seoDescription}
                  onChange={e => setForm(prev => ({ ...prev, seoDescription: e.target.value }))}
                  placeholder={form.excerpt || 'Descripción para motores de búsqueda'}
                  rows={3}
                  className="textarea"
                  maxLength={160}
                />
                <div className="flex justify-between mt-1">
                  <p className="text-xs text-gray-400">Recomendado: 120–160 caracteres</p>
                  <p className={`text-xs ${form.seoDescription.length > 150 ? 'text-orange-500' : 'text-gray-400'}`}>
                    {form.seoDescription.length}/160
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="card p-5 space-y-4">
              <div>
                <label className="label">Estado de publicación</label>
                <select
                  value={form.status}
                  onChange={e => setForm(prev => ({ ...prev, status: e.target.value as PostStatus }))}
                  className="select"
                >
                  <option value="draft">Borrador</option>
                  <option value="published">Publicado</option>
                  <option value="scheduled">Programado</option>
                  <option value="archived">Archivado</option>
                </select>
              </div>
              {form.status === 'scheduled' && (
                <div>
                  <label className="label">Fecha de publicación</label>
                  <input type="datetime-local" className="input" />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Featured image */}
          <div className="card p-4">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Image className="w-4 h-4" /> Imagen destacada
            </h3>
            {form.featuredImage ? (
              <div className="relative rounded-lg overflow-hidden">
                <img src={form.featuredImage} alt="Featured" className="w-full h-40 object-cover rounded-lg" />
                <button
                  className="absolute top-2 right-2 p-1 bg-white rounded-lg shadow text-gray-500 hover:text-red-600"
                  onClick={() => setForm(prev => ({ ...prev, featuredImage: '' }))}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-colors"
                onClick={() => setForm(prev => ({ ...prev, featuredImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800' }))}
              >
                <Image className="w-6 h-6" />
                <span className="text-xs font-medium">Seleccionar imagen</span>
              </button>
            )}
          </div>

          {/* Category */}
          <div className="card p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Categoría *</h3>
            <select
              value={form.categoryId}
              onChange={e => setForm(prev => ({ ...prev, categoryId: e.target.value }))}
              className={`select ${errors.categoryId ? 'border-red-400' : ''}`}
            >
              <option value="">Seleccionar categoría</option>
              {mockCategories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            {errors.categoryId && <p className="text-xs text-red-500 mt-1">{errors.categoryId}</p>}
          </div>

          {/* Tags */}
          <div className="card p-4">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Tag className="w-4 h-4" /> Etiquetas
            </h3>
            <div className="flex flex-wrap gap-2">
              {mockTags.map(tag => (
                <button
                  key={tag.id}
                  onClick={() => toggleTag(tag.id)}
                  className={`text-xs px-2.5 py-1 rounded-full border font-medium transition-all ${
                    form.tagIds.includes(tag.id)
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'text-gray-600 border-gray-300 hover:border-blue-400 hover:text-blue-600'
                  }`}
                >
                  {form.tagIds.includes(tag.id) ? <X className="w-3 h-3 inline mr-0.5" /> : <Plus className="w-3 h-3 inline mr-0.5" />}
                  {tag.name}
                </button>
              ))}
            </div>
          </div>

          {/* Publish actions */}
          <div className="card p-4 space-y-2">
            <h3 className="font-semibold text-gray-900 mb-3">Publicar</h3>
            <button className="btn-primary w-full" onClick={() => handleSave('published')}>
              <Globe className="w-4 h-4" /> Publicar ahora
            </button>
            <button className="btn-secondary w-full" onClick={() => handleSave('draft')}>
              <Save className="w-4 h-4" /> Guardar borrador
            </button>
            <button className="btn-secondary w-full" onClick={() => handleSave('scheduled')}>
              <Clock className="w-4 h-4" /> Programar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
