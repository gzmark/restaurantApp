import React, { useState, useEffect } from 'react';
import HeaderDs from '@/app/components/header';
import Menu from '@/app/components/menu';
import { fetchProductos, crearProducto, eliminarProducto, actualizarProducto } from '@/api/api';
import { Plus, X, Utensils, Edit, Trash2, Search, Filter, ImageIcon } from 'lucide-react';

const GestionMenu = () => {
  const [platillos, setPlatillos] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [platilloEditando, setPlatilloEditando] = useState(null);
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const [filtroCategoria, setFiltroCategoria] = useState('todos');
  const [busqueda, setBusqueda] = useState('');
  const [mostrarSelectorImagenes, setMostrarSelectorImagenes] = useState(false);
  
  // Estado del formulario
  const [formulario, setFormulario] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    categoria: 'comida',
    disponible: true,
    imagen: ''
  });

  const categorias = [
    { value: 'todos', label: 'Todas las categorías' },
    { value: 'comida', label: 'Comida' },
    { value: 'bebida', label: 'Bebida' },
    { value: 'postre', label: 'Postre' },
    { value: 'entrada', label: 'Entrada' }
  ];

  // Lista de imágenes disponibles
  const imagenesDisponibles = [
    { id: 1, nombre: '1.jpeg', ruta: '/imagenes/1.jpeg' },
    { id: 2, nombre: '2.jpeg', ruta: '/src/Imagenes/2.jpg' },
    { id: 3, nombre: '3.jpeg', ruta: '/src/Imagenes/3.jpg' },
    { id: 4, nombre: '4.jpeg', ruta: '/src/Imagenes/4.jpg' },
    { id: 5, nombre: '5.jpeg', ruta: '/src/Imagenes/5.jpg' },
    { id: 6, nombre: '6.jpeg', ruta: '/src/Imagenes/6.jpg' },
    { id: 7, nombre: '7.jpeg', ruta: '/src/Imagenes/7.jpg' },
    { id: 8, nombre: '8.jpeg', ruta: '/src/Imagenes/8.jpeg' },
    { id: 9, nombre: '9.jpeg', ruta: '/src/Imagenes/9.jpeg' },
    { id: 10, nombre: '10.jpeg', ruta: '/src/Imagenes/10.jpeg' },
    { id: 11, nombre: '11.jpeg', ruta: '/src/Imagenes/11.jpeg' }
  ];

  useEffect(() => {
    fetchProductos().then(setPlatillos).catch(console.error);
  }, []);

  const platillosFiltrados = platillos.filter(p => {
    const coincide = p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                     p.descripcion.toLowerCase().includes(busqueda.toLowerCase());
    const categoria = filtroCategoria === 'todos' || p.categoria === filtroCategoria;
    return coincide && categoria;
  });

  const abrirFormulario = (platillo = null) => {
    if (platillo) {
      setFormulario({
        nombre: platillo.nombre,
        descripcion: platillo.descripcion,
        precio: platillo.precio,
        categoria: platillo.categoria,
        disponible: platillo.disponible,
        imagen: platillo.imagen
      });
      setPlatilloEditando(platillo);
    } else {
      setFormulario({
        nombre: '',
        descripcion: '',
        precio: '',
        categoria: 'comida',
        disponible: true,
        imagen: ''
      });
      setPlatilloEditando(null);
    }
    setMostrarFormulario(true);
  };

  const cerrarFormulario = () => {
    setMostrarFormulario(false);
    setPlatilloEditando(null);
    setMostrarSelectorImagenes(false);
  };

  const manejarCambio = (campo, valor) => {
    setFormulario(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const seleccionarImagen = (imagen) => {
    setFormulario(prev => ({
      ...prev,
      imagen: imagen.nombre
    }));
    setMostrarSelectorImagenes(false);
  };

  const guardarPlatillo = async () => {
    if (!formulario.nombre || !formulario.precio) {
      alert('Por favor completa los campos obligatorios (nombre y precio)');
      return;
    }
    const data = { ...formulario, precio: parseFloat(formulario.precio) };
    try {
      if (platilloEditando) {
        const actualizado = await actualizarProducto(platilloEditando._id, data);
        setPlatillos(prev => prev.map(p => p._id === actualizado._id ? actualizado : p));
      } else {
        const nuevo = await crearProducto(data);
        setPlatillos(prev => [...prev, nuevo]);
      }
      cerrarFormulario();
    } catch (err) {
      console.error('Error al guardar platillo:', err);
    }
  };

  const eliminarPlatillo = async (_id) => {
    if (confirm('¿Eliminar platillo?')) {
      try {
        await eliminarProducto(_id);
        setPlatillos(prev => prev.filter(p => p._id !== _id));
      } catch (err) {
        console.error('Error al eliminar platillo:', err);
      }
    }
  };

  const toggleDisponibilidad = async (_id) => {
    const platillo = platillos.find(p => p._id === _id);
    if (!platillo) return;
    const actualizado = { ...platillo, disponible: !platillo.disponible };
    try {
      await actualizarProducto(_id, actualizado);
      setPlatillos(prev => prev.map(p => p._id === _id ? actualizado : p));
    } catch (err) {
      console.error('Error al actualizar disponibilidad:', err);
    }
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
            <h2 className="text-2xl font-bold text-[#f3ca52] flex items-center gap-2">
              <Utensils size={28} />
              Gestión del Menú
            </h2>
            <button 
              onClick={() => abrirFormulario()}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus size={20} /> Agregar Platillo
            </button>
          </div>

          {/* Filtros y búsqueda */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar platillos..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border bg-blue-50 rounded-lg focus:ring-2 focus:ring-[#f3ca52] focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-white" />
              <select
                value={filtroCategoria}
                onChange={(e) => setFiltroCategoria(e.target.value)}
                className="px-4 py-2 border bg-gray-200 rounded-lg focus:ring-2 focus:ring-[#f3ca52] focus:border-transparent"
              >
                {categorias.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Tabla de platillos */}
          <div className="bg-white shadow rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#2d2f34] text-white">
                  <tr>
                    <th className="p-3 text-left">Platillo</th>
                    <th className="p-3 text-left hidden sm:table-cell">Descripción</th>
                    <th className="p-3">Precio</th>
                    <th className="p-3">Categoría</th>
                    <th className="p-3">Estado</th>
                    <th className="p-3">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {platillosFiltrados.map(platillo => (
                    <tr key={platillo._id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <div className="font-semibold">{platillo.nombre}</div>
                        <div className="text-sm text-gray-500 sm:hidden">{platillo.descripcion}</div>
                      </td>
                      <td className="p-3 hidden sm:table-cell text-gray-600 max-w-xs">
                        {platillo.descripcion}
                      </td>
                      <td className="p-3 text-center font-semibold text-green-600">
                        ${platillo.precio}
                      </td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          platillo.categoria === 'comida' 
                            ? 'bg-orange-100 text-orange-800'
                            : platillo.categoria === 'bebida'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {platillo.categoria.charAt(0).toUpperCase() + platillo.categoria.slice(1)}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => toggleDisponibilidad(platillo.id)}
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            platillo.disponible 
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          } transition-colors`}
                        >
                          {platillo.disponible ? 'Disponible' : 'No disponible'}
                        </button>
                      </td>
                      <td className="p-3">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => abrirFormulario(platillo)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => eliminarPlatillo(platillo._id)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {platillosFiltrados.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No se encontraron platillos que coincidan con tu búsqueda.
              </div>
            )}
          </div>

          {/* Estadísticas rápidas */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-2xl font-bold text-green-600">{platillos.length}</div>
              <div className="text-gray-600">Total de platillos</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-2xl font-bold text-blue-600">
                {platillos.filter(p => p.disponible).length}
              </div>
              <div className="text-gray-600">Disponibles</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-2xl font-bold text-orange-600">
                ${Math.round(platillos.reduce((acc, p) => acc + p.precio, 0) / platillos.length) || 0}
              </div>
              <div className="text-gray-600">Precio promedio</div>
            </div>
          </div>
        </main>

        {/* Modal del formulario */}
        {mostrarFormulario && (
          <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/50 z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-2xl shadow-xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">
                    {platilloEditando ? 'Editar Platillo' : 'Agregar Nuevo Platillo'}
                  </h3>
                  <button
                    onClick={cerrarFormulario}
                    className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre del Platillo *
                      </label>
                      <input
                        type="text"
                        value={formulario.nombre}
                        onChange={(e) => manejarCambio('nombre', e.target.value)}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#f3ca52] focus:border-transparent"
                        placeholder="Ej: Pizza Margherita"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Precio *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formulario.precio}
                        onChange={(e) => manejarCambio('precio', e.target.value)}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#f3ca52] focus:border-transparent"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descripción
                    </label>
                    <textarea
                      value={formulario.descripcion}
                      onChange={(e) => manejarCambio('descripcion', e.target.value)}
                      rows={3}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#f3ca52] focus:border-transparent"
                      placeholder="Describe los ingredientes y características del platillo..."
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Categoría
                      </label>
                      <select
                        value={formulario.categoria}
                        onChange={(e) => manejarCambio('categoria', e.target.value)}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#f3ca52] focus:border-transparent"
                      >
                        <option value="comida">Comida</option>
                        <option value="bebida">Bebida</option>
                        <option value="postre">Postre</option>
                        <option value="entrada">Entrada</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Imagen del Platillo
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={formulario.imagen}
                          onChange={(e) => manejarCambio('imagen', e.target.value)}
                          className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-[#f3ca52] focus:border-transparent"
                          placeholder="Selecciona una imagen..."
                          readOnly
                        />
                        <button
                          type="button"
                          onClick={() => setMostrarSelectorImagenes(true)}
                          className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                          <ImageIcon size={16} />
                          Seleccionar
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="disponible"
                      checked={formulario.disponible}
                      onChange={(e) => manejarCambio('disponible', e.target.checked)}
                      className="w-4 h-4 text-[#f3ca52] focus:ring-[#f3ca52] border-gray-300 rounded"
                    />
                    <label htmlFor="disponible" className="text-sm font-medium text-gray-700">
                      Platillo disponible para pedidos
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 mt-8 pt-6 border-t">
                  <button
                    onClick={cerrarFormulario}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={guardarPlatillo}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-yellow-400 text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
                  >
                    {platilloEditando ? 'Actualizar' : 'Guardar'} Platillo
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Selector de Imágenes */}
        {mostrarSelectorImagenes && (
          <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/60 z-60 p-4">
            <div className="bg-white rounded-xl w-full max-w-4xl shadow-2xl max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <ImageIcon size={24} />
                    Seleccionar Imagen del Platillo
                  </h3>
                  <button
                    onClick={() => setMostrarSelectorImagenes(false)}
                    className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {imagenesDisponibles.map(imagen => (
                    <div 
                      key={imagen.id}
                      className="relative group cursor-pointer transform transition-all duration-200 hover:scale-105"
                      onClick={() => seleccionarImagen(imagen)}
                    >
                      <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden border-2 border-transparent group-hover:border-[#f3ca52] transition-colors">
                        <img
                          src={imagen.ruta}
                          alt={`Imagen ${imagen.nombre}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                        <div className="w-full h-full bg-gray-100 hidden items-center justify-center flex-col text-gray-500">
                          <ImageIcon size={32} />
                          <span className="text-xs mt-2">{imagen.nombre}</span>
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
                        <div className="bg-white bg-opacity-90 px-3 py-1 rounded-full text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                          Seleccionar
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 mt-2 text-center truncate">
                        {imagen.nombre}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                  <button
                    onClick={() => setMostrarSelectorImagenes(false)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GestionMenu;