import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Edit2, Eye, Clock, Calendar, Tag, Share2, Trash2 } from 'lucide-react';
import { mockPosts } from '../../data/mockData';
import Avatar from '../../components/ui/Avatar';
import { formatDate, formatNumber, statusColors, statusLabels } from '../../utils/helpers';

export default function PostView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const post = mockPosts.find(p => p.id === id);

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-gray-500 mb-4">Entrada no encontrada</p>
        <button className="btn-primary" onClick={() => navigate('/posts')}>Volver a entradas</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button className="btn-ghost btn-sm" onClick={() => navigate('/posts')}>
          <ArrowLeft className="w-4 h-4" /> Volver
        </button>
        <div className="flex items-center gap-2">
          <button className="btn-secondary btn-sm">
            <Share2 className="w-3.5 h-3.5" /> Compartir
          </button>
          <button className="btn-secondary btn-sm" onClick={() => navigate(`/posts/${post.id}/edit`)}>
            <Edit2 className="w-3.5 h-3.5" /> Editar
          </button>
          <button className="btn-danger btn-sm">
            <Trash2 className="w-3.5 h-3.5" /> Eliminar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Main content */}
        <div className="lg:col-span-3 space-y-5">
          {/* Featured image */}
          {post.featuredImage && (
            <div className="card overflow-hidden">
              <img src={post.featuredImage} alt={post.title} className="w-full h-64 object-cover" />
            </div>
          )}

          {/* Content */}
          <div className="card p-6">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className={statusColors[post.status]}>{statusLabels[post.status]}</span>
              <span
                className="badge text-xs font-medium px-2.5 py-0.5 rounded-full"
                style={{ backgroundColor: `${post.category.color}20`, color: post.category.color }}
              >
                {post.category.name}
              </span>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-3">{post.title}</h1>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Avatar src={post.author.avatar} name={post.author.name} size="sm" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{post.author.name}</p>
                  <p className="text-xs text-gray-400 capitalize">{post.author.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Calendar className="w-3.5 h-3.5" />
                {formatDate(post.publishedAt || post.createdAt)}
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Clock className="w-3.5 h-3.5" />
                {post.readTime} min de lectura
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Eye className="w-3.5 h-3.5" />
                {formatNumber(post.views)} vistas
              </div>
            </div>

            <div className="border-t border-gray-100 pt-5">
              <p className="text-base text-gray-600 italic mb-4 leading-relaxed">{post.excerpt}</p>
              <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
                <p>{post.content.replace(/<[^>]*>/g, '') || 'El contenido de esta entrada aparecerá aquí...'}</p>
                <p className="mt-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                <p className="mt-4">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
              </div>
            </div>

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="flex items-center gap-2 mt-6 pt-5 border-t border-gray-100">
                <Tag className="w-4 h-4 text-gray-400" />
                <div className="flex flex-wrap gap-2">
                  {post.tags.map(tag => (
                    <span key={tag.id} className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 font-medium">
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="card p-4">
            <h3 className="font-semibold text-gray-900 mb-3 text-sm">Detalles</h3>
            <dl className="space-y-2.5">
              {[
                { label: 'Estado', value: <span className={statusColors[post.status]}>{statusLabels[post.status]}</span> },
                { label: 'Categoría', value: <span className="text-sm text-gray-700">{post.category.name}</span> },
                { label: 'Creado', value: <span className="text-sm text-gray-500">{formatDate(post.createdAt)}</span> },
                { label: 'Actualizado', value: <span className="text-sm text-gray-500">{formatDate(post.updatedAt)}</span> },
                { label: 'Vistas', value: <span className="text-sm font-semibold text-gray-900">{formatNumber(post.views)}</span> },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between">
                  <dt className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="card p-4">
            <h3 className="font-semibold text-gray-900 mb-3 text-sm">Autor</h3>
            <div className="flex items-center gap-3">
              <Avatar src={post.author.avatar} name={post.author.name} size="lg" />
              <div>
                <p className="text-sm font-medium text-gray-900">{post.author.name}</p>
                <p className="text-xs text-gray-500">{post.author.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
