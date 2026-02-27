export type UserRole = 'admin' | 'editor' | 'author' | 'viewer';
export type PostStatus = 'published' | 'draft' | 'scheduled' | 'archived';
export type MediaType = 'image' | 'video' | 'document' | 'audio';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  lastLogin?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  postCount: number;
  color: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  postCount: number;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  status: PostStatus;
  authorId: string;
  author: User;
  categoryId: string;
  category: Category;
  tags: Tag[];
  featuredImage?: string;
  publishedAt?: string;
  scheduledAt?: string;
  createdAt: string;
  updatedAt: string;
  views: number;
  readTime: number;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string;
  };
}

export interface MediaItem {
  id: string;
  name: string;
  type: MediaType;
  url: string;
  thumbnail?: string;
  size: number;
  dimensions?: { width: number; height: number };
  alt?: string;
  uploadedBy: string;
  uploadedAt: string;
  usedIn: number;
}

export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  badge?: number;
  children?: MenuItem[];
}

export interface DashboardStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalUsers: number;
  totalViews: number;
  totalMedia: number;
  viewsThisMonth: number;
  newUsersThisMonth: number;
}

export interface ActivityItem {
  id: string;
  type: 'post_created' | 'post_updated' | 'post_published' | 'user_registered' | 'media_uploaded' | 'comment_added';
  message: string;
  user: Pick<User, 'id' | 'name' | 'avatar'>;
  timestamp: string;
  link?: string;
}
