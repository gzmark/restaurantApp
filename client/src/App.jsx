import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './app/pages/login';
import DashboardAdmin from './app/pages/homeAdmin';
import VistaUsuarios from './app/pages/users';
import VistaPedidos from './app/pages/pedidos';
import DashboardMesero from './app/pages/homeMesero';
import PedidosMesero from './app/pages/pedidosMesero';
import GestionMenu from './app/pages/menu';
import GestionMeseros from './app/pages/meseros';
import GestionMesas from './app/pages/mesas';
import ProtectedRoute from "./app/components/ProtectedRoute";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta pública */}
        <Route path="/" element={<Login />} />

        {/* Rutas protegidas */}
        <Route path="/home" element={<ProtectedRoute><DashboardAdmin /></ProtectedRoute>} />
        <Route path="/homeMesero" element={<ProtectedRoute><DashboardMesero /></ProtectedRoute>} />
        <Route path="/usuarios" element={<ProtectedRoute><VistaUsuarios /></ProtectedRoute>} />
        <Route path="/pedidos" element={<ProtectedRoute><VistaPedidos /></ProtectedRoute>} />
        <Route path="/menu" element={<ProtectedRoute><GestionMenu /></ProtectedRoute>} />
        <Route path="/meseros" element={<ProtectedRoute><GestionMeseros /></ProtectedRoute>} />
        <Route path="/mesas" element={<ProtectedRoute><GestionMesas /></ProtectedRoute>} />
        <Route path="/pedidosMesero/:id" element={<ProtectedRoute><PedidosMesero /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}
