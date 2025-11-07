# 🚀 Guía para Publicar en Chrome Web Store

## 📋 Requisitos Previos

### 1. Cuenta de Desarrollador (IMPORTANTE)

Necesitas una cuenta de desarrollador de Chrome Web Store:

- **URL**: https://chrome.google.com/webstore/devconsole
- **Costo**: $5 USD (pago único, de por vida)
- **Método de pago**: Tarjeta de crédito/débito
- **Tiempo de activación**: Inmediato después del pago

**¿Ya tienes cuenta?**
- ✅ Si ya pagaste los $5 anteriormente, solo inicia sesión
- ❌ Si no, necesitas registrarte y pagar antes de continuar

---

## 📦 Assets Necesarios

### Iconos (✅ Ya los tenemos)

- ✅ **16x16** - `public/icons/icon16.png`
- ✅ **48x48** - `public/icons/icon48.png`
- ✅ **128x128** - `public/icons/icon128.png`

### Screenshots (❌ NECESARIOS)

**Requisitos de Chrome Web Store:**
- **Tamaño**: 1280x800px o 640x400px (proporción 16:10)
- **Formato**: PNG o JPEG
- **Cantidad**: Mínimo 1, recomendado 3-5
- **Qué mostrar**:
  - Screenshot 1: Popup principal con shortcuts
  - Screenshot 2: Página de opciones
  - Screenshot 3: Funcionalidad de búsqueda
  - Screenshot 4: Sistema de carpetas anidadas
  - Screenshot 5: Perfil de usuario autenticado

### Promotional Images (OPCIONALES pero recomendadas)

**Small Promo Tile (440x280px):**
- Se muestra en el store
- Recomendado tener

**Large Promo Tile (920x680px):**
- Para destacar en el store
- Opcional

**Marquee Promo Tile (1400x560px):**
- Solo si Google te destaca
- Opcional

---

## 📝 Información del Listing

### Información Básica

**Nombre de la extensión:**
```
Smart Shortcuts
```

**Descripción corta (132 caracteres máx):**
```
Shortcuts dinámicos para productos, pedidos y más. Sincronización en la nube. Perfecto para e-commerce y desarrollo.
```

**Descripción detallada:**
```
🚀 Smart Shortcuts - Enlaces Dinámicos que Ahorran Tiempo

¿Cansado de navegar múltiples clicks para llegar a un producto en Amazon o revisar un pedido? Smart Shortcuts te permite crear enlaces dinámicos que te llevan DIRECTAMENTE al detalle del producto, pedido, issue de GitHub, o cualquier página específica.

💡 LA DIFERENCIA: SHORTCUTS DINÁMICOS

En lugar de guardar solo URLs estáticas, crea shortcuts con variables:
• Amazon producto: amazon.com/dp/${input} → Ingresa el ASIN → Acceso directo
• Amazon pedido: amazon.com/gp/your-account/order-details?orderID=${input}
• Mercadolibre: articulo.mercadolibre.com.mx/MLM-${input}
• GitHub: github.com/user/repo/issues/${input}

Un click + el ID = Acceso instantáneo. Sin navegar menús, sin búsquedas.

Además: Organiza en carpetas, sincroniza entre dispositivos con Firebase, y trabaja offline.

✨ CARACTERÍSTICAS PRINCIPALES

🔐 Sincronización en la Nube
• Tus shortcuts se sincronizan automáticamente entre todos tus dispositivos
• Respaldo seguro en Firebase Firestore
• Sin límites de almacenamiento (vs 100KB de métodos tradicionales)
• Autenticación segura con Google OAuth

⚡ Acceso Ultra Rápido
• Carga instantánea (1-2ms con cache inteligente)
• Atajo de teclado: Ctrl+Shift+S (Windows/Linux) o Cmd+Shift+S (Mac)
• Búsqueda rápida para encontrar cualquier shortcut

📁 Organización Avanzada
• Secciones personalizables con iconos
• Carpetas anidadas ilimitadas (folders dentro de folders)
• Drag & drop para reorganizar fácilmente
• Acordeón multi-expansión para mejor navegación

🔗 Shortcuts Dinámicos (Característica Destacada)
• Variables en URLs: ${input}, ${clipboard}, ${date}
• Ingresa datos directamente al hacer click
• PERFECTO para e-commerce, desarrollo, investigación

Ejemplos de uso real:
• Amazon producto: amazon.com/dp/${input} → Ingresa ASIN (B08N5WRWNW) → Abre el producto directamente
• Amazon pedido: amazon.com/gp/your-account/order-details?orderID=${input} → Accede a cualquier pedido
• Mercadolibre: articulo.mercadolibre.com.mx/MLM-${input} → Ingresa ID del producto
• GitHub issue: github.com/user/repo/issues/${input} → Abre cualquier issue
• Jira ticket: company.atlassian.net/browse/${input} → Accede a tickets directamente
• Desde clipboard: google.com/search?q=${clipboard} → Busca lo que copiaste

🌐 Funciona Offline
• Modo offline completo con cache local
• Banner visual cuando estás offline
• Sincroniza automáticamente al reconectar

🎨 Interfaz Moderna
• Diseño compacto y limpio
• Dark mode automático
• Highlighting de búsqueda
• Animaciones suaves

🔒 PRIVACIDAD Y SEGURIDAD

• Tus datos solo son accesibles por ti (reglas de seguridad Firestore)
• Encriptación en tránsito (HTTPS) y en reposo
• No compartimos información con terceros
• OAuth2 seguro con chrome.identity
• Código abierto: github.com/gustavojmarrero/smart-shortcuts-extension

📊 CASOS DE USO CON SHORTCUTS DINÁMICOS

🛒 E-commerce & Ventas:
• Amazon: Acceso directo a productos (ASIN), pedidos, inventario
• Mercadolibre: Ver productos, ventas, publicaciones por ID
• Shopify: Admin de productos, órdenes, clientes
• eBay: Tracking de artículos, ventas, mensajes
→ Ahorra 5-10 clicks por consulta

💻 Desarrollo:
• GitHub: Issues, pull requests, repos por número
• Jira/Trello: Tickets y boards directamente
• Stack Overflow: Búsquedas desde clipboard
• Documentación: Acceso rápido con variables
→ Flujo de trabajo 3x más rápido

📚 Investigación & Educación:
• Google Scholar: Búsquedas dinámicas
• Bibliotecas digitales: Acceso por ISBN/DOI
• Plataformas educativas: Cursos, módulos
→ Organiza recursos por proyectos

📊 Analytics & Marketing:
• Google Analytics: Dashboards específicos
• Meta Ads: Campañas por ID
• SEO Tools: Análisis de URLs dinámicas
→ Reportes en segundos

⚙️ CARACTERÍSTICAS TÉCNICAS

• React 18 + TypeScript 5
• Firebase 11 (Firestore + Auth)
• Cache inteligente para máximo rendimiento
• Manifest V3 (última versión de Chrome Extensions)
• Bundle optimizado (200KB gzipped)

🆕 NOVEDADES EN v3.0

• Sincronización multi-dispositivo con Firebase
• Cache inteligente (70-80% menos lecturas)
• Modo offline completo
• Auto-refresh de tokens (sesión siempre activa)
• Migración automática desde v2.x
• Extension ID permanente

📚 SOPORTE

• GitHub: github.com/gustavojmarrero/smart-shortcuts-extension
• Issues: github.com/gustavojmarrero/smart-shortcuts-extension/issues
• Documentación completa en README.md
• Guía de migración disponible

🎯 ROADMAP

Próximas características planificadas:
• Autenticación con GitHub y email/password
• Compartir carpetas con otros usuarios
• Equipos y workspaces
• Historial de cambios
• Estadísticas de uso
• Soporte para Firefox y Edge

---

🙏 Desarrollado con pasión para optimizar tu flujo de trabajo.

Stack: React 18 + TypeScript 5 + Vite 6 + Tailwind CSS 3 + Firebase 11
```

**Categoría:**
```
Productivity
```

**Idioma:**
```
Español (Spanish)
```

### Permisos Requeridos (Justificación)

**storage:**
```
Necesario para guardar la configuración de shortcuts localmente como cache y respaldo offline.
```

**tabs:**
```
Necesario para abrir nuevas pestañas cuando el usuario hace click en un shortcut.
```

**identity:**
```
Necesario para autenticación OAuth2 con Google, permitiendo sincronización segura en la nube.
```

### Host Permissions (Justificación)

**https://*.googleapis.com/***
```
Necesario para comunicación con Firebase Auth (autenticación con Google).
```

**https://*.firebaseio.com/***
```
Necesario para sincronización en tiempo real con Firebase Realtime Database.
```

**https://*.firestore.googleapis.com/***
```
Necesario para operaciones CRUD con Firestore (base de datos en la nube).
```

### Política de Privacidad

**URL de la política:**
```
https://github.com/gustavojmarrero/smart-shortcuts-extension/blob/main/PRIVACY.md
```

**Contenido que debe tener PRIVACY.md:**
```markdown
# Política de Privacidad - Smart Shortcuts

**Última actualización:** 6 de Noviembre, 2025

## Información que Recopilamos

Smart Shortcuts recopila y almacena la siguiente información:

### 1. Información de Autenticación
- Email de tu cuenta de Google
- Nombre de usuario
- Foto de perfil (URL)
- ID de usuario de Google

Esta información se obtiene a través de OAuth2 y se utiliza únicamente para:
- Autenticarte en la extensión
- Identificar tus datos en Firebase Firestore
- Mostrar tu perfil en la interfaz

### 2. Datos de la Extensión
- Configuración de shortcuts (URLs, nombres, iconos)
- Estructura de carpetas y secciones
- Timestamps de última modificación

Estos datos se almacenan en:
- **Firebase Firestore** - Base de datos en la nube (sincronización)
- **chrome.storage.local** - Cache local (rendimiento)
- **chrome.storage.sync** - Respaldo local (migración de v2.x)

## Cómo Usamos tu Información

### Autenticación
- Validamos tu identidad con Google OAuth2
- No almacenamos contraseñas (OAuth2 es el método seguro de Google)

### Sincronización
- Guardamos tus shortcuts en Firestore asociados a tu ID de usuario
- Solo tú puedes acceder a tus datos (reglas de seguridad Firestore)
- Sincronizamos cambios en tiempo real entre tus dispositivos

### Cache Local
- Guardamos una copia local para carga instantánea (1-2ms)
- El cache se limpia al cerrar sesión

## Compartir Información

**NO compartimos tu información con terceros.**

Los únicos servicios que tienen acceso a tus datos son:
- **Google Firebase** - Para almacenar tus shortcuts (proveedor de infraestructura)
- **Google OAuth** - Para autenticación (servicio de Google)

Ambos servicios están sujetos a las políticas de privacidad de Google.

## Seguridad

### Medidas de Protección
- **Encriptación en tránsito:** HTTPS para todas las comunicaciones
- **Encriptación en reposo:** Firestore encripta datos automáticamente
- **Reglas de seguridad Firestore:**
  ```javascript
  // Solo el usuario autenticado puede leer/escribir sus propios datos
  allow read, write: if request.auth != null && request.auth.uid == userId;
  ```
- **OAuth2 seguro:** Usamos chrome.identity (estándar de Chrome)
- **Extension ID permanente:** Previene suplantación de identidad

### Acceso a Datos
- Solo tú tienes acceso a tus shortcuts
- Ni siquiera el desarrollador puede ver tus datos
- Firestore requiere autenticación para cualquier operación

## Tus Derechos

### Acceso a tus Datos
Puedes ver todos tus datos en:
- La extensión (interfaz de usuario)
- Firebase Console (si tienes acceso como desarrollador)
- Exportar desde Opciones > Exportar/Importar

### Eliminar tus Datos
Puedes eliminar tus datos en cualquier momento:
1. **Dentro de la extensión:**
   - Elimina shortcuts/carpetas manualmente
   - O cierra sesión (limpia cache local)

2. **Eliminar cuenta completa:**
   - Contacta: gustavojmarrero@gmail.com
   - Eliminaremos todos tus datos de Firestore en 30 días

### Portabilidad
- Exporta tus datos en formato JSON
- Importa en otra instancia o dispositivo
- Sin lock-in: tus datos son tuyos

## Cookies y Tracking

**NO usamos:**
- ❌ Cookies de tracking
- ❌ Google Analytics
- ❌ Anuncios
- ❌ Ningún tipo de rastreo

**Solo usamos:**
- ✅ Tokens de OAuth2 (autenticación)
- ✅ Cache local (rendimiento)

## Cambios en esta Política

Notificaremos cambios significativos mediante:
- Actualización del campo "Última actualización"
- Notas en el CHANGELOG
- Notificación en la extensión (si es cambio mayor)

## Cumplimiento Legal

### GDPR (Unión Europea)
Si resides en la UE, tienes derecho a:
- Acceso a tus datos
- Rectificación de datos incorrectos
- Eliminación de tus datos ("derecho al olvido")
- Portabilidad de datos
- Oposición al procesamiento

### CCPA (California, USA)
Si resides en California, tienes derecho a:
- Conocer qué datos recopilamos
- Solicitar eliminación de datos
- Optar por no vender datos (no vendemos datos)

## Contacto

Para preguntas sobre privacidad:
- **Email:** gustavojmarrero@gmail.com
- **GitHub Issues:** https://github.com/gustavojmarrero/smart-shortcuts-extension/issues

## Transparencia

Smart Shortcuts es **código abierto**:
- Código fuente: https://github.com/gustavojmarrero/smart-shortcuts-extension
- Puedes auditar el código en cualquier momento
- Aceptamos contribuciones y reportes de seguridad
```

---

## 📸 Cómo Crear Screenshots

### Método Recomendado: Usar la Extensión

1. **Instala la extensión** (ya la tienes instalada)

2. **Abre el popup** (Ctrl+Shift+S o click en el icono)

3. **Toma screenshots con Chrome DevTools:**
   ```
   1. Click derecho en el popup
   2. "Inspeccionar"
   3. En DevTools, click en "⋮" (tres puntos)
   4. More tools > Screenshot
   5. Capture screenshot (1280x800 recomendado)
   ```

4. **O usa herramienta del sistema:**
   - **Mac:** Cmd+Shift+4 (seleccionar área)
   - **Windows:** Win+Shift+S
   - **Linux:** gnome-screenshot o scrot

### Screenshots Recomendados

**1. Shortcuts Dinámicos en Acción (1280x800) ⭐ PRIORIDAD**
- Muestra un shortcut dinámico (ej: Amazon producto con ${input})
- Si es posible, captura el modal de input donde ingresas el ASIN/ID
- Ejemplo visible: "Amazon Producto: amazon.com/dp/${input}"
- ESTO ES LO QUE TE DIFERENCIA - Debe ser el screenshot #1

**2. Popup Principal (1280x800)**
- Muestra varias secciones expandidas con shortcuts
- Incluye MÁS shortcuts dinámicos visibles (resalta ${input}, ${clipboard})
- Muestra carpetas anidadas con organización
- UserProfile visible en header

**3. Casos de Uso E-commerce (1280x800)**
- Sección de "Amazon" o "E-commerce" expandida
- Múltiples shortcuts dinámicos:
  * Amazon Producto (${input})
  * Amazon Pedido (${input})
  * Mercadolibre (${input})
- Demuestra el valor para vendedores/compradores

**4. Página de Opciones (1280x800)**
- Vista de configuración completa
- Modal de edición de shortcut dinámico abierto
- Se ve el campo URL con la variable ${input}

**5. Búsqueda + Organización (1280x800)**
- Barra de búsqueda con resultados
- Highlighting visible
- Varias carpetas expandidas

---

## 🚀 Paso a Paso: Publicar en Chrome Web Store

### Paso 1: Preparar PRIVACY.md

```bash
# Crear archivo de privacidad
# (el contenido está arriba en esta guía)
```

### Paso 2: Subir PRIVACY.md a GitHub

```bash
git add PRIVACY.md
git commit -m "docs: Add privacy policy for Chrome Web Store"
git push origin main
```

La URL será:
```
https://github.com/gustavojmarrero/smart-shortcuts-extension/blob/main/PRIVACY.md
```

### Paso 3: Crear Screenshots

1. Abre la extensión
2. Toma 3-5 screenshots (1280x800)
3. Guárdalos en una carpeta local (ej: `screenshots/`)

### Paso 4: Ir al Chrome Web Store Developer Console

1. **URL:** https://chrome.google.com/webstore/devconsole
2. **Inicia sesión** con tu cuenta de Google
3. Si no has pagado los $5, hazlo ahora
4. Click en **"New Item"** (Nuevo elemento)

### Paso 5: Subir el ZIP

1. **Selecciona el archivo:**
   ```
   releases/smart-shortcuts-v3.0.0.zip
   ```
2. **Upload** y espera la validación
3. Si hay errores, revisa el log

### Paso 6: Completar el Listing

**Store Listing Tab:**
1. **Detailed description:** (copiar de arriba)
2. **Category:** Productivity
3. **Language:** Spanish
4. **Small promo tile:** (crear o dejar vacío)
5. **Screenshots:** Subir los 3-5 que creaste
6. **Promotional images:** (opcional)

**Privacy Tab:**
1. **Privacy policy URL:**
   ```
   https://github.com/gustavojmarrero/smart-shortcuts-extension/blob/main/PRIVACY.md
   ```
2. **Single purpose description:**
   ```
   Crear y organizar shortcuts web dinámicos (con variables como ${input}) para acceder directamente a productos, pedidos y páginas específicas. Incluye sincronización en la nube.
   ```
3. **Permission justifications:** (copiar de arriba)
4. **Data usage disclosure:**
   - ✅ Authentication information: Email, Name, Profile picture
   - ✅ Personally identifiable information: User ID
   - ✅ Website content: Shortcuts configuration (URLs)
   - Stored in: Firebase Firestore
   - Purpose: Sync across devices

**Distribution Tab:**
1. **Visibility:** Public
2. **Countries:** All countries (o selecciona específicos)

### Paso 7: Enviar para Revisión

1. Click en **"Submit for review"**
2. Confirma que todo está correcto
3. **Espera 1-3 días** para la revisión de Google

### Paso 8: Después de la Aprobación

Una vez aprobada:
- Tu extensión estará en: `https://chrome.google.com/webstore/detail/EXTENSION_ID`
- Puedes compartir el link
- Los usuarios pueden instalar directamente desde el store

---

## 📋 Checklist Final

Antes de enviar, verifica:

- [ ] Cuenta de desarrollador activada ($5 pagados)
- [ ] ZIP de la extensión listo (`releases/smart-shortcuts-v3.0.0.zip`)
- [ ] PRIVACY.md creado y subido a GitHub
- [ ] 3-5 screenshots de 1280x800 creados
- [ ] Descripción detallada preparada
- [ ] Justificaciones de permisos escritas
- [ ] Categoría seleccionada: Productivity
- [ ] Single purpose description claro
- [ ] Extension funciona correctamente (probada localmente)
- [ ] Manifest.json tiene toda la info correcta

---

## ⚠️ Posibles Problemas

### "Permission justification required"
- Asegúrate de explicar CADA permiso
- Usa las justificaciones de arriba

### "Privacy policy invalid"
- Verifica que la URL de PRIVACY.md sea accesible públicamente
- GitHub debe estar en público, no privado

### "Screenshots do not match extension"
- Toma screenshots reales de TU extensión
- No uses mockups o diseños falsos

### "Extension violates policies"
- Lee las políticas: https://developer.chrome.com/docs/webstore/program-policies/
- Asegúrate de no violar copyright, spam, etc.

### "Extension ID already exists"
- Si ya publicaste antes, actualiza en lugar de crear nueva
- El Extension ID debe ser el mismo: `gacibpmoecbcbhkeidgdhaoijmgablle`

---

## 💡 Consejos

1. **Primera vez:** La revisión puede tardar hasta 3 días
2. **Actualizaciones:** Futuras actualizaciones se revisan en ~1 día
3. **Rechazos:** No te preocupes, lee el feedback y corrige
4. **SEO:** Usa palabras clave en la descripción (shortcuts, bookmarks, productivity)
5. **Screenshots:** Buenas imágenes aumentan instalaciones en 40%+

---

## 📞 Soporte

Si tienes problemas:
- **Chrome Web Store Help:** https://support.google.com/chrome_webstore/
- **Developer Program Policies:** https://developer.chrome.com/docs/webstore/program-policies/

---

**Última actualización:** 6 de Noviembre, 2025
