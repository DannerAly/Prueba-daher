import { useState, useMemo } from 'react';
import {
  Plus, Search, Edit2, Trash2, MoreVertical,
  CheckCircle, XCircle, Mail, UserCheck
} from 'lucide-react';
import { mockUsers } from '../../data/mockData';
import type { User, UserRole } from '../../types';
import { formatDate, formatRelativeTime, roleLabels } from '../../utils/helpers';
import Avatar from '../../components/ui/Avatar';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';

const roleColors: Record<UserRole, string> = {
  admin: 'badge-red',
  editor: 'badge-blue',
  author: 'badge-purple',
  viewer: 'badge-gray',
};

const roleOptions: UserRole[] = ['admin', 'editor', 'author', 'viewer'];

interface UserFormData {
  name: string;
  email: string;
  role: UserRole;
  status: 'active' | 'inactive';
}

const emptyForm: UserFormData = { name: '', email: '', role: 'author', status: 'active' };

export default function UsersList() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<UserFormData>(emptyForm);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let result = [...users];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
    }
    if (roleFilter !== 'all') result = result.filter(u => u.role === roleFilter);
    return result;
  }, [users, search, roleFilter]);

  const openCreate = () => {
    setEditingUser(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (user: User) => {
    setEditingUser(user);
    setForm({ name: user.name, email: user.email, role: user.role, status: user.status });
    setModalOpen(true);
    setOpenMenu(null);
  };

  const handleSave = () => {
    if (!form.name || !form.email) return;
    if (editingUser) {
      setUsers(prev => prev.map(u => u.id === editingUser.id ? { ...u, ...form } : u));
    } else {
      const newUser: User = {
        id: Date.now().toString(),
        ...form,
        createdAt: new Date().toISOString(),
      };
      setUsers(prev => [...prev, newUser]);
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const counts = useMemo(() => ({
    all: users.length,
    admin: users.filter(u => u.role === 'admin').length,
    editor: users.filter(u => u.role === 'editor').length,
    author: users.filter(u => u.role === 'author').length,
    viewer: users.filter(u => u.role === 'viewer').length,
    active: users.filter(u => u.status === 'active').length,
  }), [users]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Usuarios</h2>
          <p className="text-sm text-gray-500">{counts.active} activos de {users.length} total</p>
        </div>
        <button className="btn-primary" onClick={openCreate}>
          <Plus className="w-4 h-4" /> Nuevo usuario
        </button>
      </div>

      {/* Stats mini */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(roleOptions).map(role => (
          <div
            key={role}
            className={`card p-3 cursor-pointer transition-all ${roleFilter === role ? 'ring-2 ring-blue-500' : 'hover:shadow-md'}`}
            onClick={() => setRoleFilter(prev => prev === role ? 'all' : role)}
          >
            <p className="text-xl font-bold text-gray-900">{counts[role as keyof typeof counts]}</p>
            <p className="text-xs text-gray-500 mt-0.5">{roleLabels[role]}s</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar usuarios..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input pl-9"
          />
        </div>
        <select
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value as UserRole | 'all')}
          className="select w-44"
        >
          <option value="all">Todos los roles</option>
          {roleOptions.map(role => (
            <option key={role} value={role}>{roleLabels[role]}</option>
          ))}
        </select>
      </div>

      {/* Users grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(user => (
          <div key={user.id} className="card p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <Avatar src={user.avatar} name={user.name} size="lg" />
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{user.name}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Mail className="w-3 h-3" /> {user.email}
                  </p>
                </div>
              </div>

              <div className="relative">
                <button
                  className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"
                  onClick={() => setOpenMenu(prev => prev === user.id ? null : user.id)}
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
                {openMenu === user.id && (
                  <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-xl shadow-xl border border-gray-200 z-10 py-1 fade-in">
                    <button className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => openEdit(user)}>
                      <Edit2 className="w-3.5 h-3.5" /> Editar
                    </button>
                    <button className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <Mail className="w-3.5 h-3.5" /> Enviar email
                    </button>
                    <div className="border-t border-gray-100 my-1" />
                    <button
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                      onClick={() => { setDeleteId(user.id); setOpenMenu(null); }}
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Eliminar
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={roleColors[user.role]}>{roleLabels[user.role]}</span>
                {user.status === 'active' ? (
                  <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                    <CheckCircle className="w-3 h-3" /> Activo
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs text-gray-400 font-medium">
                    <XCircle className="w-3 h-3" /> Inactivo
                  </span>
                )}
              </div>
            </div>

            {user.lastLogin && (
              <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                <UserCheck className="w-3 h-3" /> Último acceso: {formatRelativeTime(user.lastLogin)}
              </p>
            )}

            <p className="text-xs text-gray-400 mt-0.5">
              Miembro desde {formatDate(user.createdAt, { month: 'long', year: 'numeric' })}
            </p>
          </div>
        ))}
      </div>

      {/* User form modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingUser ? 'Editar usuario' : 'Nuevo usuario'}
        size="md"
        footer={
          <>
            <button className="btn-secondary btn-sm" onClick={() => setModalOpen(false)}>Cancelar</button>
            <button className="btn-primary btn-sm" onClick={handleSave}>
              {editingUser ? 'Guardar cambios' : 'Crear usuario'}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="label">Nombre completo *</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Nombre del usuario"
              className="input"
            />
          </div>
          <div>
            <label className="label">Correo electrónico *</label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
              placeholder="email@ejemplo.com"
              className="input"
            />
          </div>
          <div>
            <label className="label">Rol</label>
            <select
              value={form.role}
              onChange={e => setForm(prev => ({ ...prev, role: e.target.value as UserRole }))}
              className="select"
            >
              {roleOptions.map(role => (
                <option key={role} value={role}>{roleLabels[role]}</option>
              ))}
            </select>
            <div className="mt-2 p-3 bg-gray-50 rounded-lg text-xs text-gray-500 space-y-1">
              <p><strong>Administrador:</strong> Acceso completo al sistema</p>
              <p><strong>Editor:</strong> Puede publicar y editar todas las entradas</p>
              <p><strong>Autor:</strong> Solo puede gestionar sus propias entradas</p>
              <p><strong>Lector:</strong> Solo lectura</p>
            </div>
          </div>
          <div>
            <label className="label">Estado</label>
            <div className="flex gap-3">
              {(['active', 'inactive'] as const).map(status => (
                <label key={status} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value={status}
                    checked={form.status === status}
                    onChange={() => setForm(prev => ({ ...prev, status }))}
                    className="accent-blue-600"
                  />
                  <span className="text-sm text-gray-700 capitalize">
                    {status === 'active' ? 'Activo' : 'Inactivo'}
                  </span>
                </label>
              ))}
            </div>
          </div>
          {!editingUser && (
            <div>
              <label className="label">Contraseña temporal</label>
              <input type="password" placeholder="••••••••" className="input" />
              <p className="text-xs text-gray-400 mt-1">El usuario deberá cambiarla en su primer acceso</p>
            </div>
          )}
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && handleDelete(deleteId)}
        title="Eliminar usuario"
        message="¿Estás seguro de que quieres eliminar este usuario? Perderá acceso al sistema."
        confirmLabel="Eliminar"
        variant="danger"
      />

      {openMenu && (
        <div className="fixed inset-0 z-0" onClick={() => setOpenMenu(null)} />
      )}
    </div>
  );
}
