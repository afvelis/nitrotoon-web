# LISTA DE ARCHIVOS — Propósito y Función de Cada Archivo

> **Nota para el nuevo agente:** El usuario subió todos los archivos del proyecto a su GitHub. Este documento explica para qué sirve cada archivo y qué función cumplió durante el proyecto. Tienes acceso a GitHub, no al disco duro del usuario. Usa los repos para reconstruir el estado.

---

## REPOSITORIOS (en GitHub del usuario)

### `afvelis/nitrotoon-web` — PRODUCCIÓN (NO TOCAR sin aprobación)
Este es el repo que el público ve. `main` → GitHub Pages → `https://afvelis.github.io/nitrotoon-web/`

Contenido idéntico a `WEBNitro/nitrotoon-web/` en el disco local.

**Archivos en production (63 archivos, 935.9 KB):**
- 15 páginas HTML (index, eventos, otaku, gamers, kpop, cosplay, artistas, mercado, programa, galeria, normas, aliados, contacto, roadmap, admin)
- CSS: tokens.css, base.css, componentes.css, skins.css, paginas.css, admin.css, editor-secciones.css (si se promociona)
- JS: data.js, vitrina.js, vistas.js, insignia.js, sha256.js, admin-acceso.js, admin.js, secciones.js (si se promociona), editor-secciones.js (si se promociona)
- Assets: logos, og.jpg, favicons, demos SVG
- `LEEME.md`, `ROADMAP.md`
- `robots.txt` (NO en production, solo en preview)

### `afvelis/nitrotoon-web-preview` — PREVIEW (futuro, aún no creado)
Repo nuevo que contendrá el contenido de `WEBNitro/preview/`.

**Diferencias con production (que hay que revertir al promocionar):**
1. `robots.txt` existe aquí (bloquea todo) → se borra en production
2. 14 HTML tienen `<meta name="robots" content="noindex, nofollow">` → se borra en production
3. URLs absolutas apuntan a `nitrotoon-web-preview` → se cambian a `nitrotoon-web`
4. Contiene archivos NUEVOS: `manual.html`, `js/secciones.js`, `js/editor-secciones.js`, `css/editor-secciones.css`, `robots.txt`, `LEEME-PREVIEW.md`

---

## ARCHIVOS LOCALES (en `D:\NITROTOONProject\WEBNitro\`)

### 📁 RAÍZ DEL TALLER (6 archivos)

#### `AGENTS.md` (12 líneas)
**Qué es:** El manual del agente. Instrucciones permanentes de cómo trabajar.
**Propósito:** Cada nueva sesión del agente lee este archivo primero. Define el mapa del taller, el flujo de mantenimiento, las reglas de trato (una instrucción a la vez, prueba del objetivo dato a dato, archivos finales completos, informe por cambio, nada destructivo sin aprobación, detenerse si algo no encaja), la continuidad (ESTADO.md + DECISIONES.md), y el canal (screenshots del usuario son solo para su archivo).
**Función cumplida:** Garantiza que cualquier agente que entre al workspace sepa exactamente cómo comportarse y qué no hacer.

#### `ESTADO.md` (86 líneas, v3, 04/11/2026)
**Qué es:** El estado actual del proyecto. Lo que se hizo, lo que falta, bugs corregidos, notas operativas.
**Propósito:** Sistema de Continuidad v3. El estado vive aquí, no en la memoria del chat. Al cerrar sesión, se regenera (versión +1).
**Función cumplida:** El nuevo agente lee esto y sabe exactamente en qué punto quedó, qué está pendiente, y qué ver primero.

#### `DECISIONES.md` (12 líneas)
**Qué es:** Registro de decisiones del proyecto (qué se decidió, por qué, quién lo pidió).
**Propósito:** Anexo de continuidad del Sistema de Continuidad v3. Explica por qué las cosas son como son.
**Función cumplida:** El nuevo agente entiende las decisiones tomadas sin tener que adivinar el "por qué".

#### `PROMPT-WEB-NITROTOON.md` (227 líneas, v2 FINAL, 29/10/2026)
**Qué es:** La especificación maestra del proyecto. La biblia.
**Propósito:** Define TODO el proyecto: qué es Nitrotoon, referentes visuales, reglas de oro, arquitectura técnica, fases, paleta de colores, tokens, estructura de la web, dashboard, skins, roadmap, normas del comité. Cualquier IA puede ejecutarlo sin preguntar nada.
**Función cumplida:** Es la fuente de verdad absoluta. Si hay una contradicción, PROMPT-WEB-NITROTOON.md manda.

#### `comite-referentes-nitrotoon.md`
**Qué es:** Acta del comité que aprobó los 3 referentes visuales (Anime Expo, Esports World Cup, Hololive).
**Propósito:** Documenta los 9 votos, las 4 condiciones de bloqueo (K1-K4), y las refutaciones de las propuestas en contra.
**Función cumplida:** Justificación histórica de por qué los referentes son como son.

#### `REFERENTES-3-WEBS-GEEK.md`
**Qué es:** Análisis detallado de los 3 sitios referentes.
**Propósito:** Documento de investigación sobre los sitios de referencia (Anime Expo, Esports World Cup, Hololive) y qué patrones se adoptan de cada uno.

### 📁 `nitrotoon-web/` — PRODUCCIÓN (copiado a GitHub)

#### `index.html` (artesanal, no generada)
**Qué es:** La portada. La primera página que ve el visitante.
**Función cumplida:** Hero con título del evento + cuenta regresiva + cinta infinita + 7 puertas hacia comunidades. Es la única página que no se regenera automáticamente.

#### `eventos.html`
**Qué es:** El calendario del año con 4 eventos.
**Función cumplida:** Muestra NitroGamers 2026 (en-preparacion), Fest 2027 (a-la-venta), K-Fest 2027 (en-preparacion), Fest 2026 (realizado).

#### `otaku.html` / `gamers.html` / `kpop.html` / `cosplay.html`
**Qué son:** Espacios con skin propio (tema CSS exclusivo).
**Función cumplida:** Cada comunidad tiene su identidad visual propia (colores, iconos, estilo de tipografía).

#### `artistas.html` / `mercado.html`
**Qué son:** Espacios con tema compartido (misma estructura, acento de color diferente).
**Función cumplida:** Artistas (Artist Alley, firmas) y Mercado (merch, coleccionistas, retro).

#### `programa.html`
**Qué es:** Agenda por día y escenario.
**Función cumplida:** Muestra los bloques de actividad del evento por escenario y horario.

#### `galeria.html`
**Qué es:** Fotos del evento anterior (Fest 2026).
**Función cumplida:** Reels que se cargan al tocar (K1: cero autoplay) + fotos horizontales.

#### `normas.html`
**Qué es:** Reglas de la comunidad (sexta exigencia del comité).
**Función cumplida:** Cosplay y props, menores de edad, fan-art y marca, grabación, derecho de imagen, convivencia y accesibilidad.

#### `aliados.html`
**Qué es:** Sponsors por niveles (Principal, Aliado, Colaborador).
**Función cumplida:** Jerarquía de partners: presencia en escenario, zona activa, apoyo en convocatorias.

#### `contacto.html`
**Qué es:** FAQ + vías de contacto.
**Función cumplida:** 8 preguntas frecuentes + 4 vías de contacto (Instagram, Facebook, aliados/prensa, stands).

#### `roadmap.html`
**Qué es:** Plan de crecimiento público (no hay humo).
**Función cumplida:** 6 módulos: Supabase, claves de acceso, entradas, intranet, torneo (hecho), audiencia/media kit.

#### `admin.html`
**Qué es:** El dashboard de mantenimiento (PIN).
**Función cumplida:** Tres vistas: Vitrina (editar piezas), Medios (subir imágenes), Publicar (generar data.js).

#### `data.js` (703 líneas)
**Qué es:** LA FUENTE DE VERDAD. Todo el contenido de la web vive aquí.
**Función cumplida:** `window.NITROTOON_DATA` con: marca, eventoVigente (con fuente única, F0), cintaDisciplinas, eventos[], artistas[], programa, galeria, aliados, normas, contacto, portada.piezas, puertas, espacios[7], intranet, roadmap, admin, version.

#### `js/vitrina.js` (408 líneas)
**Qué es:** Núcleo compartido por todas las páginas.
**Función cumplida:** 
- `eventoDeVerdad()` — fuente única del evento (F0: hereda del calendario)
- Utilidades DOM: `$`, `$$`, `h()`, `icono()`
- Fechas en español local, sin red
- Cinta superior del evento (con cuenta corta)
- Cuenta regresiva (con reintento, BUG-5/5b)
- Menú gigante (Esc cierra, foco atrapado)

#### `js/vistas.js` (1300+ líneas)
**Qué es:** Renderizadores de cada pieza de la portada.
**Función cumplida:** `window.VISTAS` con funciones para pintar cada tipo de pieza: hero, puertas, avisos, eventos, artistas, galeria, aliados. También `construirCinta()` y `itemsDeCinta()` para la cinta infinita. 3 call sites switched to `eventoDeVerdad(datosVivos())`: `hero()`, `cuenta()`, `itemsDeCinta()`.

#### `js/insignia.js`
**Qué es:** La nave insignia — cualquier navegación interna la hace volar.
**Función cumplida:** Animación de nave que vuela cuando el usuario navega internamente (interacción insignia del proyecto).

#### `js/sha256.js`
**Qué es:** Implementación SHA-256 en JS vanilla.
**Función cumplida:** Verificar el PIN contra su hash SHA-256 (nunca se almacena el PIN en texto plano).

#### `js/admin-acceso.js`
**Qué es:** Configuración del PIN y del bloqueo.
**Función cumplida:** Hash del PIN real (`41a959...`), sesiones en horas (8), máximo intentos (5), bloqueo en minutos (15).

#### `js/admin.js` (1388 líneas)
**Qué es:** El dashboard completo (login + 3 vistas).
**Función cumplida:** 
- Sesión y bloqueo (IndexedDB + fallback, BUG-6: timeout 4s)
- Vista Vitrina: piezas arrastrables, vista previa en vivo
- Vista Medios: validación de imágenes (medida, proporción, peso)
- Vista Publicar: genera data.js, checklist de archivos GitHub
- BUG-9: manejo de localStorage lleno (retry con liberación de claves)
- F3: `guardarBorrador()`, `barra-estado` con estados ok/pend/error
- F4: `revisionPrevia()`, `pintarArbol()` (checklist 3 casillas)
- F5: `conectarEditorSecciones()` (puente a editor por secciones)
- Deshacer (Ctrl+Z) con historial de cambios

#### `css/tokens.css`
**Qué es:** Variables CSS globales (paleta + tipografía + espaciado).
**Función cumplida:** `--c-fondo`, `--c-superficie`, `--c-texto`, `--c-primario`, `--c-acento`, `--c-perla`, `--c-borde`, `--c-borde-fuerte`, `--fs-hero`, `--fs-display`, `--ancho-max`, `--sp-1..8`. PALETA CERRADA.

#### `css/base.css`
**Qué es:** Reset y estilos base (typography, links, tables, forms).
**Función cumplida:** Box-sizing, scroll-behavior, focus-visible, body, a, h1-h4, p, table, input, select, textarea, button.

#### `css/componentes.css` (1000+ líneas)
**Qué es:** Componentes UI reutilizables (hero, puertas, cinta, tarjetas, secciones, barra de estado).
**Función cumplida:** `.contenedor`, `.hero`, `.hero__titulo`, `.hero__nota`, `.puerta`, `.franja` (cinta infinita tipo reel), `.cuenta`, `.seccion`, `.intro`, `.barra-estado`, `.franja-borrador` (preview mode). Mobile-first: `@media (max-width: 48em)`, `@media (max-width: 22.5em)`.

#### `css/skins.css`
**Qué es:** Skins por comunidad (Otaku, Gamers, KPOP, Cosplay).
**Función cumplida:** Cada comunidad tiene su color de acento, su fondo, su estilo de tarjeta. Otaku (violeta), Gamers (naranja/amarillo), KPOP (rosa), Cosplay (turquesa).

#### `css/paginas.css`
**Qué es:** Estilos específicos de cada página interior.
**Función cumplida:** `eventos.html`, `otaku.html`, `gamers.html`, `programa.html`, `galeria.html`, `normas.html`, `aliados.html`, `contacto.html`, `artistas.html`, `mercado.html`, `roadmap.html` — cada uno con su chrome específico.

#### `css/admin.css`
**Qué es:** Estilos del dashboard de mantenimiento.
**Función cumplida:** Login, panel, preview (fija + ancha), medios, publicar, semáforo, tarjetas de sección (F1).

#### `css/editor-secciones.css` (NUEVO en preview)
**Qué es:** Estilo del editor por secciones (F1).
**Función cumplida:** Tarjetas de sección, campos de texto, contadores, semáforo verde/ámbar/rojo/largo, interruptores (visibilidad + deshabilitar), imagen, barra de estado, bloque mobile, bloque prefers-reduced-motion.

### 📁 `preview/` (69 archivos, copia experimental)

**Identico a `nitrotoon-web/` + lo siguiente:**

#### `preview/manual.html` (NUEVO)
**Qué es:** Manual en 9 pasos en lenguaje llano para el administrador.
**Función cumplida:** Explica cómo usar el editor sin saber programar. Diferencia entre los dos interruptores. Truco de la huella. Qué NO se puede hacer.

#### `preview/robots.txt` (NUEVO)
**Qué es:** `Disallow: /`
**Función cumplida:** Bloquea todos los buscadores. No indexar el duplicado. SE BORRA al promocionar a production.

#### `preview/js/secciones.js` (NUEVO, 320 líneas)
**Qué es:** EL CONTRATO. Mapa de la vitrina para el editor.
**Función cumplida:** Declara sección por sección: dónde vive el dato en data.js (ruta exacta), qué etiqueta ve el usuario (en español), cuántos caracteres caben (medidos en CSS real), qué tipo de campo es. `window.SECCIONES` con: `lista` (8 secciones), `porId`, `leerRuta`, `escribirRuta`, `evaluar` (semáforo), `PISTAS` (ayuda por tipo), `NIVEL` (holgado/justo/largo), `plantilla`.

#### `preview/js/editor-secciones.js` (NUEVO, 530 líneas)
**Qué es:** La UI del editor por secciones.
**Función cumplida:** Renderiza una tarjeta por sección. Campos de texto, campos de imagen, interruptores de visibilidad (dos tipos). `window.EDITOR_SECCIONES` con: `configurar` (vincula con admin.html), `pintar` (dibuja las 8 tarjetas), `deshacer` (Ctrl+Z), `puedeDeshacer`, `reiniciarHistorial`, `seccionActiva`, `activa`. Historial con 400ms throttle (BUG-4).

#### `preview/index.html?borrador=1` (modo especial)
**Qué es:** Vista previa de la portada con el borrador.
**Función cumplida:** `aplicarBorradorSiSePide()` en vitrina.js detecta `?borrador=1`, aplica el borrador de localStorage, muestra franja amarilla `.franja-borrador`. Sin `?borrador`, el público no ve nada distinto.

#### 14 HTML con `<meta name="robots" content="noindex, nofollow">`
**Función cumplida:** Que Google no indexe el duplicado. SE BORRA al promocionar a production.

#### `preview/LEEME-PREVIEW.md` (94 líneas)
**Qué es:** README del preview. Qué es esta carpeta y cómo probarlo.
**Función cumplida:** Instrucciones para probar el editor, qué es cada pieza, reglas del preview, diferencias con producción, cómo promover a production.

### 📁 `materiales/` (material crudo del usuario)

#### `materiales/marca/` (7 archivos de logo)
**Qué es:** Logos crudos del usuario.
**Función cumplida:** 
- `NITROTOON Logo_Yellow.png` — Logo de la marca (5367×3017 tinta real) → se recortó a 78×44 para encabezado
- `NITROTOON - Donut.png` — Dona 3D → `og.jpg` 1200×630
- `NITROTOON 2026_banner.png` — Banner → `social-preview.png` 1500×352
- `NITROTOON 2026_Rocket.png` — Nave → `assets/logo-encabezado.png` 93×44 retina
- `NITROTOON 2026_Rocket 3D.png` — Nave 3D → archivado
- `NITROTOON 2026_Nombre 3D.png` — Nombre en 3D
- `NITROTOON 2026_Astronaut.png` — Astronauta

#### `materiales/marca/LEEME.txt`
**Función cumplida:** Inventario de los 7 archivos de marca con descripción del usuario y medidas.

### 📁 `_tools/` (scripts del desarrollador)

#### `_tools/verificar_web.py` (Python, 16 reglas)
**Qué es:** Verificador estructural de la web.
**Función cumplida:** Verifica 16 reglas: cada página HTML tiene `<html lang="es">`, `og:title`, `og:description`, `og:image`, `twitter:card`, `icono`, título, no `Fest 2027`, cinta si tiene hero, mega si no es admin, etc. En preview: 16/16 TODO LIMPIO (incluye manual.html).

#### `_tools/generar_paginas.py` (Python)
**Qué es:** Regenera las 14 páginas HTML a partir de un template con chrome.
**Función cumplida:** Inyecta título, og:*, favicon, logo, lema en cada página. Se usa cuando se cambia algo global (título, logo, lema).

#### `_tools/generar_paquete_ia.py` (Python)
**Qué es:** Consolida los MD del proyecto en un solo archivo.
**Función cumplida:** Crea `mtto/PAQUETE-IA.md` con ~67k caracteres para trabajar con una IA pública.

### 📁 `mtto/` (taller de mantenimiento)

#### `mtto/cola.md`
**Qué es:** Cola de tareas de mantenimiento (una activa a la vez).
**Función cumplida:** Sigue el flujo: usuario → mtto → verificación → subida a GitHub → verificación → "hecha".

#### `mtto/registro.md` (500 líneas)
**Qué es:** Historial completo de cada operación terminada.
**Función cumplida:** Cada cambio tiene: qué se cambió, por qué, prueba objetiva. Desde MTTO-1a (producción inicial) hasta EDITOR POR SECCIONES F0→F5. El nuevo agente lee esto y ve la cronología completa del proyecto.

---

## ARCHIVOS DE CIERRE (End_DeepSeek/)

#### `End_DeepSeek/RESUMEN.md` (este archivo que estás leyendo)
**Qué es:** La línea de pensamiento completa. Desde el inicio hasta el final.
**Función cumplida:** El nuevo agente lee esto y entiende por qué las cosas son como son.

#### `End_DeepSeek/LISTA-ARCHIVOS.md` (este archivo)
**Qué es:** Inventario de cada archivo con propósito específico.
**Función cumplida:** El nuevo agente sabe qué hace cada archivo y por qué existe.

#### `End_DeepSeek/RESUMEN_PROYECTO.md`
**Qué es:** Resumen ejecutivo del proyecto en lenguaje simple.
**Función cumplida:** Si el nuevo agente solo lee un archivo, que sea este.