# Estación Nil

Panel de control de Nil para el móvil y la tableta: **horario y agenda de hoy**, **enlaces del colegio** (Pronote, Pix…),
**notas y recordatorios**, **Rutinator** (tareas, créditos y estrellas) y **sus juegos con su progreso**.

- Una sola página web, instalable como app (PWA) y usable sin conexión.
- Entra con la **misma cuenta de Rutinator v2** (Supabase): notas, enlaces y progreso se comparten entre aparatos.
- Sin cuenta también funciona, pero solo en ese aparato.
- Lee el progreso de los juegos publicados en `agomezbl.github.io` (Chrono-Ohm, PhiloQuest, UMBRAL) porque viven en la misma dirección.
- Sin avisos ni notificaciones: como en Rutinator, la Estación no persigue a Nil.

## Puesta en marcha (una sola vez)

1. **Base de datos.** En supabase.com, proyecto de Rutinator v2 → *SQL Editor* → *New query*. Pega entero
   `supabase/0031_estacion.sql` y pulsa **Run**. Debe salir una fila con dos `true`.
2. **Conexión.** En Supabase → *Project Settings* → *API* copia la *Project URL* y la clave *publishable* (o *anon*).
   Ponlas en `config.js` junto con la dirección de Rutinator. Esa clave es pública por diseño: lo que protege los datos
   son las reglas de la base de datos (cada hijo ve lo suyo; el padre, lo de la familia).
3. **Publicar.** El repositorio `estacion-nil` con GitHub Pages activado (rama `main`, carpeta raíz).
   Dirección: `https://agomezbl.github.io/estacion-nil/`
4. **En el móvil y la tableta de Nil:** abrir la dirección, entrar con su cuenta de Rutinator y *Añadir a pantalla de inicio*.
5. **Pronote:** en la Estación, *Colegio → Editar* (pide la clave de padre de Rutinator) y pega la dirección de Pronote del colegio.

## Archivos
- `index.html` — toda la app. `config.js` — conexión. `sw.js` — funcionamiento sin conexión. `manifest.webmanifest` e iconos — instalación.
- `supabase/0031_estacion.sql` — tablas `estacion_items` (notas y enlaces) y `estacion_progress` (resumen de cada juego por aparato).
- `tools/test.js` — prueba en móvil, tableta y ordenador, sin cuenta y con una cuenta simulada (`node tools/test.js`).

## Añadir un juego
En `index.html`, lista `GAMES`: nombre, dirección y una función `read()` que lee su progreso guardado en el navegador.

© 2026 agomezbl. Todos los derechos reservados.
