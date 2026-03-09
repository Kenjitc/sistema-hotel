import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../config/supabase';
import { LayoutDashboard, ClipboardList, Contact, DoorOpen, Wrench, Briefcase, BarChart3, Settings, Building2, X, LogOut, Menu, Bell, CheckCircle2, RefreshCw, Users, CreditCard } from 'lucide-react';
import { RoomsTab } from './tabs/RoomsTab';
import { ReservationsTab } from './tabs/ReservationsTab';
import { GuestsTab } from './tabs/GuestsTab';
import { UsersTab } from './tabs/UsersTab';
import { MaintenanceTab } from './tabs/MaintenanceTab';
import { ReportsTab } from './tabs/ReportsTab';
import { SettingsTab } from './tabs/SettingsTab';
import { LargeCalendar } from '../components/LargeCalendar';

export const DashboardView = ({ onLogout, reservations, setReservations, rooms, setRooms, users, setUsers, guests, setGuests, adminProfile, setAdminProfile, maintenanceTasks, setMaintenanceTasks }) => {
  const [activeTab, setActiveTab] = useState(() => { return localStorage.getItem('grandLuxeActiveTab') || 'dashboard'; });
  useEffect(() => { localStorage.setItem('grandLuxeActiveTab', activeTab); }, [activeTab]);

  const [showNotifications, setShowNotifications] = useState(false); 
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
                await supabase.from('reservations').upsert([newRes]);
                const roomObj = currentRooms.find(room => room.number === safeRoom);
                if(roomObj && roomObj.status === 'Disponible') {
                   await supabase.from('rooms').update({ status: 'Reservado' }).eq('id', roomObj.id);
                }
              } catch (e) {
                console.error("Error de Supabase al auto-guardar:", e);
              }
            }
          }

          const { data: resQuery } = await supabase.from('reservations').select('*');
          if(resQuery) {
              for (let docSnapshot of resQuery) {
                const resData = docSnapshot;
                if ((resData.source === 'Booking' || resData.source === 'Airbnb') && resData.status !== 'Finalizada') {
                   if (!activeIcalIds.includes(resData.id)) {
                       await supabase.from('reservations').delete().eq('id', docSnapshot.id);
                       if (resData.room && resData.room !== '??') {
                          const roomObj = currentRooms.find(r => r.number === resData.room);
                          if (roomObj && roomObj.status === 'Reservado') {
                            await supabase.from('rooms').update({ status: 'Disponible' }).eq('id', roomObj.id);
                          }
                       }
                   }
                }
              }
          }

        }
      } catch (error) {
        console.error("Error en AutoSync PHP:", error);
      } finally {
        setIsAutoSyncing(false);
      }
    };

    const initialSync = setTimeout(() => {
      performAutoSync();
    }, 5000);

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
          {activeTab === 'guests' && <GuestsTab guests={guests} setGuests={setGuests} reservations={reservations} />}
          {activeTab === 'users' && <UsersTab users={users} setUsers={setUsers} />}
          {activeTab === 'reports' && <ReportsTab reservations={reservations} rooms={rooms} />}
          {activeTab === 'settings' && <SettingsTab adminProfile={adminProfile} setAdminProfile={setAdminProfile} rooms={rooms} reservations={reservations} />}
        </main>
      </div>
    </div>
  );
};
