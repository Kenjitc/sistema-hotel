import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, ClipboardList, X, Building2 } from 'lucide-react';

export const SourceIcon = ({ source }) => {
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

export const LargeCalendar = ({ reservations }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedRes, setSelectedRes] = useState(null);

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
              <span className="truncate font-medium text-slate-700 ml-1">{r.client?.split(' ')[0]} <span className="text-slate-400 font-normal">H{r.room}</span></span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mt-6 flex flex-col relative">
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