import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { User, Lock, CheckCircle, XCircle, X } from 'lucide-react';

// Componente de Alerta Reutilizable
const Alert = ({ type, message, onClose, autoClose = true }) => {
  const [isVisible, setIsVisible] = useState(true);

  React.useEffect(() => {
    if (autoClose && type === 'success') {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [autoClose, type, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const alertStyles = {
    success: 'bg-gradient-to-r from-green-500 to-emerald-600 border-green-400',
    error: 'bg-gradient-to-r from-red-500 to-rose-600 border-red-400'
  };

  const icons = {
    success: <CheckCircle className="h-5 w-5 text-white" />,
    error: <XCircle className="h-5 w-5 text-white" />
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 transform transition-all duration-300 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
      <div className={`${alertStyles[type]} border-l-4 rounded-lg shadow-lg backdrop-blur-sm p-4 min-w-[300px] max-w-md`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {icons[type]}
            <div>
              <p className="text-white font-medium text-sm">
                {type === 'success' ? '¡Éxito!' : '¡Error!'}
              </p>
              <p className="text-white/90 text-sm">{message}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();

  const showAlert = (type, message) => {
    setAlert({ type, message });
  };

  const closeAlert = () => {
    setAlert(null);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('http://localhost:8000/api/auth/loginStaff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Login failed');

      // ✅ Mostrar alerta de éxito
      showAlert('success', 'Inicio de sesión exitoso. Redirigiendo...');

      // ✅ Guardar token en localStorage
      localStorage.setItem("token", data.token);

      // ✅ Redirigir según el rol después de un breve delay
      setTimeout(() => {
        if (data.role === 'admin') {
          navigate('/home');
        } else if (data.role === 'mesero') {
          navigate('/homeMesero');
        } else {
          setError('Rol desconocido');
        }
      }, 1500);

    } catch (err) {
      // ✅ Mostrar alerta de error
      showAlert('error', err.message || 'Error de inicio de sesión');
      setError(err.message || 'Error de inicio de sesión');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-yellow-900">
      {/* Componente de Alerta */}
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={closeAlert}
        />
      )}

      <div className="bg-white/30 backdrop-blur-md shadow-2xl rounded-2xl p-6 max-w-sm w-full mx-4">
        <div className="flex flex-col items-center">
          <img alt="Restaurante Logo" src="/usuarioLogin.png" className="h-10 w-10" />
          <h2 className="mt-4 text-center text-xl font-bold text-white">Iniciar sesión</h2>
        </div>

        <form className="mt-6 space-y-5" onSubmit={handleLogin}>
          <div>
            <label htmlFor="email" className="flex items-center gap-2 text-sm font-medium text-white">
              <User className="h-4 w-4 text-[#e9a839]" />
              Correo electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-[#e9a839] px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#e9a839] focus:border-[#e9a839] sm:text-sm"
              placeholder="correo@ejemplo.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="flex items-center gap-2 text-sm font-medium text-white">
              <Lock className="h-4 w-4 text-[#e9a839]" />
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-[#e9a839] px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#e9a839] focus:border-[#e9a839] sm:text-sm"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="text-sm text-red-600 text-center">{error}</div>
          )}

          <div>
            <button
              type="submit"
              className="w-full flex justify-center rounded-lg bg-[#e9a839] hover:bg-yellow-500 px-4 py-2 text-sm font-semibold text-white shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#e9a839]"
            >
              Iniciar sesión
            </button>
          </div>
          
        </form>
      </div>
    </div>
  );
}