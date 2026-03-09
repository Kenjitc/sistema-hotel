import React, { useState } from 'react';
import { supabase } from '../../config/supabase';
import { Plus, X, Trash2, Edit2, Save, Users, Wallet, Wrench, CheckCircle2, CalendarCheck, BedDouble, Check, ArrowRight } from 'lucide-react';

export const RoomsTab = ({ rooms, setRooms, reservations, setReservations, maintenanceTasks }) => {
  const [newRoom, setNewRoom] = useState({ number: '', type: 'Habitación Individual', capacity: '1', price: '' });
  
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({ number: '', price: '' });

  const handleAddRoom = async (e) => {
    e.preventDefault();
    if (!newRoom.number || !newRoom.price) return;
    
    const newId = Date.now().toString();
    const newRoomData = { id: newId, ...newRoom, status: 'Disponible' };
    
    // 1. UI update optimista (INSTANTÁNEO)
    setRooms(prev => [...prev, newRoomData]);
    
    // 2. Guardar en Supabase
    await supabase.from('rooms').insert([newRoomData]);
    
    setNewRoom({ number: '', type: 'Habitación Individual', capacity: '1', price: '' });
  };

  const openRoomModal = (room) => {
    setSelectedRoom(room);
    setEditFormData({ number: room.number, price: room.price });
    setIsEditing(false);
  };

  const handleSaveEdit = async () => {
    const updatedRoom = { ...selectedRoom, number: editFormData.number, price: editFormData.price };
    
    // UI Update instantáneo
    setRooms(prev => prev.map(r => r.id === selectedRoom.id ? updatedRoom : r));
    
    await supabase.from('rooms').update({ number: editFormData.number, price: editFormData.price }).eq('id', selectedRoom.id);
    
    setSelectedRoom(updatedRoom);
    setIsEditing(false);
  };

  const handleDeleteRoom = async () => {
    if (window.confirm('¿Estás seguro de eliminar esta habitación de forma permanente?')) {
      setRooms(prev => prev.filter(r => r.id !== selectedRoom.id));
      await supabase.from('rooms').delete().eq('id', selectedRoom.id);
      setSelectedRoom(null);
    }
  };

  const handleCheckout = async (reservation) => {
    // Liberar habitación en UI instantáneamente
    setRooms(prev => prev.map(r => r.number === reservation.room ? { ...r, status: 'Disponible' } : r));
    setReservations(prev => prev.map(r => r.id === reservation.id ? { ...r, status: 'Finalizada' } : r));
    
    await supabase.from('reservations').update({ status: 'Finalizada' }).eq('id', reservation.id);
    
    const roomObj = rooms.find(r => r.number === reservation.room);
    if (roomObj) {
       await supabase.from('rooms').update({ status: 'Disponible' }).eq('id', roomObj.id);
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