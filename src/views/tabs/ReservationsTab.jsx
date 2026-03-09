import React, { useState } from 'react';
import { supabase } from '../../config/supabase';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { InteractiveCalendar } from '../../components/InteractiveCalendar';
import { SourceIcon } from '../../components/LargeCalendar';

export const ReservationsTab = ({ reservations, rooms, guests, users }) => {
  const [newRes, setNewRes] = useState({ dni: '', client: '', email: '', room: '', dateIn: '', dateOut: '', paymentMethod: 'Efectivo', source: 'Directo' });
  const disponibles = rooms.filter(r => r.status === 'Disponible');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const sortedReservations = [...reservations].sort((a, b) => new Date(b.dateIn || 0) - new Date(a.dateIn || 0));
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReservations = sortedReservations.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedReservations.length / itemsPerPage) || 1;

  const handleDateSelect = ({ dateIn, dateOut }) => setNewRes(prev => ({ ...prev, dateIn, dateOut }));

  const handleDniChange = (e) => {
    const dniVal = e.target.value;
    setNewRes(prev => ({ ...prev, dni: dniVal }));
    if (dniVal.length >= 8) {
      const existingGuest = guests.find(g => g.dni === dniVal);
      if (existingGuest) setNewRes(prev => ({ ...prev, client: existingGuest.name, email: existingGuest.email }));
    }
  };

  const handleAddRes = async (e) => {
    e.preventDefault();
    if (!newRes.client || !newRes.room || !newRes.dateIn || !newRes.dateOut || !newRes.dni) return;
    
    const roomData = rooms.find(r => r.number === newRes.room);
    const basePrice = roomData ? Number(roomData.price) : 0;
    const diffTime = Math.abs(new Date(newRes.dateOut) - new Date(newRes.dateIn));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    const roomPrice = basePrice * diffDays;
    
    const resId = Math.floor(1000 + Math.random() * 9000).toString();

    if (!guests.find(g => g.dni === newRes.dni)) {
      await supabase.from('guests').upsert([{ dni: newRes.dni, name: newRes.client, email: newRes.email }]);
    }

    if (!users.find(u => u.email === newRes.email || u.name === newRes.client)) {
      const newUserId = Date.now().toString();
      await supabase.from('users').upsert([{ id: newUserId, name: newRes.client, email: newRes.email, role: 'Huésped', status: 'Activo' }]);
    }

    await supabase.from('reservations').upsert([{ id: resId, ...newRes, price: roomPrice, status: 'Confirmada' }]);
    
    if (roomData) {
      await supabase.from('rooms').update({ status: 'Reservado' }).eq('id', roomData.id);
    }

    setNewRes({ dni: '', client: '', email: '', room: '', dateIn: '', dateOut: '', paymentMethod: 'Efectivo', source: 'Directo' });
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col lg:flex-row gap-6 lg:gap-8">
        <div className="flex-1 w-full order-2 lg:order-1">
          <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 flex items-center"><CalendarIcon className="mr-2 text-yellow-600"/> Registrar Nueva Reserva</h3>
          <form onSubmit={handleAddRes} className="space-y-4 sm:space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">DNI del Huésped</label>
                <input required type="text" maxLength="8" value={newRes.dni} onChange={handleDniChange} className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-yellow-500 bg-slate-50 focus:bg-white placeholder-slate-400 text-base sm:text-sm" placeholder="Ej. 72345678" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nombre Completo</label>
                <input required type="text" value={newRes.client} onChange={e=>setNewRes({...newRes, client: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-yellow-500 bg-slate-50 focus:bg-white text-base sm:text-sm" placeholder="Se auto-rellena" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Correo Electrónico</label>
                <input required type="email" value={newRes.email} onChange={e=>setNewRes({...newRes, email: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-yellow-500 bg-slate-50 focus:bg-white text-base sm:text-sm" placeholder="correo@ejemplo.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Habitación a Asignar</label>
                <select required value={newRes.room} onChange={e=>setNewRes({...newRes, room: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-yellow-500 bg-slate-50 focus:bg-white cursor-pointer text-base sm:text-sm">
                  <option value="">Seleccione una disponible...</option>
                  {disponibles.map(r => <option key={r.id} value={r.number}>Hab. {r.number} ({r.type}) - S/ {r.price}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Método de Pago</label>
                <select required value={newRes.paymentMethod} onChange={e=>setNewRes({...newRes, paymentMethod: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-yellow-500 bg-slate-50 focus:bg-white cursor-pointer text-base sm:text-sm">
                  <option value="Efectivo">Efectivo / En mostrador</option>
                  <option value="Yape">Yape / Plin</option>
                  <option value="Depósito">Transferencia / Depósito</option>
                  <option value="Tarjeta">Tarjeta de Crédito / Débito</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Origen</label>
                <select required value={newRes.source} onChange={e=>setNewRes({...newRes, source: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-yellow-500 bg-slate-50 focus:bg-white cursor-pointer text-base sm:text-sm">
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

        <div className="w-full lg:w-[450px] flex flex-col items-center order-1 lg:order-2">
           <label className="block text-sm font-medium text-slate-700 w-full mb-3 text-center">Seleccione las fechas en el calendario</label>
           <InteractiveCalendar dateIn={newRes.dateIn} dateOut={newRes.dateOut} onDateSelect={handleDateSelect} />
        </div>
      </div>

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
                <th className="px-4 sm:px-6 py-3 sm:py-4 font-medium">ID</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 font-medium">Huésped</th>
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
                  <td className="px-4 sm:px-6 py-4 font-mono text-sm font-bold text-slate-500">#{String(res.id).substring(0, 10)}</td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap"><p className="font-bold text-slate-900">{res.client}</p><p className="text-xs text-slate-500">DNI: {res.dni}</p></td>
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
                        await supabase.from('reservations').delete().eq('id', res.id);
                      }
                    }} className="p-2 text-slate-400 hover:text-rose-600">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {totalPages > 1 && (
          <div className="px-4 sm:px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50">
            <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-100"><ChevronLeft size={20} /></button>
            <span className="text-sm text-slate-600 font-medium">Página {currentPage} de {totalPages}</span>
            <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-100"><ChevronRight size={20} /></button>
          </div>
        )}
      </div>
    </div>
  );
};
