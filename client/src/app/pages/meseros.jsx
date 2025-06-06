import React, { useState, useEffect } from 'react';
import HeaderDs from '@/app/components/header';
import Menu from '@/app/components/menu';
import { Plus, Edit, Trash2, Users, UserCheck, UserX, X, Save } from 'lucide-react';
import { fetchUsuarios, crearUsuario, eliminarUsuario, actualizarUsuario, fetchMesas  } from '@/api/api';

const GestionMeseros = () => {
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [meseroEditando, setMeseroEditando] = useState(null);
  const [mesasDisponibles, setMesasDisponibles] = useState([]);
  const [meseros, setMeseros] = useState([
    // {
    //   id: 1,
    //   nombre: 'Juan Pérez',
    //   email: 'juan@restaurante.com',
    //   telefono: '555-0123',
    //   estado: 'activo',
    //   mesasAsignadas: ['1', '2', '5'],
    //   fechaIngreso: '2024-01-15',
    //   turno: 'mañana'
    // },
    // {
    //   id: 2,
    //   nombre: 'María García',
    //   email: 'maria@restaurante.com',
    //   telefono: '555-0456',
    //   estado: 'activo',
    //   mesasAsignadas: ['3', '4', '6'],
    //   fechaIngreso: '2024-02-01',
    //   turno: 'tarde'
    // },
    // {
    //   id: 3,
    //   nombre: 'Carlos López',
    //   email: 'carlos@restaurante.com',
    //   telefono: '555-0789',
    //   estado: 'inactivo',
    //   mesasAsignadas: [],
    //   fechaIngreso: '2023-12-10',
    //   turno: 'noche'
    // }
  ]);

    const [formularioData, setFormularioData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    estado: 'activo',
    mesasAsignadas: [],
    turno: 'mañana',
    role: 'mesero',
    password: 'restaurante123'
  });

  //const mesasDisponibles = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
  const turnos = ['mañana', 'tarde', 'noche'];

  useEffect(() => {
  const cargarMesas = async () => {
    try {
      const mesas = await fetchMesas();
      setMesasDisponibles(mesas.map(m => m.numero)); // just get table numbers
    } catch (error) {
      console.error('Error al obtener mesas:', error);
    }
  };

  cargarMesas();
}, []);

  useEffect(() => {
    fetchUsuarios()
      .then(data => {
        const meserosFiltrados = data.filter(u => u.role === 'mesero');
        setMeseros(meserosFiltrados);
      })
      .catch(err => console.error('Error al obtener meseros:', err));
  }, []);

  const abrirFormulario = (mesero = null) => {
    if (mesero) {
      setMeseroEditando(mesero);
      setFormularioData({
        nombre: mesero.name,
        email: mesero.email,
        telefono: mesero.telefono,
        estado: mesero.estado,
        mesasAsignadas: mesero.mesasAsignadas || [],
        turno: mesero.turno || 'mañana',
        role: mesero.role,
        password: ''
      });
    } else {
      setMeseroEditando(null);
      setFormularioData({
        nombre: '',
        email: '',
        telefono: '',
        estado: 'activo',
        mesasAsignadas: [],
        turno: 'mañana',
        role: 'mesero',
        password: 'restaurante123'
      });
    }
    setMostrarFormulario(true);
  };

  const cerrarFormulario = () => {
    setMostrarFormulario(false);
    setMeseroEditando(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormularioData(prev => ({ ...prev, [name]: value }));
  };

  const handleMesasChange = (mesa) => {
    setFormularioData(prev => ({
      ...prev,
      mesasAsignadas: prev.mesasAsignadas.includes(mesa)
        ? prev.mesasAsignadas.filter(m => m !== mesa)
        : [...prev.mesasAsignadas, mesa]
    }));
  };

  const guardarMesero = async () => {
    const { nombre, email, telefono, password, estado, mesasAsignadas, turno } = formularioData;
    if (!nombre || !email || !telefono || (!meseroEditando && !password)) {
      alert('Completa todos los campos requeridos');
      return;
    }

    try {
      if (!meseroEditando) {
        const nuevo = await crearUsuario({
          name: nombre,
          email,
          password,
          telefono,
          role: 'mesero',
          estado,
          mesasAsignadas,
          turno
        });
        setMeseros(prev => [...prev, nuevo]);
      } else {
        const actualizado = await actualizarUsuario(meseroEditando._id, {
        name: nombre,
        email,
        telefono,
        role: 'mesero',
        estado,
        mesasAsignadas,
        turno,
        // Solo se actualiza la contraseña si se proporciona
        ...(password && { password })
      });
      setMeseros(prev =>
        prev.map(m => (m._id === actualizado._id ? actualizado : m))
      );
      }
      cerrarFormulario();
    } catch (error) {
      console.error('Error al guardar mesero:', error);
    }
  };

  const eliminarMesero = async (id) => {
    if (confirm('¿Eliminar este mesero?')) {
      try {
        await eliminarUsuario(id);
        setMeseros(prev => prev.filter(m => m._id !== id));
      } catch (error) {
        console.error('Error al eliminar mesero:', error);
      }
    }
  };

const cambiarEstado = async (id) => {
  const mesero = meseros.find(m => m._id === id);
  const nuevoEstado = mesero.estado === 'activo' ? 'inactivo' : 'activo';

  try {
    const actualizado = await actualizarUsuario(id, { estado: nuevoEstado });
    setMeseros(prev =>
      prev.map(m => (m._id === id ? actualizado : m))
    );
  } catch (error) {
    console.error('Error al cambiar estado:', error);
  }
};

  const meseroActivos = meseros.filter(m => m.estado === 'activo').length;
  const meseroInactivos = meseros.filter(m => m.estado === 'inactivo').length;

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
            <h2 className="text-2xl font-bold text-[#f3ca52]">Gestión de Meseros</h2>
            <button 
              onClick={() => abrirFormulario()}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              <Plus size={20} /> Agregar Mesero
            </button>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-600 text-white p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <Users size={24} />
                <div>
                  <p className="text-2xl font-bold">{meseros.length}</p>
                  <p className="text-sm">Total Meseros</p>
                </div>
              </div>
            </div>
            <div className="bg-green-600 text-white p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <UserCheck size={24} />
                <div>
                  <p className="text-2xl font-bold">{meseroActivos}</p>
                  <p className="text-sm">Meseros Activos</p>
                </div>
              </div>
            </div>
            <div className="bg-red-600 text-white p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <UserX size={24} />
                <div>
                  <p className="text-2xl font-bold">{meseroInactivos}</p>
                  <p className="text-sm">Meseros Inactivos</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabla de meseros */}
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-[#2d2f34] text-white">
                <tr>
                  <th className="p-3 text-left">Nombre</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Teléfono</th>
                  <th className="p-3 text-left">Turno</th>
                  <th className="p-3 text-left">Mesas Asignadas</th>
                  <th className="p-3 text-center">Estado</th>
                  <th className="p-3 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {meseros.map(mesero => (
                  <tr key={mesero._id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{mesero.name}</td>
                    <td className="p-3">{mesero.email}</td>
                    <td className="p-3">{mesero.telefono}</td>
                    <td className="p-3 capitalize">{mesero.turno}</td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {mesero.mesasAsignadas.map(mesa => (
                          <span key={mesa} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                            Mesa {mesa}
                          </span>
                        ))}
                        {mesero.mesasAsignadas.length === 0 && (
                          <span className="text-gray-500 text-sm">Sin mesas</span>
                        )}
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => cambiarEstado(mesero._id)}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          mesero.estado === 'activo' 
                            ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {mesero.estado}
                      </button>
                    </td>
                    <td className="p-3">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => abrirFormulario(mesero)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => eliminarMesero(mesero._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
                {meseroEditando ? 'Editar Mesero' : 'Agregar Nuevo Mesero'}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nombre *</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formularioData.nombre}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg"
                    placeholder="Nombre completo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formularioData.email}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg"
                    placeholder="email@restaurante.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Teléfono *</label>
                  <input
                    type="tel"
                    name="telefono"
                    value={formularioData.telefono}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg"
                    placeholder="555-0123"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Turno</label>
                  <select
                    name="turno"
                    value={formularioData.turno}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg"
                  >
                    {turnos.map(turno => (
                      <option key={turno} value={turno} className="capitalize">
                        {turno}
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
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                </div>
              </div>

              {meseroEditando && mesasDisponibles?.length > 0 && (
              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">Mesas Asignadas</label>
                <div className="grid grid-cols-5 gap-2">
                  {mesasDisponibles.map(mesa => (
                    <button
                      key={mesa}
                      type="button"
                      onClick={() => handleMesasChange(mesa)}
                      className={`p-2 border rounded text-sm ${
                        formularioData.mesasAsignadas.includes(mesa)
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      Mesa {mesa}
                    </button>
                  ))}
                </div>
              </div>
              )}

              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={cerrarFormulario}
                  className="px-4 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancelar
                </button>
                <button
                  onClick={guardarMesero}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <Save size={16} />
                  {meseroEditando ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GestionMeseros;