import { useNavigate } from 'react-router-dom';
import {
  FileText, Users, Eye, CheckCircle, Clock,
  ArrowRight, PenSquare
} from 'lucide-react';
import {
  AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import StatsCard from '../components/dashboard/StatsCard';
import Avatar from '../components/ui/Avatar';
import { mockStats, mockActivity, chartData, mockPosts } from '../data/mockData';
import { formatNumber, formatRelativeTime, statusColors, statusLabels } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const recentPosts = mockPosts.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            ¡Hola, {user?.name?.split(' ')[0]}! 👋
          </h2>
          <p className="text-gray-500 mt-0.5 text-sm">
            Aquí tienes un resumen de tu contenido
          </p>
        </div>
        <button className="btn-primary" onClick={() => navigate('/posts/new')}>
          <PenSquare className="w-4 h-4" />
          Nueva entrada
        </button>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total de entradas"
          value={mockStats.totalPosts}
          icon={FileText}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
          trend={{ value: 12, label: 'vs mes anterior', positive: true }}
        />
        <StatsCard
          title="Publicadas"
          value={mockStats.publishedPosts}
          icon={CheckCircle}
          iconColor="text-green-600"
          iconBg="bg-green-50"
          subtitle={`${mockStats.draftPosts} en borrador`}
        />
        <StatsCard
          title="Vistas este mes"
          value={formatNumber(mockStats.viewsThisMonth)}
          icon={Eye}
          iconColor="text-purple-600"
          iconBg="bg-purple-50"
          trend={{ value: 23, label: 'vs mes anterior', positive: true }}
        />
        <StatsCard
          title="Usuarios"
          value={mockStats.totalUsers}
          icon={Users}
          iconColor="text-orange-600"
          iconBg="bg-orange-50"
          trend={{ value: 3, label: 'nuevos este mes', positive: true }}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Views chart */}
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold text-gray-900">Vistas del sitio</h3>
              <p className="text-sm text-gray-500">Últimos 6 meses</p>
            </div>
            <span className="badge-blue">Total: {formatNumber(mockStats.totalViews)}</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData.views}>
              <defs>
                <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => formatNumber(v)} />
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value: number | undefined) => [formatNumber(value ?? 0), 'Vistas']}
              />
              <Area type="monotone" dataKey="views" stroke="#3b82f6" strokeWidth={2} fill="url(#viewsGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Posts by category */}
        <div className="card p-5">
          <div className="mb-5">
            <h3 className="font-semibold text-gray-900">Por categoría</h3>
            <p className="text-sm text-gray-500">Distribución de contenido</p>
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={chartData.postsByCategory} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                {chartData.postsByCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number | undefined) => [value ?? 0, 'Entradas']} />
            </PieChart>
          </ResponsiveContainer>
          <ul className="mt-2 space-y-1.5">
            {chartData.postsByCategory.slice(0, 4).map(cat => (
              <li key={cat.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                  <span className="text-gray-600">{cat.name}</span>
                </div>
                <span className="font-medium text-gray-900">{cat.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent posts */}
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Entradas recientes</h3>
            <button
              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              onClick={() => navigate('/posts')}
            >
              Ver todas <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="divide-y divide-gray-100">
            {recentPosts.map(post => (
              <div key={post.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => navigate(`/posts/${post.id}`)}>
                {post.featuredImage && (
                  <img src={post.featuredImage} alt={post.title} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{post.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={statusColors[post.status]}>{statusLabels[post.status]}</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-400">{post.category.name}</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  {post.views > 0 && (
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Eye className="w-3 h-3" />
                      {formatNumber(post.views)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity feed */}
        <div className="card">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Actividad reciente</h3>
          </div>
          <ul className="divide-y divide-gray-100">
            {mockActivity.map(item => (
              <li key={item.id} className="flex gap-3 px-5 py-3.5">
                <Avatar src={item.user.avatar} name={item.user.name} size="xs" className="flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-700 leading-relaxed">
                    <span className="font-medium">{item.user.name}</span>{' '}
                    {item.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatRelativeTime(item.timestamp)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
