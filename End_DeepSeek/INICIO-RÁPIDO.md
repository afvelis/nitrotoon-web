# INICIO RÁPIDO — Para el nuevo agente que lee esto por primera vez

> Si solo vas a leer UN archivo, lee `End_DeepSeek/RESUMEN_PROYECTO.md`.
> Si vas a leer dos, añade `End_DeepSeek/RESUMEN.md`.
> Con esos dos ya puedes trabajar.

---

## ¿DE DÓNDE EMPIEZO?

### 1. Lee estos 4 archivos EN ESTE ORDEN:
1. `End_DeepSeek/RESUMEN_PROYECTO.md` — QUÉ es el proyecto
2. `End_DeepSeek/RESUMEN.md` — CÓMO se construyó
3. `End_DeepSeek/LISTA-ARCHIVOS.md` — QUÉ hace cada archivo
4. `WEBNitro/ESTADO.md` — en QUÉ punto quedó

### 2. Para ver la web actual (producción):
- GitHub: https://afvelis.github.io/nitrotoon-web/

### 3. Para ver el editor por secciones (preview):
- Crea repo `afvelis/nitrotoon-web-preview` en GitHub del usuario
- Sube `WEBNitro/preview/` (excluyendo `robots.txt` y `<meta name="robots"...>`)
- URL: https://afvelis.github.io/nitrotoon-web-preview/

### 4. Para probar el editor localmente:
- Abre `WEBNitro/preview/admin.html` con doble clic
- PIN: el mismo que producción (el hash es `41a959222edfd196842cbacf94c7f9895f45ea7232ea14c6be332b09882ae058`)
- Verás 8 tarjetas del editor por secciones

---

## REGLAS DE ORO (NO SE ROMPEN)

1. **`nitrotoon-web/` es sagrado.** No se toca sin aprobación explícita.
2. **Todo nuevo trabajo va a `preview/`.** Siempre.
3. **La paleta está cerrada:** #F2B705 amarillo, no azul.
4. **Probar contra datos reales, no contra fixtures.** (Bug 6 y 7 lo demostraron)
5. **Dos interruptores ≠ lo mismo:** "Ocultar en mi vista" ≠ "Retirar del sitio"
6. **Estructura congelada:** no añadir/borrar/reordenar secciones.

---

## COMANDO DE VERIFICACIÓN

```powershell
python _tools\verificar_web.py "D:\NITROTOONProject\WEBNitro\preview"
# Debe decir: 16/16 TODO LIMPIO

node --check preview\js\secciones.js
node --check preview\js\editor-secciones.js
node --check preview\js\admin.js
# Deben salir sin error
```

---

## LO PENDIENTE

1. **Usuario prueba preview/admin.html en local** → aprueba o pide cambios
2. **Si aprueba → push a repo** `afvelis/nitrotoon-web-preview`
3. **Usuario verifica en navegador** → aprueba o pide cambios
4. **Si aprueba → sustituir nitrotoon-web/ y push a producción**
5. **Si todo bien → iniciar Awwwards redesign** (chat nuevo, kit en `PROMPT-CHAT-AWWWARDS.md`)

---

## RECURSOS ÚTILES

- `AGENTS.md` — Cómo comportarse como agente de este proyecto
- `mtto/registro.md` — Historial de cambios (500 líneas)
- `PROMPT-WEB-NITROTOON.md` — La biblia (especificación maestra)
- `PROMPT-CHAT-AWWWARDS.md` — Kit para el rediseño Awwwards