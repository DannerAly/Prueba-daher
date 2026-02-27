import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus, Search, Filter, Eye, Edit2, Trash2,
  ArrowUpDown, Clock, Calendar, CheckCircle
} from 'lucide-react';
import { mockPosts, mockCategories } from '../../data/mockData';
import type { Post, PostStatus } from '../../types';
import { formatDate, formatNumber, statusColors, statusLabels, truncate } from '../../utils/helpers';
import Avatar from '../../components/ui/Avatar';
import Pagination from '../../components/ui/Pagination';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import EmptyState from '../../components/ui/EmptyState';

const ITEMS_PER_PAGE = 6;

const statusFilters: { value: PostStatus | 'all'; label: string; icon: React.ElementType }[] = [
  { value: 'all', label: 'Todas', icon: Filter },
  { value: 'published', label: 'Publicadas', icon: CheckCircle },
  { value: 'draft', label: 'Borradores', icon: Edit2 },
  { value: 'scheduled', label: 'Programadas', icon: Clock },
  { value: 'archived', label: 'Archivadas', icon: Calendar },
];

export default function PostsList() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<PostStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortField, setSortField] = useState<'createdAt' | 'title' | 'views'>('createdAt');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let result = [...posts];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(p => p.title.toLowerCase().includes(q) || p.author.name.toLowerCase().includes(q));
    }
    if (statusFilter !== 'all') result = result.filter(p => p.status === statusFilter);
    if (categoryFilter !== 'all') result = result.filter(p => p.categoryId === categoryFilter);
    result.sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1;
      if (sortField === 'title') return a.title.localeCompare(b.title) * dir;
      if (sortField === 'views') return (a.views - b.views) * dir;
      return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * dir;
    });
    return result;
  }, [posts, search, statusFilter, categoryFilter, sortField, sortDir]);

  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('desc'); }
  };

  const handleDelete = (id: string) => {
    setPosts(prev => prev.filter(p => p.id !== id));
  };

  const counts = useMemo(() => ({
    all: posts.length,
    published: posts.filter(p => p.status === 'published').length,
    draft: posts.filter(p => p.status === 'draft').length,
    scheduled: posts.filter(p => p.status === 'scheduled').length,
    archived: posts.filter(p => p.status === 'archived').length,
  }), [posts]);

  return (
    <div className="space-y-5">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Entradas</h2>
          <p className="text-sm text-gray-500">{posts.length} entradas en total</p>
        </div>
        <button className="btn-primary" onClick={() => navigate('/posts/new')}>
          <Plus className="w-4 h-4" /> Nueva entrada
        </button>
      </div>

      {/* Status tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit flex-wrap">
        {statusFilters.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => { setStatusFilter(value as PostStatus | 'all'); setPage(1); }}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              statusFilter === value
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {label}
            <span className={`ml-1.5 text-xs ${statusFilter === value ? 'text-blue-600' : 'text-gray-400'}`}>
              {counts[value as keyof typeof counts]}
            </span>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar entradas..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="input pl-9"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={e => { setCategoryFilter(e.target.value); setPage(1); }}
          className="select w-44"
        >
          <option value="all">Todas las categorías</option>
          {mockCategories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {paginated.length === 0 ? (
          <EmptyState
            icon={Search}
            title="No se encontraron entradas"
            description="Prueba ajustando los filtros de búsqueda"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <button className="flex items-center gap-1 hover:text-gray-700" onClick={() => toggleSort('title')}>
                      Entrada <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Estado
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Autor
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    <button className="flex items-center gap-1 hover:text-gray-700" onClick={() => toggleSort('createdAt')}>
                      Fecha <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden xl:table-cell">
                    <button className="flex items-center gap-1 hover:text-gray-700" onClick={() => toggleSort('views')}>
                      Vistas <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginated.map(post => (
                  <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {post.featuredImage && (
                          <img src={post.featuredImage} alt={post.title} className="w-10 h-10 rounded-lg object-cover flex-shrink-0 hidden sm:block" />
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-900 hover:text-blue-600 cursor-pointer" onClick={() => navigate(`/posts/${post.id}`)}>
                            {truncate(post.title, 50)}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-gray-400">{post.category.name}</span>
                            <span className="md:hidden">
                              <span className={statusColors[post.status]}>{statusLabels[post.status]}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <span className={statusColors[post.status]}>{statusLabels[post.status]}</span>
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell">
                      <div className="flex items-center gap-2">
                        <Avatar src={post.author.avatar} name={post.author.name} size="xs" />
                        <span className="text-sm text-gray-600">{post.author.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell">
                      <span className="text-sm text-gray-500">{formatDate(post.updatedAt)}</span>
                    </td>
                    <td className="px-5 py-4 hidden xl:table-cell">
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Eye className="w-3.5 h-3.5" />
                        {formatNumber(post.views)}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors"
                          onClick={() => navigate(`/posts/${post.id}`)}
                          title="Ver"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                          onClick={() => navigate(`/posts/${post.id}/edit`)}
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                          onClick={() => setDeleteId(post.id)}
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {paginated.length > 0 && (
          <div className="px-5 py-4 border-t border-gray-100">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
              totalItems={filtered.length}
              itemsPerPage={ITEMS_PER_PAGE}
            />
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && handleDelete(deleteId)}
        title="Eliminar entrada"
        message="¿Estás seguro de que quieres eliminar esta entrada? Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        variant="danger"
      />
    </div>
  );
}
