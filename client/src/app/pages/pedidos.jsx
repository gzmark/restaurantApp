import React, { useState, useEffect } from 'react';
import HeaderDs from '../components/header';
import { fetchPedidos, eliminarPedido } from '@/api/api';
import { Trash2, Search } from 'lucide-react';

// const pedidosMock = [
//   {
//     id: 1,
//     mesaId: 'M01',
//     mesero: 'Carlos López',
//     fecha: '2025-06-01',
//     montoTotal: 450.00,
//     status: 'Finalizado',
//   },
//   {
//     id: 2,
//     mesaId: 'M02',
//     mesero: 'Laura Pérez',
//     fecha: '2025-06-01',
//     montoTotal: 220.50,
//     status: 'Pendiente',
//   },
//   {
//     id: 3,
//     mesaId: 'M03',
//     mesero: 'Ana García',
//     fecha: '2025-05-31',
//     montoTotal: 700.00,
//     status: 'Finalizado',
//   },
// ];

const VistaPedidos = () => {
  const [busqueda, setBusqueda] = useState('');
  const [pedidos, setPedidos] = useState([]);

    useEffect(() => {
    fetchPedidos()
      .then(setPedidos)
      .catch(err => console.error('Error al obtener pedidos:', err));
  }, []);

  const handleEliminar = async (id) => {
    try {
      await eliminarPedido(id);
      setPedidos(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      console.error('Error al eliminar pedido:', err);
    }
  };

  const pedidosFiltrados = pedidos.filter((pedido) =>
    JSON.stringify(pedido).toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#FFF9ED] to-[#f0f4f8]">
      <HeaderDs />

      <main className="p-6 bg-[#1b1b1a] min-h-screen text-white">
        <h1 className="text-3xl font-bold mb-6 text-[#f3ca52]">Pedidos</h1>

        {/* Buscador */}
        <div className="flex items-center mb-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute top-2.5 left-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar pedido..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="pl-10 pr-4 py-2 w-full bg-[#2d2f34] text-white rounded-md border border-[#444] focus:outline-none focus:ring-2 focus:ring-[#f3ca52]"
            />
          </div>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto rounded-lg shadow-lg bg-[#2d2f34]">
          <table className="min-w-full text-sm">
            <thead className="bg-[#3a3a3a] text-[#f3ca52]">
              <tr>
                <th className="px-4 py-3 text-left"># Pedido</th>
                <th className="px-4 py-3 text-left">Mesa</th>
                <th className="px-4 py-3 text-left">Mesero</th>
                <th className="px-4 py-3 text-left">Fecha</th>
                <th className="px-4 py-3 text-left">Total</th>
                <th className="px-4 py-3 text-left">Estado</th>
                <th className="px-4 py-3 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pedidosFiltrados.map((pedido, index) => (
                <tr key={pedido._id} className="border-b border-[#444]">
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3">Mesa {pedido.mesa?.numero || 'N/A'}</td>
                  <td className="px-4 py-3">{pedido.mesero?.name || 'N/A'}</td>
                  <td className="px-4 py-3">{new Date(pedido.fecha).toLocaleDateString()}</td>
                  <td className="px-4 py-3">${pedido.total?.toFixed(2) || 0}</td>
                  <td className={`px-4 py-3 font-semibold ${pedido.estado === 'Finalizado' ? 'text-green-400' : 'text-yellow-400'}`}>
                    {pedido.estado}
                  </td>
                  <td className="px-4 py-3">
                    {pedido.estado === 'Finalizado' && (
                      <button
                        onClick={() => handleEliminar(pedido._id)}
                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md transition"
                      >
                        <Trash2 size={16} />
                        <span>Eliminar</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {pedidosFiltrados.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-6 text-gray-400">No se encontraron pedidos.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default VistaPedidos;
