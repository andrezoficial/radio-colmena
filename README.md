# Radio Colmena — versión mejorada

Proyecto React de la emisora Radio Colmena.

## Mejoras incluidas

- Rediseño moderno, limpio y responsive para computador y celular.
- Reproductor en vivo más claro y accesible.
- Corrección del cambio automático entre servidores de streaming.
- Indicadores de conexión, buffering y estado en vivo.
- Control de volumen y silencio.
- Selector manual de servidor.
- Botón para abrir el reproductor oficial y copiar el stream.
- Programación y programa actual destacados.
- Secciones de locutores, solicitudes y concursos renovadas.
- Chat lateral adaptable a móvil.
- Eliminación de la fecha de concurso antigua de 2025.
- Interfaz con mejor jerarquía visual y menos información técnica expuesta al usuario.

## Ejecutar

```bash
npm install
npm start
```

Para producción:

```bash
npm run build
```

## Identidad visual (v2)

- Logo propio: hexágono de panal + ondas de sonido (`src/logo.svg`, `public/logo*.png`, favicon).
- Paleta: Miel `#FFD23F` · Frambuesa `#F0386B` · Noche `#0B0D12`.
- Tipografía: Sora (títulos) + Inter (texto).
- Ecualizador animado en el reproductor, patrón de panal en el hero, avatares hexagonales.
- Accesibilidad: foco visible, contraste mejorado, respeta `prefers-reduced-motion`.

## Correcciones (v2.1)

- Chat: el nombre ya no cambia de pantalla al escribir la primera letra; el chat baja solo al último mensaje.
- Reproductor: sin bucles infinitos entre servidores, sin reintentos duplicados, se puede cancelar mientras conecta y se corta la descarga al pausar.
- Programa actual: usa hora de Bogotá y ya no muestra "Mañanas" de madrugada.
- Solicitudes: aviso en pantalla en vez de `alert()`.
- Configuración de PostCSS alineada con Tailwind v3 y test reemplazado.

## Firebase (chat y solicitudes)

1. En https://console.firebase.google.com crea un proyecto → **Build → Firestore Database → Crear base de datos** (modo producción).
2. **Reglas**: pega el contenido de `firestore.rules` y publica.
3. **Configuración del proyecto → Tus apps → Web (</>)**: registra la app y copia los valores.
4. Local: copia `.env.example` a `.env.local` y rellénalo. Producción: cárgalos en Vercel → Settings → Environment Variables y vuelve a desplegar.
5. Las solicitudes llegan a la colección `requests` (se leen en la consola de Firebase); el chat usa la colección `chat`.

## Reproductor móvil (v3.1)

- Media Session: la pantalla de bloqueo y la notificación muestran el programa actual con el logo y los botones de play/pausa.
- Temporizador para dormir: 15 / 30 / 60 min (se cambia pulsando la luna) y detiene el stream al terminar.

## Estado real del servidor (v4)

- `api/now-playing.js` (función de Vercel) consulta `http://uk14freenew.listen2myradio.com:22602/7.html` y entrega a la web canción actual, oyentes, pico, bitrate y estado de transmisión.
- Si cambias de servidor, define la variable `STATS_URL` en Vercel con la nueva dirección `/7.html`.
- En local (`npm start`) la función `/api` no existe; la web funciona igual pero sin esos datos. Para probarla en local usa `npx vercel dev`.

## Panel privado (v5)

Entra en `https://TU-DOMINIO/#admin` (no aparece enlazado en la web).

1. Firebase → **Authentication → Comenzar → Método de acceso → Correo/contraseña → Habilitar**.
2. **Authentication → Usuarios → Agregar usuario** (tu correo y una contraseña larga).
3. Entra al panel con ese usuario: si aún no tienes permiso, el panel te muestra tu **UID**.
4. Pega ese UID en `isAdmin()` de `firestore.rules` y publica las reglas.

El panel permite ver solicitudes, marcarlas como "ya sonó", copiar "Artista - Canción" para buscarla en Mixxx, borrarlas y moderar el chat.
