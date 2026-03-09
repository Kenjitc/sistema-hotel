import React, { useState } from 'react';
import { supabase } from '../../config/supabase';
import { Wrench, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';

export const MaintenanceTab = ({ rooms, setRooms, maintenanceTasks, setMaintenanceTasks }) => {
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

    const taskId = Math.floor(1000 + Math.random() * 9000).toString();
    const roomToUpdate = rooms.find(r => r.number === newTask.room);

    await supabase.from('maintenance_tasks').insert([{
      id: taskId,
      room: newTask.room,
      reason: newTask.reason,
      startDate: todayStr,
      status: 'En progreso'
    }]);

    if (roomToUpdate) {
       await supabase.from('rooms').update({ status: 'En Mantenimiento' }).eq('id', roomToUpdate.id);
    }

    setNewTask({ room: '', reason: '' });
  };

  const handleFinish = async (taskId, roomNumber) => {
    await supabase.from('maintenance_tasks').update({ status: 'Completado' }).eq('id', taskId);
    
    const roomToUpdate = rooms.find(r => r.number === roomNumber);
    if (roomToUpdate) {
       await supabase.from('rooms').update({ status: 'Disponible' }).eq('id', roomToUpdate.id);
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
