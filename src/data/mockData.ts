import type { User, Post, Category, Tag, MediaItem, ActivityItem, DashboardStats } from '../types';

export const mockUsers: User[] = [
  { id: '1', name: 'Ana García', email: 'ana@example.com', role: 'admin', status: 'active', createdAt: '2024-01-15', lastLogin: '2026-02-27', avatar: 'https://i.pravatar.cc/150?img=47' },
  { id: '2', name: 'Carlos López', email: 'carlos@example.com', role: 'editor', status: 'active', createdAt: '2024-03-20', lastLogin: '2026-02-26', avatar: 'https://i.pravatar.cc/150?img=12' },
  { id: '3', name: 'María Rodríguez', email: 'maria@example.com', role: 'author', status: 'active', createdAt: '2024-05-10', lastLogin: '2026-02-25', avatar: 'https://i.pravatar.cc/150?img=32' },
  { id: '4', name: 'José Martínez', email: 'jose@example.com', role: 'author', status: 'active', createdAt: '2024-06-01', lastLogin: '2026-02-24', avatar: 'https://i.pravatar.cc/150?img=15' },
  { id: '5', name: 'Laura Sánchez', email: 'laura@example.com', role: 'viewer', status: 'inactive', createdAt: '2024-07-15', lastLogin: '2026-01-10', avatar: 'https://i.pravatar.cc/150?img=45' },
  { id: '6', name: 'Pedro Jiménez', email: 'pedro@example.com', role: 'editor', status: 'active', createdAt: '2024-08-20', lastLogin: '2026-02-23', avatar: 'https://i.pravatar.cc/150?img=68' },
];

export const mockCategories: Category[] = [
  { id: '1', name: 'Tecnología', slug: 'tecnologia', description: 'Artículos sobre tech', postCount: 24, color: '#3b82f6' },
  { id: '2', name: 'Diseño', slug: 'diseno', description: 'UI/UX y diseño gráfico', postCount: 18, color: '#8b5cf6' },
  { id: '3', name: 'Negocios', slug: 'negocios', description: 'Emprendimiento y negocios', postCount: 15, color: '#10b981' },
  { id: '4', name: 'Marketing', slug: 'marketing', description: 'Estrategias de marketing', postCount: 12, color: '#f59e0b' },
  { id: '5', name: 'Tutoriales', slug: 'tutoriales', description: 'Guías paso a paso', postCount: 30, color: '#ef4444' },
  { id: '6', name: 'Noticias', slug: 'noticias', description: 'Últimas noticias', postCount: 8, color: '#06b6d4' },
];

export const mockTags: Tag[] = [
  { id: '1', name: 'React', slug: 'react', postCount: 12 },
  { id: '2', name: 'TypeScript', slug: 'typescript', postCount: 8 },
  { id: '3', name: 'Node.js', slug: 'nodejs', postCount: 6 },
  { id: '4', name: 'CSS', slug: 'css', postCount: 10 },
  { id: '5', name: 'JavaScript', slug: 'javascript', postCount: 15 },
  { id: '6', name: 'Python', slug: 'python', postCount: 7 },
  { id: '7', name: 'SEO', slug: 'seo', postCount: 9 },
  { id: '8', name: 'UX', slug: 'ux', postCount: 11 },
];

export const mockPosts: Post[] = [
  {
    id: '1', title: 'Guía completa de React 19', slug: 'guia-completa-react-19',
    excerpt: 'Descubre todas las nuevas características de React 19 y cómo migrar tu proyecto.',
    content: '<p>React 19 trae consigo numerosas mejoras...</p>',
    status: 'published', authorId: '1', author: mockUsers[0],
    categoryId: '1', category: mockCategories[0], tags: [mockTags[0], mockTags[4]],
    featuredImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
    publishedAt: '2026-02-20', createdAt: '2026-02-18', updatedAt: '2026-02-20',
    views: 4521, readTime: 8,
  },
  {
    id: '2', title: 'Diseño de sistemas: Principios fundamentales', slug: 'diseno-sistemas-principios',
    excerpt: 'Los principios más importantes para diseñar sistemas escalables y mantenibles.',
    content: '<p>Un buen sistema de diseño...</p>',
    status: 'published', authorId: '2', author: mockUsers[1],
    categoryId: '2', category: mockCategories[1], tags: [mockTags[3], mockTags[7]],
    featuredImage: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&q=80',
    publishedAt: '2026-02-18', createdAt: '2026-02-15', updatedAt: '2026-02-18',
    views: 3208, readTime: 6,
  },
  {
    id: '3', title: 'TypeScript avanzado: Tipos genéricos', slug: 'typescript-avanzado-tipos-genericos',
    excerpt: 'Aprende a dominar los tipos genéricos en TypeScript para escribir código más robusto.',
    content: '<p>Los tipos genéricos en TypeScript...</p>',
    status: 'draft', authorId: '3', author: mockUsers[2],
    categoryId: '5', category: mockCategories[4], tags: [mockTags[1], mockTags[4]],
    featuredImage: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&q=80',
    createdAt: '2026-02-22', updatedAt: '2026-02-25',
    views: 0, readTime: 10,
  },
  {
    id: '4', title: 'SEO en 2026: Las nuevas reglas', slug: 'seo-2026-nuevas-reglas',
    excerpt: 'Los algoritmos han cambiado. Descubre qué funciona hoy en SEO.',
    content: '<p>El SEO moderno...</p>',
    status: 'scheduled', authorId: '2', author: mockUsers[1],
    categoryId: '4', category: mockCategories[3], tags: [mockTags[6]],
    featuredImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    scheduledAt: '2026-03-01', createdAt: '2026-02-24', updatedAt: '2026-02-26',
    views: 0, readTime: 7,
  },
  {
    id: '5', title: 'Node.js con Express: API REST completa', slug: 'nodejs-express-api-rest',
    excerpt: 'Construye una API REST profesional con Node.js, Express y MongoDB.',
    content: '<p>En este tutorial...</p>',
    status: 'published', authorId: '4', author: mockUsers[3],
    categoryId: '5', category: mockCategories[4], tags: [mockTags[2], mockTags[4]],
    featuredImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
    publishedAt: '2026-02-10', createdAt: '2026-02-08', updatedAt: '2026-02-10',
    views: 6102, readTime: 12,
  },
  {
    id: '6', title: 'Tendencias de UX para 2026', slug: 'tendencias-ux-2026',
    excerpt: 'Las tendencias de diseño de experiencia de usuario que dominarán este año.',
    content: '<p>El diseño UX evoluciona...</p>',
    status: 'archived', authorId: '1', author: mockUsers[0],
    categoryId: '2', category: mockCategories[1], tags: [mockTags[7]],
    featuredImage: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&q=80',
    publishedAt: '2025-12-15', createdAt: '2025-12-10', updatedAt: '2025-12-15',
    views: 2890, readTime: 5,
  },
  {
    id: '7', title: 'Introducción a Python para Data Science', slug: 'python-data-science',
    excerpt: 'Comienza tu camino en Data Science con Python desde cero.',
    content: '<p>Python es el lenguaje preferido...</p>',
    status: 'published', authorId: '3', author: mockUsers[2],
    categoryId: '5', category: mockCategories[4], tags: [mockTags[5]],
    featuredImage: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&q=80',
    publishedAt: '2026-02-05', createdAt: '2026-02-01', updatedAt: '2026-02-05',
    views: 5234, readTime: 9,
  },
  {
    id: '8', title: 'Estrategias de marketing digital B2B', slug: 'marketing-digital-b2b',
    excerpt: 'Cómo generar leads de calidad y cerrar más ventas en el mercado B2B.',
    content: '<p>El marketing B2B requiere...</p>',
    status: 'draft', authorId: '4', author: mockUsers[3],
    categoryId: '4', category: mockCategories[3], tags: [mockTags[6]],
    featuredImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80',
    createdAt: '2026-02-26', updatedAt: '2026-02-27',
    views: 0, readTime: 6,
  },
];

export const mockMedia: MediaItem[] = [
  { id: '1', name: 'hero-banner.jpg', type: 'image', url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400', thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=200', size: 245760, dimensions: { width: 1920, height: 1080 }, alt: 'Hero banner', uploadedBy: '1', uploadedAt: '2026-02-20', usedIn: 3 },
  { id: '2', name: 'design-systems.jpg', type: 'image', url: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400', thumbnail: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=200', size: 189440, dimensions: { width: 1600, height: 900 }, alt: 'Design systems', uploadedBy: '2', uploadedAt: '2026-02-18', usedIn: 1 },
  { id: '3', name: 'typescript-code.jpg', type: 'image', url: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=400', thumbnail: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=200', size: 312320, dimensions: { width: 1920, height: 1280 }, alt: 'TypeScript code', uploadedBy: '3', uploadedAt: '2026-02-22', usedIn: 1 },
  { id: '4', name: 'seo-analytics.jpg', type: 'image', url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400', thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200', size: 198656, dimensions: { width: 1800, height: 1200 }, alt: 'SEO Analytics', uploadedBy: '2', uploadedAt: '2026-02-24', usedIn: 1 },
  { id: '5', name: 'nodejs-server.jpg', type: 'image', url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400', thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=200', size: 276480, dimensions: { width: 1920, height: 1080 }, alt: 'Node.js server', uploadedBy: '4', uploadedAt: '2026-02-08', usedIn: 1 },
  { id: '6', name: 'annual-report.pdf', type: 'document', url: '#', size: 2048000, uploadedBy: '1', uploadedAt: '2026-02-15', usedIn: 0 },
  { id: '7', name: 'python-data.jpg', type: 'image', url: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400', thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=200', size: 221184, dimensions: { width: 1600, height: 1066 }, alt: 'Python data', uploadedBy: '3', uploadedAt: '2026-02-01', usedIn: 1 },
  { id: '8', name: 'marketing-chart.jpg', type: 'image', url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400', thumbnail: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=200', size: 167936, dimensions: { width: 1800, height: 1200 }, alt: 'Marketing chart', uploadedBy: '4', uploadedAt: '2026-02-26', usedIn: 1 },
  { id: '9', name: 'intro-video.mp4', type: 'video', url: '#', thumbnail: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=200', size: 52428800, uploadedBy: '1', uploadedAt: '2026-01-20', usedIn: 2 },
  { id: '10', name: 'podcast-ep1.mp3', type: 'audio', url: '#', size: 10485760, uploadedBy: '2', uploadedAt: '2026-02-12', usedIn: 0 },
  { id: '11', name: 'ux-trends.jpg', type: 'image', url: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=400', thumbnail: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=200', size: 203776, dimensions: { width: 1920, height: 1280 }, alt: 'UX Trends', uploadedBy: '1', uploadedAt: '2025-12-10', usedIn: 1 },
  { id: '12', name: 'presentation.pptx', type: 'document', url: '#', size: 5242880, uploadedBy: '3', uploadedAt: '2026-02-19', usedIn: 0 },
];

export const mockActivity: ActivityItem[] = [
  { id: '1', type: 'post_published', message: 'publicó "Guía completa de React 19"', user: { id: '1', name: 'Ana García', avatar: 'https://i.pravatar.cc/150?img=47' }, timestamp: '2026-02-27T10:30:00' },
  { id: '2', type: 'user_registered', message: 'se unió al equipo como Editor', user: { id: '6', name: 'Pedro Jiménez', avatar: 'https://i.pravatar.cc/150?img=68' }, timestamp: '2026-02-27T09:15:00' },
  { id: '3', type: 'media_uploaded', message: 'subió 3 imágenes a la biblioteca', user: { id: '3', name: 'María Rodríguez', avatar: 'https://i.pravatar.cc/150?img=32' }, timestamp: '2026-02-26T16:45:00' },
  { id: '4', type: 'post_updated', message: 'actualizó "TypeScript avanzado: Tipos genéricos"', user: { id: '3', name: 'María Rodríguez', avatar: 'https://i.pravatar.cc/150?img=32' }, timestamp: '2026-02-26T14:20:00' },
  { id: '5', type: 'post_created', message: 'creó el borrador "Estrategias de marketing B2B"', user: { id: '4', name: 'José Martínez', avatar: 'https://i.pravatar.cc/150?img=15' }, timestamp: '2026-02-26T11:00:00' },
  { id: '6', type: 'post_published', message: 'programó "SEO en 2026: Las nuevas reglas"', user: { id: '2', name: 'Carlos López', avatar: 'https://i.pravatar.cc/150?img=12' }, timestamp: '2026-02-25T15:30:00' },
];

export const mockStats: DashboardStats = {
  totalPosts: mockPosts.length,
  publishedPosts: mockPosts.filter(p => p.status === 'published').length,
  draftPosts: mockPosts.filter(p => p.status === 'draft').length,
  totalUsers: mockUsers.length,
  totalViews: mockPosts.reduce((acc, p) => acc + p.views, 0),
  totalMedia: mockMedia.length,
  viewsThisMonth: 28540,
  newUsersThisMonth: 3,
};

export const chartData = {
  views: [
    { month: 'Sep', views: 12400 },
    { month: 'Oct', views: 15800 },
    { month: 'Nov', views: 14200 },
    { month: 'Dic', views: 18900 },
    { month: 'Ene', views: 22100 },
    { month: 'Feb', views: 28540 },
  ],
  postsByCategory: mockCategories.map(c => ({ name: c.name, value: c.postCount, color: c.color })),
};
