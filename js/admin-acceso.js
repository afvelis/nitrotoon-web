/* ==========================================================================
   NITROTOON · admin-acceso.js — configuración de acceso al dashboard (§6)
   --------------------------------------------------------------------------
   ÚNICO archivo que el administrador toca para cambiar su PIN.
   El PIN NUNCA vive aquí: solo su hash SHA-256 (con salto), calculado así:
     sha256Hex(SALTO + ":" + PIN)
   Para cambiar el PIN: abre el dashboard → Publicar → «Cambiar PIN» →
   pega el hash nuevo en este archivo y súbelo a GitHub junto con data.js.

   ┌──────────────────────────────────────────────────────────────────────┐
   │  PIN DE DEMOSTRACIÓN: NITRO27                                        │
   │  CÁMBIALO antes de publicar el sitio real (ver LEEME.md §4).         │
   └──────────────────────────────────────────────────────────────────────┘
   ========================================================================== */
"use strict";

window.ADMIN_ACCESO = {
  /* sha256Hex("nitrotoon:NITRO27") — PIN demo: NITRO27 */
  hash: "94ab0537b3672bdc1692ada1e3bd016415bb8084ca9e147a8147119f21fbf388",

  /* Salto que se antepone al PIN antes de hashear */
  salto: "nitrotoon",

  /* Bloqueo tras intentos fallidos (§6: mismo patrón que NitroSystem) */
  maxIntentos: 5,
  bloqueoMinutos: 15,

  /* La sesión vive en este navegador (localStorage) y expira sola */
  sesionHoras: 8
};
