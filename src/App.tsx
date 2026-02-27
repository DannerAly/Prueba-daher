import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PostsList from './pages/posts/PostsList';
import PostForm from './pages/posts/PostForm';
import PostView from './pages/posts/PostView';
import MediaLibrary from './pages/media/MediaLibrary';
import UsersList from './pages/users/UsersList';
import Categories from './pages/categories/Categories';
import Settings from './pages/settings/Settings';

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route element={isAuthenticated ? <Layout /> : <Navigate to="/login" replace />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/posts" element={<PostsList />} />
        <Route path="/posts/new" element={<PostForm />} />
        <Route path="/posts/:id" element={<PostView />} />
        <Route path="/posts/:id/edit" element={<PostForm />} />
        <Route path="/media" element={<MediaLibrary />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/tags" element={<Navigate to="/categories" replace />} />
        <Route path="/users" element={<UsersList />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
