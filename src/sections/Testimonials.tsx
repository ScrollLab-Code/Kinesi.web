import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion'; // Si lo seguís usando

const testimonials = [
  {
    name: 'Martina',
    career: 'Medicina',
    text: 'Me ayudo a ordenar los parciales y a estudiar con menos ansiedad. La diferencia fue tener un plan y alguien que lo revise.',
  },
  
];

export default function Testimonials() {
  const [name, setName] = useState('');
  const [career, setCareer] = useState('');
  const [text, setText] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { data, error } = await supabase.from('testimonios').insert([
      { name, career, text },
    ]);
    if (error) {
      console.error('Error al enviar el testimonio:', error);
    } else {
      // Limpiar campos o dar feedback al usuario
      setName('');
      setCareer('');
      setText('');
      alert('Testimonio enviado con éxito');
    }
  };

  return (
    <section id="testimonios" className="bg-white py-24 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 max-w-3xl">
          <p className="mb-3 text-sm font-black uppercase tracking-[0.2em] text-emerald-700">
            Historias de estudiantes
          </p>

          <h2 className="text-4xl font-black leading-tight text-slate-950 md:text-5xl">
            La promesa es simple: estudiar mejor, con menos caos.
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="mb-14">
          <div className="grid gap-4 md:grid-cols-2">
            <input
              type="text"
              placeholder="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded border p-3"
              required
            />
            <input
              type="text"
              placeholder="Carrera"
              value={career}
              onChange={(e) => setCareer(e.target.value)}
              className="rounded border p-3"
              required
            />
          </div>
          <textarea
            placeholder="Tu testimonio"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="rounded border p-3 mt-4 w-full"
        
            required
          />
          <button type="submit" className="mt-4 bg-emerald-700 text-white px-6 py-3 rounded hover:bg-emerald-800">
            Enviar Testimonio
          </button>
        </form>

        <div className="grid gap-6 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.article
              key={testimonial.name}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              viewport={{ once: true }}
              className="rounded-lg border border-slate-200 bg-stone-50 p-7"
            >
              <p className="mb-7 text-lg leading-8 text-slate-700">
                "{testimonial.text}"
              </p>

              <h3 className="font-black text-slate-950">{testimonial.name}</h3>
              <p className="text-slate-500">{testimonial.career}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}