// pages/pedidos-mesero.jsx
import React, { useState, useEffect } from 'react';
import HeaderDs from '@/app/components/header';
import Menu from '@/app/components/menu';
import { useParams } from 'react-router-dom';
import { Plus, X, Utensils } from 'lucide-react';
import { fetchProductos, crearPedido, registrarPago } from '@/api/api';

const PedidosMesero = () => {
  const { id } = useParams();  // id de la mesa
  const mesaSeleccionada = `Mesa ${id}`;

  // const [productos, setProductos] = useState([
  //   { id: 1, nombre: 'Pizza', tipo: 'comida', costo: 120, cantidad: 1 },
  //   { id: 2, nombre: 'Coca Cola', tipo: 'bebida', costo: 30, cantidad: 2 },
  // ]);

  const [productosDisponibles, setProductosDisponibles] = useState([]);
  const [pedido, setPedido] = useState([]);
  const [mostrarResumen, setMostrarResumen] = useState(false);
  const [metodoPago, setMetodoPago] = useState('');
  //const [mostrarPago, setMostrarPago] = useState(false);
  const [montoPagado, setMontoPagado] = useState('');
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const [mostrarVentanaPago, setMostrarVentanaPago] = useState(false);

    useEffect(() => {
    fetchProductos()
      .then(data => setProductosDisponibles(data.filter(p => p.disponible)))
      .catch(err => console.error('Error al obtener productos:', err));
  }, []);

  const agregarProducto = (producto) => {
    const existente = pedido.find(p => p._id === producto._id);
    if (existente) {
      setPedido(prev => prev.map(p => p._id === producto._id ? { ...p, cantidad: p.cantidad + 1 } : p));
    } else {
      setPedido(prev => [...prev, { ...producto, cantidad: 1 }]);
    }
  };

  const aumentar = (id) => setPedido(pedido.map(p => p._id === id ? { ...p, cantidad: p.cantidad + 1 } : p));
  const disminuir = (id) => setPedido(pedido.map(p => p._id === id && p.cantidad > 1 ? { ...p, cantidad: p.cantidad - 1 } : p));
  const eliminar = (id) => setPedido(pedido.filter(p => p._id !== id));

  const totalPedido = pedido.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
  const cambio = montoPagado ? parseFloat(montoPagado) - totalPedido : 0;

    const enviarPedido = async () => {
    try {
      const payload = {
        mesa: id,
        productos: pedido.map(p => ({ producto: p._id, cantidad: p.cantidad })),
        total: totalPedido,
        estado: 'activo'
      };
      const nuevoPedido = await crearPedido(payload);
      // para simular que se paga directamente tras crear pedido
      await registrarPago({
        pedido: nuevoPedido._id,
        metodo: metodoPago,
        monto: totalPedido,
        status: 'pagado'
      });
      alert('Pedido enviado y pago registrado con éxito');
      setPedido([]);
      setMostrarResumen(false);
      setMostrarVentanaPago(false);
    } catch (err) {
      console.error('Error al enviar pedido:', err);
      alert('Error al guardar el pedido');
    }
  };

const resumen = pedido.reduce((acc, p) => {
  const categoria = p.categoria; // o p.producto.categoria si usas populate
  if (!acc[categoria]) acc[categoria] = { cantidad: 0, total: 0 };
  acc[categoria].cantidad += p.cantidad;
  acc[categoria].total += p.precio * p.cantidad;
  return acc;
}, {});

   return (
    <div className="flex relative">
      {mostrarMenu && (
        <div className="hidden md:block">
          <Menu onClose={() => setMostrarMenu(false)} />
        </div>
      )}
      <div className="flex-1">
        <HeaderDs onMenuClick={() => setMostrarMenu(true)} />

        <main className="p-6 bg-gray-800 min-h-screen">
          <h2 className="text-2xl font-bold text-[#f3ca52] mb-2">Pedidos</h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Productos disponibles */}
            <div className="lg:col-span-2">
              <h3 className="text-white mb-3 font-semibold">Menú</h3>
              <div className="grid grid-cols-1  sm:grid-cols-2 md:grid-cols-3 gap-3 mb-4 items-center bg-green-600 text-black px-4 py-2 rounded-lg hover:bg-green-700">
                {productosDisponibles.map(p => (
                  <button
                    key={p._id}
                    onClick={() => agregarProducto(p)}
                    className="flex justify-between items-center bg-white px-4 py-2 rounded-lg hover:bg-gray-100"
                  >
                    <span>{p.nombre}</span>
                    <span>${p.precio}</span>
                  </button>
                ))}
              </div>

              {/* Tabla del pedido */}
              <table className="w-full mt-6 bg-white shadow rounded-xl overflow-hidden">
                <thead className="bg-[#2d2f34] text-white">
                  <tr>
                    <th className="p-3 text-left">Producto</th>
                    <th>Cantidad</th>
                    <th>Total</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {pedido.map(p => (
                    <tr key={p._id} className="text-center border-b">
                      <td className="p-2 text-left">{p.nombre}</td>
                      <td>
                        <div className="flex justify-center items-center gap-2">
                          <button onClick={() => disminuir(p._id)} className="px-2 bg-gray-200 rounded">-</button>
                          {p.cantidad}
                          <button onClick={() => aumentar(p._id)} className="px-2 bg-gray-200 rounded">+</button>
                        </div>
                      </td>
                      <td>${(p.precio * p.cantidad).toFixed(2)}</td>
                      <td>
                        <button onClick={() => eliminar(p._id)} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-700">Eliminar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Resumen y pago */}
            <div className="bg-gray-800 p-4 rounded-xl shadow h-fit text-white border-1 border-black">
              <div className="flex items-center gap-2 mb-4 text-[#e07a35]">
                <Utensils />
                <span className="font-semibold text-3xl">Pedido de la {mesaSeleccionada}</span>
              </div>
              <button
                onClick={() => setMostrarResumen(true)}
                disabled={pedido.length === 0}
                className="w-full bg-gradient-to-r from-orange-500 to-yellow-400 text-black py-2 rounded-lg mb-4 hover:opacity-90 disabled:bg-gray-400"
              >
                Cobrar
              </button>

              {mostrarResumen && (
                <div className="space-y-3">
                  {Object.entries(resumen).map(([tipo, info]) => {
                    return (
                      <div key={tipo} className="flex justify-between">
                        <span>{tipo.charAt(0).toUpperCase() + tipo.slice(1)}</span>
                        <span>{info.cantidad} x ${info.total}</span>
                      </div>
                    );
                  })}
                  <hr className="my-2 border-[#f3ca52]" />
                  <div className="text-lg font-bold text-right text-white">Importe Total: ${totalPedido.toFixed(2)}</div>

                  <p className="mt-4 font-semibold">Método de Pago:</p>
                  <div className="flex gap-2">
                    <button onClick={() => setMetodoPago('efectivo')} className={`px-4 py-1 rounded ${metodoPago === 'efectivo' ? 'bg-[#f3ca52] text-white' : 'bg-gray-200 text-black'}`}>Efectivo</button>
                    <button onClick={() => setMetodoPago('tarjeta')} className={`px-4 py-1 rounded ${metodoPago === 'tarjeta' ? 'bg-[#f3ca52] text-white' : 'bg-gray-200 text-black'}`}>Tarjeta</button>
                  </div>

                  <button
                    onClick={() => setMostrarVentanaPago(true)}
                    disabled={!metodoPago}
                    className={`mt-4 w-full py-2 rounded-lg ${metodoPago ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                  >
                    Pagar
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Ventana de pago */}
        {mostrarVentanaPago && (
          <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-white/30 z-50">
            <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg relative">
              <button
                onClick={() => setMostrarVentanaPago(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
              <h3 className="text-xl font-bold mb-4 text-center">Procesar Pago</h3>
              <p className="mb-2 text-center text-lg">Total: <strong>${totalPedido.toFixed(2)}</strong></p>
              <input
                type="number"
                placeholder="Dinero recibido"
                value={montoPagado}
                onChange={(e) => setMontoPagado(e.target.value)}
                className="w-full p-2 border rounded mb-2"
              />
              {montoPagado && (
                <p className="mb-4 text-center">Cambio: <strong>${cambio.toFixed(2)}</strong></p>
              )}
              <div className="text-center">
                <button
                  onClick={enviarPedido}
                  disabled={!montoPagado || cambio < 0}
                  className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PedidosMesero;