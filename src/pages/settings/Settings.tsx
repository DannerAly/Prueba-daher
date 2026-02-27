import { useState } from 'react';
import {
  Globe, Bell, Shield, Palette, Database,
  Save, Check, RefreshCw, Mail, Smartphone
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../../components/ui/Avatar';

type TabId = 'general' | 'notifications' | 'security' | 'appearance' | 'advanced';

const tabs: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: 'general', label: 'General', icon: Globe },
  { id: 'notifications', label: 'Notificaciones', icon: Bell },
  { id: 'security', label: 'Seguridad', icon: Shield },
  { id: 'appearance', label: 'Apariencia', icon: Palette },
  { id: 'advanced', label: 'Avanzado', icon: Database },
];

export default function Settings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabId>('general');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Configuración</h2>
        <p className="text-sm text-gray-500">Gestiona la configuración de tu CMS</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-5">
        {/* Sidebar tabs */}
        <div className="lg:w-52 flex-shrink-0">
          <div className="card p-2 space-y-0.5">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left ${
                  activeTab === id
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-4">
          {activeTab === 'general' && (
            <>
              {/* Profile */}
              <div className="card p-5">
                <h3 className="font-semibold text-gray-900 mb-4">Perfil de usuario</h3>
                <div className="flex items-center gap-4 mb-5">
                  <Avatar src={user?.avatar} name={user?.name || 'User'} size="xl" />
                  <div>
                    <button className="btn-secondary btn-sm">Cambiar foto</button>
                    <p className="text-xs text-gray-400 mt-1">JPG, PNG. Máx 2MB</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Nombre</label>
                    <input type="text" defaultValue={user?.name} className="input" />
                  </div>
                  <div>
                    <label className="label">Email</label>
                    <input type="email" defaultValue={user?.email} className="input" />
                  </div>
                  <div>
                    <label className="label">Cargo / Bio</label>
                    <input type="text" placeholder="Ej: Editor de contenidos" className="input" />
                  </div>
                  <div>
                    <label className="label">Zona horaria</label>
                    <select className="select">
                      <option>UTC-6 (América Central)</option>
                      <option>UTC-5 (América del Este)</option>
                      <option>UTC+1 (Europa Central)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Site settings */}
              <div className="card p-5">
                <h3 className="font-semibold text-gray-900 mb-4">Información del sitio</h3>
                <div className="space-y-4">
                  <div>
                    <label className="label">Nombre del sitio</label>
                    <input type="text" defaultValue="ContentCMS" className="input" />
                  </div>
                  <div>
                    <label className="label">Descripción</label>
                    <textarea rows={2} defaultValue="Mi plataforma de contenidos" className="textarea" />
                  </div>
                  <div>
                    <label className="label">URL del sitio</label>
                    <input type="url" defaultValue="https://misitioweb.com" className="input" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">Entradas por página</label>
                      <select className="select">
                        {[5, 10, 15, 20, 25].map(n => <option key={n}>{n}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="label">Idioma</label>
                      <select className="select">
                        <option>Español</option>
                        <option>English</option>
                        <option>Français</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'notifications' && (
            <div className="card p-5 space-y-5">
              <h3 className="font-semibold text-gray-900">Preferencias de notificaciones</h3>

              {[
                { section: 'Email', icon: Mail, items: [
                  { label: 'Nueva entrada publicada', desc: 'Cuando se publica una nueva entrada en el sitio' },
                  { label: 'Nuevo usuario registrado', desc: 'Cuando un nuevo usuario se une al sistema' },
                  { label: 'Comentarios en entradas', desc: 'Cuando alguien comenta en una entrada' },
                  { label: 'Resumen semanal', desc: 'Informe semanal de actividad del sitio' },
                ]},
                { section: 'Push / App', icon: Smartphone, items: [
                  { label: 'Actualizaciones del sistema', desc: 'Actualizaciones importantes del CMS' },
                  { label: 'Menciones', desc: 'Cuando alguien te menciona en un comentario' },
                ]},
              ].map(({ section, icon: Icon, items }) => (
                <div key={section}>
                  <div className="flex items-center gap-2 mb-3">
                    <Icon className="w-4 h-4 text-gray-500" />
                    <h4 className="font-medium text-gray-900 text-sm">{section}</h4>
                  </div>
                  <div className="space-y-3">
                    {items.map(item => (
                      <div key={item.label} className="flex items-center justify-between py-2">
                        <div>
                          <p className="text-sm font-medium text-gray-800">{item.label}</p>
                          <p className="text-xs text-gray-500">{item.desc}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked className="sr-only peer" />
                          <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-4 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all" />
                        </label>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-gray-100 mt-3" />
                </div>
              ))}
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-4">
              <div className="card p-5">
                <h3 className="font-semibold text-gray-900 mb-4">Cambiar contraseña</h3>
                <div className="space-y-3 max-w-sm">
                  <div>
                    <label className="label">Contraseña actual</label>
                    <input type="password" placeholder="••••••••" className="input" />
                  </div>
                  <div>
                    <label className="label">Nueva contraseña</label>
                    <input type="password" placeholder="••••••••" className="input" />
                  </div>
                  <div>
                    <label className="label">Confirmar nueva contraseña</label>
                    <input type="password" placeholder="••••••••" className="input" />
                  </div>
                  <div className="pt-1">
                    <p className="text-xs text-gray-500 mb-2">La contraseña debe tener:</p>
                    <ul className="text-xs text-gray-500 space-y-1 ml-2">
                      <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-green-500" /> Mínimo 8 caracteres</li>
                      <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-green-500" /> Al menos una mayúscula</li>
                      <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-gray-300" /> Al menos un número</li>
                      <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-gray-300" /> Al menos un símbolo</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="card p-5">
                <h3 className="font-semibold text-gray-900 mb-1">Autenticación de dos factores</h3>
                <p className="text-sm text-gray-500 mb-4">Añade una capa extra de seguridad a tu cuenta</p>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">App autenticadora</p>
                      <p className="text-xs text-gray-500">Google Authenticator, Authy...</p>
                    </div>
                  </div>
                  <span className="badge-gray text-xs">No configurado</span>
                </div>
                <button className="btn-secondary btn-sm mt-3">Configurar 2FA</button>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="card p-5 space-y-5">
              <h3 className="font-semibold text-gray-900">Apariencia del panel</h3>
              <div>
                <label className="label">Tema</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'light', label: 'Claro', preview: 'bg-white border-gray-200' },
                    { value: 'dark', label: 'Oscuro', preview: 'bg-gray-900 border-gray-700' },
                    { value: 'auto', label: 'Sistema', preview: 'bg-gradient-to-r from-white to-gray-900 border-gray-400' },
                  ].map(theme => (
                    <label key={theme.value} className="cursor-pointer">
                      <input type="radio" name="theme" value={theme.value} defaultChecked={theme.value === 'light'} className="sr-only peer" />
                      <div className={`p-3 rounded-xl border-2 peer-checked:border-blue-500 transition-all ${theme.preview}`}>
                        <div className="w-full h-12 rounded-lg mb-2" style={{background: theme.value === 'dark' ? '#1e293b' : '#f1f5f9'}} />
                        <p className={`text-xs font-medium text-center ${theme.value === 'dark' ? 'text-white' : 'text-gray-700'}`}>{theme.label}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="label">Color de acento</label>
                <div className="flex gap-2 flex-wrap">
                  {['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'].map(color => (
                    <button
                      key={color}
                      className="w-8 h-8 rounded-full hover:scale-110 transition-transform ring-2 ring-offset-2"
                      style={{ backgroundColor: color, '--tw-ring-color': color } as React.CSSProperties}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="label">Densidad de la interfaz</label>
                <div className="flex gap-3">
                  {['Compacta', 'Normal', 'Cómoda'].map((d, i) => (
                    <label key={d} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="density" defaultChecked={i === 1} className="accent-blue-600" />
                      <span className="text-sm text-gray-700">{d}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'advanced' && (
            <div className="space-y-4">
              <div className="card p-5">
                <h3 className="font-semibold text-gray-900 mb-4">Caché y rendimiento</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Caché del sistema</p>
                      <p className="text-xs text-gray-500">Última limpieza: hace 3 días</p>
                    </div>
                    <button className="btn-secondary btn-sm">
                      <RefreshCw className="w-3.5 h-3.5" /> Limpiar caché
                    </button>
                  </div>
                </div>
              </div>

              <div className="card p-5">
                <h3 className="font-semibold text-gray-900 mb-4">Exportar / Importar</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button className="btn-secondary">Exportar contenido (JSON)</button>
                  <button className="btn-secondary">Exportar usuarios (CSV)</button>
                  <button className="btn-secondary">Importar contenido</button>
                  <button className="btn-secondary">Backup completo</button>
                </div>
              </div>

              <div className="card p-5 border-red-200">
                <h3 className="font-semibold text-red-700 mb-1">Zona de peligro</h3>
                <p className="text-sm text-gray-500 mb-4">Estas acciones son irreversibles. Procede con cuidado.</p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border border-red-200 rounded-lg bg-red-50">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Eliminar todos los borradores</p>
                      <p className="text-xs text-gray-500">Elimina permanentemente todas las entradas en borrador</p>
                    </div>
                    <button className="btn-danger btn-sm">Eliminar</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Save button */}
          <div className="flex justify-end">
            <button className="btn-primary" onClick={handleSave}>
              {saved ? <><Check className="w-4 h-4" /> ¡Guardado!</> : <><Save className="w-4 h-4" /> Guardar cambios</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
