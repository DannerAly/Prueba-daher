import { Clock } from 'lucide-react';

export default function Otros() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-6">
        <Clock className="w-10 h-10 text-blue-600" />
      </div>
      <h1 className="text-4xl font-bold text-gray-800 mb-3">Próximamente</h1>
      <p className="text-gray-500 text-lg max-w-md">
        Estamos trabajando en algo nuevo. Esta sección estará disponible muy pronto.
      </p>
    </div>
  );
}
