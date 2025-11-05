# 🧪 Testing Checklist - Carpetas Anidadas v2.1.0

## 📋 Pre-requisitos
- [ ] Extensión compilada (`npm run build`)
- [ ] Extensión cargada en Chrome desde `chrome://extensions/`
- [ ] Developer mode activado

---

## ✅ Test Cases

### 1️⃣ Crear carpeta en sección vacía
**Pasos:**
1. Abrir popup de la extensión
2. Crear una nueva sección (si no existe)
3. Click en botón "📁 Nueva Carpeta" en ShortcutSection
4. Ingresar nombre: "Mi Primera Carpeta"
5. Agregar icono: 📂
6. Guardar

**Resultado esperado:**
- ✅ Carpeta aparece en la sección
- ✅ Muestra icono 📂 y nombre
- ✅ Muestra contador "(0 items)"
- ✅ Tiene botones de acción visibles

**Estado:** ⏳ Pendiente

---

### 2️⃣ Crear carpetas anidadas (3+ niveles)
**Pasos:**
1. Dentro de "Mi Primera Carpeta", click en botón "📁+"
2. Crear "Nivel 2" con icono 📁
3. Dentro de "Nivel 2", crear "Nivel 3" con icono 🗂️
4. Verificar indentación visual

**Resultado esperado:**
- ✅ Cada nivel tiene indentación progresiva
- ✅ Chevrons para expandir/colapsar funcionan
- ✅ Contadores actualizados en cada nivel
- ✅ Navegación clara de jerarquía

**Estado:** ⏳ Pendiente

---

### 3️⃣ Crear shortcut dentro de carpeta
**Pasos:**
1. Abrir "Nivel 3" (carpeta más profunda)
2. Click en botón "+"
3. Crear shortcut:
   - Tipo: Direct
   - Label: "Google"
   - URL: https://google.com
   - Icon: 🔍
4. Guardar

**Resultado esperado:**
- ✅ Shortcut aparece dentro de la carpeta
- ✅ Se puede hacer click y abre el link
- ✅ Contador de carpeta actualizado a "(1 item)"

**Estado:** ⏳ Pendiente

---

### 4️⃣ Editar nombre/icono de carpeta
**Pasos:**
1. Click en botón de editar (✏️) en "Mi Primera Carpeta"
2. Cambiar nombre a "Favoritos"
3. Cambiar icono a ⭐
4. Guardar

**Resultado esperado:**
- ✅ Nombre actualizado visible inmediatamente
- ✅ Icono actualizado
- ✅ Contenido de la carpeta intacto

**Estado:** ⏳ Pendiente

---

### 5️⃣ Eliminar carpeta con confirmación
**Pasos:**
1. Click en botón eliminar (🗑️) en "Nivel 2"
2. Verificar diálogo de confirmación aparece
3. Confirmar eliminación

**Resultado esperado:**
- ✅ Aparece diálogo: "¿Seguro que quieres eliminar esta carpeta y todo su contenido?"
- ✅ Carpeta y todo su contenido (incluyendo "Nivel 3") eliminados
- ✅ Estructura actualizada correctamente

**Estado:** ⏳ Pendiente

---

### 6️⃣ Migración automática v2.0 → v2.1
**Pasos:**
1. Abrir Options page
2. Exportar configuración actual
3. Crear archivo de prueba con formato v2.0:
```json
{
  "sections": [
    {
      "id": "test-section",
      "name": "Test Section",
      "shortcuts": [
        {
          "id": "shortcut-1",
          "type": "direct",
          "label": "Example",
          "url": "https://example.com",
          "order": 0
        }
      ],
      "order": 0
    }
  ],
  "version": "2.0.0",
  "lastModified": 1234567890
}
```
4. Importar este archivo
5. Verificar en consola del navegador logs de migración

**Resultado esperado:**
- ✅ Log: "Migrating config from 2.0.0 to 2.1.0"
- ✅ Config convertido: `shortcuts` → `items`
- ✅ Version actualizada a "2.1.0"
- ✅ Datos intactos y funcionales

**Estado:** ⏳ Pendiente

---

### 7️⃣ Búsqueda en carpetas anidadas
**Pasos:**
1. Crear estructura:
   - Carpeta "Trabajo" → Carpeta "Proyectos" → Shortcut "GitHub Repo"
   - Carpeta "Personal" → Shortcut "Netflix"
2. En la barra de búsqueda, escribir "GitHub"
3. Verificar resultados

**Resultado esperado:**
- ✅ Encuentra "GitHub Repo" dentro de carpetas anidadas
- ✅ Muestra la jerarquía completa: Trabajo → Proyectos → GitHub Repo
- ✅ Carpetas se auto-expanden para mostrar resultado
- ✅ Highlighting del texto de búsqueda

**Estado:** ⏳ Pendiente

---

### 8️⃣ Persistencia de estado de expansión
**Pasos:**
1. Expandir varias carpetas
2. Colapsar otras
3. Cerrar popup
4. Reabrir popup

**Resultado esperado:**
- ⚠️ **NOTA**: Esta funcionalidad NO está implementada actualmente
- ❌ Estado NO persiste (todas las carpetas colapsadas al reabrir)
- 📝 Feature marcado para v2.2.0 (opcional)

**Estado:** ⏳ Pendiente (comportamiento esperado es NO persistencia)

---

### 9️⃣ Performance con 50+ items
**Pasos:**
1. Ir a Options page
2. Crear estructura grande:
   - 5 secciones
   - Cada sección con 3 carpetas
   - Cada carpeta con 4 shortcuts
   - Total: ~60 items
3. Abrir popup
4. Expandir/colapsar todas las secciones
5. Hacer búsqueda
6. Observar tiempos de respuesta

**Resultado esperado:**
- ✅ Carga inicial < 500ms
- ✅ Expand/collapse instantáneo
- ✅ Búsqueda responde < 200ms
- ✅ Scroll suave
- ✅ Sin lag visible

**Estado:** ⏳ Pendiente

---

### 🔟 Animaciones de expand/collapse
**Pasos:**
1. Click en chevron para expandir carpeta
2. Click para colapsar
3. Verificar transiciones

**Resultado esperado:**
- ✅ Animación suave al expandir
- ✅ Animación suave al colapsar
- ✅ Chevron rota suavemente (→ a ↓)
- ✅ Sin "saltos" o glitches visuales

**Estado:** ⏳ Pendiente

---

## 📊 Resumen de Tests

| Test | Estado | Notas |
|------|--------|-------|
| 1. Crear carpeta en sección vacía | ⏳ | - |
| 2. Carpetas anidadas 3+ niveles | ⏳ | - |
| 3. Shortcut dentro de carpeta | ⏳ | - |
| 4. Editar carpeta | ⏳ | - |
| 5. Eliminar carpeta | ⏳ | - |
| 6. Migración v2.0 → v2.1 | ⏳ | - |
| 7. Búsqueda recursiva | ⏳ | - |
| 8. Persistencia expansión | ⏳ | Feature no implementado |
| 9. Performance 50+ items | ⏳ | - |
| 10. Animaciones | ⏳ | - |

---

## 🐛 Issues Encontrados

_(Documentar aquí cualquier problema encontrado)_

---

## ✅ Tests Pasados: 0/10
## ❌ Tests Fallidos: 0/10
## ⏸️ Tests Pendientes: 10/10

---

## 📝 Notas Adicionales

- Verificar en Chrome DevTools (F12) por errores en consola
- Verificar storage en DevTools → Application → Storage → chrome.storage.sync
- Performance: usar DevTools → Performance para profiling si es necesario
