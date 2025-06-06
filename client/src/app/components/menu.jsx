import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Home, Users, LayoutGrid, UtensilsCrossed, ClipboardList, 
  UserCog, LogOut, User, X 
} from 'lucide-react';

const Menu = ({ onClose }) => {
  const userData = {
    fullName: 'Nombre del Usuario',
    role: 'mesero', // 'mesero' o 'admin'
    imageUrl: 'usuarioN.png', // URL de la imagen del usuario
  };

  const handleLogout = () => {
    console.log('Cerrar sesión (a implementar)');
  };

  return (
    <div className="w-80 shadow-lg flex flex-col h-full overflow-y-auto max-h-screen relative">
      {/* Botón de cerrar */}
      <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
        <X size={24} />
      </button>

      {/* Usuario */}
      <div className="bg-gray-800 p-4 flex items-center space-x-3 border-b">
        {userData.imageUrl ? (
          <img src={userData.imageUrl} alt="Foto de usuario" width={50} height={50} className="rounded-full" />
        ) : (
          <User size={50} color="#e9a839" />
        )}
        <div className="space-y-1">
          <p className="text-lg font-semibold text-[#e9a839]">{userData.fullName}</p>
          <div className="w-full h-0.5 bg-[#ffffff] my-1"></div>
          <p className="text-sm font-medium text-[#ffffff]">
            {userData.role.charAt(0).toUpperCase() + userData.role.slice(1)}
          </p>
        </div>
      </div>

      {/* Menú */}
      <nav className="bg-gray-800 flex-1 space-y-2 p-4">

        {userData.role === 'mesero' && (
    <Link to="/homeMesero" className="flex items-center space-x-2 p-2 rounded-lg text-[#ffffff] hover:bg-[#e9a839]">
      <Home size={20} />
      <span>Inicio</span>
    </Link>
  )}
      

        {(userData.role === 'admin' || userData.role === 'gerente') && (
          <>
          <Link to="/home" className="flex items-center space-x-2 p-2 rounded-lg text-[#ffffff] hover:bg-[#e9a839]">
          <Home size={20} />
          <span>Inicio</span>
        </Link>
            <Link to="/meseros" className="flex items-center space-x-2 p-2 rounded-lg text-[#ffffff] hover:bg-[#e9a839]">
              <Users size={20} />
              <span>Meseros</span>
            </Link>
            <Link to="/mesas" className="flex items-center space-x-2 p-2 rounded-lg text-[#ffffff] hover:bg-[#e9a839]">
              <LayoutGrid size={20} />
              <span>Mesas</span>
            </Link>
            <Link to="/menu" className="flex items-center space-x-2 p-2 rounded-lg text-[#ffffff] hover:bg-[#e9a839]">
              <UtensilsCrossed size={20} />
              <span>Menú</span>
            </Link>
            <Link to="/pedidos" className="flex items-center space-x-2 p-2 rounded-lg text-[#ffffff] hover:bg-[#e9a839]">
              <ClipboardList size={20} />
              <span>Pedidos</span>
            </Link>
            <Link to="/usuarios" className="flex items-center space-x-2 p-2 rounded-lg text-[#ffffff] hover:bg-[#e9a839]">
              <UserCog size={20} />
              <span>Usuarios</span>
            </Link>
          </>
        )}

        <button onClick={handleLogout} className="flex items-center space-x-2 p-2 rounded-lg text-red-500 hover:bg-red-400 w-full">
          <LogOut size={20} />
          <span>Cerrar Sesión</span>
        </button>
      </nav>
    </div>
  );
};

export default Menu;
