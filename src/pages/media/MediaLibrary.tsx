import { useState, useMemo } from 'react';
import {
  Upload, Search, Grid, List, Image, FileText,
  Film, Music, Trash2, Download, Eye, X, Copy, Check
} from 'lucide-react';
import { mockMedia, mockUsers } from '../../data/mockData';
import type { MediaItem, MediaType } from '../../types';
import { formatFileSize, formatDate } from '../../utils/helpers';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import EmptyState from '../../components/ui/EmptyState';

const typeIcons: Record<MediaType, React.ElementType> = {
  image: Image,
  video: Film,
  document: FileText,
  audio: Music,
};

const typeFilters: { value: MediaType | 'all'; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'image', label: 'Imágenes' },
  { value: 'video', label: 'Videos' },
  { value: 'audio', label: 'Audio' },
  { value: 'document', label: 'Documentos' },
];

export default function MediaLibrary() {
  const [media, setMedia] = useState(mockMedia);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<MediaType | 'all'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selected, setSelected] = useState<string[]>([]);
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let result = [...media];
    if (search) result = result.filter(m => m.name.toLowerCase().includes(search.toLowerCase()));
    if (typeFilter !== 'all') result = result.filter(m => m.type === typeFilter);
    return result;
  }, [media, search, typeFilter]);

  const toggleSelect = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const handleDelete = (id: string) => {
    setMedia(prev => prev.filter(m => m.id !== id));
    setSelected(prev => prev.filter(s => s !== id));
  };

  const handleCopy = (url: string, id: string) => {
    navigator.clipboard.writeText(url).catch(() => {});
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const uploaderName = (id: string) => mockUsers.find(u => u.id === id)?.name || 'Desconocido';

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Biblioteca de medios</h2>
          <p className="text-sm text-gray-500">{media.length} archivos</p>
        </div>
        <button className="btn-primary">
          <Upload className="w-4 h-4" /> Subir archivos
        </button>
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar archivos..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input pl-9"
          />
        </div>

        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
          {typeFilters.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setTypeFilter(value as MediaType | 'all')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                typeFilter === value ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bulk actions */}
      {selected.length > 0 && (
        <div className="flex items-center gap-3 px-4 py-2.5 bg-blue-50 border border-blue-200 rounded-xl fade-in">
          <span className="text-sm font-medium text-blue-700">{selected.length} seleccionados</span>
          <button
            className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
            onClick={() => { selected.forEach(id => handleDelete(id)); setSelected([]); }}
          >
            <Trash2 className="w-3.5 h-3.5" /> Eliminar selección
          </button>
          <button className="text-sm text-gray-500 hover:text-gray-700 ml-auto" onClick={() => setSelected([])}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Upload area */}
      <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-blue-300 hover:bg-blue-50/30 transition-all cursor-pointer">
        <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2" />
        <p className="text-sm text-gray-500">Arrastra archivos aquí o <span className="text-blue-600 font-medium">haz clic para subir</span></p>
        <p className="text-xs text-gray-400 mt-1">Soporta: JPG, PNG, GIF, MP4, MP3, PDF, DOCX (máx. 50MB)</p>
      </div>

      {/* Media grid/list */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Image}
          title="No se encontraron archivos"
          description="Prueba ajustando los filtros de búsqueda"
        />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filtered.map(item => {
            const Icon = typeIcons[item.type];
            const isSelected = selected.includes(item.id);

            return (
              <div
                key={item.id}
                className={`card group cursor-pointer overflow-hidden transition-all ${isSelected ? 'ring-2 ring-blue-500' : 'hover:shadow-md'}`}
                onClick={() => toggleSelect(item.id)}
              >
                {/* Preview */}
                <div className="relative aspect-square bg-gray-100">
                  {item.thumbnail ? (
                    <img src={item.thumbnail} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Icon className="w-8 h-8 text-gray-300" />
                    </div>
                  )}
                  {isSelected && (
                    <div className="absolute inset-0 bg-blue-600/20 flex items-center justify-center">
                      <Check className="w-6 h-6 text-blue-600 bg-white rounded-full p-1" />
                    </div>
                  )}
                  {/* Hover actions */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      className="p-1.5 bg-white rounded-lg text-gray-700 hover:text-blue-600"
                      onClick={e => { e.stopPropagation(); setPreviewItem(item); }}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      className="p-1.5 bg-white rounded-lg text-gray-700 hover:text-red-600"
                      onClick={e => { e.stopPropagation(); setDeleteId(item.id); }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="p-2">
                  <p className="text-xs font-medium text-gray-700 truncate">{item.name}</p>
                  <p className="text-xs text-gray-400">{formatFileSize(item.size)}</p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Archivo</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Tipo</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Tamaño</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Subido por</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden xl:table-cell">Fecha</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(item => {
                const Icon = typeIcons[item.type];
                return (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
                          {item.thumbnail ? (
                            <img src={item.thumbnail} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Icon className="w-5 h-5 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{item.name}</p>
                          {item.dimensions && (
                            <p className="text-xs text-gray-400">{item.dimensions.width}×{item.dimensions.height}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="badge-gray capitalize">{item.type}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 hidden lg:table-cell">
                      {formatFileSize(item.size)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 hidden lg:table-cell">
                      {uploaderName(item.uploadedBy)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 hidden xl:table-cell">
                      {formatDate(item.uploadedAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-blue-600"
                          onClick={() => setPreviewItem(item)}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-green-600"
                          onClick={() => handleCopy(item.url, item.id)}
                        >
                          {copied === item.id ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-blue-600">
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600"
                          onClick={() => setDeleteId(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Preview modal */}
      <Modal
        isOpen={!!previewItem}
        onClose={() => setPreviewItem(null)}
        title={previewItem?.name || ''}
        size="lg"
        footer={
          <>
            <button className="btn-secondary btn-sm" onClick={() => setPreviewItem(null)}>Cerrar</button>
            <button
              className="btn-primary btn-sm"
              onClick={() => previewItem && handleCopy(previewItem.url, previewItem.id)}
            >
              {copied === previewItem?.id ? <><Check className="w-3.5 h-3.5" /> Copiado</> : <><Copy className="w-3.5 h-3.5" /> Copiar URL</>}
            </button>
          </>
        }
      >
        {previewItem && (
          <div className="space-y-4">
            {previewItem.type === 'image' && previewItem.thumbnail && (
              <img src={previewItem.url} alt={previewItem.name} className="w-full rounded-lg max-h-80 object-contain bg-gray-50" />
            )}
            <dl className="grid grid-cols-2 gap-3">
              {[
                { label: 'Nombre', value: previewItem.name },
                { label: 'Tipo', value: previewItem.type },
                { label: 'Tamaño', value: formatFileSize(previewItem.size) },
                { label: 'Subido', value: formatDate(previewItem.uploadedAt) },
                { label: 'Usado en', value: `${previewItem.usedIn} entradas` },
                ...(previewItem.dimensions ? [{ label: 'Dimensiones', value: `${previewItem.dimensions.width}×${previewItem.dimensions.height}` }] : []),
              ].map(({ label, value }) => (
                <div key={label}>
                  <dt className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-0.5">{label}</dt>
                  <dd className="text-sm text-gray-700 font-medium">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && handleDelete(deleteId)}
        title="Eliminar archivo"
        message="¿Estás seguro de que quieres eliminar este archivo? Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        variant="danger"
      />
    </div>
  );
}
