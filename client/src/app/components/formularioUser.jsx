import React, { useState } from 'react';
import { crearUsuario } from '@/api/api';

const FormNuevoUsuario = ({ onClose, onUsuarioCreado }) => {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [imagen, setImagen] = useState(null);
  const [rol, setRol] = useState('mesero');
  const [telefono, setTelefono] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [mesasAsignadas, setMesasAsignadas] = useState('');
  const [turno, setTurno] = useState('mañana');
  const [estado, setEstado] = useState('activo');

  const validarNombre = (value) => /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(value);
  const validarCorreo = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      name: nombre,
      email: correo,
      password,
      role: rol,
      telefono,
      fechaNacimiento,
      turno,
      estado,
      mesasAsignadas: mesasAsignadas.split(',').map((m) => m.trim()),
    };

    // Si hay imagen, podría subirse a un servicio externo y guardar la URL
    // Pero como se está guardando el nombre de archivo local, se puede asignar directamente aquí
    if (imagen) {
      userData.foto = `/uploads/${imagen.name}`; // O la lógica que haya en el backend
    }

    try {
  const nuevoUsuario = await crearUsuario(userData);
  onUsuarioCreado(nuevoUsuario); 
      onClose();
    } catch (error) {
      alert('Error al crear usuario: ' + error.message);
    }
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 backdrop-blur-sm transition-opacity"></div>

      {/* Formulario modal */}
      <div className="relative z-10 bg-white text-black rounded-2xl shadow-xl p-8 w-[90%] max-w-md space-y-5 max-h-[95vh] overflow-y-auto">
      <div className="relative z-10 bg-white text-black rounded-2xl shadow-xl p-8 w-[90%] max-w-md space-y-5">
        <h2 className="text-2xl font-semibold text-center mb-2">Nuevo Usuario</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej. Juan Pérez"
              className="w-full mt-1 p-2 border rounded-lg"
              required
              pattern="[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+"
              title="Solo letras y espacios"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Correo</label>
            <input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="usuario@correo.com"
              className="w-full mt-1 p-2 border rounded-lg"
              required
              disabled={!validarNombre(nombre)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              className="w-full mt-1 p-2 border rounded-lg"
              required
              minLength={8}
              disabled={!validarCorreo(correo)}
            />
          </div>

          <div>
  <label className="block text-sm font-medium">Teléfono</label>
  <input
    type="tel"
    value={telefono}
    onChange={(e) => setTelefono(e.target.value)}
    placeholder="Ej. 5512345678"
    className="w-full mt-1 p-2 border rounded-lg"
  />
</div>

<div>
  <label className="block text-sm font-medium">Fecha de Nacimiento</label>
  <input
    type="date"
    value={fechaNacimiento}
    onChange={(e) => setFechaNacimiento(e.target.value)}
    className="w-full mt-1 p-2 border rounded-lg"
  />
</div>

<div>
  <label className="block text-sm font-medium">Mesas asignadas (separadas por coma)</label>
  <input
    type="text"
    value={mesasAsignadas}
    onChange={(e) => setMesasAsignadas(e.target.value)}
    placeholder="Ej. 1, 2, 5"
    className="w-full mt-1 p-2 border rounded-lg"
  />
</div>

<div>
  <label className="block text-sm font-medium">Turno</label>
  <select
    value={turno}
    onChange={(e) => setTurno(e.target.value)}
    className="w-full mt-1 p-2 border rounded-lg"
  >
    <option value="mañana">Mañana</option>
    <option value="tarde">Tarde</option>
    <option value="noche">Noche</option>
  </select>
</div>

<div>
  <label className="block text-sm font-medium">Estado</label>
  <select
    value={estado}
    onChange={(e) => setEstado(e.target.value)}
    className="w-full mt-1 p-2 border rounded-lg"
  >
    <option value="activo">Activo</option>
    <option value="inactivo">Inactivo</option>
  </select>
</div>


          <div>
            <label className="block text-sm font-medium">Rol</label>
            <select
              value={rol}
              onChange={(e) => setRol(e.target.value)}
              className="w-full mt-1 p-2 border rounded-lg"
              required
            >
              <option value="mesero">Mesero</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Imagen (opcional)</label>
            <label className="inline-block bg-[#e07a35] text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-[#e07a35cc] transition">
              Agregar imagen
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImagen(e.target.files?.[0] || null)}
                className="hidden"
              />
            </label>
            {imagen && (
              <p className="mt-2 text-sm text-gray-600">Imagen seleccionada: {imagen.name}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={
                !validarNombre(nombre) || !validarCorreo(correo) || password.length < 8
              }
              className="px-4 py-2 rounded-lg bg-[#f3ca52] hover:bg-[#f3ca52cc] text-black font-semibold transition"
            >
              Aceptar
            </button>
          </div>
        </form>
      </div>
      </div>
    </div>
  );
};

export default FormNuevoUsuario;
