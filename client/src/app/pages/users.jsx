import React, { useEffect, useState } from 'react';
import HeaderDs from '@/app/components/header';
import { fetchUsuarios, crearUsuario, eliminarUsuario, actualizarUsuario } from '@/api/api';
import { Search, Plus, X, Edit, Trash2 } from 'lucide-react';

const VistaUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [formulario, setFormulario] = useState({
    name: '', email: '', password: '', telefono: '', role: 'mesero', estado: 'activo'
  });

  useEffect(() => {
    fetchUsuarios()
      .then(data => setUsuarios(data))
      .catch(err => console.error('Error al obtener usuarios:', err));
  }, []);

  const usuariosFiltrados = usuarios.filter((u) =>
    u.name.toLowerCase().includes(busqueda.toLowerCase()) ||
    u.email.toLowerCase().includes(busqueda.toLowerCase())
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormulario(prev => ({ ...prev, [name]: value }));
  };

  const abrirFormularioAgregar = () => {
    setFormulario({ name: '', email: '', password: '', telefono: '', role: 'mesero', estado: 'activo' });
    setModoEdicion(false);
    setMostrarFormulario(true);
  };

  const abrirFormularioEditar = (usuario) => {
    setFormulario({
      name: usuario.name,
      email: usuario.email,
      telefono: usuario.telefono,
      role: usuario.role,
      estado: usuario.estado,
      password: ''
    });
    setUsuarioEditando(usuario);
    setModoEdicion(true);
    setMostrarFormulario(true);
  };

  const guardarUsuario = async () => {
    if (!formulario.name || !formulario.email || (!modoEdicion && !formulario.password)) {
      alert('Nombre, correo y contraseña son obligatorios');
      return;
    }
    try {
      if (modoEdicion && usuarioEditando) {
        const actualizado = await actualizarUsuario(usuarioEditando._id, formulario);
        setUsuarios(prev => prev.map(u => u._id === actualizado._id ? actualizado : u));
      } else {
        const nuevo = await crearUsuario(formulario);
        setUsuarios(prev => [...prev, nuevo]);
      }
      setMostrarFormulario(false);
    } catch (err) {
      console.error('Error al guardar usuario:', err);
    }
  };

  const handleEliminar = async (id) => {
    if (confirm('¿Eliminar este usuario?')) {
      try {
        await eliminarUsuario(id);
        setUsuarios(prev => prev.filter(u => u._id !== id));
      } catch (err) {
        console.error('Error al eliminar usuario:', err);
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#FFF9ED] to-[#f0f4f8]">
      <HeaderDs />
      <main className="p-6 bg-[#1b1b1a] min-h-screen text-white">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[#f3ca52]">Staff</h1>
          <button onClick={abrirFormularioAgregar} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg">
            <Plus size={18} /> Agregar Usuario
          </button>
        </div>

        <div className="flex items-center mb-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute top-2.5 left-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar usuario..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="pl-10 pr-4 py-2 w-full bg-[#2d2f34] text-white rounded-md border border-[#444] focus:outline-none focus:ring-2 focus:ring-[#f3ca52]"
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg shadow-lg bg-[#2d2f34]">
          <table className="min-w-full text-sm">
            <thead className="bg-[#3a3a3a] text-[#f3ca52]">
              <tr>
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Nombre</th>
                <th className="px-4 py-3 text-left">Correo</th>
                <th className="px-4 py-3 text-left">Rol</th>
                <th className="px-4 py-3 text-left">Teléfono</th>
                <th className="px-4 py-3 text-left">Estado</th>
                <th className="px-4 py-3 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuariosFiltrados.map((u, index) => (
                <tr key={u._id} className="border-b border-[#444]">
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3">{u.name}</td>
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3">{u.role}</td>
                  <td className="px-4 py-3">{u.telefono || '-'}</td>
                  <td className={`px-4 py-3 font-semibold ${u.estado === 'activo' ? 'text-green-400' : 'text-red-400'}`}>{u.estado}</td>
                  <td className="px-4 py-3 flex gap-2">
                    <button onClick={() => abrirFormularioEditar(u)} className="text-yellow-400 hover:text-yellow-500">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleEliminar(u._id)} className="text-red-500 hover:text-red-600">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {usuariosFiltrados.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-6 text-gray-400">No se encontraron usuarios.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {mostrarFormulario && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white text-black p-6 rounded-lg w-full max-w-md relative">
              <button onClick={() => setMostrarFormulario(false)} className="absolute top-2 right-2 text-red-500">
                <X size={20} />
              </button>
              <h2 className="text-xl font-semibold mb-4">{modoEdicion ? 'Editar Usuario' : 'Agregar Usuario'}</h2>
              <input type="text" name="name" placeholder="Nombre" value={formulario.name} onChange={handleChange} className="w-full mb-3 p-2 border rounded" />
              <input type="email" name="email" placeholder="Correo" value={formulario.email} onChange={handleChange} className="w-full mb-3 p-2 border rounded" />
              {!modoEdicion && (
                <input type="password" name="password" placeholder="Contraseña" value={formulario.password} onChange={handleChange} className="w-full mb-3 p-2 border rounded" />
              )}
              <input type="text" name="telefono" placeholder="Teléfono" value={formulario.telefono} onChange={handleChange} className="w-full mb-3 p-2 border rounded" />
              <select name="role" value={formulario.role} onChange={handleChange} className="w-full mb-3 p-2 border rounded">
                <option value="mesero">Mesero</option>
                <option value="admin">Administrador</option>
              </select>
              <select name="estado" value={formulario.estado} onChange={handleChange} className="w-full mb-3 p-2 border rounded">
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
              <button onClick={guardarUsuario} className="w-full bg-green-600 hover:bg-green-700 text-white p-2 rounded">Guardar</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default VistaUsuarios;
