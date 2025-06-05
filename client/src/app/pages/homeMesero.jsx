import React, { useEffect, useState } from 'react';
import HeaderDs from '@/app/components/header';
import Menu from '@/app/components/menu';
import { fetchMesas } from '@/api/api';
import { Link } from 'react-router-dom';
import { Menu as MenuIcon } from 'lucide-react';

const DashboardMesero = () => {
  const [mesas, setMesas] = useState([]);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    fetchMesas()
      .then(setMesas)
      .catch(err => console.error('Error al obtener mesas:', err));
  }, []);

  return (
    <div className="flex">
      {/* Sidebar menú oculto hasta que se abra */}
      {showMenu && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-40 md:bg-transparent md:static md:block">
          <Menu onClose={() => setShowMenu(false)} />
        </div>
      )}

      <div className="flex-1">
        {/* Header con botón para abrir menú */}
        <div className="flex items-center justify-between bg-gray-900 text-white p-4 shadow">
          <button
            onClick={() => setShowMenu(true)}
            className="md:hidden text-white hover:text-yellow-400"
          >
            <MenuIcon size={28} />
          </button>
          <HeaderDs />
        </div>

        <main className="p-6 bg-gray-900 min-h-screen">
          <h2 className="text-2xl font-bold mb-4 text-[#f3ca52]">Tus Mesas</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {mesas.map((mesa) => (
              <Link
                key={mesa.numero}
                to={`/pedidosMesero/${mesa.numero}`}
                className={`p-4 rounded-2xl shadow text-center font-semibold text-white transition-all duration-300 ${
                  mesa.estado === 'disponible' ? 'bg-green-500' :
                  mesa.estado === 'reservada' ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}
              >
                {`Mesa ${mesa.numero} - ${mesa.capacidad} Personas`}
              </Link>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardMesero;
