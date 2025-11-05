# Guía de Uso - Smart Shortcuts

## 🚀 Acceso Rápido

**Atajo de teclado**: `Ctrl+Shift+S` (Windows/Linux) o `Cmd+Shift+S` (Mac)

Este atajo abre el popup instantáneamente sin necesidad de hacer click en el ícono.

## 📋 Conceptos Básicos

### Secciones
Organizan tus shortcuts por categoría (ej: Amazon, Mercadolibre, Planillas, Aplicaciones)

### Tipos de Shortcuts

1. **Enlaces Directos** 🔗
   - Abren una URL fija con un solo click
   - Ejemplo: "Analítica Amazon" → `https://sellercentral.amazon.com/analytics`

2. **Enlaces Dinámicos** ⚡
   - Requieren un input para construir la URL
   - Ejemplo: "Pedido Amazon"
     - Template: `https://amazon.com/orders/{input}`
     - Input: `702-8229162-0992232`
     - Resultado: Abre la página de ese pedido específico

## 🎯 Uso del Popup Principal

### Abrir el Popup
- Método 1: `Ctrl+Shift+S` (o `Cmd+Shift+S`)
- Método 2: Click en el ícono de la extensión

### Enlaces Directos
1. Simplemente haz **click** en el enlace
2. Se abre inmediatamente en una nueva pestaña

### Enlaces Dinámicos
1. Escribe el valor en el input (ej: número de orden)
2. Presiona **Enter** o click en el botón →
3. La URL se construye automáticamente y se abre

### Edición Rápida (Inline)
1. **Hover** sobre cualquier shortcut
2. Aparecen botones de editar ✏️ y eliminar 🗑️
3. Click en editar → modal rápido para cambiar valores
4. Guardar → cambios aplicados instantáneamente

### Agregar Shortcuts
1. En cada sección, click en el ícono **+**
2. Completa el formulario:
   - **Tipo**: Directo o Dinámico
   - **Nombre**: Etiqueta descriptiva
   - **Icono**: Emoji opcional (ej: 📦)
   - **URL** (directo) o **URL Template** (dinámico)
3. Guardar

## ⚙️ Configuración Avanzada

### Acceder
- Método 1: Click en ⚙️ en el popup
- Método 2: Click derecho en ícono → Opciones
- Método 3: `chrome://extensions/` → Smart Shortcuts → Detalles → Opciones

### Gestión de Secciones
- **Crear**: Botón "Nueva Sección"
- **Editar**: Click en ✏️ junto a la sección
- **Eliminar**: Click en 🗑️ (se eliminan todos los shortcuts dentro)
- **Reordenar**: Usa los botones ↑ ↓ para cambiar el orden

### Gestión de Shortcuts
- **Ver todos**: Las secciones son expandibles/colapsables
- **Agregar**: Botón + junto a cada sección
- **Editar**: Click en ✏️ junto al shortcut
- **Eliminar**: Click en 🗑️
- **Reordenar**: Usa los botones ↑ ↓

### Import/Export

**Exportar configuración**:
1. Click en "Exportar"
2. Se descarga un archivo JSON con toda tu configuración
3. Úsalo como respaldo o para compartir

**Importar configuración**:
1. Click en "Importar"
2. Selecciona un archivo JSON válido
3. Tu configuración se reemplaza completamente
4. ⚠️ Esto sobrescribe todo, haz backup antes

## 📝 Ejemplos de Configuración

### Ejemplo 1: Sección Amazon

**Sección**: Amazon 📦

**Shortcut 1** (Directo):
- Nombre: Analítica y Pagos
- Tipo: Directo
- URL: `https://sellercentral.amazon.com/payments/dashboard`

**Shortcut 2** (Dinámico):
- Nombre: Pedido
- Tipo: Dinámico
- URL Template: `https://www.amazon.com.mx/your-orders/order-details?orderID={input}`
- Placeholder: Ingresa número de orden
- Input Type: Texto

**Shortcut 3** (Directo):
- Nombre: Pedidos Pendientes
- Tipo: Directo
- URL: `https://sellercentral.amazon.com/orders-v3?page=1&q=&qt=&date-range=Last30&fs=&ss=`

### Ejemplo 2: Sección Mercadolibre

**Sección**: Mercadolibre 🛒

**Shortcut 1** (Dinámico):
- Nombre: Buscar Orden
- Tipo: Dinámico
- URL Template: `https://www.mercadolibre.com.mx/ventas/{input}/detalle`
- Placeholder: Número de orden

**Shortcut 2** (Directo):
- Nombre: Mis Ventas
- Tipo: Directo
- URL: `https://www.mercadolibre.com.mx/ventas/lista`

### Ejemplo 3: Sección Planillas

**Sección**: Planillas 📊

**Shortcut 1** (Directo):
- Nombre: Inventario Principal
- Tipo: Directo
- URL: `https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit`

**Shortcut 2** (Directo):
- Nombre: Ventas del Mes
- Tipo: Directo
- URL: `https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit#gid=0`

## 💡 Tips y Trucos

### 1. Usa Emojis para Iconos
Los emojis hacen más fácil identificar shortcuts:
- 📦 Pedidos
- 📊 Reportes
- 💰 Pagos
- 🔍 Búsquedas
- ⚙️ Configuración

### 2. Templates URL con Múltiples Parámetros
Aunque {input} reemplaza un solo valor, puedes crear URLs complejas:
```
https://ejemplo.com/search?q={input}&filter=active&sort=date
```

### 3. Keyboard Shortcuts Personalizados
1. Ve a `chrome://extensions/shortcuts`
2. Busca "Smart Shortcuts"
3. Personaliza el atajo de teclado

### 4. Sincronización Automática
Tu configuración se sincroniza automáticamente entre todos tus dispositivos con Chrome sincronizado.

### 5. Respaldo Regular
Exporta tu configuración mensualmente como respaldo:
- Configuración → Exportar
- Guarda el JSON en un lugar seguro

### 6. URLs con Filtros Pre-aplicados
Guarda URLs de búsquedas específicas:
```
https://amazon.com/orders?q=pending&date=last7days
```

### 7. Organización por Frecuencia
Coloca los shortcuts más usados al inicio de cada sección usando los botones de reordenar.

## 🔧 Solución de Problemas

**El popup no abre con el atajo**
- Verifica en `chrome://extensions/shortcuts`
- Puede haber conflicto con otro atajo

**Los shortcuts dinámicos no funcionan**
- Verifica que el template tenga `{input}` exactamente así
- Asegúrate de que la URL base sea correcta

**Mis cambios no se guardan**
- Chrome puede tener límites de storage (100KB en sync)
- Si tienes muchos shortcuts, algunos pueden no sincronizarse
- Usa exportar/importar como alternativa

**La extensión no aparece**
- Verifica que esté habilitada en `chrome://extensions/`
- Recarga la extensión si es necesario

## 📊 Límites Técnicos

- **Storage sincronizado**: 100KB total
- **Shortcuts recomendados**: ~50-100 shortcuts
- **Secciones recomendadas**: ~10-20 secciones
- Si excedes los límites, la sincronización puede fallar (pero funciona localmente)

## 🎯 Casos de Uso Reales

### Vendedor de Amazon/ML
- Sección Amazon: Pedidos, inventario, reportes, analítica
- Sección Mercadolibre: Ventas, mensajes, configuración
- Sección Planillas: Inventario, ventas, gastos

### Desarrollador Web
- Sección GitHub: Repos frecuentes con búsquedas
- Sección Docs: React, Vue, Tailwind docs
- Sección Tools: CodePen, JSFiddle, Chrome DevTools

### Estudiante
- Sección Universidad: Plataforma, calendario, correo
- Sección Investigación: Scholar, libros, papers
- Sección Herramientas: Google Docs, Notion, Trello

## 🚀 Ventajas vs Favoritos

| Característica | Smart Shortcuts | Favoritos Chrome |
|---------------|-----------------|------------------|
| Velocidad | 1 atajo (< 100ms) | 2-3 clicks + navegación |
| Enlaces dinámicos | ✅ Sí | ❌ No |
| Organización | Secciones visuales | Carpetas jerárquicas |
| Búsqueda | Próximamente | Limitada |
| Edición | Inline + panel | Solo organización |
| Sincronización | ✅ Automática | ✅ Automática |

## 📞 Soporte

Para reportar bugs o sugerir mejoras:
- GitHub Issues: (tu repositorio)
- O contacta directamente al desarrollador

---

¡Disfruta de tu navegación ultrarrápida! 🚀
