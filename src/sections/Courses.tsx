import { useState } from "react"

export default function Courses() {
  const whatsappNumber = "5492996232195"

  // Tab navigation: 'reservar' (turnero) o 'cursos' (próximos lanzamientos)
  const [activeTab, setActiveTab] = useState<'reservar' | 'cursos'>('reservar')

  // Booking states
  const [selectedDay, setSelectedDay] = useState<string>("")
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("")
  const [name, setName] = useState("")
  const [lastname, setLastname] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [subject, setSubject] = useState("")
  const [dayOfMonth, setDayOfMonth] = useState("")
  const [isBooked, setIsBooked] = useState(false)

  const currentMonthName = new Date().toLocaleString("es-AR", { month: "long" })

  const availableDays = ["Lunes", "Miércoles", "Jueves", "Viernes"]
  
  const timeSlotsGroup = [
    { 
      label: "Bloque Mañana", 
      slots: ["07:00 - 08:00", "08:00 - 09:00", "09:00 - 10:00"] 
    },
    { 
      label: "Bloque Tarde/Noche", 
      slots: ["18:00 - 19:00", "19:00 - 20:00"] 
    }
  ]

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDay || !dayOfMonth || !selectedTimeSlot || !name || !lastname || !email || !phone) {
      alert("Por favor completa todos los campos y selecciona un día y horario.")
      return
    }

    const message = [
      "📌 Nueva Reserva de Acompañamiento Particular (Kinase Academy)",
      `Estudiante: ${name} ${lastname}`,
      `Email: ${email}`,
      `WhatsApp: ${phone}`,
      `Materia/Tema: ${subject}`,
      `Día: ${selectedDay} ${dayOfMonth} de ${currentMonthName} (mes corriente vigente)`,
      `Horario: ${selectedTimeSlot} hs`
    ].join("\n")

    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappLink, "_blank", "noopener,noreferrer")
    setIsBooked(true)
  }

  const handleReset = () => {
    setSelectedDay("")
    setSelectedTimeSlot("")
    setName("")
    setLastname("")
    setEmail("")
    setPhone("")
    setSubject("")
    setDayOfMonth("")
    setIsBooked(false)
  }

  return (
    <section id="cursos" className="bg-stone-50 py-16 px-6 dark:bg-[#090f0e]">
      <div className="mx-auto max-w-4xl space-y-8">
        
        {/* Encabezado Principal */}
        <div className="text-center space-y-2">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-800 dark:text-emerald-400">
            Gestión de Compromisos Kinase Academy
          </span>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Acompañamiento Médico & Reservas
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            Reserva una vacante para acompañamiento particular de Anatomía, Fisiología o Histología con asignación horaria inmediata.
          </p>
        </div>

        {/* Selector de Pestañas */}
        <div className="flex justify-center border-b border-slate-200 dark:border-[#1d3330]">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('reservar')}
              className={`pb-2.5 text-xs font-bold tracking-wider uppercase border-b-2 transition ${
                activeTab === 'reservar' 
                  ? 'border-emerald-600 text-emerald-800 dark:text-emerald-400' 
                  : 'border-transparent text-slate-400 hover:text-slate-655'
              }`}
            >
              📅 Reservar Turno de Acompañamiento
            </button>
            <button
              onClick={() => setActiveTab('cursos')}
              className={`pb-2.5 text-xs font-bold tracking-wider uppercase border-b-2 transition ${
                activeTab === 'cursos' 
                  ? 'border-emerald-600 text-emerald-800 dark:text-emerald-400' 
                  : 'border-transparent text-slate-400 hover:text-slate-655'
              }`}
            >
              📚 Cursos y Programas
            </button>
          </div>
        </div>

        {activeTab === 'reservar' ? (
          <div className="glass-card rounded-2xl p-6 md:p-8 border border-slate-200 dark:border-[#1d3330] bg-white clinical-shadow">
            
            {isBooked ? (
              <div className="text-center space-y-4 py-6">
                <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center mx-auto text-emerald-800 dark:text-emerald-450 text-xl font-bold">
                  ✓
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">¡Reserva Enviada a WhatsApp!</h3>
                <p className="text-xs text-slate-550 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                  Hemos enviado los detalles a nuestro sistema de turnos vía WhatsApp. El equipo de Kinase confirmará tu sesión a la brevedad.
                </p>
                <button
                  onClick={handleReset}
                  className="rounded-lg border border-slate-200 px-6 py-2 text-xs font-bold text-slate-600 transition hover:border-slate-800 dark:border-[#1d3330] dark:text-emerald-400"
                >
                  Reservar otro turno
                </button>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-6">
                
                {/* 1. Selección de Día */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    1. Selecciona un Día Disponible:
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                    {availableDays.map(day => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => {
                          setSelectedDay(day)
                          setSelectedTimeSlot("") // reset slot upon day change
                        }}
                        className={`rounded-xl border p-3 text-center text-xs font-bold transition duration-200 ${
                          selectedDay === day
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400'
                            : 'border-slate-250 bg-stone-50 hover:bg-stone-100 text-slate-600 dark:border-[#1d3330] dark:bg-[#0c1312] dark:text-emerald-455'
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Selección de Horario */}
                {selectedDay && (
                  <div className="space-y-3 animate-fadeIn">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      2. Selecciona el Horario (Sesiones de 1 Hora):
                    </label>
                    
                    <div className="space-y-4">
                      {timeSlotsGroup.map(group => (
                        <div key={group.label} className="space-y-1.5">
                          <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider">
                            {group.label}
                          </span>
                          <div className="grid grid-cols-3 gap-2">
                            {group.slots.map(slot => (
                              <button
                                key={slot}
                                type="button"
                                onClick={() => setSelectedTimeSlot(slot)}
                                className={`rounded-lg border py-2 px-3 text-center text-xs font-semibold transition ${
                                  selectedTimeSlot === slot
                                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400 font-bold'
                                    : 'border-slate-200 bg-white hover:border-slate-400 text-slate-600 dark:border-[#1d3330] dark:bg-[#090f0e] dark:text-emerald-455'
                                }`}
                              >
                                {slot} hs
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Datos del Estudiante */}
                {selectedDay && selectedTimeSlot && (
                  <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-[#1d3330] animate-fadeIn">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      3. Ficha de Reserva Particular
                    </h4>
                    
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                          Número de Día del Mes
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="31"
                          required
                          value={dayOfMonth}
                          onChange={e => setDayOfMonth(e.target.value)}
                          placeholder="Ej. 14"
                          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-emerald-600 dark:border-[#1d3330] dark:bg-[#090f0e] dark:text-white"
                        />
                      </div>
                      <div className="flex flex-col justify-center bg-stone-50 dark:bg-[#0c1312] border border-slate-200 dark:border-[#1d3330] rounded-lg p-2.5">
                        <span className="text-[9px] font-black uppercase text-emerald-850 dark:text-emerald-400 block tracking-wider">
                          Mes Corriente Vigente
                        </span>
                        <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block capitalize mt-0.5">
                          {currentMonthName}
                        </span>
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nombre</label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={e => setName(e.target.value)}
                          placeholder="Tu nombre"
                          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-emerald-600 dark:border-[#1d3330] dark:bg-[#090f0e] dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Apellido</label>
                        <input
                          type="text"
                          required
                          value={lastname}
                          onChange={e => setLastname(e.target.value)}
                          placeholder="Tu apellido"
                          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-emerald-600 dark:border-[#1d3330] dark:bg-[#090f0e] dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Email</label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          placeholder="estudiante@correo.com"
                          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-emerald-600 dark:border-[#1d3330] dark:bg-[#090f0e] dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">WhatsApp de Contacto</label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={e => setPhone(e.target.value)}
                          placeholder="ej. +54 9 299 123456"
                          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-emerald-600 dark:border-[#1d3330] dark:bg-[#090f0e] dark:text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Materia / Tema a tratar</label>
                      <input
                        type="text"
                        required
                        value={subject}
                        onChange={e => setSubject(e.target.value)}
                        placeholder="Ej. Anatomía (Miembro Superior), Fisiología (Cardio) o el tema que necesites..."
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-emerald-600 dark:border-[#1d3330] dark:bg-[#090f0e] dark:text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <button
                        type="submit"
                        className="w-full rounded-lg bg-emerald-800 hover:bg-slate-900 text-white font-bold text-xs py-3 transition duration-200 shadow-md uppercase tracking-wider"
                      >
                        Confirmar Reserva y Notificar vía WhatsApp
                      </button>
                      <p className="text-[10px] text-slate-450 text-center dark:text-slate-500 font-medium">
                        * Cada sesión de acompañamiento personalizado de 1 hora tiene un valor de $12.000 ARS.
                      </p>
                    </div>
                  </div>
                )}

              </form>
            )}

          </div>
        ) : (
          <div className="glass-card rounded-2xl p-8 border border-slate-200 dark:border-[#1d3330] bg-white text-center space-y-6 shadow-sm">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-2xl text-emerald-800">
              📚
            </div>
            
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-800 dark:text-emerald-400">Kinase Academy</span>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Próximamente Cursos</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                Estamos diseñando programas interactivos de alta intensidad para el ciclo biomédico basados en la bibliografía oficial de las cátedras.
              </p>
            </div>

            <div className="border-t border-slate-100 dark:border-[#1d3330] pt-6 max-w-sm mx-auto space-y-4">
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal">
                ¿Necesitas apoyo particular inmediato o deseas reservar una vacante para el acompañamiento personalizado? Contáctanos de forma directa.
              </p>
              
              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hola! Quiero consultar por las tutorías y los próximos cursos de Kinase Academy.")}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-800 px-6 py-2.5 text-xs font-bold text-white transition hover:bg-slate-900 shadow-sm"
              >
                Contactar por WhatsApp
              </a>
            </div>
          </div>
        )}

      </div>
    </section>
  )
}
