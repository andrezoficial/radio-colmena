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
