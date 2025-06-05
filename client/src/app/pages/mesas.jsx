import React, { useState, useEffect } from 'react';
import HeaderDs from '@/app/components/header';
import Menu from '@/app/components/menu';
import { fetchMesas, fetchMesaById, fetchUsuarios, crearMesa, actualizarMesa, cambiarEstadoMesa, eliminarMesa as deleteTable } from '@/api/api';
import { Plus, Edit, Trash2, Coffee, Users, Clock, X, Save, CheckCircle, AlertCircle, UserCheck } from 'lucide-react';

const GestionMesas = () => {
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mesaEditando, setMesaEditando] = useState(null);
  const [meseros, setMeseros] = useState([]);
  const [mesas, setMesas] = useState([
    {
      id: 1,
      numero: '1',
      capacidad: 4,
      ubicacion: 'terraza',
      estado: 'disponible',
      meseroAsignado: 'Juan Pérez',
      clientesActuales: 0,
      fechaUltimaOcupacion: '2024-06-02',
      horaUltimaOcupacion: '14:30',
      observaciones: 'Mesa junto a la ventana'
    },
    {
      id: 2,
      numero: '2',
      capacidad: 2,
      ubicacion: 'interior',
      estado: 'ocupada',
      meseroAsignado: 'María García',
      clientesActuales: 2,
      fechaUltimaOcupacion: '2024-06-03',
      horaUltimaOcupacion: '13:15',
      observaciones: 'Mesa romántica'
    },
    {
      id: 3,
      numero: '3',
      capacidad: 6,
      ubicacion: 'terraza',
      estado: 'reservada',
      meseroAsignado: 'Juan Pérez',
      clientesActuales: 0,
      fechaUltimaOcupacion: '2024-06-03',
      horaUltimaOcupacion: '19:00',
      observaciones: 'Reserva para las 19:00'
    },
    {
      id: 4,
      numero: '4',
      capacidad: 8,
      ubicacion: 'salon-privado',
      estado: 'mantenimiento',
      meseroAsignado: null,
      clientesActuales: 0,
      fechaUltimaOcupacion: '2024-06-01',
      horaUltimaOcupacion: '20:45',
      observaciones: 'Reparación de silla'
    },
    {
      id: 5,
      numero: '5',
      capacidad: 4,
      ubicacion: 'interior',
      estado: 'disponible',
      meseroAsignado: 'María García',
      clientesActuales: 0,
      fechaUltimaOcupacion: '2024-06-02',
      horaUltimaOcupacion: '12:00',
      observaciones: ''
    }
  ]);


useEffect(() => {
  const cargarMeseros = async () => {
    try {
      const usuarios = await fetchUsuarios();
      const meserosFiltrados = usuarios.filter(u => u.role === 'mesero').map(m => ({ _id: m._id, name: m.name })); // o como lo manejes
      setMeseros(meserosFiltrados);//.map(m => m.name));
    } catch (error) {
      console.error('Error cargando meseros:', error);
    }
  };

  cargarMeseros();
}, []);
 
  
  useEffect(() => {
    const cargarMesas = async () => {
      try {
        const data = await fetchMesas();
        setMesas(data);
    } catch (error) {
      console.error('Error al cargar las mesas:', error);
      alert('No se pudieron cargar las mesas.');
    }
  };
  
  cargarMesas();
}, []);

  const [formularioData, setFormularioData] = useState({
    numero: '',
    capacidad: 2,
    ubicacion: 'interior',
    estado: 'disponible',
    meseroAsignado: '',
    clientesActuales: 0,
    observaciones: ''
  });

  const ubicaciones = ['interior', 'terraza', 'salon-privado', 'barra'];
  const estados = ['disponible', 'ocupada', 'reservada', 'mantenimiento', 'limpieza'];
  //const meseros = ['Juan Pérez', 'María García', 'Carlos López'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormularioData(prev => ({
      ...prev,
      [name]: name === 'capacidad' || name === 'clientesActuales' ? parseInt(value) || 0 : value
    }));
  };

  const abrirFormulario = (mesa = null) => {
    if (mesa) {
      setMesaEditando(mesa);
      setFormularioData({
        numero: mesa.numero,
        capacidad: mesa.capacidad,
        ubicacion: mesa.ubicacion,
        estado: mesa.estado,
        meseroAsignado: mesa.meseroAsignado?._id || mesa.meseroAsignado || '',
        clientesActuales: mesa.clientesActuales,
        observaciones: mesa.observaciones
      });
    } else {
      setMesaEditando(null);
      setFormularioData({
        numero: '',
        capacidad: 2,
        ubicacion: 'interior',
        estado: 'disponible',
        meseroAsignado: '',
        clientesActuales: 0,
        observaciones: ''
      });
    }
    setMostrarFormulario(true);
  };

  const cerrarFormulario = () => {
    setMostrarFormulario(false);
    setMesaEditando(null);
    setFormularioData({
      numero: '',
      capacidad: 2,
      ubicacion: 'interior',
      estado: 'disponible',
      meseroAsignado: '',
      clientesActuales: 0,
      observaciones: ''
    });
  };

  const guardarMesa = async () => {
    if (!formularioData.numero) {
      alert('Por favor ingresa el número de mesa');
      return;
    }

    // Verificar que el número no esté duplicado
    const numeroExiste = mesas.some(mesa => 
      mesa.numero === formularioData.numero && (!mesaEditando || mesa._id !== mesaEditando.id)
    );

    if (numeroExiste) {
      alert('Ya existe una mesa con ese número');
      return;
    }

    
  try {
    if (mesaEditando) {
      const mesaActualizada = await actualizarMesa(mesaEditando._id || mesaEditando.id, formularioData);
      setMesas(prev => prev.map(m => m._id === mesaActualizada._id ? mesaActualizada : m));
    } else {
      console.log('Datos que se envían:', formularioData);
      const nuevaMesa = await crearMesa(formularioData);
      setMesas(prev => [...prev, nuevaMesa]);
    }
    cerrarFormulario();
  } catch (err) {
    console.error('Error guardando mesa:', err);
    alert('Hubo un error al guardar la mesa.');
  }
  console.log("Se va a guardar la mesa:", formularioData);
  console.log("Se va a actualizar la mesa:", mesaEditando._id, formularioData);

};

  const eliminarMesa = async (id) => {
    const mesa = mesas.find(m => m._id === id);
    if (mesa && mesa.estado === 'ocupada') {
      alert('No se puede eliminar una mesa que está ocupada');
      return;
    }

      if (window.confirm('¿Estás seguro de que quieres eliminar esta mesa?')) {
    try {
      await deleteTable(id);
      setMesas(prev => prev.filter(m => m._id !== id));
    } catch (err) {
      console.error('Error eliminando mesa:', err);
      alert('No se pudo eliminar la mesa');
    }
  }
};

  const cambiarEstadoMesaFront = async (id, nuevoEstado) => {
      try {
    const mesaActualizada = await cambiarEstadoMesa(id, nuevoEstado);
    setMesas(prev => prev.map(m => m._id === id ? mesaActualizada : m));
  } catch (err) {
    console.error('Error cambiando estado:', err);
    alert('No se pudo cambiar el estado de la mesa');
  }
  };

  const getEstadoColor = (estado) => {
    const colores = {
      'disponible': 'bg-green-100 text-green-800',
      'ocupada': 'bg-red-100 text-red-800',
      'reservada': 'bg-yellow-100 text-yellow-800',
      //'mantenimiento': 'bg-orange-100 text-orange-800',
      //'limpieza': 'bg-blue-100 text-blue-800'
    };
    return colores[estado] || 'bg-gray-100 text-gray-800';
  };

  const getEstadoIcon = (estado) => {
    const iconos = {
      'disponible': <CheckCircle size={16} />,
      'ocupada': <Users size={16} />,
      'reservada': <Clock size={16} />,
      //'mantenimiento': <AlertCircle size={16} />,
      //'limpieza': <Coffee size={16} />
    };
    return iconos[estado] || <AlertCircle size={16} />;
  };

  // Estadísticas
  const mesasDisponibles = mesas.filter(m => m.estado === 'disponible').length;
  const mesasOcupadas = mesas.filter(m => m.estado === 'ocupada').length;
  const mesasReservadas = mesas.filter(m => m.estado === 'reservada').length;
  const capacidadTotal = mesas.reduce((total, mesa) => total + mesa.capacidad, 0);
  const clientesActuales = mesas.reduce((total, mesa) => total + mesa.clientesActuales, 0);

  const obtenerNombreMesero = (id) => {
  const mesero = meseros.find(m => m._id === id);
  return mesero ? mesero.name : 'Sin asignar';
};


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
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#f3ca52]">Gestión de Mesas</h2>
            <button 
              onClick={() => abrirFormulario()}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              <Plus size={20} /> Agregar Mesa
            </button>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-blue-600 text-white p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <Coffee size={24} />
                <div>
                  <p className="text-2xl font-bold">{mesas.length}</p>
                  <p className="text-sm">Total Mesas</p>
                </div>
              </div>
            </div>
            <div className="bg-green-600 text-white p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle size={24} />
                <div>
                  <p className="text-2xl font-bold">{mesasDisponibles}</p>
                  <p className="text-sm">Disponibles</p>
                </div>
              </div>
            </div>
            <div className="bg-red-600 text-white p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <Users size={24} />
                <div>
                  <p className="text-2xl font-bold">{mesasOcupadas}</p>
                  <p className="text-sm">Ocupadas</p>
                </div>
              </div>
            </div>
            <div className="bg-yellow-600 text-white p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <Clock size={24} />
                <div>
                  <p className="text-2xl font-bold">{mesasReservadas}</p>
                  <p className="text-sm">Reservadas</p>
                </div>
              </div>
            </div>
            <div className="bg-purple-600 text-white p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <UserCheck size={24} />
                <div>
                  <p className="text-2xl font-bold">{clientesActuales}/{capacidadTotal}</p>
                  <p className="text-sm">Ocupación</p>
                </div>
              </div>
            </div>
          </div>

          {/* Vista de tarjetas de mesas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
            {mesas.map(mesa => (
              <div key={mesa._id} className="bg-white rounded-xl shadow-lg p-4 hover:shadow-xl transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Mesa {mesa.numero}</h3>
                    <p className="text-sm text-gray-600 capitalize">{(mesa.ubicacion || '').replace('-', ' ')}</p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => abrirFormulario(mesa)}
                      className="text-blue-600 hover:text-blue-800 p-1"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => eliminarMesa(mesa._id)}
                      className="text-red-600 hover:text-red-800 p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg mb-3 ${getEstadoColor(mesa.estado)}`}>
                  {getEstadoIcon(mesa.estado)}
                  <span className="text-sm font-medium capitalize">{mesa.estado}</span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Capacidad:</span>
                    <span className="font-medium">{mesa.capacidad} personas</span>
                  </div>
                  
                  {mesa.estado === 'ocupada' && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Clientes:</span>
                      <span className="font-medium">{mesa.clientesActuales}</span>
                    </div>
                  )}

                  {mesa.meseroAsignado && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mesero:</span>
                      <span className="font-medium text-xs">{obtenerNombreMesero(mesa.meseroAsignado)}</span>
                    </div>
                  )}

                  {mesa.observaciones && (
                    <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                      <strong>Nota:</strong> {mesa.observaciones}
                    </div>
                  )}
                </div>

                {/* Acciones rápidas de estado */}
                <div className="mt-4 flex flex-wrap gap-1">
                  {estados.filter(estado => estado !== mesa.estado).map(estado => (
                    <button
                      key={estado}
                      onClick={() => cambiarEstadoMesaFront(mesa._id, estado)}
                      className={`px-2 py-1 text-xs rounded transition-colors ${
                        estado === 'disponible' ? 'bg-green-100 text-green-700 hover:bg-green-200' :
                        estado === 'ocupada' ? 'bg-red-100 text-red-700 hover:bg-red-200' :
                        estado === 'reservada' ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' :
                        estado === 'mantenimiento' ? 'bg-orange-100 text-orange-700 hover:bg-orange-200' :
                        'bg-blue-100 text-blue-700 hover:bg-blue-200'
                      }`}
                    >
                      {estado}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </main>

        {/* Modal de formulario */}
        {mostrarFormulario && (
          <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/50 z-50">
            <div className="bg-white p-6 rounded-xl w-full max-w-2xl shadow-lg relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={cerrarFormulario}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
              
              <h3 className="text-xl font-bold mb-4">
                {mesaEditando ? 'Editar Mesa' : 'Agregar Nueva Mesa'}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Número de Mesa *</label>
                  <input
                    type="text"
                    name="numero"
                    value={formularioData.numero}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg"
                    placeholder="1, 2, A1, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Capacidad *</label>
                  <input
                    type="number"
                    name="capacidad"
                    value={formularioData.capacidad}
                    onChange={handleInputChange}
                    min="1"
                    max="20"
                    className="w-full p-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Ubicación</label>
                  <select
                    name="ubicacion"
                    value={formularioData.ubicacion}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg"
                  >
                    {ubicaciones.map(ubicacion => (
                      <option key={ubicacion} value={ubicacion} className="capitalize">
                        {ubicacion.replace('-', ' ')}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Estado</label>
                  <select
                    name="estado"
                    value={formularioData.estado}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg"
                  >
                    {estados.map(estado => (
                      <option key={estado} value={estado} className="capitalize">
                        {estado}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Mesero Asignado</label>
                  <select
                    name="meseroAsignado"
                    value={formularioData.meseroAsignado}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="">Sin asignar</option>
                    {meseros.map(mesero => (
                      <option key={mesero._id} value={mesero._id}>
                        {mesero.name}
                      </option>
                    ))}
                  </select>
                </div>

                {formularioData.estado === 'ocupada' && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Clientes Actuales</label>
                    <input
                      type="number"
                      name="clientesActuales"
                      value={formularioData.clientesActuales}
                      onChange={handleInputChange}
                      min="0"
                      max={formularioData.capacidad}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
                )}
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium mb-1">Observaciones</label>
                <textarea
                  name="observaciones"
                  value={formularioData.observaciones}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Notas adicionales sobre la mesa..."
                />
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={cerrarFormulario}
                  className="px-4 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancelar
                </button>
                <button
                  onClick={guardarMesa}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <Save size={16} />
                  {mesaEditando ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GestionMesas;