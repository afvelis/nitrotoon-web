# RESUMEN — Línea de Pensamiento Completa
## Nitrotoon Web: De la Especificación al Editor Intuitivo

> **Agente:** DeepSeek (actual)
> **Período:** 29/10/2026 → 05/11/2026
> **Objetivo:** Construir la web pública de Nitrotoon + un editor que cualquier persona pueda usar sin saber programar.

---

## FASE 0: EL PROYECTO Y EL MÉTODO

### Qué es Nitrotoon
Comunidad geek venezolana que reúne a artistas internacionales, gamers, fandoms de KPOP, dibujantes, cosplayers, coleccionistas y familias en convenciones. Presente en Instagram y Facebook.

### El Método: LOOP + ÁRBITRO
1. **LOOP:** planificar → construir → probar → revisar → corregir → repetir
2. **ÁRBITRO:** un crítico independiente (el usuario) evalúa cada iteración antes de avanzar
3. **REGlas de trato:** Una instrucción a la vez. Prueba del objetivo dato a dato. Archivos SIEMPRE finales y completos (Ctrl+A → Ctrl+V). Cada cambio tiene su INFORME. Nada destructivo sin aprobación. DETENERSE si algo no encaja.

### La Especificación Maestra: PROMPT-WEB-NITROTOON.md (v2 FINAL)
Documento de 227 líneas que define TODO el proyecto: qué es, cómo se construye, qué reglas no se tocan, qué archivos se crean, cómo se publica. Es la biblia del proyecto. Cualquier IA puede ejecutarlo sin preguntar nada.

### Referentes Visuales (Aprobados por Comité)
- **A — Anime Expo:** Base visual, tokens de color, CTA de entradas, menú gigante, hub de puertas
- **B — Esports World Cup:** Jerarquía de partners por nivel, tablas de datos deportivos (SOLO un patrón)
- **C — Hololive Production:** Hub de puertas por comunidad, normas publicadas (SOLO patrón de navegación)

### Reglas de Oro (NO negociables)
- K1: Cero autoplay (excepto cinta superior)
- K2: prefers-reduced-motion obligatorio
- K3: Cero "Coming Soon" → solo estados reales (a-la-venta · en-preparacion · en-negociacion · realizado)
- K4: Todo funciona en mobile-first, file://, sin build, sin frameworks

### Paleta y Tokens (CERRADA, no se cambian)
```
--c-fondo: #0A0A0A (negro base)
--c-superficie: #161616 (tarjetas, paneles)
--c-texto: #FFF (texto principal)
--c-primario: #F2B705 (amarillo dorado Nitrotoon)
--c-acento: #A2AE15 (verde oliva)
--c-perla: #B3B3B3 (texto secundario)
--c-borde: #2C2C2C (bordes sutiles)
--c-borde-fuerte: #3A3A3A (bordes visibles)
```
Tokens tipográficos: `--fs-hero: clamp(2.7rem, 9vw, 7.5rem)`, `--fs-display: clamp(2.05rem,5.6vw,4.3rem)`, `--ancho-max: 72rem`, `--sp-1..8` (espaciado: .25/0.5/1/1.5/2.25/3.25/4.75/7rem)

---

## FASE 1: LA VITRINA PRINCIPAL

### Estructura del Proyecto
```
WEBNitro/                          ← Taller de trabajo (lo que ves aquí)
├── nitrotoon-web/                 ← EL ARTEFACTO: la web completa (se sube al repo)
│   ├── index.html                 ← Portada (hero + puertas)
│   ├── eventos.html               ← Calendario
│   ├── artistas.html              ← Artistas invitados
│   ├── programa.html              ← Programa por día
│   ├── galeria.html               ← Fotos del evento pasado
│   ├── normas.html                ← Normas de la comunidad
│   ├── aliados.html               ← Sponsors por nivel
│   ├── contacto.html              ← Contacto + FAQ
│   ├── otaku.html / gamers.html   ← Espacios con skin propio
│   ├── kpop.html / cosplay.html   ← Espacios con skin propio
│   ├── mercado.html               ← Espacio con tema compartido
│   ├── roadmap.html               ← Plan de crecimiento
│   ├── css/                       ← Tokens, base, componentes, skins, admin
│   ├── js/                        ← data.js, vitrina.js, vistas.js, insignia.js, sha256.js
│   ├── admin.html                 ← Dashboard de mantenimiento
│   └── assets/                    ← Logos, og.jpg, demos SVG
├── materiales/                    ← Material crudo del usuario (NO se sube)
├── _tools/                        ← Scripts de verificación (NO se sube)
│   ├── verificar_web.py           ← Verificador de 16 reglas estructurales
│   └── generar_paginas.py         ← Regenera HTML con chrome desde data.js
├── mtto/                          ← Taller de mantenimiento (NO se sube)
│   ├── cola.md                    ← Tareas pendientes
│   └── registro.md                ← Historial de cambios
├── AGENTS.md                      ← Instrucciones permanentes del agente
├── ESTADO.md                      ← Estado actual del proyecto (Sistema de Continuidad v3)
├── DECISIONES.md                  ← Registro de decisiones (Sistema de Continuidad v3)
├── PROMPT-WEB-NITROTOON.md        ← Especificación maestra (la biblia)
└── preview/                       ← Copia experimental (NO es producción)
```

### Arquitectura Técnica
- **Static site:** HTML/CSS/JS vanilla, sin build, sin npm, sin frameworks
- **Compatible file://:** se abre con doble clic, sin servidor
- **data.js alimenta TODO:** un solo archivo de datos alimenta las 15 páginas HTML
- **Publicación:** GitHub Pages (`afvelis/nitrotoon-web`, branch `main`, deploy desde root)
- **Dashboard admin.html:** PIN de acceso, editor por piezas, biblioteca de medios, botón Publicar

### Páginas del Sitio (15 total)
1. **Portada** (index.html) — Hero + cuenta regresiva + cinta infinita + 7 puertas + pie con intranet
2. **Eventos** (eventos.html) — Calendario del año con estados reales
3. **Otaku** (otaku.html) — Anime, manga, cómic (skin propio)
4. **Gamers** (gamers.html) — Torneos, esports (skin propio)
5. **KPOP** (kpop.html) — Dance covers, stans (skin propio)
6. **Cosplay** (cosplay.html) — Concursos, normas (skin propio)
7. **Artistas** (artistas.html) — Artist Alley, firmas (tema compartido)
8. **Mercado** (mercado.html) — Merch, stans, coleccionistas (tema compartido)
9. **Programa** (programa.html) — Agenda por día y escenario
10. **Galería** (galeria.html) — Fotos de "así salió"
11. **Normas** (normas.html) — Reglas de la comunidad
12. **Aliados** (aliados.html) — Sponsors por nivel
13. **Contacto** (contacto.html) — FAQ + vías de contacto
14. **Roadmap** (roadmap.html) — Plan de crecimiento público
15. **Admin** (admin.html) — Dashboard de mantenimiento (PIN)

### El Sistema de Piezas (Portada compuesta)
La portada no es fija. Se compone con PIEZAS en `data.portada.piezas`:
1. **hero** — Título del evento + cuenta regresiva + cinta infinita
2. **puertas** — 7 tarjetas hacia las comunidades
3. **avisos** — Franja de anuncios
4. **eventos** — Calendario con estados
5. **artistas** — Retatos de invitados
6. **galeria** — Fotos del evento pasado
7. **aliados** — Logos de sponsors

El dashboard arrastra piezas, las oculta, o añade nuevas. La estructura es congelada.

---

## FASE 2: EL DASHBOARD DE MANTENIMIENTO

### admin.html (lo que ve el administrador)
1. **Login con PIN** — Hash SHA-256 almacenado (PIN nunca en texto plano)
2. **Bloqueo por intentos** — 5 intentos fallidos → 15 minutos de bloqueo
3. **Sesión con localStorage** — 8 horas de vigencia

### Tres Vistas del Dashboard
1. **VITRINA** — Editar piezas de la portada con vista previa en vivo
2. **MEDIOS** — Biblioteca con validación técnica (medida, proporción, peso)
3. **PUBLICAR** — Genera data.js + checklist exacta de archivos para subir a GitHub

### Lo que el administrador puede hacer (SIN saber programar)
- Cambiar nombre del evento, eslogan, bajada, lugar
- Cambiar horarios, textos de puertas, estado de eventos
- Subir fotos de artistas, logos de aliados, fotos de galería
- Ocultar/mostrar piezas de la portada (visibilidad)
- Reordenar piezas de la portada (drag & drop)
- Generar data.js y subirlo a GitHub

### Lo que NO puede hacer (y por qué)
- No puede añadir/borrar/seccionar secciones (estructura congelada)
- No puede cambiar la paleta (colores codificados en CSS)
- No puede cambiar la tipografía (tokens codificados en CSS)
- No puede tocar el orden de las 7 puertas (orden fijado por el usuario)
- Solo bloquea lo que rompería la web (imposible, peso >2x)

---

## FASE 3: EL PROBLEMA Y LA SOLUCIÓN (EDITOR POR SECCIONES)

### La Petición del Usuario
> *"la manera como está creada la página de mantenimiento actual… es poco intuitiva"*

### El Mandato Literal
> *"no cambiemos la actual porque ya está en uso y no podemos aplicar mejoras cuando no sabremos el resultado"*

### La Estrategia Elegida
**Preview separado + sustitución al final.** Trabajo en copia independiente. Producción intacta.

### La Carpeta `preview/` (69 archivos, 1031.4 KB)
Copia experimental de la web. Sus diferencias con producción:
1. `robots.txt` bloquea todo (no indexar)
2. 14 HTML tienen `<meta name="robots" content="noindex, nofollow">`
3. URLs apuntan a `nitrotoon-web-preview` (no a `nitrotoon-web`)
4. Contiene las 6 nuevas fases F0-F5

### Las Fases F0-F5 (Nuevo Editor)

#### F0 · Red de Seguridad y Fuente Única
- `eventoVigente` ya no se escribe dos veces. Nombre, fechas, ciudad se HEREDAN del calendario.
- `data.js`: campos valen `"__HEREDADO__"`, `vitrina.js → eventoDeVerdad()` los resuelve desde `eventos[]`.
- **BUG-6:** IndexedDB colgaba en `file://` → 4s timeout + onblocked handler.
- **SEO:** `<title>`, `og:*` y `<noscript>` decían "Nitrotoon Fest 2027" → corregido a "Torneo NitroGamers 2026".

#### F1 · Editor por Secciones
- **`js/secciones.js`** (~320 líneas) — EL CONTRATO: declara sección por sección qué campos hay, qué etiqueta ve el usuario, cuántos caracteres caben (medidos en el CSS real).
- **`js/editor-secciones.js`** (~530 líneas) — LA UI: tarjetas con campos, contadores de caracteres, los dos interruptores, deshacer (Ctrl+Z).
- **`css/editor-secciones.css`** (~400 líneas) — Estilo con paleta cerrada, semáforo verde/ámbar/rojo/largo, barra de estado, bloque mobile, bloque prefers-reduced-motion.
- **8 tarjetas** en el orden de la portada: Evento, Cinta, Puertas, Avisos, Calendario, Invitados, Así Salio, Aliados.

#### F2 · Validación de Imágenes
- **Medida real** (ancho/alto en píxeles)
- **Proporción real** (ratio numérico: 1.78:1, 4.80:1, etc.)
- **Peso real** (KB, bytes)
- Acepta con AVISO; solo bloquea lo que rompería la web (no es imagen, peso >2x máximo).
- 5 escenarios probados: JPG 1920×1080/250KB → "encaja bien". 1920×400 → "proporción no es la esperada". 900KB → bloqueada. PDF → bloqueada.

#### F3 · Barra de Estado y Vista Previa del Borrador
- **Barra de estado permanente** arriba: verde (todo ok), ámbar (cambios sin guardar), blanco (sin cambios).
- Hora del último guardado.
- **Vista previa:** `index.html?borrador=1` abre la portada real con el borrador + franja amarilla.
- Regresión: sin `?borrador` el público no ve nada distinto.

#### F4 · Revisión Previa y Árbol de Publicación
- Checklist de 3 casillas que NUNCA se marcan solas:
  1. ¿El campo más importante tiene texto?
  2. ¿Las imágenes están subidas?
  3. ¿Hay cambios que publicar?
- Detecta: campo vacío, texto excedido, sección retirada, imágenes sin subir, ausencia de cambios.

#### F5 · Manual del Administrador
- `manual.html`: 9 pasos en lenguaje llano (no técnico).
- Explica los dos interruptores ("Ocultar en mi vista" vs "Retirar del sitio").
- Truco de la huella para saber si hay cambios sin guardar.
- Qué NO se puede hacer.

---

## LOS 9 BUGS ENCONTRADOS (y por qué aparecieron)

| # | Bug | Cómo se vio | Por qué apareció |
|---|-----|-------------|------------------|
| 1 | Rutas `portada.aviso.*` inexistentes | 2 campos vacíos en producción | Se inventaron rutas sin consultar data.js real |
| 2 | Fechas mostraban `de ~undefined` | Texto absurdo en pantalla | Campos de tipo fecha sin `ideal`/`max` definidos |
| 3 | Campo "Nombre del evento" vacío → escribía `__HEREDADO__` | El usuario sobrescribiría con basura | `ruta: "nombre"` buscaba en raíz, no en `datos.eventoVigente` |
| 4 | Deshacer pedía 2 pulsaciones por 1 edición | Frustración garantizada | `input` Y `change` disparaban undo stack por separado |
| 5 | Proporción de imagen diagnosticada como "pequeña" | Mensaje confuso | Check de medida antes de proporción (orden errado) |
| 6 | `cinta` y `evento` compartían `tipoPieza: "hero"` | Interruptor de cinta habría retirado el hero | `tipoPieza` ambiguo → se inventó `piezaId` explícito |
| 7 | 3 secciones (`calendario`, `invitados`, `asiSalio`) sin pieza | Interruptores apuntaban a piezas inexistentes | Match ad-hoc por `tipoPieza` vs `pieza.tipo` real |
| 8 | `heroPoster` apuntaba a propiedad inexistente | Prometía adjuntar foto que nadie lee | Hero se viste con CSS, no con `eventoVigente.heroPoster` |
| 9 | localStorage lleno → pérdida silenciosa de datos | Borradores desaparecían en rojo | `catch` bloqueaba todos los errores sin mostrar nada |

### La Lección Fundamental
> Los bugs 6 y 7 aparecieron SOLO al probar con los datos reales, no con fixtures inventados. La lección: probar contra los datos de producción, no contra fixtures inventados.

---

## EL FLUJO DE TRABAJO ACTUAL

```
1. Usuario trabaja en preview/admin.html (en su máquina local)
2. Prueba el editor: escribe en campos, sube imágenes, verifica portada con ?borrador=1
3. Si está satisfecho → aprueba en local
4. Se empuja a repo: afvelis/nitrotoon-web-preview (nuevo repo)
5. GitHub Pages despliega en: https://afvelis.github.io/nitrotoon-web-preview/
6. Usuario verifica en el navegador
7. Si aprueba → se sustituye archivo por archivo en producción (nitrotoon-web/)
8. Se borran diferencias deliberadas (robots.txt, noindex, URLs preview → production)
9. Se sube a afvelis/nitrotoon-web (producción) y se espera el verde de Actions
```

---

## DECISIONES CRÍTICAS TOMADAS

1. **Fuente única de verdad:** `eventoVigente.id` apunta a `eventos[]`. Todo se hereda. Cambiar una vez → se propaga a los 5 sitios.
2. **Estructura congelada:** No se pueden añadir, borrar o reordenar secciones. Es lo que hace que nadie rompa el diseño.
3. **Límites avisan, no bloquean:** El diseño aguanta más de lo ideal; bloquear haría que un usuario no técnico abandonara.
4. **Dos interruptores no-negociables:** "Ocultar en mi vista" (privado) ≠ "Retirar del sitio" (público). Conflatarlos fue un fallo en la propuesta original.
5. **Preview aislado de producción:** La carpeta `preview/` vive separada. `robots.txt` + `noindex` + URLs distintas. Solo se sustituye con aprobación explícita.
6. **Producción sagrada:** `nitrotoon-web/` NUNCA se toca en esta sesión. Todo nuevo trabajo va a `preview/`.
7. **Probar contra datos reales, no contra fixtures:** Los bugs más críticos aparecieron SOLO al probar con `data.js` real.

---

## EVENTO VIGENTE (DATOS ACTUALES)

**Torneo NitroGamers 2026**
- 5 y 6 de diciembre de 2026
- Valencia, Venezuela
- 6 disciplinas: Tekken 8, Street Fighter 6, EA Sports FC 26, Just Dance, Super Smash Bros. Ultimate, Call of Duty Mobile
- 3 niveles: Regional · Nacional · Internacional
- Aforo: 200 personas con acceso QR
- Transmisión con narradores
- Estado: `en-preparacion`

**Datos CONFIDENCIALES (NO en la web):**
- Sponsor: FIBEX Telecom
- ExitLag
- Aval: LIGA ADEC / FUNDADEPROTE
- Montos en USD ($1500, partidas)
- Método de medición

---

## ESTADO FINAL DE LA SESIÓN

### Lo que hay listo
- **F0→F5** construidos y verificados en `preview/` (69 archivos, 1031.4 KB)
- **16/16 verificador estructural LIMPIO** (incluye `manual.html`)
- **Sintaxis JS: OK** en todos los archivos
- **Producción intacta** (`nitrotoon-web/` no se tocó)
- **9 bugs corregidos** (documentados en `mtto/registro.md`)

### Lo que falta
- **Revisión del usuario en local** → abrir `preview/admin.html` y probar
- **Push a repo** → crear `afvelis/nitrotoon-web-preview`, subir `preview/` (excluyendo `robots.txt` y `noindex` en promoción)
- **Promoción a producción** → sustituir `nitrotoon-web/` archivo por archivo tras aprobación
- **Revertir diferencias deliberadas** → borrar `robots.txt`, quitar `noindex`, cambiar URLs preview → production
- **Actualizar `ESTADO.md` a v4** con el estado del preview

### Prueba para el nuevo agente
```bash
python _tools\verificar_web.py "D:\NITROTOONProject\WEBNitro\preview"
# Debe decir: 16/16 TODO LIMPIO

node --check preview\js\secciones.js
node --check preview\js\editor-secciones.js
node --check preview\js\admin.js
node --check preview\js\vitrina.js
node --check preview\js\vistas.js
# Deben salir sin error
```

### URL del preview (cuando se suba al repo)
```
https://afvelis.github.io/nitrotoon-web-preview/
```

### URL de producción (intacta)
```
https://afvelis.github.io/nitrotoon-web/
```