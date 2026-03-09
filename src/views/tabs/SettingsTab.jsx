import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../config/supabase';
import { User, Mail, Globe, Trash2, Loader2, RefreshCw, Server, BedDouble, Copy, Camera, CheckCircle2 } from 'lucide-react';

export const SettingsTab = ({ adminProfile, setAdminProfile, rooms, reservations }) => {
  const [formData, setFormData] = useState({ ...adminProfile, apiIntegrations: adminProfile.apiIntegrations || { phpEndpoint: '' } });
  const [roomIcalLinks, setRoomIcalLinks] = useState({});
  const [saved, setSaved] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testSuccess, setTestSuccess] = useState(false);
  const [testMessage, setTestMessage] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    const updateServerJson = async () => {
      const endpoint = formData.apiIntegrations?.phpEndpoint;
      if (endpoint && endpoint.includes('http')) {
        try {
          await fetch(`${endpoint}?action=updateJson`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(reservations) });
        } catch (e) { console.error(e); }
      }
    };
    updateServerJson();
  }, [reservations, formData.apiIntegrations.phpEndpoint]);

  useEffect(() => {
    if (adminProfile) {
       setFormData({ ...adminProfile, apiIntegrations: adminProfile.apiIntegrations || { phpEndpoint: '' } });
       if (adminProfile.roomIcalLinks) setRoomIcalLinks(adminProfile.roomIcalLinks);
    }
  }, [adminProfile]);

  const handleSave = async (e) => {
    e.preventDefault();
    const dataToSave = { ...formData, roomIcalLinks };
    await supabase.from('admin_profile').upsert([{ id: 'main', ...dataToSave }]);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleIcalChange = (roomNumber, platform, value) => {
    setRoomIcalLinks(prev => ({ ...prev, [roomNumber]: { ...(prev[roomNumber] || { booking: '', airbnb: '' }), [platform]: value } }));
  };

  const copyToClipboard = (text) => { navigator.clipboard.writeText(text); alert("Enlace iCal copiado"); };

  const handleClearSyncData = async () => {
    if (window.confirm("¿Borrar TODAS las reservas sincronizadas de prueba?")) {
      const { data } = await supabase.from('reservations').select('*').in('source', ['Booking', 'Airbnb']);
      if(data) {
        for(let res of data) {
          await supabase.from('reservations').delete().eq('id', res.id);
          if (res.room && res.room !== '??') await supabase.from('rooms').update({ status: 'Disponible' }).eq('number', res.room);
        }
      }
      alert("Limpiado con éxito.");
    }
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    const endpoint = formData.apiIntegrations.phpEndpoint;
    if (!endpoint || !endpoint.includes('http')) { setIsTesting(false); return; }

    const activeRooms = rooms.map(room => ({ number: room.number, booking: roomIcalLinks[room.number]?.booking || '', airbnb: roomIcalLinks[room.number]?.airbnb || '' })).filter(r => r.booking !== '' || r.airbnb !== '');

    try {
      const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ rooms: activeRooms }) });
      const data = await response.json();
      
      if (data.status === 'success') {
        setTestSuccess(true);
        const activeIcalIds = [];
        
        if (data.reservas && data.reservas.length > 0) {
          for (const r of data.reservas) {
            const uniqueId = `sync_${r.source}_${r.dateIn}_${r.room}_${r.client.replace(/[^a-zA-Z0-9]/g, '').substring(0, 15)}`;
            activeIcalIds.push(uniqueId);
            const newRes = { id: uniqueId, client: r.client, dni: 'iCal', email: 'sync@hotel.com', room: r.room, price: 0, dateIn: r.dateIn, dateOut: r.dateOut || r.dateIn, status: 'Confirmada', paymentMethod: 'Pre-pagado', source: r.source };
            await supabase.from('reservations').upsert([newRes]);
            await supabase.from('rooms').update({ status: 'Reservado' }).eq('number', r.room);
          }
        }
        
        const { data: currentRes } = await supabase.from('reservations').select('*').in('source', ['Booking', 'Airbnb']);
        if(currentRes){
          for(let cr of currentRes) {
            if(!activeIcalIds.includes(cr.id) && cr.status !== 'Finalizada') {
              await supabase.from('reservations').delete().eq('id', cr.id);
              await supabase.from('rooms').update({ status: 'Disponible' }).eq('number', cr.room);
            }
          }
        }
        setTestMessage("Sincronizado correctamente.");
      }
    } catch (error) { console.error(error); } finally { setIsTesting(false); setTimeout(() => setTestSuccess(false), 6000); }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData({ ...formData, avatar: reader.result });
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-xl font-bold mb-4 text-slate-800">Configuración</h2>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 sm:p-8 bg-slate-50 border-b border-slate-100 flex items-center">
          <div className="relative mr-6 cursor-pointer" onClick={() => fileInputRef.current.click()}>
            <div className="w-24 h-24 rounded-full border-4 border-white shadow-md bg-slate-200 overflow-hidden flex items-center justify-center text-slate-500 font-bold text-3xl">
              {formData.avatar ? <img src={formData.avatar} className="w-full h-full object-cover" /> : formData.name.substring(0, 2).toUpperCase()}
            </div>
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} className="hidden" />
          </div>
          <div><h3 className="text-xl font-bold text-slate-800">Datos del Administrador</h3></div>
        </div>
        <form id="settings-form" onSubmit={handleSave} className="p-5 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div><label className="block text-sm font-medium mb-1">Nombre Completo</label><input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-3 border rounded-xl" /></div>
            <div><label className="block text-sm font-medium mb-1">Correo</label><input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-3 border rounded-xl" /></div>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 sm:p-8 bg-blue-50/50 border-b border-blue-100 flex justify-between items-center flex-wrap gap-4">
          <div><h3 className="text-xl font-bold text-slate-800 flex items-center"><Globe className="mr-2 text-blue-600"/> Sincronización iCal</h3></div>
          <div className="flex gap-2">
            <button type="button" onClick={handleClearSyncData} className="px-4 py-2 border border-rose-200 text-rose-600 rounded-lg font-bold">Limpiar</button>
            <button type="button" onClick={handleTestConnection} disabled={isTesting} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold">Sync Ahora</button>
          </div>
        </div>
        
        <div className="p-5 sm:p-8 space-y-6">
          {testSuccess && <div className="p-4 bg-emerald-50 text-emerald-700 font-medium rounded-xl">{testMessage}</div>}
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 mb-6">
             <label className="block text-sm font-bold text-slate-700 mb-2">URL del Script PHP</label>
             <input type="url" value={formData.apiIntegrations.phpEndpoint} onChange={e => setFormData({...formData, apiIntegrations: { ...formData.apiIntegrations, phpEndpoint: e.target.value }})} className="w-full p-3 border rounded-lg" placeholder="[https://tuhotel.com/sync.php](https://tuhotel.com/sync.php)" />
          </div>
          <div className="space-y-4">
            {rooms.map(room => (
              <div key={room.id} className="p-4 border rounded-xl bg-white shadow-sm flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-1/4">
                  <p className="font-bold">Hab. {room.number}</p>
                </div>
                <div className="w-full md:w-3/4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input type="text" value={roomIcalLinks[room.number]?.booking || ''} onChange={(e) => handleIcalChange(room.number, 'booking', e.target.value)} placeholder="iCal Booking..." className="w-full p-2 border rounded-lg text-xs" />
                  <input type="text" value={roomIcalLinks[room.number]?.airbnb || ''} onChange={(e) => handleIcalChange(room.number, 'airbnb', e.target.value)} placeholder="iCal Airbnb..." className="w-full p-2 border rounded-lg text-xs" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="p-5 bg-slate-50 flex justify-end items-center gap-4">
          {saved && <span className="text-emerald-600 font-bold">Guardado</span>}
          <button type="submit" form="settings-form" className="bg-slate-900 text-white px-10 py-3 rounded-xl font-bold">Guardar Toda la Configuración</button>
        </div>
      </div>
    </div>
  );
};