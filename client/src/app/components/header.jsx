'use client';

import React, { useState } from 'react';
import { MenuIcon } from 'lucide-react';
import Menu from '@/app/components/menu';
import { Link } from 'react-router-dom';

const HeaderDs = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Simulación de datos de usuario (esto lo reemplazas con backend luego)
  const userData = {
    fullName: 'Nombre del Usuario',
    role: 'Administrador' // o 'Mesero'
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="w-full bg-black py-4 px-8 shadow-md flex items-center justify-between relative z-20">
      {/* Sección izquierda */}
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleMenu}
          className="focus:outline-none"
          aria-label="Toggle menu"
        >
          <MenuIcon size={28} color="#ffffff" />
        </button>
        <div>
          <p className="text-2xl font-medium text-[#e9a839]">
            Bienvenido {userData.role}
          </p>
          <p className="text-lg font-medium text-[#ffffff]">{userData.fullName}</p>
        </div>
      </div>

      {/* Sección derecha */}
      <div className="flex items-center space-x-4">
        
          <img src="/Logo.png" alt="Logo" width="80" height="80" />
          <div className="flex flex-col items-start">
            <h1 className="text-3xl font-medium text-[#e9a839] font-montserrat-medium">
              Restaurante
            </h1>
          </div>
       
      </div>

      {/* Menú lateral */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-30 flex">
          <div
  className="absolute inset-0 backdrop-blur-sm bg-white/30"
  onClick={toggleMenu}
  aria-hidden="true"
></div>
          <div className="relative w-64 bg-white">
            <Menu onClose={toggleMenu} />
          </div>
        </div>
      )}
    </header>
  );
};

export default HeaderDs;
