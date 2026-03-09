import React, { useState, useEffect } from 'react';
import { supabase } from './config/supabase';
import { LoginView } from './views/LoginView';
import { DashboardView } from './views/DashboardView';

export default function App() {
  const [currentView, setCurrentView] = useState(() => localStorage.getItem('grandLuxeAdminSession') === 'active' ? 'dashboard' : 'login');
  
  const [rooms, setRooms] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [maintenanceTasks, setMaintenanceTasks] = useState([]);
  const [guests, setGuests] = useState([]);
  const [users, setUsers] = useState([]);
  const [adminProfile, setAdminProfile] = useState({ name: 'Admin', email: 'admin@hotel.com', avatar: null, apiIntegrations: { phpEndpoint: '' }, roomIcalLinks: {} });

  const handleLoginSuccess = () => { localStorage.setItem('grandLuxeAdminSession', 'active'); setCurrentView('dashboard'); };
  const handleLogout = () => { localStorage.removeItem('grandLuxeAdminSession'); setCurrentView('login'); };

  useEffect(() => {
    if (currentView !== 'dashboard') return;

    const fetchData = async () => {
      const [{ data: rRooms }, { data: rRes }, { data: rTasks }, { data: rGuests }, { data: rUsers }, { data: rAdmin }] = await Promise.all([
        supabase.from('rooms').select('*'),
        supabase.from('reservations').select('*'),
        supabase.from('maintenance_tasks').select('*'),
        supabase.from('guests').select('*'),
        supabase.from('users').select('*'),
        supabase.from('admin_profile').select('*').eq('id', 'main').single()
      ]);

      if (rRooms) setRooms(rRooms);
      if (rRes) setReservations(rRes);
      if (rTasks) setMaintenanceTasks(rTasks);
      if (rGuests) setGuests(rGuests);
      if (rUsers) setUsers(rUsers);
      if (rAdmin) setAdminProfile(rAdmin);
    };
    fetchData();

    const channel = supabase.channel('hotel-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'rooms' }, () => supabase.from('rooms').select('*').then(({data}) => setRooms(data || [])))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reservations' }, () => supabase.from('reservations').select('*').then(({data}) => setReservations(data || [])))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'maintenance_tasks' }, () => supabase.from('maintenance_tasks').select('*').then(({data}) => setMaintenanceTasks(data || [])))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'guests' }, () => supabase.from('guests').select('*').then(({data}) => setGuests(data || [])))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, () => supabase.from('users').select('*').then(({data}) => setUsers(data || [])))
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [currentView]);

  return (
    <div className="w-full min-h-screen bg-slate-50">
      {currentView === 'login' && <LoginView onLoginSuccess={handleLoginSuccess} />}
      {currentView === 'dashboard' && (
        <DashboardView 
          onLogout={handleLogout} 
          reservations={reservations} setReservations={setReservations}
          rooms={rooms} setRooms={setRooms}
          users={users} guests={guests} 
          adminProfile={adminProfile} setAdminProfile={setAdminProfile}
          maintenanceTasks={maintenanceTasks} 
        />
      )}
    </div>
  );
}
