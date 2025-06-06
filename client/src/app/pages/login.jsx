import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { User, Lock } from 'lucide-react';

export default function Login( ) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     const credentials = {
//       email,
//       password,
//     };
//   try {
//     await setIsLoggedIn(credentials); // wait for login
//           if (isAdmin) {
//         navigate('/home'); // only navigate if login succeeds
//       } else {
//         navigate('/homeMesero');
//       }
//   } catch (err) {
//     console.error("Login failed:", err);
//     // optionally display error message to user
//   }
// };

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

    if (data.role === 'admin') {
      navigate('/home');
    } else if (data.role === 'mesero') {
      navigate('/homeMesero');
    } else {
      setError('Unknown role');
    }
  } catch (err) {
    setError(err.message || 'Login error');
  }
};


  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-yellow-900"
    >
      <div className="bg-white/30 backdrop-blur-md shadow-2xl rounded-2xl p-6 max-w-sm w-full mx-4">
        <div className="flex flex-col items-center">
          <img
            alt="Restaurante Logo"
            src="/usuarioLogin.png"
            className="h-10 w-10"
          />
          <h2 className="mt-4 text-center text-xl font-bold text-white">
            Iniciar sesión
          </h2>
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
