import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase'; // Asegúrate de que la ruta hacia tu archivo de supabase sea correcta

interface Particular {
  id: number;
  nombre: string;
  especialidad: string;
  telefono: string;
}

export const Particulares: React.FC = () => {
  const [particulares, setParticulares] = useState<Particular[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [busqueda, setBusqueda] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  const [formData, setFormData] = useState({
    nombre: '',
    especialidad: '',
    telefono: ''
  });

  // 1. CARGAR LOS PARTICULARES DESDE SUPABASE AL ENTRAR A LA PÁGINA
  const cargarParticulares = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('particulares')
        .select('id, nombre, especialidad, telefono')
        .order('id', { ascending: false }); // Muestra los más nuevos primero

      if (error) throw error;
      if (data) setParticulares(data);
    } catch (error) {
      console.error("Error cargando particulares:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarParticulares();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // 2. GUARDAR EL NUEVO PARTICULAR EN SUPABASE
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Limpiamos el teléfono por si ponen espacios o el signo "+"
    const telefonoLimpio = formData.telefono.replace(/\D/g, '');

    try {
      const { error } = await supabase
        .from('particulares')
        .insert([
          { 
            nombre: formData.nombre, 
            especialidad: formData.especialidad, 
            telefono: telefonoLimpio 
          }
        ]);

      if (error) throw error;

      alert("¡Te has registrado con éxito!");
      
      // Resetear el formulario y cerrar la ventana modal
      setFormData({ nombre: '', especialidad: '', telefono: '' });
      setIsModalOpen(false);
      
      // Volver a consultar la base de datos para mostrar el nuevo perfil de inmediato
      cargarParticulares();

    } catch (error) {
      console.error("Error al registrarse:", error);
      alert("Hubo un error al guardar tu registro. Inténtalo de nuevo.");
    }
  };

  // 3. FILTRADO EN TIEMPO REAL
  const particularesFiltrados = particulares.filter(p =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.especialidad.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      
      {/* Banner de Invitación */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 p-8 text-white md:p-12 shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-3xl font-black md:text-4xl">¿Ofrecés clases o servicios particulares?</h2>
          <p className="mt-4 text-slate-300 leading-relaxed">
            Súmate a la red de Kinase Academy. Regístrate para que estudiantes de toda la comunidad puedan contactarte al instante por WhatsApp.
          </p>
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="mt-6 rounded-xl bg-emerald-600 px-6 py-3 font-black text-white shadow-lg transition-all hover:bg-emerald-500"
          >
            Registrarme como Particular
          </button>
        </div>
      </section>

      {/* Buscador */}
      <section className="mt-12">
        <h3 className="text-2xl font-black text-slate-950">Buscar Particulares</h3>
        <div className="mt-4 max-w-md">
          <input 
            type="text" 
            placeholder="Buscar por nombre o materia..." 
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none focus:border-emerald-600"
          />
        </div>
      </section>

      {/* Grid de Perfiles o Estado de Carga */}
      <section className="mt-8">
        {loading ? (
          <p className="text-slate-500 text-sm italic">Cargando la lista de profesionales...</p>
        ) : particularesFiltrados.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {particularesFiltrados.map((particular) => (
              <div key={particular.id} className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
                <div>
                  <h4 className="text-lg font-black text-slate-950">{particular.nombre}</h4>
                  <p className="mt-1 text-sm font-medium text-emerald-700 uppercase tracking-wider">{particular.especialidad}</p>
                </div>
                <a 
                  href={`https://wa.me/${particular.telefono}?text=Hola%20${encodeURIComponent(particular.nombre)},%20vi%20tu%20perfil%20en%20Kinase%20Academy%20y%20me%20gustaría%20consultarte%20por%20tus%20clases.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 block w-full rounded-xl bg-emerald-600 py-2.5 text-center text-sm font-black text-white transition-all hover:bg-emerald-700 shadow-sm"
                >
                  Contactar por WhatsApp
                </a>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 text-sm italic">No se encontraron particulares.</p>
        )}
      </section>

      {/* Modal de Registro */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}>
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-xl font-black text-slate-950">Formulario de Registro</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-2xl text-slate-400 hover:text-slate-600">&times;</button>
            </div>
            
            <form onSubmit={handleFormSubmit} className="mt-4 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-500">Nombre Completo</label>
                <input 
                  type="text" 
                  name="nombre" 
                  value={formData.nombre} 
                  onChange={handleInputChange} 
                  required 
                  className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-500">Especialidad o Materia</label>
                <input 
                  type="text" 
                  name="especialidad" 
                  value={formData.especialidad} 
                  onChange={handleInputChange} 
                  required 
                  className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-500">WhatsApp (Con código de país, sin espacios ni el "+")</label>
                <input 
                  type="tel" 
                  name="telefono" 
                  placeholder="Ej: 549112345678"
                  value={formData.telefono} 
                  onChange={handleInputChange} 
                  required 
                  className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:border-emerald-600"
                />
              </div>

              <button type="submit" className="mt-2 w-full rounded-xl bg-emerald-700 py-3 font-black text-white shadow-lg transition-all hover:bg-emerald-600">
                Finalizar Registro
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};