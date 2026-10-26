/* Configuración de la Estación Nil.
   supabaseUrl y supabaseKey: los del proyecto de Rutinator v2 (Supabase → Project Settings → API).
   La clave «publishable/anon» es pública por diseño: lo que protege los datos son las reglas (RLS) de la base de datos.
   Si se dejan vacíos, la Estación funciona solo en este aparato, sin cuenta. */
window.ESTACION = {
  supabaseUrl: '',
  supabaseKey: '',
  rutinatorUrl: ''
};
