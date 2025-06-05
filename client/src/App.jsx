import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './app/pages/login';
import DashboardAdmin from './app/pages/homeAdmin';
import VistaUsuarios from './app/pages/users';
import VistaPedidos from './app/pages/pedidos';
import DashboardMesero from './app/pages/homeMesero';
import PedidosMesero from './app/pages/pedidosMesero';
import GestionMenu from './app/pages/menu';
import GestionMeseros from './app/pages/meseros'; // Nueva importación
import GestionMesas from './app/pages/mesas'; // Nueva importación


export default function App() {

    const login = async (newLogin) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newLogin),
    });
  if (!res.ok) {
    throw new Error("Login failed");
  }
  return res.json(); // return user or token or whatever you need
};

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login setIsLoggedIn={login} />} />
        <Route path="/home" element={<DashboardAdmin />} />
        <Route path="/homeMesero" element={<DashboardMesero />} />
        <Route path="/usuarios" element={<VistaUsuarios />} />
        <Route path="/pedidos" element={<VistaPedidos />} />
        <Route path="/menu" element={<GestionMenu />} />
        <Route path="/meseros" element={<GestionMeseros />} /> {/* Nueva ruta */}
        <Route path="/mesas" element={<GestionMesas />} /> {/* Nueva ruta */}
        <Route path="/pedidosMesero/:id" element={<PedidosMesero />} />
        {/* Puedes agregar más rutas aquí */}
      </Routes>
    </Router>
  );
}
