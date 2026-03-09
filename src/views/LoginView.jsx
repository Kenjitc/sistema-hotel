import React, { useState } from 'react';
import { Mail, Lock, Building2, Loader2, CheckCircle2, XCircle } from 'lucide-react';

export const LoginView = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setStatus('loading');
    setTimeout(() => {
      if (email === 'admin@hotel.com' && password === '123456') {
        setStatus('success');
        setTimeout(() => onLoginSuccess(), 1000);
      } else {
        setStatus('error');
        setErrorMsg('Credenciales incorrectas (Usa admin@hotel.com / 123456)');
        setTimeout(() => setStatus('idle'), 3000);
      }
    }, 1500);
  };

  return (
    <div className="w-full h-screen flex flex-col md:flex-row overflow-hidden bg-white text-slate-900">
      <div className="relative hidden md:flex md:w-1/2 h-full bg-slate-900 items-center justify-center">
        <div className="absolute inset-0 bg-slate-900/40 z-10"></div>
        <img 
          src="[https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1200](https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1200)" 
          alt="Lobby del Hotel" 
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        <div className="relative z-20 flex flex-col items-center text-center p-12 text-white">
          <Building2 size={80} className="mb-6 text-yellow-500" />
          <h1 className="text-5xl lg:text-7xl font-serif font-semibold mb-6 tracking-wide">Grand Luxe</h1>
          <p className="text-xl text-slate-200 max-w-lg font-light leading-relaxed">
            Panel de Administración Exclusivo. Gestione sus reservas y brinde el mejor servicio.
          </p>
        </div>
      </div>

      <div className="w-full md:w-1/2 h-full flex flex-col justify-center px-6 sm:px-16 lg:px-32 relative">
        <div className="w-full max-w-md mx-auto">
          <div className="md:hidden flex flex-col items-center mb-8">
             <Building2 size={40} className="mb-3 text-yellow-600" />
             <h1 className="text-3xl font-serif font-semibold text-center">Grand Luxe</h1>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-center md:text-left">Iniciar Sesión</h2>
          <p className="text-slate-500 mb-8 text-center md:text-left text-sm sm:text-base">Ingrese sus credenciales administrativas.</p>

          {status === 'error' && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 flex items-start rounded-lg shadow-sm">
              <XCircle className="text-red-500 w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-700">{errorMsg}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5 sm:space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5 sm:mb-2">Correo Electrónico</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input 
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)} required 
                  disabled={status === 'loading' || status === 'success'}
                  className="block w-full pl-10 pr-3 py-3 sm:py-3.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none text-base sm:text-sm transition-shadow"
                  placeholder="admin@hotel.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5 sm:mb-2">Contraseña</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input 
                  type="password" value={password} onChange={(e) => setPassword(e.target.value)} required 
                  disabled={status === 'loading' || status === 'success'}
                  className="block w-full pl-10 pr-3 py-3 sm:py-3.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none text-base sm:text-sm transition-shadow"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit" disabled={status === 'loading' || status === 'success'}
              className={`w-full flex justify-center items-center py-3.5 sm:py-4 px-4 rounded-xl text-white font-bold transition-all duration-300 shadow-md ${
                status === 'success' ? 'bg-emerald-600 shadow-emerald-600/30' : 'bg-slate-900 hover:bg-slate-800 shadow-slate-900/20'
              }`}
            >
              {status === 'idle' && <>Ingresar al Sistema</>}
              {status === 'loading' && <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Verificando...</>}
              {status === 'success' && <><CheckCircle2 className="mr-2 h-5 w-5" /> Acceso Concedido</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};