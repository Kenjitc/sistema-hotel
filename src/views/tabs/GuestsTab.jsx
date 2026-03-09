import React, { useState } from 'react';
import { supabase } from '../../config/supabase';
import { UserPlus, Edit2, X, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

export const GuestsTab = ({ guests, setGuests, reservations }) => {
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
    
    if(isEditing){
      setGuests(prev => prev.map(g => g.dni === form.dni ? form : g));
    } else {
      setGuests(prev => [...prev, form]);
    }
    
    await supabase.from('guests').upsert([form]);
    setShowModal(false);
  };

  const handleDelete = async (dni) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este huésped?')) {
      setGuests(prev => prev.filter(g => g.dni !== dni));
      await supabase.from('guests').delete().eq('dni', dni);
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
