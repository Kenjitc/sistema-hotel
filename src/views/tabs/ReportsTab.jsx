import React, { useState } from 'react';
import { Download, Activity, BedDouble } from 'lucide-react';

export const ReportsTab = ({ reservations, rooms }) => {
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