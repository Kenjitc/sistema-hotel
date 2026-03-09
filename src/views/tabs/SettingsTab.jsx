import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../config/supabase';
import { User, Mail, Globe, Trash2, Loader2, RefreshCw, Server, BedDouble, Copy, Camera, CheckCircle2 } from 'lucide-react';

export const SettingsTab = ({ adminProfile, setAdminProfile, rooms, reservations }) => {
  const [formData, setFormData] = useState({
    name: adminProfile?.name || '',
    email: adminProfile?.email || '',
    avatar: adminProfile?.avatar || null,
    apiIntegrations: adminProfile?.apiIntegrations || { phpEndpoint: '' }
  });

  const [roomIcalLinks, setRoomIcalLinks] = useState({});
  const [saved, setSaved] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testSuccess, setTestSuccess] = useState(false);
  const [testMessage, setTestMessage] = useState('');
  const fileInputRef = useRef(null);

  // 1. CARGAR LOS LINKS DESDE EL JSON DE TU PHP AL INICIAR
  useEffect(() => {
    const fetchConfigFromPHP = async () => {
      const endpoint = formData.apiIntegrations?.phpEndpoint;
      if (endpoint && endpoint.includes('http')) {
        try {
          const response = await fetch(`${endpoint}?action=getConfig`);
          const data = await response.json();
          if (data && data.roomIcalLinks) {
            setRoomIcalLinks(data.roomIcalLinks);
          }
        } catch (e) {
          console.log("Aún no hay un config.json en PHP o la URL es incorrecta.");
        }
      }
    };
    fetchConfigFromPHP();
  }, [formData.apiIntegrations?.phpEndpoint]);

  useEffect(() => {
    const updateServerJson = async () => {
      const endpoint = formData.apiIntegrations?.phpEndpoint;
      if (endpoint && endpoint.includes('http')) {
        try {
          await fetch(`${endpoint}?action=updateJson`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reservations)
          });
        } catch (e) {
          console.error("Error actualizando JSON en SiteGround", e);
        }
      }
    };
    updateServerJson();
  }, [reservations, formData.apiIntegrations?.phpEndpoint]);

  useEffect(() => {
    if (adminProfile) {
       setFormData(prev => ({
         ...prev,
         name: adminProfile.name || '',
         email: adminProfile.email || '',
         avatar: adminProfile.avatar || null,
         apiIntegrations: adminProfile.apiIntegrations || { phpEndpoint: '' }
       }));
    }
  }, [adminProfile]);

  const handleSave = async (e) => {
    e.preventDefault();
    
    // 2. GUARDAR LOS LINKS EN EL JSON DE TU PHP (SiteGround)
    const endpoint = formData.apiIntegrations?.phpEndpoint;
    if (endpoint && endpoint.includes('http')) {
      try {
        await fetch(`${endpoint}?action=saveConfig`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ roomIcalLinks })
        });
      } catch (error) {
        console.error("Error al guardar links en PHP:", error);
        alert("No se pudieron guardar los enlaces iCal en tu servidor PHP. Verifica la URL.");
      }
    }

    // 3. GUARDAR SOLO PERFIL BÁSICO Y LA URL EN SUPABASE
    const dataToSave = {
      name: formData.name,
      email: formData.email,
      avatar: formData.avatar,
      apiIntegrations: formData.apiIntegrations // Guardamos la URL de PHP para saber a dónde conectarnos
    };
    
    setAdminProfile(dataToSave); // Actualizar UI local
    
    const { error } = await supabase.from('admin_profile').upsert([{ id: 'main', ...dataToSave }]);
    
    if (error) {
      console.error("Error de Supabase:", error);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const handleIcalChange = (roomNumber, platform, value) => {
    setRoomIcalLinks(prev => ({
      ...prev,
      [roomNumber]: {
        ...(prev[roomNumber] || { booking: '', airbnb: '' }),
        [platform]: value
      }
    }));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Enlace iCal copiado al portapapeles. Pégalo en Booking/Airbnb.");
  };

  const handleClearSyncData = async () => {
    if (window.confirm("¿Seguro que deseas borrar TODAS las reservas sincronizadas de prueba? Esto limpiará los duplicados del calendario.")) {
      try {
        const { data: resQuery } = await supabase.from('reservations').select('*');
        if(resQuery) {
            for (let docSnapshot of resQuery) {
              const data = docSnapshot;
              if (data.dni === 'iCal' || data.source === 'Booking' || data.source === 'Airbnb') {
                await supabase.from('reservations').delete().eq('id', docSnapshot.id);
                
                if (data.room && data.room !== '??') {
                  const roomObj = rooms.find(r => r.number === data.room);
                  if (roomObj && roomObj.status === 'Reservado') {
                    await supabase.from('rooms').update({ status: 'Disponible' }).eq('id', roomObj.id);
                  }
                }
              }
            }
        }
        alert("Calendario limpiado con éxito. Revisa tu panel principal.");
      } catch (e) {
        console.error("Error al limpiar:", e);
        alert("Hubo un error al intentar limpiar.");
      }
    }
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestSuccess(false);
    setTestMessage('');

    const endpoint = formData.apiIntegrations?.phpEndpoint;

    if (!endpoint || !endpoint.includes('http')) {
      setIsTesting(false);
      alert("Por favor, ingresa una URL válida donde alojaste tu script PHP en SiteGround.");
      return;
    }

    const roomsPayload = rooms.map(room => ({
      number: room.number,
      booking: roomIcalLinks[room.number]?.booking || '',
      airbnb: roomIcalLinks[room.number]?.airbnb || ''
    }));

    const activeRooms = roomsPayload.filter(r => r.booking !== '' || r.airbnb !== '');

    if (activeRooms.length === 0) {
      setIsTesting(false);
      alert("No has configurado ningún enlace iCal para las habitaciones.");
      return;
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rooms: activeRooms })
      });
      
      const data = await response.json();
      
      if (data.status === 'success') {
        setTestSuccess(true);
        
        const activeIcalIds = [];
        
        if (data.reservas && data.reservas.length > 0) {
          for (const r of data.reservas) {
            const dIn = r.dateIn || new Date().toISOString().split('T')[0];
            const dOut = r.dateOut || dIn;
            const cName = r.client ? r.client.replace('SUMMARY:', '') : 'Huésped Sincronizado';
            const safeSource = r.source || 'Plataforma';
            const safeRoom = r.room || '??';

            const safeClientName = cName.replace(/[^a-zA-Z0-9]/g, '').substring(0, 15);
            const uniqueId = `sync_${safeSource}_${dIn}_${safeRoom}_${safeClientName}`;
            
            activeIcalIds.push(uniqueId);

            const roomObjForPrice = rooms.find(room => room.number === safeRoom);
            const basePrice = roomObjForPrice ? Number(roomObjForPrice.price) || 0 : 0;
            const diffTime = Math.abs(new Date(dOut) - new Date(dIn));
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
            const calculatedPrice = basePrice * diffDays;

            const newRes = {
              id: uniqueId,
              client: cName,
              dni: 'iCal',
              email: 'sincronizado@hotel.com',
              room: safeRoom,
              price: calculatedPrice, 
              dateIn: dIn,
              dateOut: dOut,
              status: 'Confirmada',
              paymentMethod: 'Pre-pagado',
              source: safeSource
            };

            try {
              await supabase.from('reservations').upsert([newRes]);
              const roomObj = rooms.find(room => room.number === safeRoom);
              if(roomObj && roomObj.status === 'Disponible') {
                 await supabase.from('rooms').update({ status: 'Reservado' }).eq('id', roomObj.id);
              }
            } catch (e) {
              console.error("Error de Supabase al guardar:", e);
            }
          }
        }
        
        let canceladas = 0;
        const { data: resQuery } = await supabase.from('reservations').select('*');
        if(resQuery) {
            for (let docSnapshot of resQuery) {
              const resData = docSnapshot;
              if ((resData.source === 'Booking' || resData.source === 'Airbnb') && resData.status !== 'Finalizada') {
                 if (!activeIcalIds.includes(resData.id)) {
                     await supabase.from('reservations').delete().eq('id', docSnapshot.id);
                     canceladas++;
                     
                     if (resData.room && resData.room !== '??') {
                        const roomObj = rooms.find(r => r.number === resData.room);
                        if (roomObj && roomObj.status === 'Reservado') {
                          await supabase.from('rooms').update({ status: 'Disponible' }).eq('id', roomObj.id);
                        }
                     }
                 }
              }
            }
        }
        
        setTestMessage(`¡Sincronizado! ${data.total} reservas activas. ${canceladas > 0 ? `Se detectaron y borraron ${canceladas} cancelaciones.` : ''}`);

      } else {
        alert("Error del servidor PHP: " + data.message);
      }
    } catch (error) {
      console.error("Error al conectar con PHP:", error);
      alert("Error de conexión. Revisa la consola y tu script sync.php.");
    } finally {
      setIsTesting(false);
      setTimeout(() => { setTestSuccess(false); setTestMessage(''); }, 6000);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-slate-800">Configuración del Sistema</h2>
      
      {/* SECCIÓN 1: PERFIL DEL ADMINISTRADOR */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 sm:p-8 bg-slate-50 border-b border-slate-100 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left">
          
          <div className="relative mb-4 sm:mb-0 sm:mr-6 group cursor-pointer" onClick={() => fileInputRef.current.click()}>
            <div className="w-24 h-24 rounded-full border-4 border-white shadow-md bg-slate-200 overflow-hidden flex items-center justify-center text-slate-500 font-bold text-3xl">
              {formData.avatar ? (
                <img src={formData.avatar} alt="Perfil" className="w-full h-full object-cover" />
              ) : (
                formData.name?.substring(0, 2).toUpperCase() || 'AD'
              )}
            </div>
            <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
              <Camera size={24} />
            </div>
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef} 
              onChange={handleImageChange} 
              className="hidden" 
            />
          </div>

          <div className="mt-2 sm:mt-0">
            <h3 className="text-xl font-bold text-slate-800">Datos del Administrador</h3>
            <p className="text-slate-500 text-sm mt-1">Actualiza tu foto personal e información de acceso.</p>
          </div>
        </div>
        
        <form id="settings-form" onSubmit={handleSave} className="p-5 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center"><User size={16} className="mr-2 text-slate-400"/> Nombre Completo</label>
              <input required type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-yellow-500 bg-slate-50 focus:bg-white transition text-base sm:text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center"><Mail size={16} className="mr-2 text-slate-400"/> Correo Electrónico</label>
              <input required type="email" value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-yellow-500 bg-slate-50 focus:bg-white transition text-base sm:text-sm" />
            </div>
          </div>
        </form>
      </div>

      {/* SECCIÓN 2: INTEGRACIÓN DE CANALES */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 sm:p-8 bg-blue-50/50 border-b border-blue-100 flex justify-between items-center flex-wrap gap-4">
          <div>
            <h3 className="text-xl font-bold text-slate-800 flex items-center"><Globe className="mr-2 text-blue-600"/> Sincronización de Habitaciones (iCal)</h3>
            <p className="text-slate-500 text-sm mt-1">Asigna los enlaces iCal de Booking o Airbnb a tus habitaciones creadas.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button 
              type="button" 
              onClick={handleClearSyncData}
              className="flex items-center px-4 py-2 bg-white border border-rose-200 text-rose-600 rounded-lg text-sm font-bold hover:bg-rose-50 transition shadow-sm"
            >
              <Trash2 size={16} className="mr-2" />
              Limpiar Pruebas
            </button>
            <button 
              type="button" 
              onClick={handleTestConnection}
              disabled={isTesting || !formData.apiIntegrations?.phpEndpoint}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 disabled:opacity-50 transition shadow-sm"
            >
              {isTesting ? <Loader2 size={16} className="mr-2 animate-spin" /> : <RefreshCw size={16} className="mr-2" />}
              Sincronizar Ahora
            </button>
          </div>
        </div>
        
        <div className="p-5 sm:p-8 space-y-6">
          {testSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex flex-col sm:flex-row items-center text-emerald-700 text-sm font-medium animate-in fade-in">
              <CheckCircle2 className="mr-2 mb-2 sm:mb-0 flex-shrink-0" size={20} />
              {testMessage}
            </div>
          )}

          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 mb-6">
             <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center"><Server size={18} className="mr-2 text-slate-500"/> URL del Script en SiteGround</label>
             <p className="text-xs text-slate-500 mb-3">Ruta al archivo <b>sync.php</b> que procesa los calendarios.</p>
             <input 
                type="url" 
                value={formData.apiIntegrations?.phpEndpoint || ''} 
                onChange={e => setFormData({
                  ...formData, 
                  apiIntegrations: { ...formData.apiIntegrations, phpEndpoint: e.target.value }
                })} 
                className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm font-mono" 
                placeholder="https://tuhotel.com/sync.php" 
              />
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-slate-800 border-b border-slate-200 pb-2">Mapeo de Habitaciones</h4>
            
            {rooms.length === 0 ? (
               <p className="text-sm text-slate-500 italic p-4 bg-slate-50 rounded-lg border border-slate-200 text-center">No has creado habitaciones todavía.</p>
            ) : (
              rooms.map(room => (
                <div key={room.id} className="p-4 border border-slate-200 rounded-xl hover:border-blue-300 transition bg-white shadow-sm flex flex-col md:flex-row items-start md:items-center gap-4">
                  <div className="w-full md:w-1/4">
                    <p className="font-bold text-slate-800 text-lg flex items-center"><BedDouble size={18} className="mr-2 text-blue-500"/> Hab. {room.number}</p>
                    <p className="text-xs text-slate-500">{room.type}</p>
                    
                    <div className="mt-3">
                      <p className="text-[10px] font-bold text-emerald-600 uppercase mb-1">Exportar a Booking/Airbnb</p>
                      <button 
                        type="button"
                        onClick={() => copyToClipboard(`${formData.apiIntegrations?.phpEndpoint || 'https://tuhotel.com/sync.php'}?exportRoom=${room.number}`)}
                        className="flex items-center text-xs bg-emerald-50 text-emerald-700 px-2 py-1.5 rounded hover:bg-emerald-100 transition border border-emerald-200"
                      >
                        <Copy size={12} className="mr-1" /> Copiar Enlace iCal
                      </button>
                    </div>

                  </div>
                  <div className="w-full md:w-3/4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <div className="w-4 h-4 bg-[#003580] rounded-sm text-white flex items-center justify-center font-bold text-[8px]">B.</div>
                      </div>
                      <input 
                        type="text" 
                        value={roomIcalLinks[room.number]?.booking || ''}
                        onChange={(e) => handleIcalChange(room.number, 'booking', e.target.value)}
                        placeholder="Importar iCal Booking..." 
                        className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs font-mono outline-none focus:ring-2 focus:ring-[#003580]"
                      />
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <div className="w-4 h-4 bg-[#FF5A5F] rounded-sm text-white flex items-center justify-center">
                           <svg viewBox="0 0 24 24" fill="currentColor" className="w-2.5 h-2.5"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.88 14.71L12 13.5l-3.88 3.21.99-4.94-3.79-3.4 5.04-.43L12 3.5l1.64 4.44 5.04.43-3.79 3.4.99 4.94z"/></svg>
                        </div>
                      </div>
                      <input 
                        type="text" 
                        value={roomIcalLinks[room.number]?.airbnb || ''}
                        onChange={(e) => handleIcalChange(room.number, 'airbnb', e.target.value)}
                        placeholder="Importar iCal Airbnb..." 
                        className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs font-mono outline-none focus:ring-2 focus:ring-[#FF5A5F]"
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        <div className="p-5 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row justify-end items-center gap-4">
          {saved && <span className="text-emerald-600 font-bold sm:mr-4 flex items-center"><CheckCircle2 size={18} className="mr-1.5"/> Guardado correctamente</span>}
          <button 
            type="submit" 
            form="settings-form"
            className="w-full sm:w-auto bg-slate-900 text-white px-10 py-3.5 sm:py-3 rounded-xl hover:bg-slate-800 transition font-bold shadow-md shadow-slate-900/20 text-base sm:text-sm"
          >
            Guardar Toda la Configuración
          </button>
        </div>
      </div>
    </div>
  );
};