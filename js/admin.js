/* ==========================================================================
   NITROTOON · admin.js — dashboard de mantenimiento (§6, Fase 2)
   --------------------------------------------------------------------------
   Tres vistas tras el login con PIN:
   · VITRINA  — piezas arrastrables de la portada + vista previa en vivo
                (reutiliza los renderizadores de vistas.js vía window.VISTAS).
   · MEDIOS   — biblioteca con validación técnica: solo bloquea lo que
                rompería la web; lo demás pasa con avisos y consejos (§6).
   · PUBLICAR — genera data.js + checklist exacta de archivos para GitHub.
   El borrador vive en localStorage; lo publicado nunca se toca aquí: el
   administrador sube los archivos generados a GitHub (§9).
   Reutiliza utilidades de vitrina.js ($, $$, h, icono) — carga después.
   ========================================================================== */
"use strict";

(function () {

  /* ---- Referencias y constantes ------------------------------------------ */
  const CFG = window.ADMIN_ACCESO || {};
  const CLAVES = {
    sesion: "nitrotoon-sesion",
    intentos: "nitrotoon-intentos",
    bloqueo: "nitrotoon-bloqueo",
    borrador: "nitrotoon-borrador"
  };

  const publicado = JSON.parse(JSON.stringify(window.NITROTOON_DATA || {}));
  let trabajo = null;
  let seleccion = null;
  let medios = [];
  let db = null;

  const ref = id => document.getElementById(id);
  const vistaLogin = () => ref("vista-login");
  const vistaPanel = () => ref("vista-panel");

  function clonar(x) { return JSON.parse(JSON.stringify(x)); }
  function slug(texto) {
    return String(texto || "").toLowerCase().normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "pieza";
  }
  function pesoLegible(bytes) {
    if (bytes >= 1048576) return (bytes / 1048576).toFixed(1).replace(".", ",") + " MB";
    return Math.max(1, Math.round(bytes / 1024)) + " KB";
  }
  function escapar(texto) {
    return String(texto).replace(/[&<>"']/g, c =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  /* ==========================================================================
     1 · SESIÓN Y BLOQUEO (mismo patrón que NitroSystem, §6)
     ========================================================================== */
  const sesion = {
    activa() {
      try {
        const s = JSON.parse(localStorage.getItem(CLAVES.sesion) || "null");
        return !!(s && s.exp > Date.now());
      } catch (e) { return false; }
    },
    abrir() {
      try {
        localStorage.setItem(CLAVES.sesion, JSON.stringify({
          exp: Date.now() + (CFG.sesionHoras || 8) * 3600000
        }));
      } catch (e) { /* storage bloqueado: sesión solo en memoria */ }
    },
    cerrar() {
      try { localStorage.removeItem(CLAVES.sesion); } catch (e) { /* sin storage */ }
    }
  };

  let bloqueoMem = 0;   /* respaldo en memoria si localStorage está bloqueado */

  function bloqueoRestante() {
    if (bloqueoMem > Date.now()) return bloqueoMem - Date.now();
    try {
      const b = JSON.parse(localStorage.getItem(CLAVES.bloqueo) || "null");
      if (b && b.hasta > Date.now()) return b.hasta - Date.now();
    } catch (e) { /* sin storage */ }
    return 0;
  }

  function anotarFallo() {
    let intentos;
    try {
      intentos = (parseInt(localStorage.getItem(CLAVES.intentos) || "0", 10) || 0) + 1;
      localStorage.setItem(CLAVES.intentos, String(intentos));
    } catch (e) {
      intentos = (anotarFallo._mem || 0) + 1;
      anotarFallo._mem = intentos;
    }
    if (intentos >= (CFG.maxIntentos || 5)) {
      bloqueoMem = Date.now() + (CFG.bloqueoMinutos || 15) * 60000;
      try {
        localStorage.setItem(CLAVES.bloqueo, JSON.stringify({ hasta: bloqueoMem }));
        localStorage.removeItem(CLAVES.intentos);
      } catch (e) { /* storage bloqueado */ }
      return 0;
    }
    return (CFG.maxIntentos || 5) - intentos;
  }

  function limpiarFallos() {
    bloqueoMem = 0;
    anotarFallo._mem = 0;
    try { localStorage.removeItem(CLAVES.intentos); } catch (e) { /* sin storage */ }
  }

  function pintarLoginEstado(texto) {
    ref("login-estado").textContent = texto || "";
  }

  function revisarBloqueo() {
    const ms = bloqueoRestante();
    if (ms <= 0) return false;
    const min = Math.ceil(ms / 60000);
    pintarLoginEstado(`Demasiados intentos fallidos. Espera ${min} min antes de volver a intentar.`);
    ref("pin").disabled = true;
    return true;
  }

  function entrarConPin(pin) {
    if (revisarBloqueo()) return;
    if (!pin) { pintarLoginEstado("Escribe tu PIN."); return; }
    const hash = sha256Hex(`${CFG.salto || "nitrotoon"}:${pin}`);
    if (hash === CFG.hash) {
      limpiarFallos();
      sesion.abrir();
      abrirPanel();
    } else {
      const restantes = anotarFallo();
      ref("pin").value = "";
      if (revisarBloqueo()) return;
      pintarLoginEstado(restantes > 0
        ? `PIN incorrecto. Intentos restantes: ${restantes}.`
        : "PIN incorrecto.");
    }
  }

  /* ==========================================================================
     2 · PESTAÑAS DEL PANEL
     ========================================================================== */
  const PESTANAS = ["vitrina", "medios", "publicar"];

  function activarPestana(nombre) {
    for (const p of PESTANAS) {
      ref(`tab-${p}`).setAttribute("aria-selected", String(p === nombre));
      ref(`panel-${p}`).hidden = p !== nombre;
    }
    if (nombre === "publicar") pintarResumen();
    if (nombre === "vitrina") actualizarPreview();
  }

  function iniciarPestanas() {
    const tabs = PESTANAS.map(p => ref(`tab-${p}`));
    tabs.forEach(tab => tab.addEventListener("click", () =>
      activarPestana(tab.id.replace("tab-", ""))));
    ref("tab-vitrina").closest(".pestanas").addEventListener("keydown", e => {
      const i = tabs.indexOf(document.activeElement);
      if (i < 0) return;
      let j = null;
      if (e.key === "ArrowRight") j = (i + 1) % tabs.length;
      if (e.key === "ArrowLeft") j = (i - 1 + tabs.length) % tabs.length;
      if (j !== null) { tabs[j].focus(); activarPestana(tabs[j].id.replace("tab-", "")); }
    });
  }

  /* ==========================================================================
     3 · CATÁLOGO DE PIEZAS (campos editables por tipo)
     ========================================================================== */
  const campo = (clave, etiqueta, tipo = "texto", opciones = null, ayuda = "") =>
    ({ clave, etiqueta, tipo, opciones, ayuda });

  const CATALOGO = {
    hero:     { etiqueta: "Hero del evento", sistema: true,  campos: [] },
    puertas:  { etiqueta: "Hub de puertas",  sistema: true,  campos: [campo("titulo", "Título"), campo("intro", "Bajada", "area")] },
    avisos:   { etiqueta: "Avisos automáticos", sistema: true, campos: [campo("titulo", "Título"), campo("intro", "Bajada", "area")] },
    eventos:  { etiqueta: "Grilla de eventos", sistema: true, campos: [campo("titulo", "Título"), campo("intro", "Bajada", "area")] },
    artistas: { etiqueta: "Invitados", sistema: true, campos: [campo("titulo", "Título"), campo("intro", "Bajada", "area"), campo("max", "Máximo de fichas", "numero")] },
    galeria:  { etiqueta: "Galería", sistema: true, campos: [campo("titulo", "Título"), campo("intro", "Bajada", "area")] },
    aliados:  { etiqueta: "Aliados", sistema: true, campos: [campo("titulo", "Título"), campo("intro", "Bajada", "area")] },
    aviso: {
      etiqueta: "Aviso / noticia",
      porDefecto: () => ({ titulo: "Aviso nuevo", texto: "Escribe aquí el aviso.", tono: "dorado", icono: "estrella", accionTexto: "Ver más", accionUrl: "eventos.html" }),
      campos: [
        campo("titulo", "Título"),
        campo("texto", "Texto", "area"),
        campo("tono", "Tono", "select", ["dorado", "verde"]),
        campo("icono", "Icono", "select", ["estrella", "camara", "microfono", "ticket", "calendario", "control"]),
        campo("accionTexto", "Texto del enlace"),
        campo("accionUrl", "URL del enlace", "url")
      ]
    },
    tarjeta: {
      etiqueta: "Tarjeta de contenido",
      porDefecto: () => ({ titulo: "Tarjeta nueva", texto: "Contenido de la tarjeta.", accionTexto: "Ver más", accionUrl: "index.html" }),
      campos: [campo("titulo", "Título"), campo("texto", "Texto", "area"), campo("accionTexto", "Texto del enlace"), campo("accionUrl", "URL del enlace", "url")]
    },
    enlace: {
      etiqueta: "Botón / enlace",
      porDefecto: () => ({ texto: "Botón nuevo", url: "index.html", grande: true }),
      campos: [campo("texto", "Texto del botón"), campo("url", "URL", "url"), campo("grande", "Tamaño grande", "check")]
    },
    cuenta: {
      etiqueta: "Cuenta regresiva",
      porDefecto: () => ({ titulo: "Cuenta regresiva", fecha: (window.NITROTOON_DATA.eventoVigente || {}).fechaInicio || "2027-07-17" }),
      campos: [campo("titulo", "Título"), campo("fecha", "Fecha objetivo", "fecha", null, "Sin hora: cuenta desde las 00:00 de Venezuela")]
    },
    reel: {
      etiqueta: "Reel destacado",
      porDefecto: () => ({ titulo: "Reel destacado", texto: "Toca para verlo: nada de terceros se carga hasta entonces.", url: "https://www.instagram.com/nitrotoon/", videoId: "", poster: "assets/demo/galeria-reel1.svg" }),
      campos: [campo("titulo", "Título"), campo("texto", "Texto", "area"), campo("url", "URL del reel (Instagram)", "url"), campo("videoId", "ID de YouTube (opcional)", "url", null, "Si lo llenas, se incrusta al tocar"), campo("poster", "Ruta de la imagen fachada", "url")]
    },
    carrusel: {
      etiqueta: "Carrusel (manual)",
      porDefecto: () => ({ titulo: "Carrusel nuevo", intro: "Pasa las tarjetas con las flechas.", items: [{ titulo: "Primera tarjeta", texto: "Contenido.", accionTexto: "", accionUrl: "" }] }),
      campos: [campo("titulo", "Título"), campo("intro", "Bajada", "area")],
      conItems: true
    }
  };

  function etiquetaDe(pieza) {
    const c = CATALOGO[pieza.tipo];
    return c ? c.etiqueta : pieza.tipo;
  }

  function resumenDe(pieza) {
    if (pieza.titulo) return pieza.titulo;
    if (pieza.texto) return pieza.texto;
    return (pieza.tipo === "hero") ? "Portada del evento vigente" : "Pieza del sistema";
  }

  /* ==========================================================================
     4 · VITRINA — lista arrastrable + formularios + vista previa
     ========================================================================== */
  function guardarBorrador() {
    clearTimeout(guardarBorrador._t);
    guardarBorrador._t = setTimeout(() => {
      try { localStorage.setItem(CLAVES.borrador, JSON.stringify(trabajo)); } catch (e) { /* lleno */ }
      window.NITROTOON_DATA = trabajo;   /* las vistas leen en vivo */
    }, 250);
  }

  function descartarBorrador() {
    localStorage.removeItem(CLAVES.borrador);
    trabajo = clonar(publicado);
    seleccion = null;
    window.NITROTOON_DATA = trabajo;
    renderListaPiezas();
    actualizarPreview();
    pintarResumen();
  }

  function piezaPorId(id) {
    return (trabajo.portada && trabajo.portada.piezas || []).find(p => p.id === id) || null;
  }

  function renderListaPiezas() {
    const lista = ref("lista-piezas");
    lista.replaceChildren();
    const piezas = (trabajo.portada && trabajo.portada.piezas) || [];
    piezas.forEach((pieza, i) => {
      const cat = CATALOGO[pieza.tipo] || { etiqueta: pieza.tipo, sistema: true, campos: [] };
      const asa = h("span", { class: "admin__pieza-asa", "aria-hidden": "true", html: "☰" });
      const info = h("div", { class: "admin__pieza-info" }, [
        h("strong", { html: etiquetaDe(pieza) }),
        h("span", { class: "texto-suave", html: resumenDe(pieza) })
      ]);
      const chkId = `vis-${pieza.id}`;
      const chk = h("input", { type: "checkbox", id: chkId });
      chk.checked = pieza.visible !== false;
      chk.addEventListener("change", () => { pieza.visible = chk.checked; guardarBorrador(); actualizarPreview(); });
      const sw = h("label", { class: "admin__switch", for: chkId }, [chk, h("span", { html: "Visible" })]);

      const btnSubir = h("button", { class: "btn btn--contorno btn--pequeno", type: "button", "aria-label": `Subir: ${etiquetaDe(pieza)}`, html: "↑" });
      btnSubir.disabled = i === 0;
      btnSubir.addEventListener("click", () => moverPieza(i, -1));
      const btnBajar = h("button", { class: "btn btn--contorno btn--pequeno", type: "button", "aria-label": `Bajar: ${etiquetaDe(pieza)}`, html: "↓" });
      btnBajar.disabled = i === piezas.length - 1;
      btnBajar.addEventListener("click", () => moverPieza(i, 1));

      const btnEditar = h("button", { class: "btn btn--contorno btn--pequeno", type: "button", "aria-expanded": "false", html: "Editar" });
      const form = h("div", { class: "admin__pieza-form", hidden: true });
      btnEditar.addEventListener("click", () => {
        const abierto = !form.hidden;
        form.hidden = abierto;
        btnEditar.setAttribute("aria-expanded", String(!abierto));
        if (!abierto) {
          seleccion = pieza.id;
          construirFormulario(form, pieza);
          actualizarPreview();
        }
      });

      const botones = h("div", { class: "admin__pieza-botones" }, [btnSubir, btnBajar, btnEditar]);
      if (!cat.sistema) {
        const btnQuitar = h("button", { class: "btn btn--contorno btn--pequeno admin__quitar", type: "button", "aria-label": `Quitar: ${etiquetaDe(pieza)}`, html: "✕" });
        btnQuitar.addEventListener("click", () => {
          trabajo.portada.piezas = trabajo.portada.piezas.filter(p => p.id !== pieza.id);
          if (seleccion === pieza.id) seleccion = null;
          guardarBorrador(); renderListaPiezas(); actualizarPreview();
        });
        botones.append(btnQuitar);
      }

      const li = h("li", { class: "admin__pieza", dataset: { id: pieza.id }, draggable: true }, [asa, info, sw, botones, form]);
      iniciarArrastre(li, pieza);
      lista.append(li);
    });
  }

  function moverPieza(i, delta) {
    const piezas = trabajo.portada.piezas;
    const j = i + delta;
    if (j < 0 || j >= piezas.length) return;
    [piezas[i], piezas[j]] = [piezas[j], piezas[i]];
    guardarBorrador();
    renderListaPiezas();
    actualizarPreview();
    /* devolver el foco al botón de la pieza movida (navegación por teclado) */
    const li = ref("lista-piezas").children[j];
    if (li) {
      const btn = li.querySelector(delta < 0 ? "button[aria-label^='Subir']" : "button[aria-label^='Bajar']");
      if (btn) btn.focus();
    }
  }

  function iniciarArrastre(li, pieza) {
    li.addEventListener("dragstart", e => {
      e.dataTransfer.setData("text/plain", pieza.id);
      e.dataTransfer.effectAllowed = "move";
      li.classList.add("admin__pieza--arrastrando");
    });
    li.addEventListener("dragend", () => li.classList.remove("admin__pieza--arrastrando"));
    li.addEventListener("dragover", e => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      const rect = li.getBoundingClientRect();
      li.classList.toggle("admin__pieza--antes", e.clientY < rect.top + rect.height / 2);
      li.classList.toggle("admin__pieza--despues", e.clientY >= rect.top + rect.height / 2);
    });
    li.addEventListener("dragleave", () => li.classList.remove("admin__pieza--antes", "admin__pieza--despues"));
    li.addEventListener("drop", e => {
      e.preventDefault();
      const idOrigen = e.dataTransfer.getData("text/plain");
      li.classList.remove("admin__pieza--antes", "admin__pieza--despues");
      if (!idOrigen || idOrigen === pieza.id) return;
      const piezas = trabajo.portada.piezas;
      const desde = piezas.findIndex(p => p.id === idOrigen);
      let hasta = piezas.findIndex(p => p.id === pieza.id);
      if (desde < 0 || hasta < 0) return;
      const rect = li.getBoundingClientRect();
      const despues = e.clientY >= rect.top + rect.height / 2;
      const [movida] = piezas.splice(desde, 1);
      hasta = piezas.findIndex(p => p.id === pieza.id); /* recalcular tras splicar */
      piezas.splice(despues ? hasta + 1 : hasta, 0, movida);
      guardarBorrador();
      renderListaPiezas();
      actualizarPreview();
    });
  }

  function construirFormulario(form, pieza) {
    const cat = CATALOGO[pieza.tipo] || { campos: [] };
    form.replaceChildren();
    for (const def of cat.campos || []) {
      const inputId = `f-${pieza.id}-${def.clave}`;
      const control = crearControl(def, pieza, inputId);
      form.append(h("div", { class: "campo" }, [
        def.tipo === "check"
          ? h("label", { class: "admin__switch", for: inputId }, [control, h("span", { html: def.etiqueta })])
          : h("label", { for: inputId, html: def.etiqueta + (def.tipo === "select" || def.tipo === "check" ? "" : "") }),
        def.tipo === "check" ? null : control,
        def.ayuda ? h("small", { class: "texto-suave", html: def.ayuda }) : null
      ]));
    }
    if (cat.conItems) construirItems(form, pieza);
  }

  function crearControl(def, pieza, inputId) {
    let control;
    if (def.tipo === "area") {
      control = h("textarea", { id: inputId, rows: 3 });
      control.value = pieza[def.clave] || "";
    } else if (def.tipo === "select") {
      control = h("select", { id: inputId }, (def.opciones || []).map(o =>
        h("option", { value: o, html: o })));
      control.value = pieza[def.clave] || def.opciones[0];
    } else if (def.tipo === "check") {
      control = h("input", { type: "checkbox", id: inputId });
      control.checked = pieza[def.clave] !== false;
    } else if (def.tipo === "fecha") {
      control = h("input", { type: "date", id: inputId });
      control.value = pieza[def.clave] || "";
    } else if (def.tipo === "numero") {
      control = h("input", { type: "number", id: inputId, min: "1", max: "12" });
      control.value = pieza[def.clave] || 3;
    } else {
      control = h("input", { type: def.tipo === "url" ? "text" : "text", id: inputId, spellcheck: "false" });
      control.value = pieza[def.clave] || "";
    }
    control.addEventListener("input", () => {
      pieza[def.clave] = def.tipo === "check" ? control.checked
        : def.tipo === "numero" ? parseInt(control.value, 10) || 3
        : control.value;
      guardarBorrador();
      actualizarPreview();
    });
    return control;
  }

  function construirItems(form, pieza) {
    const caja = h("div", { class: "admin__items" });
    const pintar = () => {
      caja.replaceChildren(h("p", { class: "texto-micro texto-suave", html: "Tarjetas del carrusel:" }));
      (pieza.items || []).forEach((item, i) => {
        const fila = h("div", { class: "admin__item" });
        for (const clave of ["titulo", "texto", "accionTexto", "accionUrl"]) {
          const inp = h("input", { type: "text", "aria-label": `${clave} de tarjeta ${i + 1}`, placeholder: clave, spellcheck: "false" });
          inp.value = item[clave] || "";
          inp.addEventListener("input", () => { item[clave] = inp.value; guardarBorrador(); actualizarPreview(); });
          fila.append(inp);
        }
        const quitar = h("button", { class: "btn btn--contorno btn--pequeno", type: "button", "aria-label": `Quitar tarjeta ${i + 1}`, html: "✕" });
        quitar.addEventListener("click", () => { pieza.items.splice(i, 1); guardarBorrador(); pintar(); actualizarPreview(); });
        fila.append(quitar);
        caja.append(fila);
      });
      const anadir = h("button", { class: "btn btn--contorno btn--pequeno", type: "button", html: "+ Añadir tarjeta" });
      anadir.addEventListener("click", () => {
        pieza.items = pieza.items || [];
        pieza.items.push({ titulo: "Nueva tarjeta", texto: "", accionTexto: "", accionUrl: "" });
        guardarBorrador(); pintar(); actualizarPreview();
      });
      caja.append(anadir);
    };
    pintar();
    form.append(caja);
  }

  function actualizarPreview() {
    const marco = ref("contenedor-preview");
    const etiqueta = ref("preview-pieza");
    if (!marco) return;
    const piezas = (trabajo.portada && trabajo.portada.piezas) || [];
    const visibles = piezas.filter(p => p.visible !== false);
    const pieza = (seleccion && piezaPorId(seleccion)) || visibles[0] || piezas[0];
    if (!pieza) { marco.replaceChildren(h("p", { class: "texto-suave", html: "No hay piezas activas." })); return; }
    if (etiqueta) etiqueta.textContent = `· ${etiquetaDe(pieza)}`;
    if (pieza.visible === false) {
      marco.replaceChildren(h("p", { class: "aviso", html: `<div><strong>Pieza oculta</strong><p>Marca «Visible» para verla en la portada.</p></div>` }));
      return;
    }
    window.VISTAS.pieza(pieza.tipo, pieza, marco);
  }

  function anadirPieza() {
    const tipo = ref("nueva-pieza").value;
    const cat = CATALOGO[tipo];
    if (!cat) return;
    const pieza = { id: `${tipo}-${Date.now().toString(36)}`, tipo, visible: true, demo: true, ...cat.porDefecto() };
    trabajo.portada.piezas = trabajo.portada.piezas || [];
    trabajo.portada.piezas.push(pieza);
    seleccion = pieza.id;
    guardarBorrador();
    renderListaPiezas();
    actualizarPreview();
    /* abre el formulario recién creado */
    const li = ref("lista-piezas").querySelector(`[data-id="${pieza.id}"]`);
    if (li) li.querySelector(".admin__pieza-botones button[aria-expanded]").click();
  }

  /* ==========================================================================
     5 · MEDIOS — biblioteca con validación (solo bloquea lo que rompe, §6)
     ========================================================================== */
  const SPECS = [
    { id: "retrato",      etiqueta: "Retrato de artista", mimes: ["image/jpeg", "image/png", "image/webp"], minAncho: 800,  minAlto: 800,  exacto: [800, 800],    maxMB: 0.5, destino: (n, mime) => `assets/demo/retrato-${slug(n)}.${extDe(mime, "jpg")}` },
    { id: "galeria-foto", etiqueta: "Foto de galería",    mimes: ["image/jpeg", "image/png", "image/webp"], minAncho: 1600, minAlto: 900,  exacto: null,          maxMB: 0.8, destino: (n, mime) => `assets/demo/galeria-${slug(n)}.${extDe(mime, "jpg")}` },
    { id: "logo-aliado",  etiqueta: "Logo de aliado",     mimes: ["image/png", "image/svg+xml"],            minAncho: 600,  minAlto: 400,  exacto: null,          maxMB: 0.3, destino: (n, mime) => `assets/demo/aliado-${slug(n)}.${extDe(mime, "png")}` },
    { id: "hero-video",   etiqueta: "Video de portada",   mimes: ["video/mp4"],                             minAncho: 1920, minAlto: 1080, exacto: null,          maxMB: 20,  destino: () => "assets/hero-loop.mp4" },
    { id: "hero-poster",  etiqueta: "Póster del video",   mimes: ["image/jpeg", "image/png"],               minAncho: 1920, minAlto: 1080, exacto: null,          maxMB: 0.4, destino: () => "assets/hero-poster.jpg" },
    { id: "reel",         etiqueta: "Reel de galería",    mimes: ["video/mp4", "image/jpeg", "image/png", "image/webp"], minAncho: 720, minAlto: 1280, exacto: null, maxMB: 50, destino: (n, mime) => `assets/demo/galeria-reel-${slug(n)}.${extDe(mime, "mp4")}` },
    { id: "logo-marca",   etiqueta: "Logo de marca",      mimes: ["image/png"],                             minAncho: 1280, minAlto: 0,    exacto: null,          maxMB: 0.5, destino: () => "assets/logo.png" },
    { id: "og",           etiqueta: "og:image (redes)",   mimes: ["image/jpeg", "image/png"],               minAncho: 1200, minAlto: 630,  exacto: [1200, 630],   maxMB: 0.5, destino: () => "assets/og.jpg" }
  ];
  const PESO_LIMITE_MB = 50;   /* más que esto rompe la subida a GitHub */
  const EXT_POR_MIME = {
    "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp",
    "image/svg+xml": "svg", "video/mp4": "mp4"
  };
  const extDe = (mime, porDefecto) => EXT_POR_MIME[mime] || porDefecto;

  function abrirDB() {
    return new Promise(res => {
      if (!window.indexedDB) { res(null); return; }
      const pedido = window.indexedDB.open("nitrotoon-admin", 1);
      pedido.onupgradeneeded = () => pedido.result.createObjectStore("medios", { keyPath: "id" });
      pedido.onsuccess = () => res(pedido.result);
      pedido.onerror = () => res(null);
    });
  }

  function txMedios(modo) {
    return db.transaction("medios", modo).objectStore("medios");
  }

  function listarMedios() {
    return new Promise(res => {
      if (!db) { res([]); return; }
      const pedido = txMedios("readonly").getAll();
      pedido.onsuccess = () => res(pedido.result || []);
      pedido.onerror = () => res([]);
    });
  }

  function guardarMedio(registro) {
    if (!db) return Promise.resolve();
    return new Promise(res => {
      const pedido = txMedios("readwrite").put(registro);
      pedido.onsuccess = res;
      pedido.onerror = res;
    });
  }

  function borrarMedio(id) {
    if (!db) return Promise.resolve();
    return new Promise(res => {
      const pedido = txMedios("readwrite").delete(id);
      pedido.onsuccess = res;
      pedido.onerror = res;
    });
  }

  function medirArchivo(file) {
    return new Promise(res => {
      const url = URL.createObjectURL(file);
      if (file.type.startsWith("video/")) {
        const v = document.createElement("video");
        v.preload = "metadata";
        v.onloadedmetadata = () => {
          res({ ancho: v.videoWidth, alto: v.videoHeight, duracion: v.duration, url });
          URL.revokeObjectURL(url);
        };
        v.onerror = () => { res({ ancho: 0, alto: 0, url }); URL.revokeObjectURL(url); };
        v.src = url;
      } else {
        const img = new Image();
        img.onload = () => {
          res({ ancho: img.naturalWidth, alto: img.naturalHeight, url });
          URL.revokeObjectURL(url);
        };
        img.onerror = () => { res({ ancho: 0, alto: 0, url }); URL.revokeObjectURL(url); };
        img.src = url;
      }
    });
  }

  function adivinarSpec(file, meta) {
    if (file.type === "video/mp4") return meta.ancho > meta.alto ? "hero-video" : "reel";
    if (file.type === "image/svg+xml") return "logo-aliado";
    if (meta.ancho === 800 && meta.alto === 800) return "retrato";
    if (meta.ancho === 1200 && meta.alto === 630) return "og";
    if (meta.ancho >= 1920 && meta.alto >= 1080) return "hero-poster";
    return "galeria-foto";
  }

  function validarContra(spec, meta, file) {
    const pesoMB = file.size / 1048576;
    const mensajes = [];
    let nivel = "ok";
    if (!spec.mimes.includes(file.type)) {
      return { nivel: "bloqueo", mensajes: [`Formato ${file.type || "desconocido"} no servible para «${spec.etiqueta}»: la web necesita ${spec.mimes.join(" · ")}. Convierte el archivo y vuelve a intentar.`] };
    }
    if (pesoMB > PESO_LIMITE_MB) {
      return { nivel: "bloqueo", mensajes: [`${pesoLegible(file.size)} supera el límite duro de ${PESO_LIMITE_MB} MB: GitHub no lo aceptará en la práctica y la vitrina se arrastraría. Comprime o divide el archivo.`] };
    }
    if (!meta.ancho || !meta.alto) {
      return { nivel: "aviso", mensajes: ["No pudimos medir el archivo (0×0): puede estar corrupto o usar un formato especial. Ábrelo en tu equipo para confirmar que se ve bien antes de publicarlo."] };
    }
    if (spec.exacto && (meta.ancho !== spec.exacto[0] || meta.alto !== spec.exacto[1])) {
      nivel = "aviso";
      mensajes.push(`«${spec.etiqueta}» pide ${spec.exacto[0]}×${spec.exacto[1]} exactos; este archivo mide ${meta.ancho}×${meta.alto}. Redimensiónalo para que encaje sin recortes raros.`);
    }
    if (spec.minAncho && meta.ancho && meta.ancho < spec.minAncho) {
      nivel = "aviso";
      mensajes.push(`Ancho ${meta.ancho} px por debajo del mínimo recomendado (${spec.minAncho} px): se verá borroso en pantallas grandes. Sube la mejor resolución que tengas.`);
    }
    if (pesoMB > spec.maxMB) {
      nivel = "aviso";
      mensajes.push(`Pesa ${pesoLegible(file.size)} y lo ideal para «${spec.etiqueta}» es ≤ ${String(spec.maxMB).replace(".", ",")} MB. Comprímelo (JPG calidad 80, WebP, o HandBrake para video) para que la vitrina vuele.`);
    }
    return { nivel, mensajes };
  }

  let bloqueadosSesion = [];   /* trazabilidad de archivos bloqueados (F2-9) */

  async function recibirArchivos(archivos) {
    const estado = ref("estado-medios");
    if (!archivos.length) return;
    estado.textContent = "Revisando archivos…";
    let ok = 0, avisos = 0, bloqueados = 0;
    for (const file of archivos) {
      const meta = await medirArchivo(file);
      const spec = SPECS.find(s => s.id === adivinarSpec(file, meta)) || SPECS[1];
      const veredicto = validarContra(spec, meta, file);
      if (veredicto.nivel === "bloqueo") {
        bloqueados++;
        bloqueadosSesion.push({ nombre: file.name, motivo: veredicto.mensajes[0] });
        continue;
      }
      if (veredicto.nivel === "aviso") avisos++; else ok++;
      const registro = {
        id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
        nombre: file.name,
        tipoSpec: spec.id,
        mime: file.type,
        peso: file.size,
        ancho: meta.ancho,
        alto: meta.alto,
        estado: veredicto.nivel,
        mensajes: veredicto.mensajes,
        creado: new Date().toISOString(),
        blob: file
      };
      await guardarMedio(registro);
      medios.push(registro);
    }
    if (bloqueados > 0) {
      estado.textContent = `${bloqueados} archivo(s) bloqueado(s): revisa la lista de abajo para ver el motivo de cada uno.` +
        (ok || avisos ? ` El resto (${ok + avisos}) quedó en tu biblioteca local.` : "");
    } else {
      estado.textContent = `Listo: ${ok} sin notas` +
        (avisos ? ` · ${avisos} con avisos (revisa las sugerencias abajo)` : "") +
        " · todo quedó en tu biblioteca local.";
    }
    renderListaMedios();
  }

  function pillEstado(nivel) {
    const mapa = {
      ok: { clase: "admin__pill--ok", texto: "Listo" },
      aviso: { clase: "admin__pill--aviso", texto: "Con aviso" },
      bloqueo: { clase: "admin__pill--bloqueo", texto: "Bloqueado" }
    };
    const m = mapa[nivel] || mapa.ok;
    return h("span", { class: `admin__pill ${m.clase}`, html: m.texto });
  }

  let miniaturas = [];   /* URLs de objeto vivas; se revocan al re-render (F2-8) */

  function renderListaMedios() {
    const lista = ref("lista-medios");
    miniaturas.forEach(u => URL.revokeObjectURL(u));
    miniaturas = [];
    lista.replaceChildren();

    /* Archivos bloqueados en esta sesión: quedan listados con su motivo */
    for (const b of bloqueadosSesion) {
      lista.append(h("li", { class: "aviso admin__bloqueado" }, [
        h("div", {}, [
          h("strong", {}, b.nombre),
          h("p", { class: "admin__medio-aviso", html: b.motivo })
        ]),
        h("button", { class: "btn btn--contorno btn--pequeno", type: "button", html: "Quitar de la lista" })
      ]));
      lista.lastChild.querySelector("button").addEventListener("click", () => {
        bloqueadosSesion = bloqueadosSesion.filter(x => x !== b);
        renderListaMedios();
      });
    }

    if (!db) {
      lista.append(h("li", { class: "aviso", html: `<div><strong>Biblioteca solo en memoria</strong><p>Tu navegador no permitió guardar entre sesiones aquí. Los archivos se validarán igual, pero al cerrar la pestaña se olvida la biblioteca.</p></div>` }));
    }
    if (!medios.length) {
      if (!bloqueadosSesion.length) {
        lista.append(h("li", { class: "texto-suave", html: "Todavía no hay archivos. Arrastra los primeros arriba." }));
      }
      return;
    }
    for (const m of [...medios].reverse()) {
      const spec = SPECS.find(s => s.id === m.tipoSpec) || SPECS[0];
      const destino = spec.destino(m.nombre, m.mime);
      const urlMini = URL.createObjectURL(m.blob);
      miniaturas.push(urlMini);
      const vista = m.mime.startsWith("video/")
        ? h("span", { class: "admin__medio-vista", "aria-hidden": "true", html: "🎬" })
        : h("img", { class: "admin__medio-vista", src: urlMini, alt: "" });
      const copiar = h("button", { class: "btn btn--contorno btn--pequeno", type: "button", html: "Copiar ruta" });
      copiar.addEventListener("click", () => {
        copiarRuta(destino, copiar);
      });
      const li = h("li", { class: "admin__medio" }, [
        vista,
        h("div", { class: "admin__medio-info" }, [
          h("strong", {}, m.nombre),
          h("p", { class: "texto-suave", html: `${spec.etiqueta} · ${m.ancho}×${m.alto} · ${pesoLegible(m.peso)}` }),
          ...(m.mensajes || []).map(t => h("p", { class: "admin__medio-aviso", html: t })),
          h("p", { class: "texto-micro texto-suave", html: `Guárdalo en GitHub como: <code>${destino}</code>` })
        ]),
        h("div", { class: "admin__medio-botones" }, [
          pillEstado(m.estado),
          copiar,
          (() => {
            const b = h("button", { class: "btn btn--contorno btn--pequeno admin__quitar", type: "button", "aria-label": `Quitar ${m.nombre} de la biblioteca`, html: "✕" });
            b.addEventListener("click", async () => {
              await borrarMedio(m.id);
              medios = medios.filter(x => x.id !== m.id);
              renderListaMedios();
            });
            return b;
          })()
        ])
      ]);
      lista.append(li);
    }
  }

  function copiarRuta(texto, boton) {
    const hecho = () => { boton.textContent = "¡Copiada!"; setTimeout(() => boton.textContent = "Copiar ruta", 1500); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(texto).then(hecho, () => respaldo());
    } else respaldo();
    function respaldo() {
      const ta = document.createElement("textarea");
      ta.value = texto;
      document.body.append(ta);
      ta.select();
      try { document.execCommand("copy"); hecho(); } catch (e) { /* sin permiso */ }
      ta.remove();
    }
  }

  /* ==========================================================================
     6 · PUBLICAR — genera data.js + checklist (§6, §9)
     ========================================================================== */
  function serializarData(datos) {
    const fecha = new Date().toISOString().slice(0, 10);
    return `/* ==========================================================================
   NITROTOON · data.js — la vitrina entera vive aquí (§4 del prompt maestro)
   --------------------------------------------------------------------------
   · Generado por el dashboard de mantenimiento (admin.html) el ${fecha}.
   · Un solo data.js alimenta TODAS las páginas. El administrador nunca
     toca este archivo a mano: edita desde el dashboard y vuelve a publicar.
   · Formato: script clásico (sin módulos) para funcionar con file:// (§3.6).
   ========================================================================== */

window.NITROTOON_DATA = ${JSON.stringify(datos, null, 2)};
`;
  }

  function pintarResumen() {
    const caja = ref("resumen-publicar");
    if (!caja) return;
    const piezas = (trabajo.portada && trabajo.portada.piezas) || [];
    const activas = piezas.filter(p => p.visible !== false).length;
    const cambio = JSON.stringify(trabajo) === JSON.stringify(publicado);
    caja.replaceChildren(
      h("p", { html: `Portada con <strong>${activas}</strong> de ${piezas.length} piezas visibles · <strong>${medios.length}</strong> archivos en tu biblioteca local.` }),
      h("p", { class: cambio ? "texto-suave" : "admin__pendiente", html: cambio
        ? "El borrador está igual a lo publicado: puedes generar data.js de todas formas para tener la copia más reciente."
        : "Hay cambios sin publicar: genera data.js y súbelo a GitHub para vestir la vitrina." })
    );
  }

  function generarDataJs() {
    const ahora = new Date();
    const fecha = ahora.toISOString().slice(0, 10);
    /* pintarPie() (vitrina.js) espera { etiqueta, fecha } — nunca un string */
    trabajo.version = { etiqueta: "Dashboard", fecha };
    trabajo.generado = ahora.toISOString();
    const texto = serializarData(trabajo);
    const blob = new Blob([texto], { type: "text/javascript;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "data.js";
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    guardarBorrador();
    pintarResumen();
    pintarChecklist();
  }

  function pintarChecklist() {
    const lista = ref("lista-checklist");
    if (!lista) return;
    const items = [
      "Descarga el data.js que acaba de generarse (carpeta de descargas).",
      "Entra a github.com → tu repositorio → «Add file» → «Upload files».",
      "Arrastra el data.js nuevo (reemplaza al anterior) y haz «Commit changes»."
    ];
    if (medios.length) {
      items.push("Sube también tus archivos de la biblioteca, guardando cada uno con ESTA ruta exacta:");
      for (const m of medios) {
        const destino = (SPECS.find(s => s.id === m.tipoSpec) || SPECS[0]).destino(m.nombre, m.mime);
        items.push(`• ${escapar(m.nombre)} → <code>${destino}</code>`);
      }
      items.push("(Si el archivo ya existe en el repositorio, al subirlo con el mismo nombre lo reemplaza.)");
    }
    items.push("Espera 1–2 min: en la pestaña «Actions» del repo debe verse el flujo «pages build and deployment» en verde.");
    items.push("Abre tu web publicada, refresca con Ctrl+F5 y verifica el cambio en la portada.");
    lista.replaceChildren(...items.map(t => {
      const li = h("li", {});
      li.innerHTML = t;   /* solo armamos nosotros este HTML (sin input del usuario salvo nombres de archivo ya validados) */
      return li;
    }));
  }

  function cambiarPin(e) {
    e.preventDefault();
    const a = ref("pin-nuevo"), b = ref("pin-confirmar"), estado = ref("pin-estado"), salida = ref("pin-resultado");
    salida.hidden = true;
    if (!a.value || a.value.length < 6) { estado.textContent = "El PIN nuevo debe tener al menos 6 caracteres."; return; }
    if (a.value !== b.value) { estado.textContent = "Los dos PIN no coinciden."; return; }
    estado.textContent = "Hash listo. Cópialo en js/admin-acceso.js y súbelo a GitHub junto con data.js.";
    salida.hidden = false;
    salida.textContent =
      `// js/admin-acceso.js — reemplaza la línea del hash por:\n` +
      `hash: "${sha256Hex(`${CFG.salto || "nitrotoon"}:${a.value}`)}",\n\n` +
      `// No guardes el PIN en ningún archivo: con el hash basta.\n` +
      `// Después de subirlo, entra con el PIN nuevo (cierra sesión antes).`;
    a.value = b.value = "";
  }

  /* ==========================================================================
     7 · ARRANQUE
     ========================================================================== */
  function abrirPanel() {
    vistaLogin().hidden = true;
    vistaPanel().hidden = false;
    ref("btn-salir").hidden = false;
    ref("pin").disabled = false;
    pintarLoginEstado("");
    renderListaPiezas();
    actualizarPreview();
    renderListaMedios();
    pintarResumen();
    pintarChecklist();
  }

  function mostrarLogin() {
    vistaPanel().hidden = true;
    vistaLogin().hidden = false;
    ref("btn-salir").hidden = true;
    revisarBloqueo();
    ref("pin").focus();
  }

  async function arrancar() {
    if (typeof pintarIconos === "function") pintarIconos();
    if (typeof $$ === "function") {
      const ver = (window.NITROTOON_DATA || {}).version;
      const textoVersion = typeof ver === "string" ? ver
        : (ver && ver.etiqueta ? `${ver.etiqueta} · ${ver.fecha || ""}` : "demo");
      $$("[data-version]").forEach(n => n.textContent = textoVersion);
    }

    /* Borrador guardado o copia limpia de lo publicado */
    let guardado = null;
    try { guardado = JSON.parse(localStorage.getItem(CLAVES.borrador) || "null"); } catch (e) { guardado = null; }
    trabajo = (guardado && guardado.portada) ? guardado : clonar(publicado);
    if (!trabajo.portada) trabajo.portada = { piezas: [] };
    window.NITROTOON_DATA = trabajo;

    iniciarPestanas();

    ref("form-login").addEventListener("submit", e => {
      e.preventDefault();
      entrarConPin(ref("pin").value);
    });
    ref("btn-salir").addEventListener("click", () => { sesion.cerrar(); mostrarLogin(); });
    ref("btn-anadir").addEventListener("click", anadirPieza);
    ref("btn-generar").addEventListener("click", generarDataJs);
    ref("btn-descartar").addEventListener("click", () => {
      if (confirm("¿Descartar el borrador y volver a lo publicado?")) descartarBorrador();
    });
    ref("form-pin").addEventListener("submit", cambiarPin);

    /* Dropzone de medios */
    const zona = ref("zona-soltar");
    const input = ref("input-medios");
    zona.addEventListener("click", () => input.click());
    zona.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); input.click(); }
    });
    input.addEventListener("change", () => { recibirArchivos([...input.files]); input.value = ""; });
    ["dragenter", "dragover"].forEach(ev => zona.addEventListener(ev, e => { e.preventDefault(); zona.classList.add("admin__dropzone--sobre"); }));
    ["dragleave", "drop"].forEach(ev => zona.addEventListener(ev, e => { e.preventDefault(); zona.classList.remove("admin__dropzone--sobre"); }));
    zona.addEventListener("drop", e => recibirArchivos([...(e.dataTransfer.files || [])]));

    /* Biblioteca */
    db = await abrirDB();
    medios = await listarMedios();

    if (sesion.activa()) abrirPanel(); else mostrarLogin();
  }

  document.addEventListener("DOMContentLoaded", arrancar);
})();
