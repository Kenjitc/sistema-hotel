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

export const DashboardView = ({ onLogout, reservations, setReservations, rooms, setRooms, users, guests, adminProfile, setAdminProfile, maintenanceTasks, setMaintenanceTasks }) => {
  const [activeTab, setActiveTab] = useState(() => localStorage.getItem('grandLuxeActiveTab') || 'dashboard');
  const [showNotifications, setShowNotifications] = useState(false); 
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAutoSyncing, setIsAutoSyncing] = useState(false);

  useEffect(() => { localStorage.setItem('grandLuxeActiveTab', activeTab); }, [activeTab]);

  const todayStr = new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString().split('T')[0];
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
      
      <div className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-slate-900 text-white flex flex-col z-50 transition-transform duration-300 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 border-r border-slate-800`}>
        <div className="p-5 sm:p-6 flex items-start justify-between border-b border-slate-800">
          <div className="flex items-center"><Building2 className="text-yellow-500 mr-3" size={32}/><h1 className="font-serif font-bold text-xl">Grand Luxe</h1></div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-slate-400 p-2"><X size={24} /></button>
        </div>
        <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }} className={`flex items-center w-full px-4 py-3 rounded-xl transition ${ activeTab === item.id ? 'bg-yellow-600 text-white font-medium' : 'text-slate-300 hover:bg-slate-800' }`}>
              <item.icon size={20} className="mr-3"/> <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button onClick={onLogout} className="flex items-center text-slate-400 hover:text-white transition w-full px-4 py-3 rounded-xl hover:bg-slate-800"><LogOut size={20} className="mr-3"/> Cerrar Sesión</button>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-screen overflow-hidden w-full">
        <header className="bg-white shadow-sm h-16 sm:h-20 flex items-center justify-between px-4 sm:px-8 z-30 border-b border-slate-100">
          <div className="flex items-center">
            <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden mr-3 p-2 text-slate-500 hover:bg-slate-100 rounded-lg"><Menu size={26} /></button>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800">{navItems.find(item => item.id === activeTab)?.label}</h2>
          </div>
          <div className="flex items-center space-x-5">
            <div className="hidden sm:flex items-center text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
              <CheckCircle2 size={12} className="text-emerald-500 mr-1.5" /> Sincronizado
            </div>
            <div className="relative">
              <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2 text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-full transition">
                <Bell size={22} />
                {checkoutsToday.length > 0 && <span className="absolute top-0 right-0 bg-rose-500 text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-white">{checkoutsToday.length}</span>}
              </button>
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 z-50">
                   <div className="p-4 border-b bg-slate-50"><h4 className="font-bold text-sm">Notificaciones</h4></div>
                   <div className="max-h-64 overflow-y-auto p-4 text-sm text-slate-500">
                      {checkoutsToday.length > 0 ? checkoutsToday.map(r => <div key={r.id}>Check-out pendiente Hab. {r.room}</div>) : "Todo al día."}
                   </div>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-3 border-l pl-5 border-slate-200 cursor-pointer">
              <div className="text-right">
                <p className="text-sm font-bold text-slate-700">{adminProfile.name}</p>
                <p className="text-xs text-slate-500">{adminProfile.email}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-8 bg-[#f8fafc]">
          {activeTab === 'dashboard' && (
            <>
              <h2 className="text-xl font-bold mb-6">Resumen del Día</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center">
                  <div className="w-14 h-14 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mr-4"><ClipboardList size={26} /></div>
                  <div><p className="text-slate-500 text-sm font-medium">Reservas Totales</p><p className="text-3xl font-black">{reservations.length}</p></div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center">
                  <div className="w-14 h-14 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mr-4"><DoorOpen size={26} /></div>
                  <div><p className="text-slate-500 text-sm font-medium">Hab. Libres</p><p className="text-3xl font-black">{rooms.filter(r => r.status === 'Disponible').length}</p></div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center">
                  <div className="w-14 h-14 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mr-4"><Users size={26} /></div>
                  <div><p className="text-slate-500 text-sm font-medium">Staff Activo</p><p className="text-3xl font-black">{users.filter(u => u.status === 'Activo').length}</p></div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center">
                  <div className="w-14 h-14 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mr-4"><CreditCard size={26} /></div>
                  <div><p className="text-slate-500 text-sm font-medium">Ingresos</p><p className="text-xl font-black text-yellow-600">S/ {todayRevenue}</p></div>
                </div>
              </div>
              <LargeCalendar reservations={reservations} />
            </>
          )}
          {activeTab === 'maintenance' && <MaintenanceTab rooms={rooms} maintenanceTasks={maintenanceTasks} />}
          {activeTab === 'rooms' && <RoomsTab rooms={rooms} reservations={reservations} maintenanceTasks={maintenanceTasks} />}
          {activeTab === 'reservations' && <ReservationsTab reservations={reservations} rooms={rooms} guests={guests} users={users} />}
          {activeTab === 'guests' && <GuestsTab guests={guests} reservations={reservations} />}
          {activeTab === 'users' && <UsersTab users={users} />}
          {activeTab === 'reports' && <ReportsTab reservations={reservations} rooms={rooms} />}
          {activeTab === 'settings' && <SettingsTab adminProfile={adminProfile} rooms={rooms} reservations={reservations} />}
        </main>
      </div>
    </div>
  );
};