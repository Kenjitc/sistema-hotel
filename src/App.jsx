import React, { useState, useRef, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, onSnapshot, doc, setDoc, deleteDoc, getDocs } from "firebase/firestore";
import { 
  Mail, Lock, Building2, ArrowRight, Loader2, CheckCircle2, XCircle, 
  Users, CreditCard, LogOut, LayoutDashboard, 
  DoorOpen, ClipboardList, Bell, Search, Menu, BarChart3, Settings,
  Plus, Activity, BedDouble, Calendar as CalendarIcon, CalendarCheck,
  ChevronLeft, ChevronRight, Check, Edit2, Save, X, AlertTriangle, Wallet, Trash2, UserPlus, User, Download, Camera,
  Wrench, AlertOctagon, RefreshCw, Globe, Server, Link as LinkIcon, Copy, Briefcase, Contact
} from 'lucide-react';

const firebaseConfig = {
  apiKey: "AIzaSyCrBLRdhrPYUXFFFsv-FUEFZ1Bz1zLIp0Q",
  authDomain: "sistema-hotel-79a17.firebaseapp.com",
  projectId: "sistema-hotel-79a17",
  storageBucket: "sistema-hotel-79a17.firebasestorage.app",
  messagingSenderId: "79759937724",
  appId: "1:79759937724:web:9dd008c76a9cb974cfc0b9"
};

// Inicialización de Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Utilidad para construir fácilmente las referencias a las colecciones
const HOTEL_DB = {
  col: (colName) => collection(db, 'artifacts', firebaseConfig.projectId, 'public', 'data', colName),
  doc: (colName, id) => doc(db, 'artifacts', firebaseConfig.projectId, 'public', 'data', colName, String(id))
};

// ==========================================
// VISTA 1: LOGIN
// ==========================================
const LoginView = ({ onLoginSuccess }) => {
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
          src="https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1200" 
          alt="Lobby del Hotel" 
          className="absolute inset-0 w-full h-full object-cover z-0"
          onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }}
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

// ==========================================
// COMPONENTE DE CALENDARIO PERSONALIZADO (Pequeño)
// ==========================================
const InteractiveCalendar = ({ dateIn, dateOut, onDateSelect }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const days = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'];
  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const todayObj = new Date();
  todayObj.setHours(0, 0, 0, 0);
  const isPrevMonthDisabled = year < todayObj.getFullYear() || (year === todayObj.getFullYear() && month <= todayObj.getMonth());

  const handleDayClick = (day) => {
    const selectedDate = new Date(year, month, day);
    const formattedDate = new Date(selectedDate.getTime() - (selectedDate.getTimezoneOffset() * 60000)).toISOString().split('T')[0];

    if (!dateIn || (dateIn && dateOut)) {
      onDateSelect({ dateIn: formattedDate, dateOut: '' });
    } else {
      const start = new Date(dateIn);
      if (selectedDate > start) {
        onDateSelect({ dateIn, dateOut: formattedDate });
      } else {
        onDateSelect({ dateIn: formattedDate, dateOut: '' });
      }
    }
  };

  const isSelected = (day) => {
    const d = new Date(year, month, day);
    const formatted = new Date(d.getTime() - (d.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
    return formatted === dateIn || formatted === dateOut;
  };

  const isBetween = (day) => {
    if (!dateIn || !dateOut) return false;
    const d = new Date(year, month, day);
    const start = new Date(dateIn + 'T00:00:00');
    const end = new Date(dateOut + 'T00:00:00');
    return d > start && d < end;
  };

  const renderCells = () => {
    const cells = [];
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);

    for (let i = 0; i < firstDay; i++) {
      cells.push(<div key={`empty-${i}`} className="p-1 sm:p-2"></div>);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const selected = isSelected(d);
      const between = isBetween(d);
      const dDate = new Date(year, month, d);
      const formatted = new Date(dDate.getTime() - (dDate.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
      const isStart = dateIn === formatted;
      const isEnd = dateOut === formatted;
      const isPast = dDate < todayDate;

      cells.push(
        <button
          key={d}
          type="button"
          disabled={isPast}
          onClick={() => handleDayClick(d)}
          className={`
            h-10 sm:h-12 w-full flex items-center justify-center text-sm sm:text-base font-medium transition-all
            ${selected ? 'bg-yellow-600 text-white font-bold shadow-md z-10 relative' : ''}
            ${between ? 'bg-yellow-100 text-yellow-800' : ''}
            ${!selected && !between && !isPast ? 'text-slate-700 hover:bg-slate-100 rounded-lg' : ''}
            ${isStart ? 'rounded-l-lg' : ''}
            ${isEnd ? 'rounded-r-lg' : ''}
            ${selected && !isStart && !isEnd ? 'rounded-lg' : ''}
            ${isPast ? 'text-slate-300 cursor-not-allowed opacity-50' : ''}
          `}
        >
          {d}
        </button>
      );
    }
    return cells;
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4 sm:p-6 w-full select-none">
      <div className="flex justify-between items-center mb-6">
        <button type="button" onClick={prevMonth} disabled={isPrevMonthDisabled} className="p-2 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed rounded-full transition"><ChevronLeft size={24} className="text-slate-600"/></button>
        <div className="font-bold text-slate-800 text-lg sm:text-xl">{monthNames[month]} {year}</div>
        <button type="button" onClick={nextMonth} className="p-2 hover:bg-slate-100 rounded-full transition"><ChevronRight size={24} className="text-slate-600"/></button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {days.map(d => <div key={d} className="text-center text-xs sm:text-sm font-bold text-slate-400 py-1">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-y-1 sm:gap-y-2 gap-x-0">
        {renderCells()}
      </div>
      
      <div className="mt-6 flex justify-between text-xs sm:text-sm text-slate-500 border-t border-slate-100 pt-4">
        <div className="flex flex-col">
          <span className="font-medium">Check-In</span>
          <span className={`font-bold ${dateIn ? 'text-yellow-600' : 'text-slate-400'}`}>{dateIn || 'Seleccione fecha'}</span>
        </div>
        <div className="flex flex-col text-right">
          <span className="font-medium">Check-Out</span>
          <span className={`font-bold ${dateOut ? 'text-yellow-600' : 'text-slate-400'}`}>{dateOut || 'Seleccione fecha'}</span>
        </div>
      </div>
    </div>
  );
};


// ==========================================
// SUB-COMPONENTES DE PESTAÑAS (TABS)
// ==========================================

const SourceIcon = ({ source }) => {
  if (source === 'Booking') {
    return (
      <div className="flex items-center justify-center w-5 h-5 bg-[#003580] rounded-full text-white font-bold text-[10px] shadow-sm flex-shrink-0" title="Booking.com">
        B.
      </div>
    );
  }
  if (source === 'Airbnb') {
    return (
      <div className="flex items-center justify-center w-5 h-5 bg-[#FF5A5F] rounded-full text-white shadow-sm flex-shrink-0" title="Airbnb">
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.88 14.71L12 13.5l-3.88 3.21.99-4.94-3.79-3.4 5.04-.43L12 3.5l1.64 4.44 5.04.43-3.79 3.4.99 4.94z"/>
        </svg>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center w-5 h-5 bg-slate-200 rounded-full text-slate-600 shadow-sm flex-shrink-0" title="Reserva Directa">
      <Building2 size={12} />
    </div>
  );
};

// Calendario Gigante (Panel Principal)
const LargeCalendar = ({ reservations }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedRes, setSelectedRes] = useState(null); // NUEVO: Estado para el modal de detalles

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const goToday = () => setCurrentDate(new Date());

  const cells = [];
  for (let i = 0; i < firstDay; i++) {
    cells.push(<div key={`empty-${i}`} className="min-h-[100px] border border-slate-100 bg-slate-50/50"></div>);
  }

  const todayStr = new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString().split('T')[0];

  for (let d = 1; d <= daysInMonth; d++) {
    const dDate = new Date(year, month, d);
    const formatted = new Date(dDate.getTime() - (dDate.getTimezoneOffset() * 60000)).toISOString().split('T')[0];

    // CORRECCIÓN MATEMÁTICA:
    // Una reserva se muestra si:
    // 1. Es el día exacto de entrada (dateIn === formatted)
    // 2. O es un día intermedio antes de la salida (dateIn < formatted && dateOut > formatted)
    const daysRes = reservations.filter(r => {
      const isCheckInDay = r.dateIn === formatted;
      const isMiddleDay = r.dateIn < formatted && r.dateOut > formatted;
      
      return (isCheckInDay || isMiddleDay) && r.status !== 'Finalizada';
    });

    cells.push(
      <div key={d} className={`min-h-[100px] sm:min-h-[120px] border border-slate-100 p-1 sm:p-2 flex flex-col relative group transition ${formatted === todayStr ? 'bg-yellow-50/30' : 'bg-white hover:bg-slate-50'}`}>
        <div className="flex justify-between items-start mb-1">
          <span className={`text-xs font-bold ${formatted === todayStr ? 'bg-yellow-500 text-white w-6 h-6 flex items-center justify-center rounded-full shadow-sm' : 'text-slate-500 ml-1'}`}>{d}</span>
          <span className="text-[10px] text-slate-300 opacity-0 group-hover:opacity-100 transition">{daysRes.length} res</span>
        </div>
        <div className="flex flex-col gap-1.5 overflow-y-auto max-h-[85px] scrollbar-hide">
          {daysRes.map(r => (
            <div 
              key={r.id} 
              onClick={() => setSelectedRes(r)} 
              className="flex items-center text-[10px] sm:text-xs bg-slate-50 rounded px-1.5 py-1 shadow-sm border border-slate-200 cursor-pointer hover:bg-white hover:border-yellow-400 hover:shadow transition" 
              title="Click para ver detalles"
            >
              <SourceIcon source={r.source || 'Directo'} />
              <span className="truncate font-medium text-slate-700 ml-1">{r.client.split(' ')[0]} <span className="text-slate-400 font-normal">H{r.room}</span></span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mt-6 flex flex-col relative">
      
      {/* MODAL DE DETALLES DE RESERVA DESDE EL CALENDARIO */}
      {selectedRes && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4" onClick={() => setSelectedRes(null)}>
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
            <div className="p-4 sm:p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-lg flex items-center text-slate-800"><ClipboardList className="mr-2 text-yellow-600" size={20}/> Detalles de Reserva</h3>
              <button onClick={() => setSelectedRes(null)} className="p-2 hover:bg-slate-200 rounded-full transition"><X size={20} className="text-slate-500" /></button>
            </div>
            <div className="p-5 space-y-4">
               <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                 <div className="flex items-center gap-2">
                   <SourceIcon source={selectedRes.source || 'Directo'} />
                   <span className="text-sm font-bold text-slate-700">{selectedRes.source || 'Reserva Directa'}</span>
                 </div>
                 <span className={`px-2.5 py-1 rounded-lg text-[11px] uppercase font-bold tracking-wider ${selectedRes.status === 'Finalizada' ? 'bg-slate-100 text-slate-600' : 'bg-emerald-100 text-emerald-700'}`}>
                   {selectedRes.status}
                 </span>
               </div>
               <div>
                 <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Huésped Principal</p>
                 <p className="font-bold text-slate-800 text-lg leading-tight">{selectedRes.client}</p>
                 <p className="text-sm text-slate-500 font-medium">DNI / ID: {selectedRes.dni}</p>
               </div>
               <div className="grid grid-cols-2 gap-3">
                 <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                   <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Check-In</p>
                   <p className="font-bold text-slate-800 text-sm">{selectedRes.dateIn}</p>
                 </div>
                 <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                   <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Check-Out</p>
                   <p className="font-bold text-slate-800 text-sm">{selectedRes.dateOut || 'N/A'}</p>
                 </div>
               </div>
               <div className="flex justify-between items-end pt-2">
                 <div>
                   <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Asignación</p>
                   <p className="font-black text-slate-800 text-lg">Hab. {selectedRes.room}</p>
                 </div>
                 <div className="text-right">
                   <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Total a Pagar</p>
                   <p className="font-black text-yellow-600 text-xl">S/ {selectedRes.price}</p>
                 </div>
               </div>
            </div>
          </div>
        </div>
      )}

      <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center bg-slate-50 gap-4">
        <div>
          <h3 className="text-lg font-bold flex items-center text-slate-800"><CalendarIcon className="mr-2 text-yellow-600"/> Calendario de Ocupación</h3>
          <p className="text-sm text-slate-500 mt-1">Sincronización de canales y reservas locales.</p>
        </div>
        <div className="flex items-center gap-2 sm:gap-4 bg-white px-2 py-1.5 rounded-xl border border-slate-200 shadow-sm">
          <button onClick={prevMonth} className="p-1.5 sm:p-2 hover:bg-slate-100 rounded-lg transition text-slate-600"><ChevronLeft size={20}/></button>
          <button onClick={goToday} className="font-bold text-slate-700 w-32 text-center text-sm sm:text-base hover:text-yellow-600 transition">{monthNames[month]} {year}</button>
          <button onClick={nextMonth} className="p-1.5 sm:p-2 hover:bg-slate-100 rounded-lg transition text-slate-600"><ChevronRight size={20}/></button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-100/50">
        {days.map(d => <div key={d} className="text-center text-xs font-bold text-slate-500 py-3 uppercase tracking-wider border-r border-slate-100 last:border-0">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 bg-slate-100 gap-[1px]">
        {cells}
      </div>
      
      <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-wrap justify-center gap-4 sm:gap-8 text-xs font-medium text-slate-600">
         <span className="flex items-center bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm"><SourceIcon source="Directo" /><span className="ml-2">Reserva Directa</span></span>
         <span className="flex items-center bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm"><SourceIcon source="Booking" /><span className="ml-2">Booking.com</span></span>
         <span className="flex items-center bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm"><SourceIcon source="Airbnb" /><span className="ml-2">Airbnb</span></span>
      </div>
    </div>
  );
};

// Pestaña de Mantenimiento
const MaintenanceTab = ({ rooms, setRooms, maintenanceTasks, setMaintenanceTasks }) => {
  const [newTask, setNewTask] = useState({ room: '', reason: '' });
  const disponibles = rooms.filter(r => r.status === 'Disponible');

  // --- NUEVO: Paginación en Memoria ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const sortedTasks = [...maintenanceTasks].reverse(); // Más recientes primero
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTasks = sortedTasks.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedTasks.length / itemsPerPage) || 1;

  const handleStartMaintenance = async (e) => {
    e.preventDefault();
    if (!newTask.room || !newTask.reason) return;

    const todayObj = new Date();
    const todayStr = new Date(todayObj.getTime() - (todayObj.getTimezoneOffset() * 60000)).toISOString().split('T')[0];

    const taskId = Math.floor(1000 + Math.random() * 9000);
    const roomToUpdate = rooms.find(r => r.number === newTask.room);

    await setDoc(HOTEL_DB.doc('maintenanceTasks', taskId), {
      id: taskId,
      room: newTask.room,
      reason: newTask.reason,
      startDate: todayStr,
      status: 'En progreso'
    });

    if (roomToUpdate) {
       await setDoc(HOTEL_DB.doc('rooms', roomToUpdate.id), { status: 'En Mantenimiento' }, { merge: true });
    }

    setNewTask({ room: '', reason: '' });
  };

  const handleFinish = async (taskId, roomNumber) => {
    await setDoc(HOTEL_DB.doc('maintenanceTasks', taskId), { status: 'Completado' }, { merge: true });
    
    const roomToUpdate = rooms.find(r => r.number === roomNumber);
    if (roomToUpdate) {
       await setDoc(HOTEL_DB.doc('rooms', roomToUpdate.id), { status: 'Disponible' }, { merge: true });
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Formulario de Mantenimiento */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 flex items-center"><Wrench className="mr-2 text-amber-500"/> Enviar a Mantenimiento</h3>
        <form onSubmit={handleStartMaintenance} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Habitación Disponible</label>
            <select required value={newTask.room} onChange={e=>setNewTask({...newTask, room: e.target.value})} className="w-full p-3 sm:p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50 cursor-pointer text-base sm:text-sm">
              <option value="">Seleccione una...</option>
              {disponibles.map(r => <option key={r.id} value={r.number}>Hab. {r.number} ({r.type})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Motivo / Tarea a realizar</label>
            <input required type="text" value={newTask.reason} onChange={e=>setNewTask({...newTask, reason: e.target.value})} className="w-full p-3 sm:p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50 text-base sm:text-sm" placeholder="Ej. Reparación de AC, Pintura..." />
          </div>
          <button type="submit" className="w-full bg-amber-500 text-white py-3.5 sm:py-3 rounded-xl hover:bg-amber-600 transition font-bold shadow-md shadow-amber-500/20 text-base sm:text-sm">
            Registrar Mantenimiento
          </button>
        </form>
      </div>

      {/* Historial de Tareas */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-lg">Registro de Tareas de Mantenimiento</h3>
          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full shadow-inner">Total: {maintenanceTasks.length}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs sm:text-sm uppercase tracking-wider">
                <th className="px-4 sm:px-6 py-3 sm:py-4 font-medium">ID Tarea</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 font-medium">Habitación</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 font-medium">Motivo</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 font-medium">Fecha Inicio</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 font-medium">Estado / Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentTasks.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50 transition">
                  <td className="px-4 sm:px-6 py-4 font-mono text-sm font-bold text-slate-500">#{t.id}</td>
                  <td className="px-4 sm:px-6 py-4 font-bold text-slate-800 whitespace-nowrap">Hab. {t.room}</td>
                  <td className="px-4 sm:px-6 py-4 text-sm text-slate-600">{t.reason}</td>
                  <td className="px-4 sm:px-6 py-4 text-sm text-slate-600 font-medium whitespace-nowrap">{t.startDate}</td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    {t.status === 'En progreso' ? (
                      <button onClick={() => handleFinish(t.id, t.room)} className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 px-3 py-2 rounded-lg text-xs font-bold transition flex items-center shadow-sm">
                        <CheckCircle2 size={16} className="mr-1.5"/> Marcar como Listo
                      </button>
                    ) : (
                      <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-600 flex items-center w-max">
                        Completado
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {currentTasks.length === 0 && (
                 <tr><td colSpan="5" className="px-6 py-8 text-center text-slate-500 text-sm">No hay tareas de mantenimiento registradas.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* NUEVO: Controles de Paginación UI */}
        {totalPages > 1 && (
          <div className="px-4 sm:px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 disabled:opacity-40 hover:bg-slate-100 transition shadow-sm"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-sm text-slate-600 font-medium">
              Página {currentPage} de {totalPages}
            </span>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 disabled:opacity-40 hover:bg-slate-100 transition shadow-sm"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// 1. Pestaña Habitaciones
const RoomsTab = ({ rooms, setRooms, reservations, setReservations, maintenanceTasks }) => {
  const [newRoom, setNewRoom] = useState({ number: '', type: 'Habitación Individual', capacity: '1', price: '' });
  
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({ number: '', price: '' });

  const handleAddRoom = async (e) => {
    e.preventDefault();
    if (!newRoom.number || !newRoom.price) return;
    
    const newId = Date.now();
    await setDoc(HOTEL_DB.doc('rooms', newId), { id: newId, ...newRoom, status: 'Disponible' });
    
    setNewRoom({ number: '', type: 'Habitación Individual', capacity: '1', price: '' });
  };

  const openRoomModal = (room) => {
    setSelectedRoom(room);
    setEditFormData({ number: room.number, price: room.price });
    setIsEditing(false);
  };

  const handleSaveEdit = async () => {
    await setDoc(HOTEL_DB.doc('rooms', selectedRoom.id), { 
      number: editFormData.number, 
      price: editFormData.price 
    }, { merge: true });
    
    setSelectedRoom({ ...selectedRoom, number: editFormData.number, price: editFormData.price });
    setIsEditing(false);
  };

  const handleDeleteRoom = async () => {
    if (window.confirm('¿Estás seguro de eliminar esta habitación de forma permanente?')) {
      await deleteDoc(HOTEL_DB.doc('rooms', selectedRoom.id));
      setSelectedRoom(null);
    }
  };

  const handleCheckout = async (reservation) => {
    await setDoc(HOTEL_DB.doc('reservations', reservation.id), { status: 'Finalizada' }, { merge: true });
    
    const roomObj = rooms.find(r => r.number === reservation.room);
    if (roomObj) {
       await setDoc(HOTEL_DB.doc('rooms', roomObj.id), { status: 'Disponible' }, { merge: true });
    }
    
    setSelectedRoom({ ...selectedRoom, status: 'Disponible' });
  };

  const activeReservation = selectedRoom ? reservations.find(r => r.room === selectedRoom.number && (r.status === 'Confirmada' || r.status === 'En curso')) : null;
  const activeTask = selectedRoom ? maintenanceTasks.find(t => t.room === selectedRoom.number && t.status === 'En progreso') : null;

  const getCardStyle = (status) => {
    if (status === 'Disponible') return 'from-emerald-400 to-emerald-600 border-emerald-500/30 shadow-emerald-500/20';
    if (status === 'Ocupada') return 'from-rose-500 to-rose-600 border-rose-500/30 shadow-rose-500/20';
    if (status === 'Reservado') return 'from-blue-500 to-blue-600 border-blue-500/30 shadow-blue-500/20';
    if (status === 'En Mantenimiento') return 'from-amber-400 to-amber-600 border-amber-500/30 shadow-amber-500/20';
    return 'from-slate-400 to-slate-500 border-slate-500/30 shadow-slate-500/20';
  };

  return (
    <div className="space-y-6 sm:space-y-8 relative">
      
      {/* MODAL DE DETALLES Y EDICIÓN DE HABITACIÓN */}
      {selectedRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-3 sm:p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[95vh] sm:max-h-[90vh] animate-in fade-in zoom-in duration-200">
            {/* Header Modal */}
            <div className={`p-5 sm:p-6 flex-shrink-0 text-white flex justify-between items-start bg-gradient-to-r ${getCardStyle(selectedRoom.status).split(' ')[0]} ${getCardStyle(selectedRoom.status).split(' ')[1]}`}>
              <div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-1">Nro: {isEditing ? editFormData.number : selectedRoom.number}</h2>
                <p className="text-sm font-medium opacity-90">{selectedRoom.type} • {selectedRoom.status}</p>
              </div>
              <button onClick={() => setSelectedRoom(null)} className="p-2 hover:bg-white/20 rounded-full transition"><X size={24} /></button>
            </div>

            {/* Contenido Modal (con scroll) */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-5 sm:space-y-6">
              
              {/* Sección de Edición */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center mb-4 gap-3">
                  <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Datos de la Habitación</h4>
                  <div className="flex items-center space-x-3 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-200">
                    <button onClick={handleDeleteRoom} className="text-rose-600 hover:text-rose-700 flex items-center text-sm font-medium"><Trash2 size={16} className="mr-1"/> Eliminar</button>
                    {!isEditing ? (
                      <button onClick={() => setIsEditing(true)} className="text-yellow-600 hover:text-yellow-700 flex items-center text-sm font-medium bg-yellow-100/50 px-3 py-1.5 rounded-lg"><Edit2 size={16} className="mr-1"/> Editar</button>
                    ) : (
                      <button onClick={handleSaveEdit} className="text-emerald-600 hover:text-emerald-700 flex items-center text-sm font-medium bg-emerald-100 px-3 py-1.5 rounded-lg"><Save size={16} className="mr-1"/> Guardar</button>
                    )}
                  </div>
                </div>

                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-medium text-slate-500">Número / Nombre</label>
                      <input type="text" value={editFormData.number} onChange={e => setEditFormData({...editFormData, number: e.target.value})} className="w-full mt-1 p-2.5 sm:p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none text-base sm:text-sm" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-500">Precio (S/)</label>
                      <input type="number" value={editFormData.price} onChange={e => setEditFormData({...editFormData, price: e.target.value})} className="w-full mt-1 p-2.5 sm:p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none text-base sm:text-sm" />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-medium text-slate-500">Capacidad</p>
                      <p className="font-bold text-slate-800 text-base">{selectedRoom.capacity} Personas</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-500">Precio x Noche</p>
                      <p className="font-bold text-slate-800 text-base">S/ {selectedRoom.price}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Información del Huésped o Mantenimiento */}
              {(selectedRoom.status === 'Ocupada' || selectedRoom.status === 'Reservado') && activeReservation ? (
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                  <h4 className="font-bold text-blue-900 text-sm uppercase tracking-wider mb-4 flex items-center"><Users size={16} className="mr-2"/> Datos del Huésped</h4>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-medium text-blue-500">Huésped Principal (DNI: {activeReservation.dni})</p>
                      <p className="font-bold text-blue-900 break-words text-base">{activeReservation.client}</p>
                      <p className="text-sm text-blue-700 break-words">{activeReservation.email}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-3 border-t border-blue-200/50">
                      <div>
                        <p className="text-xs font-medium text-blue-500">Check-In</p>
                        <p className="font-bold text-blue-900">{activeReservation.dateIn}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-blue-500">Check-Out</p>
                        <p className="font-bold text-blue-900">{activeReservation.dateOut}</p>
                      </div>
                    </div>
                    <div className="pt-2">
                       <p className="text-xs font-medium text-blue-500 mb-1.5">Método de Pago</p>
                       <span className="inline-flex items-center px-2.5 py-1.5 rounded-lg bg-blue-100 text-blue-800 text-xs font-bold uppercase"><Wallet size={14} className="mr-1.5"/> {activeReservation.paymentMethod}</span>
                    </div>
                    <button onClick={() => handleCheckout(activeReservation)} className="mt-5 w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 sm:py-3 rounded-xl text-sm font-bold transition flex justify-center items-center shadow-md shadow-blue-600/20">
                      Realizar Check-out y Liberar
                    </button>
                  </div>
                </div>
              ) : selectedRoom.status === 'En Mantenimiento' && activeTask ? (
                <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                  <h4 className="font-bold text-amber-900 text-sm uppercase tracking-wider mb-4 flex items-center"><Wrench size={16} className="mr-2"/> Detalles de Mantenimiento</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-medium text-amber-600">Motivo / Tarea</p>
                      <p className="font-bold text-amber-900">{activeTask.reason}</p>
                    </div>
                    <div className="pt-3 border-t border-amber-200/50">
                      <p className="text-xs font-medium text-amber-600">Fecha de Inicio</p>
                      <p className="font-bold text-amber-900">{activeTask.startDate}</p>
                    </div>
                  </div>
                </div>
              ) : selectedRoom.status !== 'Disponible' ? (
                <div className="text-center py-6 text-slate-500 italic text-sm bg-slate-50 rounded-xl">
                  El estado es "{selectedRoom.status}" pero no hay datos asociados.
                </div>
              ) : (
                <div className="text-center py-6 text-emerald-600 font-medium bg-emerald-50 rounded-xl border border-emerald-100">
                  <CheckCircle2 size={32} className="mx-auto mb-2 opacity-50" />
                  Habitación Libre y Lista
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Formulario para agregar */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold mb-4 sm:mb-5 flex items-center"><Plus className="mr-2 text-yellow-600"/> Agregar Nueva Habitación</h3>
        <form onSubmit={handleAddRoom} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4 items-end">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Número de Hab.</label>
            <input required type="text" value={newRoom.number} onChange={e => setNewRoom({...newRoom, number: e.target.value})} className="w-full p-3 sm:p-2 border rounded-xl sm:rounded-lg outline-none focus:ring-2 focus:ring-yellow-500 text-base sm:text-sm" placeholder="Ej. 101" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Tipo</label>
            <select value={newRoom.type} onChange={e => setNewRoom({...newRoom, type: e.target.value})} className="w-full p-3 sm:p-2 border rounded-xl sm:rounded-lg outline-none focus:ring-2 focus:ring-yellow-500 text-base sm:text-sm">
              <option>Habitación Individual</option>
              <option>Habitación Doble</option>
              <option>Suite</option>
              <option>Matrimonial</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Capacidad</label>
            <input required type="number" min="1" value={newRoom.capacity} onChange={e => setNewRoom({...newRoom, capacity: e.target.value})} className="w-full p-3 sm:p-2 border rounded-xl sm:rounded-lg outline-none focus:ring-2 focus:ring-yellow-500 text-base sm:text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Precio x Noche (S/)</label>
            <input required type="number" value={newRoom.price} onChange={e => setNewRoom({...newRoom, price: e.target.value})} className="w-full p-3 sm:p-2 border rounded-xl sm:rounded-lg outline-none focus:ring-2 focus:ring-yellow-500 text-base sm:text-sm" placeholder="0.00" />
          </div>
          <button type="submit" className="w-full sm:col-span-2 md:col-span-1 bg-slate-900 text-white p-3.5 sm:p-2.5 rounded-xl sm:rounded-lg hover:bg-slate-800 transition font-bold sm:font-medium shadow-md">Guardar</button>
        </form>
      </div>

      {/* Cuadrícula de Habitaciones Estilo Visual Moderno */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-8 mb-4 gap-4">
        <h3 className="text-xl font-bold">Estado de Habitaciones</h3>
        <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm font-medium bg-white px-3 sm:px-4 py-2.5 rounded-xl shadow-sm border border-slate-100">
           <span className="flex items-center"><div className="w-3 h-3 bg-emerald-500 rounded-full mr-1.5 shadow-sm"></div> Disponible</span>
           <span className="flex items-center"><div className="w-3 h-3 bg-rose-500 rounded-full mr-1.5 shadow-sm"></div> Ocupada</span>
           <span className="flex items-center"><div className="w-3 h-3 bg-blue-500 rounded-full mr-1.5 shadow-sm"></div> Reservado</span>
           <span className="flex items-center"><div className="w-3 h-3 bg-amber-500 rounded-full mr-1.5 shadow-sm"></div> Mant.</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-5">
        {rooms.map(room => (
          <div 
            key={room.id} 
            onClick={() => openRoomModal(room)}
            className={`group relative flex flex-col justify-between p-5 rounded-2xl text-white shadow-lg border-b-4 cursor-pointer transition-all duration-300 transform hover:-translate-y-1 sm:hover:-translate-y-2 hover:shadow-2xl overflow-hidden bg-gradient-to-br ${getCardStyle(room.status)}`}
          >
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            
            <div className="relative z-10 flex justify-between items-start mb-6">
              <div>
                <h2 className="text-3xl sm:text-4xl font-black mb-1 tracking-tighter drop-shadow-sm">Nro:{room.number}</h2>
                <p className="text-xs font-medium opacity-90 tracking-wide">{room.type}</p>
              </div>
              <div className="bg-white/20 p-2.5 sm:p-2 rounded-xl backdrop-blur-sm">
                {room.status === 'Reservado' && <CalendarCheck size={28} className="opacity-100 sm:w-8 sm:h-8" strokeWidth={2} />}
                {room.status === 'En Mantenimiento' && <Wrench size={28} className="opacity-100 sm:w-8 sm:h-8" strokeWidth={2} />}
                {(room.status === 'Disponible' || room.status === 'Ocupada') && <BedDouble size={28} className="opacity-100 sm:w-8 sm:h-8" strokeWidth={2} />}
              </div>
            </div>
            
            <div className="relative z-10 mt-auto pt-3 pb-1 flex justify-between sm:justify-center items-center text-[11px] sm:text-xs font-bold uppercase tracking-widest border-t border-white/30">
              <div className="flex items-center space-x-1.5">
                {room.status === 'Disponible' && <Check size={14} />}
                <span>{room.status}</span>
              </div>
              <ArrowRight size={16} className="opacity-70 group-hover:translate-x-1 transition-transform sm:ml-2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 2. Pestaña Reservas 
const ReservationsTab = ({ reservations, setReservations, rooms, setRooms, guests, setGuests, users, setUsers }) => {
  const [newRes, setNewRes] = useState({ dni: '', client: '', email: '', room: '', dateIn: '', dateOut: '', paymentMethod: 'Efectivo', source: 'Directo' });
  const disponibles = rooms.filter(r => r.status === 'Disponible');

  // --- NUEVO: Paginación en Memoria ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const sortedReservations = [...reservations].sort((a, b) => new Date(b.dateIn || 0) - new Date(a.dateIn || 0)); // Más recientes primero
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReservations = sortedReservations.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedReservations.length / itemsPerPage) || 1;

  const handleDateSelect = ({ dateIn, dateOut }) => {
    setNewRes(prev => ({ ...prev, dateIn, dateOut }));
  };

  const handleDniChange = (e) => {
    const dniVal = e.target.value;
    setNewRes(prev => ({ ...prev, dni: dniVal }));
    
    if (dniVal.length >= 8) {
      const existingGuest = guests.find(g => g.dni === dniVal);
      if (existingGuest) {
        setNewRes(prev => ({ ...prev, client: existingGuest.name, email: existingGuest.email }));
      }
    }
  };

  const handleAddRes = async (e) => {
    e.preventDefault();
    if (!newRes.client || !newRes.room || !newRes.dateIn || !newRes.dateOut || !newRes.dni) return;
    
    const roomData = rooms.find(r => r.number === newRes.room);
    
    // Calculo de total en reserva manual
    const basePrice = roomData ? Number(roomData.price) : 0;
    const date1 = new Date(newRes.dateIn);
    const date2 = new Date(newRes.dateOut);
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    const roomPrice = basePrice * diffDays;
    
    const resId = Math.floor(1000 + Math.random() * 9000);

    if (!guests.find(g => g.dni === newRes.dni)) {
      await setDoc(HOTEL_DB.doc('guests', newRes.dni), { dni: newRes.dni, name: newRes.client, email: newRes.email });
    }

    if (!users.find(u => u.email === newRes.email || u.name === newRes.client)) {
      const newUserId = Date.now();
      await setDoc(HOTEL_DB.doc('users', newUserId), { id: newUserId, name: newRes.client, email: newRes.email, role: 'Huésped', status: 'Activo' });
    }

    await setDoc(HOTEL_DB.doc('reservations', resId), { id: resId, ...newRes, price: roomPrice, status: 'Confirmada' });
    
    if (roomData) {
      await setDoc(HOTEL_DB.doc('rooms', roomData.id), { status: 'Reservado' }, { merge: true });
    }

    setNewRes({ dni: '', client: '', email: '', room: '', dateIn: '', dateOut: '', paymentMethod: 'Efectivo', source: 'Directo' });
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col lg:flex-row gap-6 lg:gap-8">
        
        {/* Lado del Formulario de Texto */}
        <div className="flex-1 w-full order-2 lg:order-1">
          <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 flex items-center"><CalendarIcon className="mr-2 text-yellow-600"/> Registrar Nueva Reserva</h3>
          <form onSubmit={handleAddRes} className="space-y-4 sm:space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">DNI del Huésped</label>
                <input required type="text" maxLength="8" value={newRes.dni} onChange={handleDniChange} className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-yellow-500 transition-shadow bg-slate-50 focus:bg-white placeholder-slate-400 text-base sm:text-sm" placeholder="Ej. 72345678" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nombre Completo</label>
                <input required type="text" value={newRes.client} onChange={e=>setNewRes({...newRes, client: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-yellow-500 transition-shadow bg-slate-50 focus:bg-white text-base sm:text-sm" placeholder="Se auto-rellena con el DNI" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Correo Electrónico</label>
                <input required type="email" value={newRes.email} onChange={e=>setNewRes({...newRes, email: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-yellow-500 transition-shadow bg-slate-50 focus:bg-white text-base sm:text-sm" placeholder="correo@ejemplo.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Habitación a Asignar</label>
                <select required value={newRes.room} onChange={e=>setNewRes({...newRes, room: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-yellow-500 transition-shadow bg-slate-50 focus:bg-white cursor-pointer text-base sm:text-sm">
                  <option value="">Seleccione una disponible...</option>
                  {disponibles.map(r => <option key={r.id} value={r.number}>Hab. {r.number} ({r.type}) - S/ {r.price}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Método de Pago</label>
                <select required value={newRes.paymentMethod} onChange={e=>setNewRes({...newRes, paymentMethod: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-yellow-500 transition-shadow bg-slate-50 focus:bg-white cursor-pointer text-base sm:text-sm">
                  <option value="Efectivo">Efectivo / En mostrador</option>
                  <option value="Yape">Yape / Plin</option>
                  <option value="Depósito">Transferencia / Depósito</option>
                  <option value="Tarjeta">Tarjeta de Crédito / Débito</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Origen / Plataforma</label>
                <select required value={newRes.source} onChange={e=>setNewRes({...newRes, source: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-yellow-500 transition-shadow bg-slate-50 focus:bg-white cursor-pointer text-base sm:text-sm">
                  <option value="Directo">Teléfono / Counter (Directo)</option>
                  <option value="Booking">Booking.com</option>
                  <option value="Airbnb">Airbnb</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-2">
               <div className="p-3 sm:p-4 bg-slate-50 border border-slate-200 rounded-xl shadow-inner">
                 <p className="text-xs sm:text-sm text-slate-500 font-medium mb-1">Check-In</p>
                 <p className="font-bold text-slate-800 text-sm sm:text-base">{newRes.dateIn || '--/--/----'}</p>
               </div>
               <div className="p-3 sm:p-4 bg-slate-50 border border-slate-200 rounded-xl shadow-inner">
                 <p className="text-xs sm:text-sm text-slate-500 font-medium mb-1">Check-Out</p>
                 <p className="font-bold text-slate-800 text-sm sm:text-base">{newRes.dateOut || '--/--/----'}</p>
               </div>
            </div>

            <button type="submit" disabled={!newRes.dateIn || !newRes.dateOut} className="w-full mt-4 bg-yellow-600 text-white py-3.5 sm:py-3 rounded-xl hover:bg-yellow-700 transition font-bold text-base sm:text-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-yellow-600/20">
              Confirmar Reserva
            </button>
          </form>
        </div>

        {/* Lado del Calendario Interactivo */}
        <div className="w-full lg:w-[450px] flex flex-col items-center order-1 lg:order-2">
           <label className="block text-sm font-medium text-slate-700 w-full mb-3 text-center">Seleccione las fechas en el calendario</label>
           <InteractiveCalendar dateIn={newRes.dateIn} dateOut={newRes.dateOut} onDateSelect={handleDateSelect} />
        </div>

      </div>

      {/* Tabla de Reservas */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-lg">Historial de Reservas</h3>
          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full shadow-inner">Total: {reservations.length}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs sm:text-sm uppercase tracking-wider">
                <th className="px-4 sm:px-6 py-3 sm:py-4 font-medium">Origen</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 font-medium">Reserva ID</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 font-medium">Huésped (DNI)</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 font-medium">Habitación</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 font-medium">Fechas</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 font-medium">Status</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 font-medium text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentReservations.map((res) => (
                <tr key={res.id} className="hover:bg-slate-50 transition">
                  <td className="px-4 sm:px-6 py-4">
                    <div className="flex items-center space-x-2">
                       <SourceIcon source={res.source || 'Directo'} />
                       <span className="text-xs font-medium text-slate-600 hidden sm:inline">{res.source || 'Directo'}</span>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 font-mono text-sm font-bold text-slate-500">#{res.id.toString().substring(0, 10)}</td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <p className="font-bold text-slate-900">{res.client}</p>
                    <p className="text-xs text-slate-500">DNI: {res.dni}</p>
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-sm text-slate-700 whitespace-nowrap font-bold">Hab. {res.room}</td>
                  <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-slate-600 font-medium whitespace-nowrap">
                    <span className="text-emerald-600">IN: {res.dateIn}</span> <br/> <span className="text-rose-600">OUT: {res.dateOut || 'N/A'}</span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1.5 rounded-lg text-xs font-bold ${res.status === 'Finalizada' ? 'bg-slate-100 text-slate-600' : 'bg-emerald-100 text-emerald-700'}`}>
                      {res.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <button onClick={async () => {
                      if(window.confirm('¿Estás seguro de que deseas eliminar esta reserva?')) {
                        await deleteDoc(HOTEL_DB.doc('reservations', res.id));
                      }
                    }} className="p-2 text-slate-400 hover:text-rose-600">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {currentReservations.length === 0 && (
                 <tr><td colSpan="7" className="px-6 py-8 text-center text-slate-500 text-sm">No hay reservas registradas.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* NUEVO: Controles de Paginación UI */}
        {totalPages > 1 && (
          <div className="px-4 sm:px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 disabled:opacity-40 hover:bg-slate-100 transition shadow-sm"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-sm text-slate-600 font-medium">
              Página {currentPage} de {totalPages}
            </span>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 disabled:opacity-40 hover:bg-slate-100 transition shadow-sm"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// 3. Pestaña Usuarios
const UsersTab = ({ users, setUsers }) => {
  const [showUserModal, setShowUserModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [userForm, setUserForm] = useState({ id: '', name: '', email: '', role: 'Recepcionista', status: 'Activo' });

  // --- NUEVO: Paginación y Filtro de Personal en Memoria ---
  const staffUsers = users.filter(u => u.role !== 'Huésped');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = staffUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(staffUsers.length / itemsPerPage) || 1;

  const openAddUser = () => {
    setUserForm({ id: '', name: '', email: '', role: 'Recepcionista', status: 'Activo' });
    setIsEditing(false);
    setShowUserModal(true);
  };

  const openEditUser = (user) => {
    setUserForm(user);
    setIsEditing(true);
    setShowUserModal(true);
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    if(!userForm.name || !userForm.email) return;

    const id = userForm.id || Date.now();
    await setDoc(HOTEL_DB.doc('users', id), { ...userForm, id });
    
    setShowUserModal(false);
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este usuario de forma permanente?')) {
      await deleteDoc(HOTEL_DB.doc('users', id));
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* Modal de Usuario (Agregar/Editar) */}
      {showUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
            <div className="p-4 sm:p-6 border-b flex-shrink-0 border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-lg flex items-center">
                {isEditing ? <Edit2 className="mr-2 text-yellow-600" size={20}/> : <UserPlus className="mr-2 text-yellow-600" size={20}/>} 
                {isEditing ? 'Editar Usuario' : 'Registrar Usuario'}
              </h3>
              <button onClick={() => setShowUserModal(false)} className="p-2 hover:bg-slate-200 rounded-full transition"><X size={20} className="text-slate-500" /></button>
            </div>
            <form onSubmit={handleSaveUser} className="p-4 sm:p-6 overflow-y-auto space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nombre Completo</label>
                <input required type="text" value={userForm.name} onChange={e=>setUserForm({...userForm, name: e.target.value})} className="w-full p-3 sm:p-2 border border-slate-300 rounded-xl sm:rounded-lg outline-none focus:border-yellow-500 text-base sm:text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Correo Electrónico</label>
                <input required type="email" value={userForm.email} onChange={e=>setUserForm({...userForm, email: e.target.value})} className="w-full p-3 sm:p-2 border border-slate-300 rounded-xl sm:rounded-lg outline-none focus:border-yellow-500 text-base sm:text-sm" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Rol / Puesto</label>
                  <select value={userForm.role} onChange={e=>setUserForm({...userForm, role: e.target.value})} className="w-full p-3 sm:p-2 border border-slate-300 rounded-xl sm:rounded-lg outline-none focus:border-yellow-500 text-base sm:text-sm">
                    <option value="Administrador">Administrador</option>
                    <option value="Recepcionista">Recepcionista</option>
                    <option value="Mantenimiento">Mantenimiento</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Estado</label>
                  <select value={userForm.status} onChange={e=>setUserForm({...userForm, status: e.target.value})} className="w-full p-3 sm:p-2 border border-slate-300 rounded-xl sm:rounded-lg outline-none focus:border-yellow-500 text-base sm:text-sm">
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full mt-4 bg-slate-900 text-white py-3.5 sm:py-3 rounded-xl sm:rounded-lg hover:bg-slate-800 transition font-bold shadow-md">
                {isEditing ? 'Guardar Cambios' : 'Registrar Usuario'}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-slate-100 flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
          <div>
            <h3 className="font-bold text-lg">Personal del Sistema</h3>
            <p className="text-xs text-slate-500 mt-1">Total registrados: {staffUsers.length}</p>
          </div>
          <button onClick={openAddUser} className="bg-slate-900 text-white px-4 py-3 sm:py-2 rounded-xl sm:rounded-lg text-sm font-bold sm:font-medium hover:bg-slate-800 transition flex items-center w-full sm:w-auto justify-center shadow-md sm:shadow-none"><UserPlus size={16} className="mr-2"/> Nuevo Usuario</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs sm:text-sm uppercase tracking-wider">
                <th className="px-4 sm:px-6 py-3 sm:py-4 font-medium">Nombre</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 font-medium">Correo</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 font-medium">Rol / Puesto</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 font-medium">Estado</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50 transition">
                  <td className="px-4 sm:px-6 py-4 font-bold text-slate-900 flex items-center whitespace-nowrap"><div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center mr-3 text-xs flex-shrink-0">{u.name.charAt(0)}</div> {u.name}</td>
                  <td className="px-4 sm:px-6 py-4 text-sm text-slate-600">{u.email}</td>
                  <td className="px-4 sm:px-6 py-4 text-sm text-slate-600 font-medium whitespace-nowrap">{u.role}</td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1.5 rounded-lg text-xs font-bold ${u.status === 'Activo' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-right space-x-2 whitespace-nowrap">
                    <button onClick={() => openEditUser(u)} className="p-2.5 sm:p-2 text-slate-400 hover:text-yellow-600 bg-white border border-slate-200 hover:border-yellow-200 rounded-lg transition shadow-sm sm:shadow-none" title="Editar">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDeleteUser(u.id)} className="p-2.5 sm:p-2 text-slate-400 hover:text-rose-600 bg-white border border-slate-200 hover:border-rose-200 rounded-lg transition shadow-sm sm:shadow-none" title="Eliminar">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {currentUsers.length === 0 && (
                 <tr><td colSpan="5" className="px-6 py-8 text-center text-slate-500 text-sm">No hay usuarios registrados.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* NUEVO: Controles de Paginación UI */}
        {totalPages > 1 && (
          <div className="px-4 sm:px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 disabled:opacity-40 hover:bg-slate-100 transition shadow-sm"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-sm text-slate-600 font-medium">
              Página {currentPage} de {totalPages}
            </span>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 disabled:opacity-40 hover:bg-slate-100 transition shadow-sm"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// 4. Pestaña Huéspedes (NUEVA)
const GuestsTab = ({ guests, reservations }) => {
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ dni: '', name: '', email: '', phone: '' });

  // Paginación en Memoria
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentGuests = guests.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(guests.length / itemsPerPage) || 1;

  const openAdd = () => {
    setForm({ dni: '', name: '', email: '', phone: '' });
    setIsEditing(false);
    setShowModal(true);
  };

  const openEdit = (g) => {
    setForm({ dni: g.dni, name: g.name, email: g.email || '', phone: g.phone || '' });
    setIsEditing(true);
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if(!form.dni || !form.name) return;
    await setDoc(HOTEL_DB.doc('guests', form.dni), form, { merge: true });
    setShowModal(false);
  };

  const handleDelete = async (dni) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este huésped?')) {
      await deleteDoc(HOTEL_DB.doc('guests', dni));
    }
  };

  return (
    <div className="space-y-6 relative">
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
            <div className="p-4 sm:p-6 border-b flex-shrink-0 border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-lg flex items-center">
                {isEditing ? <Edit2 className="mr-2 text-yellow-600" size={20}/> : <UserPlus className="mr-2 text-yellow-600" size={20}/>} 
                {isEditing ? 'Editar Huésped' : 'Registrar Huésped'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-200 rounded-full transition"><X size={20} className="text-slate-500" /></button>
            </div>
            <form onSubmit={handleSave} className="p-4 sm:p-6 overflow-y-auto space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">DNI / Documento</label>
                <input required type="text" disabled={isEditing} value={form.dni} onChange={e=>setForm({...form, dni: e.target.value})} className="w-full p-3 sm:p-2 border border-slate-300 rounded-xl sm:rounded-lg outline-none focus:border-yellow-500 text-base sm:text-sm disabled:bg-slate-100" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nombre Completo</label>
                <input required type="text" value={form.name} onChange={e=>setForm({...form, name: e.target.value})} className="w-full p-3 sm:p-2 border border-slate-300 rounded-xl sm:rounded-lg outline-none focus:border-yellow-500 text-base sm:text-sm" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Correo Electrónico</label>
                  <input type="email" value={form.email} onChange={e=>setForm({...form, email: e.target.value})} className="w-full p-3 sm:p-2 border border-slate-300 rounded-xl sm:rounded-lg outline-none focus:border-yellow-500 text-base sm:text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono</label>
                  <input type="text" value={form.phone} onChange={e=>setForm({...form, phone: e.target.value})} className="w-full p-3 sm:p-2 border border-slate-300 rounded-xl sm:rounded-lg outline-none focus:border-yellow-500 text-base sm:text-sm" />
                </div>
              </div>
              <button type="submit" className="w-full mt-4 bg-slate-900 text-white py-3.5 sm:py-3 rounded-xl sm:rounded-lg hover:bg-slate-800 transition font-bold shadow-md">
                {isEditing ? 'Guardar Cambios' : 'Registrar Huésped'}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-slate-100 flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
          <div>
            <h3 className="font-bold text-lg">Directorio de Huéspedes</h3>
            <p className="text-xs text-slate-500 mt-1">Total registrados: {guests.length}</p>
          </div>
          <button onClick={openAdd} className="bg-slate-900 text-white px-4 py-3 sm:py-2 rounded-xl sm:rounded-lg text-sm font-bold sm:font-medium hover:bg-slate-800 transition flex items-center w-full sm:w-auto justify-center shadow-md sm:shadow-none"><UserPlus size={16} className="mr-2"/> Nuevo Huésped</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs sm:text-sm uppercase tracking-wider">
                <th className="px-4 sm:px-6 py-3 sm:py-4 font-medium">DNI / Doc</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 font-medium">Huésped</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 font-medium">Contacto</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 font-medium">Reservas Totales</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentGuests.map((g) => (
                <tr key={g.dni} className="hover:bg-slate-50 transition">
                  <td className="px-4 sm:px-6 py-4 font-mono text-sm font-bold text-slate-600">{g.dni}</td>
                  <td className="px-4 sm:px-6 py-4 font-bold text-slate-900 whitespace-nowrap">{g.name}</td>
                  <td className="px-4 sm:px-6 py-4 text-sm text-slate-600">
                    <p>{g.email || 'Sin correo'}</p>
                    {g.phone && <p className="text-xs text-slate-400">{g.phone}</p>}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-50 text-blue-700">
                      {reservations.filter(r => r.dni === g.dni).length} reservas
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-right space-x-2 whitespace-nowrap">
                    <button onClick={() => openEdit(g)} className="p-2.5 sm:p-2 text-slate-400 hover:text-yellow-600 bg-white border border-slate-200 hover:border-yellow-200 rounded-lg transition shadow-sm sm:shadow-none" title="Editar">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(g.dni)} className="p-2.5 sm:p-2 text-slate-400 hover:text-rose-600 bg-white border border-slate-200 hover:border-rose-200 rounded-lg transition shadow-sm sm:shadow-none" title="Eliminar">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {currentGuests.length === 0 && (
                 <tr><td colSpan="5" className="px-6 py-8 text-center text-slate-500 text-sm">No hay huéspedes registrados.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-4 sm:px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 disabled:opacity-40 hover:bg-slate-100 transition shadow-sm"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-sm text-slate-600 font-medium">
              Página {currentPage} de {totalPages}
            </span>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 disabled:opacity-40 hover:bg-slate-100 transition shadow-sm"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// 5. Pestaña Reportes
const ReportsTab = ({ reservations, rooms }) => {
  const data = [40, 70, 45, 90, 65, 100, 80];
  const [exportPeriod, setExportPeriod] = useState('mes');

  const totalRooms = rooms.length;
  const occupied = rooms.filter(r => r.status === 'Ocupada' || r.status === 'Reservado').length;
  const available = rooms.filter(r => r.status === 'Disponible').length;
  const maintenance = rooms.filter(r => r.status === 'En Mantenimiento').length;

  const pctOccupied = totalRooms === 0 ? 0 : Math.round((occupied / totalRooms) * 100);
  const pctAvailable = totalRooms === 0 ? 0 : Math.round((available / totalRooms) * 100);
  const pctMaintenance = totalRooms === 0 ? 0 : Math.round((maintenance / totalRooms) * 100);

  const handleExportCSV = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const filteredReservations = reservations.filter(res => {
      if (!res.dateIn) return false;
      const resDate = new Date(res.dateIn + 'T00:00:00');
      
      if (exportPeriod === 'todo') return true;
      if (exportPeriod === 'hoy') return resDate.getTime() === today.getTime();
      if (exportPeriod === 'semana') {
        const oneWeekAgo = new Date(today);
        oneWeekAgo.setDate(today.getDate() - 7);
        return resDate >= oneWeekAgo && resDate <= today;
      }
      if (exportPeriod === 'mes') return resDate.getMonth() === today.getMonth() && resDate.getFullYear() === today.getFullYear();
      if (exportPeriod === 'anio') return resDate.getFullYear() === today.getFullYear();
      return true;
    });

    if (filteredReservations.length === 0) {
      alert("No hay reservas en este período para exportar.");
      return;
    }

    const headers = ['ID Reserva', 'DNI', 'Huesped', 'Habitacion', 'Precio (S/)', 'Metodo de Pago', 'Check-In', 'Check-Out', 'Estado', 'Origen'];
    const csvRows = filteredReservations.map(r => 
      `"${r.id}","${r.dni || 'N/A'}","${r.client}","${r.room}","${r.price || 0}","${r.paymentMethod || 'N/A'}","${r.dateIn}","${r.dateOut}","${r.status}","${r.source || 'Directo'}"`
    );

    const csvContent = [headers.join(','), ...csvRows].join('\n');
    
    const blob = new Blob(["\ufeff", csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Reporte_Reservas_${exportPeriod}_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Reportes y Analítica</h2>
        
        {/* PANEL DE EXPORTACIÓN */}
        <div className="bg-white w-full sm:w-auto p-2 rounded-xl shadow-sm border border-slate-200 flex flex-row items-center justify-between sm:justify-start space-x-2">
          <span className="text-sm font-medium text-slate-50 pl-2 hidden sm:inline">Exportar:</span>
          <select 
            value={exportPeriod} 
            onChange={(e) => setExportPeriod(e.target.value)}
            className="p-3 sm:p-2 flex-1 sm:flex-none bg-slate-50 border border-slate-200 rounded-lg text-base sm:text-sm outline-none focus:ring-2 focus:ring-yellow-500 font-medium"
          >
            <option value="hoy">Hoy</option>
            <option value="semana">Últimos 7 días</option>
            <option value="mes">Este Mes</option>
            <option value="anio">Este Año</option>
            <option value="todo">Histórico Completo</option>
          </select>
          <button 
            onClick={handleExportCSV}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 sm:py-2 rounded-lg text-sm font-bold transition flex items-center shadow-sm"
          >
            <Download size={18} className="sm:mr-2"/> <span className="hidden sm:inline">Excel (CSV)</span>
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-80 sm:h-96">
          <h3 className="font-bold text-slate-700 mb-6 flex items-center"><Activity className="mr-2 text-blue-500"/> Ingresos del Mes (Soles)</h3>
          
          <div className="flex-1 flex items-end space-x-1 sm:space-x-3 pt-8 pb-2">
            {data.map((h, i) => (
              <div key={i} className="flex-1 h-full bg-slate-50 rounded-t-lg relative flex flex-col justify-end group">
                <div 
                  className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all duration-700 shadow-sm" 
                  style={{ height: `${h}%` }}
                ></div>
                <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center transition-opacity duration-200 z-10 pointer-events-none">
                   <span className="text-[10px] sm:text-xs font-bold bg-slate-800 text-white px-2 py-1 sm:px-2.5 sm:py-1.5 rounded shadow-lg whitespace-nowrap">S/ {h*10}</span>
                   <div className="w-2 h-2 bg-slate-800 rotate-45 -mt-1"></div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-[10px] sm:text-xs text-slate-400 mt-2 font-medium px-1 sm:px-2 border-t border-slate-100 pt-3">
            <span>Lun</span><span>Mar</span><span>Mie</span><span>Jue</span><span>Vie</span><span>Sab</span><span>Dom</span>
          </div>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-700 mb-6 flex items-center"><BedDouble className="mr-2 text-yellow-500"/> Ocupación de Habitaciones</h3>
          
          <div className="space-y-6 pt-2 sm:pt-4">
            <div>
              <div className="flex justify-between text-xs sm:text-sm mb-2"><span className="font-medium text-slate-700">Ocupadas / Reservadas</span><span className="font-bold">{pctOccupied}% ({occupied}/{totalRooms})</span></div>
              <div className="w-full bg-slate-100 rounded-full h-3 sm:h-4"><div className="bg-rose-500 h-3 sm:h-4 rounded-full shadow-sm transition-all duration-1000" style={{width: `${pctOccupied}%`}}></div></div>
            </div>
            <div>
              <div className="flex justify-between text-xs sm:text-sm mb-2"><span className="font-medium text-slate-700">Disponibles</span><span className="font-bold">{pctAvailable}% ({available}/{totalRooms})</span></div>
              <div className="w-full bg-slate-100 rounded-full h-3 sm:h-4"><div className="bg-emerald-500 h-3 sm:h-4 rounded-full shadow-sm transition-all duration-1000" style={{width: `${pctAvailable}%`}}></div></div>
            </div>
            <div>
              <div className="flex justify-between text-xs sm:text-sm mb-2"><span className="font-medium text-slate-700">En Mantenimiento</span><span className="font-bold">{pctMaintenance}% ({maintenance}/{totalRooms})</span></div>
              <div className="w-full bg-slate-100 rounded-full h-3 sm:h-4"><div className="bg-amber-500 h-3 sm:h-4 rounded-full shadow-sm transition-all duration-1000" style={{width: `${pctMaintenance}%`}}></div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 5. Pestaña Configuración (Perfil y PHP Integrado)
const SettingsTab = ({ adminProfile, setAdminProfile, rooms, reservations }) => {
  // Inicializamos el estado asegurándonos de que phpEndpoint exista
  const [formData, setFormData] = useState({
    ...adminProfile,
    apiIntegrations: adminProfile.apiIntegrations || { phpEndpoint: '' }
  });

  // Estado local para manejar los enlaces iCal por habitación. 
  const [roomIcalLinks, setRoomIcalLinks] = useState({});

  const [saved, setSaved] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testSuccess, setTestSuccess] = useState(false);
  const [testMessage, setTestMessage] = useState('');
  const fileInputRef = useRef(null);

  // NUEVO: Efecto para enviar datos a PHP automáticamente cuando las reservas cambian
  useEffect(() => {
    const updateServerJson = async () => {
      const endpoint = formData.apiIntegrations?.phpEndpoint;
      if (endpoint && endpoint.includes('http')) {
        try {
          await fetch(`${endpoint}?action=updateJson`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reservations)
          });
        } catch (e) {
          console.error("Error actualizando JSON en SiteGround", e);
        }
      }
    };
    updateServerJson();
  }, [reservations, formData.apiIntegrations.phpEndpoint]);

  // Cargar datos al montar
  useEffect(() => {
    if (adminProfile) {
       setFormData({
         ...adminProfile,
         apiIntegrations: adminProfile.apiIntegrations || { phpEndpoint: '' }
       });
       if (adminProfile.roomIcalLinks) {
         setRoomIcalLinks(adminProfile.roomIcalLinks);
       }
    }
  }, [adminProfile]);

  const handleSave = async (e) => {
    e.preventDefault();
    // Guardamos todo junto: datos de perfil y los links de habitaciones
    const dataToSave = {
      ...formData,
      roomIcalLinks: roomIcalLinks
    };
    await setDoc(HOTEL_DB.doc('adminProfile', 'main'), dataToSave);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleIcalChange = (roomNumber, platform, value) => {
    setRoomIcalLinks(prev => ({
      ...prev,
      [roomNumber]: {
        ...(prev[roomNumber] || { booking: '', airbnb: '' }),
        [platform]: value
      }
    }));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Enlace iCal copiado al portapapeles. Pégalo en Booking/Airbnb.");
  };

  // BOTÓN MÁGICO PARA LIMPIAR LAS PRUEBAS
  const handleClearSyncData = async () => {
    if (window.confirm("¿Seguro que deseas borrar TODAS las reservas sincronizadas de prueba? Esto limpiará los duplicados del calendario.")) {
      try {
        const resQuery = await getDocs(HOTEL_DB.col('reservations'));
        resQuery.forEach(async (docSnapshot) => {
          const data = docSnapshot.data();
          if (data.dni === 'iCal' || data.source === 'Booking' || data.source === 'Airbnb') {
            await deleteDoc(HOTEL_DB.doc('reservations', docSnapshot.id));
            
            // Liberar la habitación si estaba marcada como reservada
            if (data.room && data.room !== '??') {
              const roomObj = rooms.find(r => r.number === data.room);
              if (roomObj && roomObj.status === 'Reservado') {
                await setDoc(HOTEL_DB.doc('rooms', roomObj.id), { status: 'Disponible' }, { merge: true });
              }
            }
          }
        });
        alert("Calendario limpiado con éxito. Revisa tu panel principal.");
      } catch (e) {
        console.error("Error al limpiar:", e);
        alert("Hubo un error al intentar limpiar.");
      }
    }
  };

  // Función de prueba y sincronización (Manual)
  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestSuccess(false);
    setTestMessage('');

    const endpoint = formData.apiIntegrations.phpEndpoint;

    if (!endpoint || !endpoint.includes('http')) {
      setIsTesting(false);
      alert("Por favor, ingresa una URL válida donde alojaste tu script PHP en SiteGround.");
      return;
    }

    // Preparamos el array de datos que espera el nuevo PHP
    const roomsPayload = rooms.map(room => ({
      number: room.number,
      booking: roomIcalLinks[room.number]?.booking || '',
      airbnb: roomIcalLinks[room.number]?.airbnb || ''
    }));

    // Filtramos para enviar solo las que tienen algún link configurado
    const activeRooms = roomsPayload.filter(r => r.booking !== '' || r.airbnb !== '');

    if (activeRooms.length === 0) {
      setIsTesting(false);
      alert("No has configurado ningún enlace iCal para las habitaciones.");
      return;
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rooms: activeRooms })
      });
      
      const data = await response.json();
      
      if (data.status === 'success') {
        setTestSuccess(true);
        
        // --- NUEVA LÓGICA DE LIMPIEZA DE CANCELACIONES ---
        // Extraemos los IDs de las reservas que SÍ existen actualmente en Booking/Airbnb
        const activeIcalIds = [];
        
        if (data.reservas && data.reservas.length > 0) {
          for (const r of data.reservas) {
            const dIn = r.dateIn || new Date().toISOString().split('T')[0];
            const dOut = r.dateOut || dIn;
            const cName = r.client ? r.client.replace('SUMMARY:', '') : 'Huésped Sincronizado';
            const safeSource = r.source || 'Plataforma';
            const safeRoom = r.room || '??';

            const safeClientName = cName.replace(/[^a-zA-Z0-9]/g, '').substring(0, 15);
            const uniqueId = `sync_${safeSource}_${dIn}_${safeRoom}_${safeClientName}`;
            
            activeIcalIds.push(uniqueId); // Lo guardamos en la lista de activos

            // --- CÁLCULO DE PRECIO AUTOMÁTICO PARA RESERVAS SINCRONIZADAS ---
            const roomObjForPrice = rooms.find(room => room.number === safeRoom);
            const basePrice = roomObjForPrice ? Number(roomObjForPrice.price) || 0 : 0;
            const diffTime = Math.abs(new Date(dOut) - new Date(dIn));
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1; // Al menos 1 día
            const calculatedPrice = basePrice * diffDays;

            const newRes = {
              id: uniqueId,
              client: cName,
              dni: 'iCal',
              email: 'sincronizado@hotel.com',
              room: safeRoom,
              price: calculatedPrice, 
              dateIn: dIn,
              dateOut: dOut,
              status: 'Confirmada',
              paymentMethod: 'Pre-pagado',
              source: safeSource
            };

            try {
              await setDoc(HOTEL_DB.doc('reservations', uniqueId), newRes, { merge: true });
              const roomObj = rooms.find(room => room.number === safeRoom);
              if(roomObj && roomObj.status === 'Disponible') {
                 await setDoc(HOTEL_DB.doc('rooms', roomObj.id), { status: 'Reservado' }, { merge: true });
              }
            } catch (e) {
              console.error("Error de Firebase al guardar:", e);
            }
          }
        }
        
        // AHORA BORRAMOS LAS QUE FUERON CANCELADAS EN BOOKING/AIRBNB
        let canceladas = 0;
        const resQuery = await getDocs(HOTEL_DB.col('reservations'));
        resQuery.forEach(async (docSnapshot) => {
          const resData = docSnapshot.data();
          // Si es una reserva que vino originalmente de iCal y NO está en la lista de activos que acabamos de bajar...
          if ((resData.source === 'Booking' || resData.source === 'Airbnb') && resData.status !== 'Finalizada') {
             if (!activeIcalIds.includes(resData.id)) {
                 // Significa que fue cancelada en la plataforma, la borramos de nuestro sistema
                 await deleteDoc(HOTEL_DB.doc('reservations', docSnapshot.id));
                 canceladas++;
                 
                 // Liberamos la habitación si estaba asignada
                 if (resData.room && resData.room !== '??') {
                    const roomObj = rooms.find(r => r.number === resData.room);
                    if (roomObj && roomObj.status === 'Reservado') {
                      await setDoc(HOTEL_DB.doc('rooms', roomObj.id), { status: 'Disponible' }, { merge: true });
                    }
                 }
             }
          }
        });
        
        setTestMessage(`¡Sincronizado! ${data.total} reservas activas. ${canceladas > 0 ? `Se detectaron y borraron ${canceladas} cancelaciones.` : ''}`);

      } else {
        alert("Error del servidor PHP: " + data.message);
      }
    } catch (error) {
      console.error("Error al conectar con PHP:", error);
      alert("Error de conexión. Revisa la consola y tu script sync.php.");
    } finally {
      setIsTesting(false);
      setTimeout(() => { setTestSuccess(false); setTestMessage(''); }, 6000);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-slate-800">Configuración del Sistema</h2>
      
      {/* SECCIÓN 1: PERFIL DEL ADMINISTRADOR */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 sm:p-8 bg-slate-50 border-b border-slate-100 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left">
          
          <div className="relative mb-4 sm:mb-0 sm:mr-6 group cursor-pointer" onClick={() => fileInputRef.current.click()}>
            <div className="w-24 h-24 rounded-full border-4 border-white shadow-md bg-slate-200 overflow-hidden flex items-center justify-center text-slate-500 font-bold text-3xl">
              {formData.avatar ? (
                <img src={formData.avatar} alt="Perfil" className="w-full h-full object-cover" />
              ) : (
                formData.name.substring(0, 2).toUpperCase()
              )}
            </div>
            <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
              <Camera size={24} />
            </div>
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef} 
              onChange={handleImageChange} 
              className="hidden" 
            />
          </div>

          <div className="mt-2 sm:mt-0">
            <h3 className="text-xl font-bold text-slate-800">Datos del Administrador</h3>
            <p className="text-slate-500 text-sm mt-1">Actualiza tu foto personal e información de acceso.</p>
          </div>
        </div>
        
        <form id="settings-form" onSubmit={handleSave} className="p-5 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center"><User size={16} className="mr-2 text-slate-400"/> Nombre Completo</label>
              <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-yellow-500 bg-slate-50 focus:bg-white transition text-base sm:text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center"><Mail size={16} className="mr-2 text-slate-400"/> Correo Electrónico</label>
              <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-yellow-500 bg-slate-50 focus:bg-white transition text-base sm:text-sm" />
            </div>
          </div>
        </form>
      </div>

      {/* SECCIÓN 2: INTEGRACIÓN DE CANALES */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 sm:p-8 bg-blue-50/50 border-b border-blue-100 flex justify-between items-center flex-wrap gap-4">
          <div>
            <h3 className="text-xl font-bold text-slate-800 flex items-center"><Globe className="mr-2 text-blue-600"/> Sincronización de Habitaciones (iCal)</h3>
            <p className="text-slate-500 text-sm mt-1">Asigna los enlaces iCal de Booking o Airbnb a tus habitaciones creadas.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button 
              type="button" 
              onClick={handleClearSyncData}
              className="flex items-center px-4 py-2 bg-white border border-rose-200 text-rose-600 rounded-lg text-sm font-bold hover:bg-rose-50 transition shadow-sm"
            >
              <Trash2 size={16} className="mr-2" />
              Limpiar Pruebas
            </button>
            <button 
              type="button" 
              onClick={handleTestConnection}
              disabled={isTesting || !formData.apiIntegrations.phpEndpoint}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 disabled:opacity-50 transition shadow-sm"
            >
              {isTesting ? <Loader2 size={16} className="mr-2 animate-spin" /> : <RefreshCw size={16} className="mr-2" />}
              Sincronizar Ahora
            </button>
          </div>
        </div>
        
        <div className="p-5 sm:p-8 space-y-6">
          {testSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex flex-col sm:flex-row items-center text-emerald-700 text-sm font-medium animate-in fade-in">
              <CheckCircle2 className="mr-2 mb-2 sm:mb-0 flex-shrink-0" size={20} />
              {testMessage}
            </div>
          )}

          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 mb-6">
             <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center"><Server size={18} className="mr-2 text-slate-500"/> URL del Script en SiteGround</label>
             <p className="text-xs text-slate-500 mb-3">Ruta al archivo <b>sync.php</b> que procesa los calendarios.</p>
             <input 
                type="url" 
                value={formData.apiIntegrations.phpEndpoint} 
                onChange={e => setFormData({
                  ...formData, 
                  apiIntegrations: { ...formData.apiIntegrations, phpEndpoint: e.target.value }
                })} 
                className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm font-mono" 
                placeholder="https://tuhotel.com/sync.php" 
              />
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-slate-800 border-b border-slate-200 pb-2">Mapeo de Habitaciones</h4>
            
            {rooms.length === 0 ? (
               <p className="text-sm text-slate-500 italic p-4 bg-slate-50 rounded-lg border border-slate-200 text-center">No has creado habitaciones todavía.</p>
            ) : (
              rooms.map(room => (
                <div key={room.id} className="p-4 border border-slate-200 rounded-xl hover:border-blue-300 transition bg-white shadow-sm flex flex-col md:flex-row items-start md:items-center gap-4">
                  <div className="w-full md:w-1/4">
                    <p className="font-bold text-slate-800 text-lg flex items-center"><BedDouble size={18} className="mr-2 text-blue-500"/> Hab. {room.number}</p>
                    <p className="text-xs text-slate-500">{room.type}</p>
                    
                    {/* NUEVO: Botón de Exportación */}
                    {formData.apiIntegrations.phpEndpoint && formData.apiIntegrations.phpEndpoint.includes('http') && (
                      <div className="mt-3">
                        <p className="text-[10px] font-bold text-emerald-600 uppercase mb-1">Exportar a Booking/Airbnb</p>
                        <button 
                          onClick={() => copyToClipboard(`${formData.apiIntegrations.phpEndpoint}?exportRoom=${room.number}`)}
                          className="flex items-center text-xs bg-emerald-50 text-emerald-700 px-2 py-1.5 rounded hover:bg-emerald-100 transition border border-emerald-200"
                        >
                          <Copy size={12} className="mr-1" /> Copiar Enlace iCal
                        </button>
                      </div>
                    )}

                  </div>
                  <div className="w-full md:w-3/4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <div className="w-4 h-4 bg-[#003580] rounded-sm text-white flex items-center justify-center font-bold text-[8px]">B.</div>
                      </div>
                      <input 
                        type="text" 
                        value={roomIcalLinks[room.number]?.booking || ''}
                        onChange={(e) => handleIcalChange(room.number, 'booking', e.target.value)}
                        placeholder="Importar iCal Booking..." 
                        className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs font-mono outline-none focus:ring-2 focus:ring-[#003580]"
                      />
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <div className="w-4 h-4 bg-[#FF5A5F] rounded-sm text-white flex items-center justify-center">
                           <svg viewBox="0 0 24 24" fill="currentColor" className="w-2.5 h-2.5"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.88 14.71L12 13.5l-3.88 3.21.99-4.94-3.79-3.4 5.04-.43L12 3.5l1.64 4.44 5.04.43-3.79 3.4.99 4.94z"/></svg>
                        </div>
                      </div>
                      <input 
                        type="text" 
                        value={roomIcalLinks[room.number]?.airbnb || ''}
                        onChange={(e) => handleIcalChange(room.number, 'airbnb', e.target.value)}
                        placeholder="Importar iCal Airbnb..." 
                        className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs font-mono outline-none focus:ring-2 focus:ring-[#FF5A5F]"
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        <div className="p-5 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row justify-end items-center gap-4">
          {saved && <span className="text-emerald-600 font-bold sm:mr-4 flex items-center"><CheckCircle2 size={18} className="mr-1.5"/> Guardado correctamente</span>}
          <button 
            type="submit" 
            form="settings-form"
            className="w-full sm:w-auto bg-slate-900 text-white px-10 py-3.5 sm:py-3 rounded-xl hover:bg-slate-800 transition font-bold shadow-md shadow-slate-900/20 text-base sm:text-sm"
          >
            Guardar Toda la Configuración
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// VISTA 2: DASHBOARD ADMINISTRADOR (Principal)
// ==========================================
const DashboardView = ({ onLogout, reservations, setReservations, rooms, setRooms, users, setUsers, guests, setGuests, adminProfile, setAdminProfile, maintenanceTasks, setMaintenanceTasks }) => {
  const [activeTab, setActiveTab] = useState(() => { return localStorage.getItem('grandLuxeActiveTab') || 'dashboard'; });
  useEffect(() => { localStorage.setItem('grandLuxeActiveTab', activeTab); }, [activeTab]);

  const [showNotifications, setShowNotifications] = useState(false); 
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Estados y Refs para Sincronización Automática
  const [isAutoSyncing, setIsAutoSyncing] = useState(false);
  const roomsRef = useRef(rooms);
  const profileRef = useRef(adminProfile);

  useEffect(() => {
    roomsRef.current = rooms;
    profileRef.current = adminProfile;
  }, [rooms, adminProfile]);

  useEffect(() => {
    const performAutoSync = async () => {
      const currentProfile = profileRef.current;
      const currentRooms = roomsRef.current;
      const endpoint = currentProfile?.apiIntegrations?.phpEndpoint;
      const roomIcalLinks = currentProfile?.roomIcalLinks;

      if (!endpoint || !endpoint.includes('http') || !roomIcalLinks) return;

      const activeRooms = currentRooms.map(room => ({
        number: room.number,
        booking: roomIcalLinks[room.number]?.booking || '',
        airbnb: roomIcalLinks[room.number]?.airbnb || ''
      })).filter(r => r.booking !== '' || r.airbnb !== '');

      if (activeRooms.length === 0) return;

      setIsAutoSyncing(true);
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ rooms: activeRooms })
        });
        
        const data = await response.json();
        
        if (data.status === 'success') {
          
          const activeIcalIds = [];

          if (data.reservas && data.reservas.length > 0) {
            for (const r of data.reservas) {
              const dIn = r.dateIn || new Date().toISOString().split('T')[0];
              const dOut = r.dateOut || dIn;
              const cName = r.client ? r.client.replace('SUMMARY:', '') : 'Huésped Sincronizado';
              const safeSource = r.source || 'Plataforma';
              const safeRoom = r.room || '??';

              const safeClientName = cName.replace(/[^a-zA-Z0-9]/g, '').substring(0, 15);
              const uniqueId = `sync_${safeSource}_${dIn}_${safeRoom}_${safeClientName}`;
              
              activeIcalIds.push(uniqueId);

              // --- CÁLCULO DE PRECIO AUTOMÁTICO EN SEGUNDO PLANO ---
              const roomObjForPrice = currentRooms.find(room => room.number === safeRoom);
              const basePrice = roomObjForPrice ? Number(roomObjForPrice.price) || 0 : 0;
              const diffTime = Math.abs(new Date(dOut) - new Date(dIn));
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
              const calculatedPrice = basePrice * diffDays;

              const newRes = {
                id: uniqueId,
                client: cName,
                dni: 'iCal',
                email: 'sincronizado@hotel.com',
                room: safeRoom,
                price: calculatedPrice, 
                dateIn: dIn,
                dateOut: dOut,
                status: 'Confirmada',
                paymentMethod: 'Pre-pagado',
                source: safeSource
              };

              try {
                await setDoc(HOTEL_DB.doc('reservations', uniqueId), newRes, { merge: true });
                const roomObj = currentRooms.find(room => room.number === safeRoom);
                if(roomObj && roomObj.status === 'Disponible') {
                   await setDoc(HOTEL_DB.doc('rooms', roomObj.id), { status: 'Reservado' }, { merge: true });
                }
              } catch (e) {
                console.error("Error de Firebase al auto-guardar:", e);
              }
            }
          }

          // LÓGICA DE CANCELACIONES AUTOMÁTICAS
          const resQuery = await getDocs(HOTEL_DB.col('reservations'));
          resQuery.forEach(async (docSnapshot) => {
            const resData = docSnapshot.data();
            if ((resData.source === 'Booking' || resData.source === 'Airbnb') && resData.status !== 'Finalizada') {
               if (!activeIcalIds.includes(resData.id)) {
                   await deleteDoc(HOTEL_DB.doc('reservations', docSnapshot.id));
                   if (resData.room && resData.room !== '??') {
                      const roomObj = currentRooms.find(r => r.number === resData.room);
                      if (roomObj && roomObj.status === 'Reservado') {
                        await setDoc(HOTEL_DB.doc('rooms', roomObj.id), { status: 'Disponible' }, { merge: true });
                      }
                   }
               }
            }
          });

        }
      } catch (error) {
        console.error("Error en AutoSync PHP:", error);
      } finally {
        setIsAutoSyncing(false);
      }
    };

    // Iniciar la primera sincronización automática 5 segundos después de cargar
    const initialSync = setTimeout(() => {
      performAutoSync();
    }, 5000);

    // Luego, programar la sincronización cada 5 minutos (300,000 milisegundos)
    const intervalSync = setInterval(() => {
      performAutoSync();
    }, 300000);

    return () => {
      clearTimeout(initialSync);
      clearInterval(intervalSync);
    };
  }, []);

  const today = new Date();
  const todayStr = new Date(today.getTime() - (today.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
  const checkoutsToday = reservations.filter(r => r.dateOut === todayStr && (r.status === 'Confirmada' || r.status === 'En curso'));
  const todayRevenue = reservations.filter(r => r.status === 'Confirmada' || r.status === 'En curso').reduce((sum, r) => sum + (Number(r.price) || 0), 0);

  const navItems = [
    { id: 'dashboard', label: 'Panel Principal', icon: LayoutDashboard },
    { id: 'reservations', label: 'Reservas', icon: ClipboardList },
    { id: 'guests', label: 'Huéspedes', icon: Contact },
    { id: 'rooms', label: 'Habitaciones', icon: DoorOpen },
    { id: 'maintenance', label: 'Mantenimiento', icon: Wrench },
    { id: 'users', label: 'Personal', icon: Briefcase },
    { id: 'reports', label: 'Reportes', icon: BarChart3 },
    { id: 'settings', label: 'Configuración', icon: Settings },
  ];

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900 font-sans relative">
      {isMobileMenuOpen && <div className="fixed inset-0 bg-slate-900/50 z-40 md:hidden backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />}
      
      <div className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-slate-900 text-white flex flex-col z-50 transition-transform duration-300 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 border-r border-slate-800 shadow-2xl`}>
        <div className="p-5 sm:p-6 flex items-start justify-between border-b border-slate-800">
          <div className="flex items-center">
            <Building2 className="text-yellow-500 mr-3 flex-shrink-0" size={32}/>
            <div className="flex flex-col">
              <h1 className="font-serif font-bold text-xl tracking-wide leading-none">Grand Luxe</h1>
              <span className="text-[10px] text-slate-500 font-medium tracking-widest uppercase mt-1">Versión 1.0.0</span>
            </div>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-slate-400 hover:text-white p-2"><X size={24} /></button>
        </div>
        <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => { setActiveTab(item.id); setShowNotifications(false); setIsMobileMenuOpen(false); }} className={`flex items-center w-full px-4 py-3.5 sm:py-3 rounded-xl transition-all duration-200 ${ activeTab === item.id ? 'bg-yellow-600 text-white font-medium shadow-md shadow-yellow-600/20 md:translate-x-1' : 'text-slate-300 hover:bg-slate-800 hover:text-white' }`}>
              <item.icon size={20} className="mr-3 flex-shrink-0"/> <span className="truncate text-base sm:text-sm">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button onClick={onLogout} className="flex items-center text-slate-400 hover:text-white transition w-full px-4 py-3 sm:py-2 rounded-xl hover:bg-slate-800">
            <LogOut size={20} className="mr-3 flex-shrink-0"/> <span className="text-base sm:text-sm">Cerrar Sesión</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-screen overflow-hidden w-full">
        <header className="bg-white shadow-sm h-16 sm:h-20 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-30 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center">
            <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden mr-3 p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition"><Menu size={26} /></button>
            <h2 className="text-lg sm:text-2xl font-bold text-slate-800 truncate">{navItems.find(item => item.id === activeTab)?.label}</h2>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-5">
            
            {/* INDICADOR DE SINCRONIZACIÓN AUTOMÁTICA */}
            <div className="hidden sm:flex items-center text-[11px] font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
              {isAutoSyncing ? (
                <><RefreshCw size={12} className="animate-spin text-blue-600 mr-1.5" /> Sincronizando...</>
              ) : (
                <><CheckCircle2 size={12} className="text-emerald-500 mr-1.5" /> Sincronizado</>
              )}
            </div>

            <div 
              className="relative"
              onMouseEnter={() => { if(window.innerWidth >= 768) setShowNotifications(true); }}
              onMouseLeave={() => { if(window.innerWidth >= 768) setShowNotifications(false); }}
            >
              <button 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  if(window.innerWidth < 768) setShowNotifications(!showNotifications); 
                }} 
                className="relative p-2 text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-full transition"
              >
                <Bell size={22} className="sm:w-[22px] sm:h-[22px]" />
                {checkoutsToday.length > 0 && <span className="absolute top-0 right-0 bg-rose-500 text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-white">{checkoutsToday.length}</span>}
              </button>

              {/* DROPDOWN DE NOTIFICACIONES */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden" onClick={e => e.stopPropagation()}>
                  <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                    <h4 className="font-bold text-slate-800 text-sm">Notificaciones</h4>
                    <span className="bg-slate-200 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full">{checkoutsToday.length}</span>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {checkoutsToday.length > 0 ? (
                      checkoutsToday.map(res => (
                        <div key={res.id} className="p-4 border-b border-slate-50 hover:bg-slate-50 transition flex items-start cursor-default">
                          <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0 mr-3 mt-0.5">
                            <LogOut size={14} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800 leading-tight mb-0.5">Check-out pendiente hoy</p>
                            <p className="text-xs text-slate-500">Hab. {res.room} - {res.client}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-6 text-center flex flex-col items-center justify-center text-slate-500">
                        <CheckCircle2 size={32} className="text-emerald-400 mb-2 opacity-50" />
                        <p className="text-sm font-medium">No hay notificaciones</p>
                        <p className="text-xs opacity-70">Todo está al día por ahora.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div onClick={() => setActiveTab('settings')} className="flex items-center space-x-3 border-l pl-3 sm:pl-5 border-slate-200 cursor-pointer hover:bg-slate-50 p-1 sm:p-1.5 rounded-lg transition">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-bold text-slate-700">{adminProfile.name}</p>
                <p className="text-xs text-slate-500">{adminProfile.email}</p>
              </div>
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold border border-slate-300 shadow-sm overflow-hidden flex-shrink-0">
                {adminProfile.avatar ? <img src={adminProfile.avatar} alt="Perfil" className="w-full h-full object-cover" /> : adminProfile.name.substring(0, 2).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#f8fafc]" onClick={() => showNotifications && setShowNotifications(false)}>
          {activeTab === 'dashboard' && (
            <>
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-slate-800">Resumen del Día</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center hover:shadow-md transition cursor-default">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mr-4 flex-shrink-0"><ClipboardList size={26} className="sm:w-7 sm:h-7" /></div>
                  <div><p className="text-slate-500 text-xs sm:text-sm font-medium">Reservas Totales</p><p className="text-2xl sm:text-3xl font-black text-slate-800">{reservations.length}</p></div>
                </div>
                <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center hover:shadow-md transition cursor-default">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mr-4 flex-shrink-0"><DoorOpen size={26} className="sm:w-7 sm:h-7" /></div>
                  <div><p className="text-slate-500 text-xs sm:text-sm font-medium">Habitaciones Libres</p><p className="text-2xl sm:text-3xl font-black text-slate-800">{rooms.filter(r => r.status === 'Disponible').length}</p></div>
                </div>
                <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center hover:shadow-md transition cursor-default">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mr-4 flex-shrink-0"><Users size={26} className="sm:w-7 sm:h-7" /></div>
                  <div><p className="text-slate-500 text-xs sm:text-sm font-medium">Staff Activo</p><p className="text-2xl sm:text-3xl font-black text-slate-800">{users.filter(u => u.status === 'Activo').length}</p></div>
                </div>
                <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center hover:shadow-md transition cursor-default">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mr-4 flex-shrink-0"><CreditCard size={26} className="sm:w-7 sm:h-7" /></div>
                  <div><p className="text-slate-500 text-xs sm:text-sm font-medium">Ingresos (Activos)</p><p className="text-xl sm:text-3xl font-black text-yellow-600 truncate">S/ {todayRevenue}</p></div>
                </div>
              </div>
              <LargeCalendar reservations={reservations} />
            </>
          )}
          {activeTab === 'maintenance' && <MaintenanceTab rooms={rooms} setRooms={setRooms} maintenanceTasks={maintenanceTasks} setMaintenanceTasks={setMaintenanceTasks} />}
          {activeTab === 'rooms' && <RoomsTab rooms={rooms} setRooms={setRooms} reservations={reservations} setReservations={setReservations} maintenanceTasks={maintenanceTasks} />}
          {activeTab === 'reservations' && <ReservationsTab reservations={reservations} setReservations={setReservations} rooms={rooms} setRooms={setRooms} guests={guests} setGuests={setGuests} users={users} setUsers={setUsers} />}
          {activeTab === 'guests' && <GuestsTab guests={guests} reservations={reservations} />}
          {activeTab === 'users' && <UsersTab users={users} setUsers={setUsers} />}
          {activeTab === 'reports' && <ReportsTab reservations={reservations} rooms={rooms} />}
          {activeTab === 'settings' && <SettingsTab adminProfile={adminProfile} setAdminProfile={setAdminProfile} rooms={rooms} reservations={reservations} />}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  const [currentView, setCurrentView] = useState(() => { return localStorage.getItem('grandLuxeAdminSession') === 'active' ? 'dashboard' : 'login'; });
  const [user, setUser] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [maintenanceTasks, setMaintenanceTasks] = useState([]);
  const [guests, setGuests] = useState([]);
  const [users, setUsers] = useState([]);
  const [adminProfile, setAdminProfile] = useState({ 
    name: 'Admin Recepción', 
    email: 'admin@hotel.com', 
    avatar: null,
    apiIntegrations: { phpEndpoint: '' },
    roomIcalLinks: {}
  });

  const handleLoginSuccess = () => { localStorage.setItem('grandLuxeAdminSession', 'active'); localStorage.setItem('grandLuxeActiveTab', 'dashboard'); setCurrentView('dashboard'); };
  const handleLogout = () => { localStorage.removeItem('grandLuxeAdminSession'); localStorage.removeItem('grandLuxeActiveTab'); setCurrentView('login'); };

  useEffect(() => {
    const initAuth = async () => { try { await signInAnonymously(auth); } catch (error) { console.error(error); } };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    const unsubRooms = onSnapshot(HOTEL_DB.col('rooms'), snap => setRooms(snap.docs.map(d => d.data())));
    const unsubRes = onSnapshot(HOTEL_DB.col('reservations'), snap => setReservations(snap.docs.map(d => d.data())));
    const unsubTasks = onSnapshot(HOTEL_DB.col('maintenanceTasks'), snap => setMaintenanceTasks(snap.docs.map(d => d.data())));
    const unsubGuests = onSnapshot(HOTEL_DB.col('guests'), snap => setGuests(snap.docs.map(d => d.data())));
    const unsubUsers = onSnapshot(HOTEL_DB.col('users'), snap => setUsers(snap.docs.map(d => d.data())));
    const unsubAdmin = onSnapshot(HOTEL_DB.col('adminProfile'), snap => {
      const data = snap.docs.find(d => d.id === 'main')?.data();
      if (data) setAdminProfile(data);
    });
    return () => { unsubRooms(); unsubRes(); unsubTasks(); unsubGuests(); unsubUsers(); unsubAdmin(); };
  }, [user]);

  return (
    <div className="w-full min-h-screen bg-slate-50">
      {currentView === 'login' && <LoginView onLoginSuccess={handleLoginSuccess} />}
      {currentView === 'dashboard' && (
        <DashboardView 
          onLogout={handleLogout} 
          reservations={reservations} setReservations={setReservations}
          rooms={rooms} setRooms={setRooms}
          users={users} setUsers={setUsers}
          guests={guests} setGuests={setGuests}
          adminProfile={adminProfile} setAdminProfile={setAdminProfile}
          maintenanceTasks={maintenanceTasks} setMaintenanceTasks={setMaintenanceTasks}
        />
      )}
    </div>
  );
}