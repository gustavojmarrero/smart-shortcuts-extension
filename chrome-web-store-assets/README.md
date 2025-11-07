# Chrome Web Store Assets

Screenshots optimizados para publicación en Chrome Web Store.

## 📸 Screenshots (1280x800px)

### Screenshot 1: Dynamic Input in Action ⭐ PRINCIPAL
**Archivo:** `screenshot-1-dynamic-input.png`

**Qué muestra:**
- Popup principal de Smart Shortcuts
- Sección "Amazon" expandida con 3 shortcuts
- **Shortcut dinámico "Pedido Por ID" con input activo**
- Input field mostrando número de pedido: `702-2337706-4570999`
- UserProfile visible (Gustavo Marrero - Sincronizado)
- Múltiples secciones organizadas (Mercadolibre, Planillas, Carpetas, etc.)
- Mercadolibre muestra carpetas anidadas: "1 shortcuts, 3 folders"

**Por qué es importante:**
- Demuestra la característica PRINCIPAL: shortcuts dinámicos con ${input}
- Muestra caso de uso real: acceso a pedidos de Amazon
- Se ve la interfaz limpia y profesional
- Sincronización activa visible

---

### Screenshot 2: Advanced Configuration
**Archivo:** `screenshot-2-options.png`

**Qué muestra:**
- Página de "Configuración Avanzada"
- Banner de "Sincronización automática activa"
- UserProfile (Gustavo Marrero - Sincronizado)
- Botones de Importar/Exportar
- Botón "Nueva Sección"
- Botones "Expandir Todo" / "Colapsar Todo"
- Lista de todas las secciones:
  - Amazon (3 items)
  - Mercadolibre (4 items)
  - Planillas (7 items)
  - Carpetas (1 items)
  - Documentación (3 items)
  - Aplicaciones (1 items)
  - Backends (2 items)
  - Intranet (1 items)

**Por qué es importante:**
- Muestra capacidad de organización avanzada
- Demuestra sincronización en la nube
- Se ve escalabilidad (múltiples secciones con muchos items)

---

### Screenshot 3: General Overview
**Archivo:** `screenshot-3-general.png`

**Qué muestra:**
- Popup principal con todas las secciones colapsadas
- Vista limpia de la organización
- Cantidad de shortcuts visible en cada sección
- Botón flotante (+) para nueva sección
- UserProfile en header
- Barra de búsqueda

**Por qué es importante:**
- Muestra la interfaz compacta y organizada
- Demuestra accordion multi-expansión
- Se ve fácil de usar

---

### Screenshot 4: Creating Dynamic Shortcuts ⭐ MUY IMPORTANTE
**Archivo:** `screenshot-4-create-dynamic.png`

**Qué muestra:**
- Modal "Nuevo Shortcut" abierto
- **Tipo: Dinámico** seleccionado
- Nombre: "Producto Amazon"
- Icono: 📦
- Descripción: "Página del producto por ASIN"
- **URL Template:** `https://www.amazon.com.mx/dp/{input}` ← CLAVE
- Placeholder: "ASIN"
- Nota visible: "Usa {input} donde va el valor"

**Por qué es importante:**
- Demuestra CÓMO se crean los shortcuts dinámicos
- La variable {input} es VISIBLE en el campo URL Template
- Caso de uso claro: Amazon productos por ASIN
- Complementa screenshot 1 (que muestra el shortcut EN USO)
- Muestra interfaz intuitiva del modal

---

## 📋 Orden ÓPTIMO para Chrome Web Store

**RECOMENDADO (storytelling approach):**

1. **screenshot-4-create-dynamic.png** ⭐ - "Así se crea un shortcut dinámico"
2. **screenshot-1-dynamic-input.png** ⭐ - "Así se usa: ingresa el ID y accede directo"
3. **screenshot-2-options.png** - "Organiza todo en la configuración avanzada"
4. **screenshot-3-general.png** - "Vista general limpia y compacta"

**Alternativa (mostrar resultado primero):**

1. **screenshot-1-dynamic-input.png** ⭐ - "Impacto inmediato: shortcut en acción"
2. **screenshot-4-create-dynamic.png** ⭐ - "Así es como se crea"
3. **screenshot-2-options.png** - "Configuración y organización"
4. **screenshot-3-general.png** - "Vista general"

**Recomendación:** Usar el PRIMER orden (storytelling) - enseña primero el concepto, luego muestra el resultado.

---

## ✨ Mejoras Opcionales

### Screenshot Adicional Sugerido:
**Modal de Edición con ${input} visible**

Cómo crearlo:
1. Abre Smart Shortcuts
2. Click en el botón ✏️ (editar) de un shortcut de Amazon
3. Asegúrate que el campo URL muestre: `https://www.amazon.com/gp/your-account/order-details?orderID=${input}`
4. Toma screenshot del modal completo
5. Redimensiona a 1280x800:
   ```bash
   sips -z 800 1280 --padToHeightWidth 800 1280 --padColor FFFFFF screenshot.png --out screenshot-4-edit-modal.png
   ```

Esto demostraría visualmente cómo se CREAN los shortcuts dinámicos.

---

## 📝 Descripción para Chrome Web Store

Copiar de: `CHROME_WEB_STORE_GUIDE.md`

**Descripción corta:**
```
Shortcuts dinámicos para productos, pedidos y más. Sincronización en la nube. Perfecto para e-commerce y desarrollo.
```

**Descripción detallada:**
Ver líneas 72-175 de `CHROME_WEB_STORE_GUIDE.md`

---

## 🔗 Links y Archivos Importantes

- **Privacy Policy:** https://github.com/gustavojmarrero/smart-shortcuts-extension/blob/main/PRIVACY.md
- **ZIP para Chrome Web Store:** `releases/smart-shortcuts-webstore-v3.0.0.zip` ⭐ USAR ESTE
- **ZIP para GitHub (con key):** `releases/smart-shortcuts-v3.0.0.zip` (NO usar para Web Store)
- **Extension ID (desarrollo):** `gacibpmoecbcbhkeidgdhaoijmgablle`

### ⚠️ IMPORTANTE: Diferencia entre ZIPs

**Para Chrome Web Store:**
- Archivo: `smart-shortcuts-webstore-v3.0.0.zip`
- **NO contiene el campo "key"** en manifest.json (requerido por Web Store)
- Crear con: `npm run package:webstore`

**Para GitHub Releases / Desarrollo:**
- Archivo: `smart-shortcuts-v3.0.0.zip`
- **Contiene el campo "key"** para mantener Extension ID consistente
- Crear con: `npm run package`

---

**Fecha de creación:** 6 de Noviembre, 2025
**Versión de la extensión:** v3.0.0
