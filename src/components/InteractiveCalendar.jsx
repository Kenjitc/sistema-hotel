import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const InteractiveCalendar = ({ dateIn, dateOut, onDateSelect }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const days = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'];
  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const todayObj = new Date();
  todayObj.setHours(0, 0, 0, 0);
  const isPrevMonthDisabled = year < todayObj.getFullYear() || (year === todayObj.getFullYear() && month <= todayObj.getMonth());

  const handleDayClick = (day) => {
    const selectedDate = new Date(year, month, day);
    const formattedDate = new Date(selectedDate.getTime() - (selectedDate.getTimezoneOffset() * 60000)).toISOString().split('T')[0];

    if (!dateIn || (dateIn && dateOut)) {
      onDateSelect({ dateIn: formattedDate, dateOut: '' });
    } else {
      const start = new Date(dateIn);
      if (selectedDate > start) {
        onDateSelect({ dateIn, dateOut: formattedDate });
      } else {
        onDateSelect({ dateIn: formattedDate, dateOut: '' });
      }
    }
  };

  const isSelected = (day) => {
    const d = new Date(year, month, day);
    const formatted = new Date(d.getTime() - (d.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
    return formatted === dateIn || formatted === dateOut;
  };

  const isBetween = (day) => {
    if (!dateIn || !dateOut) return false;
    const d = new Date(year, month, day);
    const start = new Date(dateIn + 'T00:00:00');
    const end = new Date(dateOut + 'T00:00:00');
    return d > start && d < end;
  };

  const renderCells = () => {
    const cells = [];
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);

    for (let i = 0; i < firstDay; i++) {
      cells.push(<div key={`empty-${i}`} className="p-1 sm:p-2"></div>);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const selected = isSelected(d);
      const between = isBetween(d);
      const dDate = new Date(year, month, d);
      const formatted = new Date(dDate.getTime() - (dDate.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
      const isStart = dateIn === formatted;
      const isEnd = dateOut === formatted;
      const isPast = dDate < todayDate;

      cells.push(
        <button
          key={d}
          type="button"
          disabled={isPast}
          onClick={() => handleDayClick(d)}
          className={`
            h-10 sm:h-12 w-full flex items-center justify-center text-sm sm:text-base font-medium transition-all
            ${selected ? 'bg-yellow-600 text-white font-bold shadow-md z-10 relative' : ''}
            ${between ? 'bg-yellow-100 text-yellow-800' : ''}
            ${!selected && !between && !isPast ? 'text-slate-700 hover:bg-slate-100 rounded-lg' : ''}
            ${isStart ? 'rounded-l-lg' : ''}
            ${isEnd ? 'rounded-r-lg' : ''}
            ${selected && !isStart && !isEnd ? 'rounded-lg' : ''}
            ${isPast ? 'text-slate-300 cursor-not-allowed opacity-50' : ''}
          `}
        >
          {d}
        </button>
      );
    }
    return cells;
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4 sm:p-6 w-full select-none">
      <div className="flex justify-between items-center mb-6">
        <button type="button" onClick={prevMonth} disabled={isPrevMonthDisabled} className="p-2 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed rounded-full transition"><ChevronLeft size={24} className="text-slate-600"/></button>
        <div className="font-bold text-slate-800 text-lg sm:text-xl">{monthNames[month]} {year}</div>
        <button type="button" onClick={nextMonth} className="p-2 hover:bg-slate-100 rounded-full transition"><ChevronRight size={24} className="text-slate-600"/></button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {days.map(d => <div key={d} className="text-center text-xs sm:text-sm font-bold text-slate-400 py-1">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-y-1 sm:gap-y-2 gap-x-0">
        {renderCells()}
      </div>
      
      <div className="mt-6 flex justify-between text-xs sm:text-sm text-slate-500 border-t border-slate-100 pt-4">
        <div className="flex flex-col">
          <span className="font-medium">Check-In</span>
          <span className={`font-bold ${dateIn ? 'text-yellow-600' : 'text-slate-400'}`}>{dateIn || 'Seleccione fecha'}</span>
        </div>
        <div className="flex flex-col text-right">
          <span className="font-medium">Check-Out</span>
          <span className={`font-bold ${dateOut ? 'text-yellow-600' : 'text-slate-400'}`}>{dateOut || 'Seleccione fecha'}</span>
        </div>
      </div>
    </div>
  );
};