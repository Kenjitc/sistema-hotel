import React, { useState } from 'react';
import { supabase } from '../../config/supabase';
import { UserPlus, Edit2, X, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

export const UsersTab = ({ users, setUsers }) => {
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

    const id = userForm.id || Date.now().toString();
    const newUserData = { ...userForm, id };
    
    // UI update instantáneo
    if(isEditing){
      setUsers(prev => prev.map(u => u.id === id ? newUserData : u));
    } else {
      setUsers(prev => [...prev, newUserData]);
    }
    
    await supabase.from('users').upsert([newUserData]);
    
    setShowUserModal(false);
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este usuario de forma permanente?')) {
      setUsers(prev => prev.filter(u => u.id !== id));
      await supabase.from('users').delete().eq('id', id);
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
