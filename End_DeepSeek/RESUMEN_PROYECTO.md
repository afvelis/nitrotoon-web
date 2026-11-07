# RESUMEN PROYECTO — Nitrotoon Web
## La Vitrina Viva: Una Web que Cualquier Persona Puede Editar Sin Saber Programar

---

## EN 3 LÍNEAS

Nitrotoon es una comunidad geek venezolana. Necesitaban una web profesional. La construimos como una **vitrina viva** — una web que cualquier persona puede editar sin tocar código — y el método para que el usuario pueda cambiar el contenido (nombres, fechas, imágenes, estados) sin conocer una línea de HTML o JavaScript.

---

## QUÉ EXISTE HOY

### 1. La Web Pública (en GitHub Pages)
- **URL:** https://afvelis.github.io/nitrotoon-web/
- **Repo:** `afvelis/nitrotoon-web` (main, GitHub Pages activo)
- **15 páginas HTML** con tema espacial-neón dorado
- **16KB de CSS** (tokens, base, componentes, skins, admin)
- **JS vanilla** (data.js alimenta todo, vitrina.js, vistas.js)
- **Evento vigente:** Torneo NitroGamers 2026 (5-6 dic, Valencia, 6 disciplinas, 3 niveles, aforo 200)

### 2. El Dashboard de Mantenimiento (admin.html)
- Login con PIN (hash SHA-256)
- Tres vistas: Vitrina (editar piezas), Medios (subir imágenes), Publicar (generar data.js)
- Al pulsar Publicar → genera data.js + checklist de archivos para subir a GitHub

### 3. El Editor por Secciones (NUEVO, en preview)
- 8 tarjetas (una por sección de la portada)
- Campos con contadores de caracteres (verde/ámbar/rojo)
- Dos interruptores: "Ocultar en mi vista" vs "Retirar del sitio"
- Deshacer con Ctrl+Z
- Vista previa con `?borrador=1`
- Barra de estado permanente
- Checklist de publicación (3 casillas)
- Manual en 9 pasos para no-programadores

---

## CÓMO SE CONSTRUYÓ (Paso a Paso)

### Paso 1: La Especificación
Se escribió PROMPT-WEB-NITROTOON.md — 227 líneas que definen TODO el proyecto. Referentes visuales aprobados (Anime Expo, Esports World Cup, Hololive). Reglas de oro K1-K4. Paleta cerrada. Arquitectura técnica. Fases.

### Paso 2: La Vitrina (Fase 1)
Se construyeron las 15 páginas HTML. Hero con cinta infinita tipo reel. Menú gigante. 7 puertas. Mobile-first. Contenido demo real (no lorem ipsum). Se verificó con `_tools/verificar_web.py`.

### Paso 3: El Dashboard (Fase 2)
Se creó admin.html con PIN, editor por piezas, biblioteca de medios, botón Publicar. Se corrigieron bugs reales: PIN quedaba en campo (BUG-2), login desbordado (BUG-3), ventana visible tras login (BUG-4), cuenta regresiva sin números (BUG-5/5b).

### Paso 4: El Torneo Real
Se reemplazó el demo "Nitrotoon Fest 2027" por el evento real: Torneo NitroGamers 2026. Se extrajeron datos del PDF del sponsor. Se filtró contenido confidencial. Se verificó que ninguna fuga de datos privados escapó a la web.

### Paso 5: Cuenta Regresiva
Se corrigió BUG-5 (nodos congelados) y BUG-5b (arranque antes de insertar hero). La cuenta regresiva funciona en `file://` con reintento automático.

### Paso 6: Cinta Infinita
Se añadió `.franja` tipo reel con CSS puro (sin JS). 6 disciplinas desfilan. Pausa al cursor. `prefers-reduced-motion`. Hero centrado (20ch, balance).

### Paso 7: Mobile Optimizado
- Hero −37% en 320px
- Cuenta contenida
- h1 interiores reducidos
- 2 media queries nuevas: `@media (max-width: 48em)`, `@media (max-width: 22.5em)`
- Verificador: 15/15 TODO LIMPIO

### Paso 8: Fuente Única (F0 del Preview)
`eventoVigente` ya no se escribe dos veces. Campos valen `"__HEREDADO__"` → `eventoDeVerdad()` los resuelve desde `eventos[]`.

### Paso 9: Editor por Secciones (F1-F5 del Preview)
- secciones.js (contrato): 8 secciones, campos con rutas exactas, límites medidos en CSS real
- editor-secciones.js (UI): tarjetas, contadores, interruptores, deshacer
- editor-secciones.css: semáforo, barra de estado, mobile, prefers-reduced-motion
- manual.html: 9 pasos en lenguaje llano
- Barra de estado con estados (verde/ámbar/blanco/rojo)
- Vista previa del borrador con `?borrador=1`
- Checklist de 3 casillas (árboles de publicación)

### Paso 10: 9 Bugs Encontrados y Corregidos
Los bugs 6 y 7 aparecieron SOLO al probar con datos reales, no fixtures. La lección: probar contra los datos de producción.

---

## CÓMO LO USARÁ EL NUEVO AGENTE

### Si quieres ver la web en producción:
1. Abre el repo `afvelis/nitrotoon-web` en GitHub
2. La web está en: https://afvelis.github.io/nitrotoon-web/

### Si quieres ver el preview (editor por secciones):
1. Crea el repo `afvelis/nitrotoon-web-preview`
2. Sube el contenido de `WEBNitro/preview/` (excluyendo robots.txt y noindex meta)
3. GitHub Pages desplegará en: https://afvelis.github.io/nitrotoon-web-preview/

### Si quieres probar el editor localmente:
1. Abre `WEBNitro/preview/admin.html` con doble clic (file://)
2. Pon el PIN (mismo que producción)
3. Verás las 8 tarjetas del editor por secciones
4. Prueba: escribir en campos, subir imágenes, ver portada con ?borrador=1

### Si quieres hacer cambios:
1. Trabaja en `WEBNitro/preview/` (NUNCA en `nitrotoon-web/`)
2. Verifica con `python _tools\verificar_web.py "D:\NITROTOONProject\WEBNitro\preview"`
3. Cuando el usuario apruebe en local → se sustituye archivo por archivo
4. Se borrarán diferencias deliberadas (robots.txt, noindex, URLs preview → production)

---

## LO QUE EL USUARIO QUIERE (Siguiente Paso)

> *"ese siempre fue el plan apuntar a ganar un awwward"*

La web actual está bien. El usuario quiere llevarla a **nivel Awwwards** en un chat nuevo. Kit de arranque preparado en `PROMPT-CHAT-AWWWARDS.md`.

### Pero antes: el usuario necesita aprobar el editor por secciones en local
1. El usuario abre `preview/admin.html` y prueba el editor
2. Aprueba → se sube a `afvelis/nitrotoon-web-preview`
3. El usuario verifica en el navegador
4. Aprueba → se sustituye `nitrotoon-web/` y se sube a producción

---

## COMANDO DE VERIFICACIÓN (siempre útil)

```bash
# En el terminal de PowerShell:
python _tools\verificar_web.py "D:\NITROTOONProject\WEBNitro\preview"
# Debe decir: 16/16 TODO LIMPIO

node --check preview\js\secciones.js
node --check preview\js\editor-secciones.js
node --check preview\js\admin.js
node --check preview\js\vitrina.js
node --check preview\js\vistas.js
# Deben salir sin error
```

---

## RECURSOS ADICIONALES

- `AGENTS.md` — Instrucciones del agente (lee primero)
- `ESTADO.md` — Estado actual (v3)
- `DECISIONES.md` — Por qué las cosas son como son
- `mtto/registro.md` — Historial completo de cambios (500 líneas)
- `PROMPT-WEB-NITROTOON.md` — Especificación maestra (la biblia)
- `PROMPT-CHAT-AWWWARDS.md` — Kit para el chat de rediseño Awwwards

---

## ÚLTIMA FRASE

El proyecto está en un punto excelente: la web funciona, el editor funciona, el usuario lo va a aprobar en local, y cuando lo haga se sube a producción. Todo documentado. Todo listo para que el nuevo agente no tenga que reconstruir nada.

Solo tiene que leer estos 4 archivos de `End_DeepSeek/`:
1. **RESUMEN_PROYECTO.md** (este, para entender QUÉ es)
2. **RESUMEN.md** (para entender CÓMO se construyó)
3. **LISTA-ARCHIVOS.md** (para entender QUÉ hace cada archivo)
4. **ESTADO.md** (para saber en QUÉ punto quedó)

Y luego ya puede trabajar. Sin pérdida de contexto. Sin reconstrucción. Sin errores de interpretación.