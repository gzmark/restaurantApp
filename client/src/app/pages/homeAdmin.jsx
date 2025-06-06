import React, { useState } from 'react';
import HeaderDs from '../components/header';
import Menu2 from '../components/menu2'; 
import { Link } from 'react-router-dom';
import { Menu as MenuIcon } from 'lucide-react';

const DashboardAdmin = () => {
  const [showMenu, setShowMenu] = useState(false); 

  return (
    <div className="flex">
      {/* Sidebar menú oculto hasta que se abra */}
      {showMenu && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-40 md:bg-transparent md:static md:block">
          <Menu2 onClose={() => setShowMenu(false)} />
        </div>
      )}

      <div className="flex-1 flex flex-col min-h-screen bg-gradient-to-br from-[#FFF9ED] to-[#f0f4f8]">
        {/* Header con botón de menú */}
        <div className="flex items-center justify-between bg-gray-900 text-white p-4 shadow">
          <button
            onClick={() => setShowMenu(true)}
            className="md:hidden text-white hover:text-yellow-400"
          >
            <MenuIcon size={28} />
          </button>
          <HeaderDs />
        </div>

        <main className="p-6 grid grid-cols-1 gap-6 bg-[#1b1b1a] min-h-screen text-white">
          <DashboardSection
            title="Meseros"
            description="Visualización, creación, edición y eliminación de los meseros que trabajan en el restaurante."
            to="/meseros"
            imageSrc="/meserosN.png"
          />
          <DashboardSection
            title="Mesas"
            description="Administración de mesas del restaurante: creación, estado y asignación."
            to="/mesas"
            imageSrc="/mesas.png"
          />
          <DashboardSection
            title="Menú"
            description="Gestión del menú del restaurante: platos, precios y categorías."
            to="/menu"
            imageSrc="/menu.png"
          />
          <DashboardSection
            title="Pedidos"
            description="Visualización y gestión de los pedidos realizados por los clientes."
            to="/pedidos"
            imageSrc="/pedidos.png"
          />
          <DashboardSection
            title="Usuarios"
            description="Administración de usuarios del sistema: roles, accesos y cuentas."
            to="/usuarios"
            imageSrc="/usuarioN.png"
          />
        </main>
      </div>
    </div>
  );
};

const DashboardSection = ({ title, description, to, imageSrc }) => (
  <div className="flex items-center gap-6 bg-[#2d2f34] p-4 rounded-xl shadow-md hover:shadow-lg transition-all">
    <Link
      to={to}
      className="flex items-center justify-center w-28 h-28 bg-[#e07a35] rounded-lg hover:bg-[#e07a35cc] transition"
    >
      <img src={imageSrc} alt={title} className="w-14 h-14 object-contain" />
    </Link>
    
    <div className="flex flex-col">
      <h2 className="text-2xl font-bold text-white">{title}</h2>
      <hr className="border-[#f3ca52] w-12 my-2" />
      <p className="text-sm text-[#ccc] max-w-md">{description}</p>
    </div>
  </div>
);

export default DashboardAdmin;
