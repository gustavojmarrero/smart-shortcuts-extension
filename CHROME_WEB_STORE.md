# Guía para Publicar en Chrome Web Store

## 📋 Checklist previo

- [x] Manifest.json completo con descripción, autor, homepage
- [x] Iconos 16x16, 48x48, 128x128
- [ ] Cuenta de desarrollador ($5 USD)
- [ ] Screenshots (1280x800 o 640x400)
- [ ] Tile icon promocional (440x280)
- [ ] Descripción detallada en español e inglés

## 🎨 Assets necesarios

### 1. Screenshots (Obligatorio)
- **Cantidad:** Mínimo 1, recomendado 3-5
- **Tamaño:** 1280x800px o 640x400px
- **Formato:** PNG o JPG
- **Qué mostrar:**
  - Popup principal con shortcuts organizados
  - Página de configuración con drag & drop
  - Modal de creación de shortcut dinámico
  - Búsqueda en acción
  - Carpetas anidadas

### 2. Tile Promocional (Opcional pero recomendado)
- **Tamaño:** 440x280px
- **Formato:** PNG o JPG
- **Contenido:** Logo + nombre de la extensión

### 3. Marquee Promocional (Opcional)
- **Tamaño:** 1400x560px
- **Formato:** PNG o JPG

## 📝 Textos necesarios

### Descripción detallada (Español)

```
Smart Shortcuts - Organiza y accede a tus sitios favoritos más rápido que con los favoritos tradicionales

🚀 CARACTERÍSTICAS PRINCIPALES

• Enlaces Directos: Acceso instantáneo a URLs frecuentes
• Enlaces Dinámicos: Construye URLs con inputs personalizados (ej: número de orden → URL completa)
• Validación con Regex: Valida inputs antes de abrir URLs
• Carpetas Anidadas: Organiza shortcuts en carpetas sin límite de profundidad
• Drag & Drop: Mueve shortcuts y carpetas entre secciones fácilmente
• Búsqueda Recursiva: Encuentra shortcuts dentro de carpetas anidadas
• Sincronización Automática: Tus shortcuts se sincronizan entre dispositivos
• Keyboard Shortcut: Abre con Ctrl+Shift+S (Cmd+Shift+S en Mac)

📂 ORGANIZACIÓN INTELIGENTE

Crea secciones para diferentes categorías (Trabajo, Personal, Proyectos) y organiza tus shortcuts en carpetas anidadas. Usa drag & drop para reorganizar todo fácilmente.

🔗 ENLACES DINÁMICOS

Crea enlaces que aceptan inputs. Por ejemplo:
- Tracking de pedidos: Ingresa número de orden → abre página de seguimiento
- Búsqueda personalizada: Ingresa término → busca en tu sitio favorito
- Dashboard con ID: Ingresa ID de cliente → abre su dashboard

Con validación regex incluida para evitar errores.

💾 SINCRONIZACIÓN

Tus shortcuts se sincronizan automáticamente entre todos tus dispositivos con Chrome usando tu cuenta de Google. También puedes exportar/importar configuraciones manualmente.

🎯 CASOS DE USO

• E-commerce: Tracking dinámico de órdenes por número
• Soporte técnico: Templates de URLs con IDs de ticket
• Desarrolladores: Acceso rápido a dashboards y herramientas
• Uso general: Organiza todos tus accesos frecuentes

🔒 PRIVACIDAD

• Sin recolección de datos
• Todo se almacena localmente y en Chrome Sync
• Sin analíticas ni tracking
• Código abierto en GitHub

⚙️ PERMISOS

• storage: Para guardar tu configuración
• tabs: Para abrir URLs en nuevas pestañas

🆓 GRATIS Y OPEN SOURCE

Esta extensión es completamente gratuita y de código abierto. Sin anuncios, sin suscripciones, sin trucos.
```

### Descripción corta (máx 132 caracteres)
```
Organiza y accede a sitios favoritos. Soporta enlaces dinámicos, carpetas anidadas y sincronización automática.
```

### Descripción en inglés

```
Smart Shortcuts - Organize and access your favorite sites faster than traditional bookmarks

🚀 KEY FEATURES

• Direct Links: Instant access to frequent URLs
• Dynamic Links: Build URLs with custom inputs (e.g., order number → full URL)
• Regex Validation: Validate inputs before opening URLs
• Nested Folders: Organize shortcuts in folders with unlimited depth
• Drag & Drop: Move shortcuts and folders between sections easily
• Recursive Search: Find shortcuts inside nested folders
• Auto Sync: Your shortcuts sync across devices automatically
• Keyboard Shortcut: Open with Ctrl+Shift+S (Cmd+Shift+S on Mac)

📂 SMART ORGANIZATION

Create sections for different categories (Work, Personal, Projects) and organize shortcuts in nested folders. Use drag & drop to reorganize everything easily.

🔗 DYNAMIC LINKS

Create links that accept inputs. For example:
- Order tracking: Enter order number → opens tracking page
- Custom search: Enter term → searches your favorite site
- Dashboard with ID: Enter customer ID → opens their dashboard

With regex validation included to prevent errors.

💾 SYNCHRONIZATION

Your shortcuts sync automatically across all your Chrome devices using your Google account. You can also export/import configurations manually.

🎯 USE CASES

• E-commerce: Dynamic order tracking by number
• Tech support: URL templates with ticket IDs
• Developers: Quick access to dashboards and tools
• General use: Organize all your frequent accesses

🔒 PRIVACY

• No data collection
• Everything stored locally and in Chrome Sync
• No analytics or tracking
• Open source on GitHub

⚙️ PERMISSIONS

• storage: To save your configuration
• tabs: To open URLs in new tabs

🆓 FREE & OPEN SOURCE

This extension is completely free and open source. No ads, no subscriptions, no tricks.
```

## 🚀 Pasos para publicar

### 1. Registrarse como desarrollador

1. Ve a: https://chrome.google.com/webstore/devconsole
2. Inicia sesión con tu cuenta de Google
3. Paga $5 USD (tarifa única de registro)
4. Acepta los términos del Developer Agreement

### 2. Preparar el ZIP

Ya tienes el ZIP automático en `releases/smart-shortcuts-v2.1.0.zip`

**Verificar que incluya:**
- ✅ manifest.json
- ✅ Todos los archivos JS compilados
- ✅ Iconos (16, 48, 128)
- ✅ Carpetas src/ con HTML
- ✅ NO incluye node_modules
- ✅ NO incluye archivos de desarrollo

### 3. Crear screenshots

**Herramientas recomendadas:**
- Usa Chrome DevTools para capturar la extensión
- Dimensiones: 1280x800px
- Recorta y optimiza con Preview o Photoshop

**Screenshots sugeridos:**
1. Popup con varias secciones y shortcuts
2. Carpeta expandida mostrando items anidados
3. Modal de crear shortcut dinámico
4. Búsqueda mostrando resultados
5. Página de opciones con drag & drop

### 4. Subir a Chrome Web Store

1. **Developer Dashboard:** https://chrome.google.com/webstore/devconsole/register
2. Click en **"New Item"**
3. **Subir ZIP:**
   - Arrastra `releases/smart-shortcuts-v2.1.0.zip`
   - Espera validación (puede tomar 1-2 minutos)

4. **Llenar información:**

   **Store listing:**
   - Descripción detallada (español e inglés)
   - Idiomas soportados: Spanish, English
   - Categoría: Productivity
   - Screenshots (subir los 5)
   - Tile promocional (opcional)

   **Privacy:**
   - Single Purpose: "Organize and access bookmarks efficiently"
   - Permission Justification:
     - storage: "To save user's shortcuts configuration"
     - tabs: "To open bookmarks in new tabs"
   - No remote code
   - No collecting user data

   **Distribution:**
   - Visibility: Public
   - Countries: All countries (o selecciona específicos)
   - Pricing: Free

5. **Guardar borrador** (puedes volver después)

6. **Submit for Review** cuando todo esté listo

### 5. Proceso de revisión

- **Tiempo:** 1-3 días laborales (puede ser más rápido)
- **Notificación:** Recibes email cuando esté aprobada
- **Posibles problemas:**
  - Permisos no justificados
  - Descripción poco clara
  - Screenshots de mala calidad
  - Código no ofuscado (esto está OK)

### 6. Una vez aprobada

Tu extensión estará en:
```
https://chrome.google.com/webstore/detail/[ID-ÚNICO]
```

Puedes agregar este link al README.

## 🔄 Actualizaciones futuras

Cada vez que actualices la versión:

1. Cambia versión en manifest.json
2. Commit (se crea release automático en GitHub)
3. Ve a Developer Console
4. Click en tu extensión
5. Click en "Package" → "Upload new package"
6. Sube el nuevo ZIP
7. Click "Submit for review"

**Las actualizaciones se revisan más rápido (~1 día)**

## 📊 Analytics (Opcional)

Chrome Web Store te da analytics gratis:
- Instalaciones diarias
- Usuarios activos
- Países
- Ratings y reviews

## 💡 Tips

1. **Buenos screenshots = más instalaciones**
   - Muestra las features más atractivas
   - Texto grande y legible
   - Fondo limpio

2. **Descripción clara**
   - Empieza con el beneficio principal
   - Lista de features con emojis
   - Casos de uso específicos

3. **Responde reviews**
   - Las primeras reviews son críticas
   - Responde rápido a preguntas
   - Agradece feedback positivo

4. **Promoción**
   - Comparte en redes sociales
   - Product Hunt
   - Reddit (r/chrome, r/SideProject)
   - Hacker News "Show HN"

## ⚠️ Políticas importantes

- No copies código sin licencia
- No uses marcas registradas sin permiso
- No recolectes datos sin consentimiento
- No uses ads invasivos
- No cambies funcionalidad después de aprobación

## 🔗 Links útiles

- **Developer Console:** https://chrome.google.com/webstore/devconsole
- **Políticas:** https://developer.chrome.com/docs/webstore/program-policies/
- **Guía oficial:** https://developer.chrome.com/docs/webstore/publish/
- **Best Practices:** https://developer.chrome.com/docs/webstore/best-practices/

## 📧 Soporte

Si tienes problemas:
- Revisa la consola de desarrollador
- Lee los emails de Google (rechazo/aprobación)
- Consulta las políticas
- Busca en Stack Overflow

## ✅ Checklist final antes de submit

- [ ] Manifest completo con todos los campos
- [ ] Descripción en español e inglés
- [ ] 3-5 screenshots de calidad
- [ ] Tile promocional (opcional)
- [ ] Permisos justificados
- [ ] Privacy policy (si recolectas datos - en tu caso NO)
- [ ] Probado en Chrome estable
- [ ] Sin errores en consola
- [ ] ZIP validado
- [ ] Versión correcta en manifest
