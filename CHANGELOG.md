# Changelog - Smart Shortcuts

## v2.0.0 - Diseño Compacto + Búsqueda + Acordeón (2025-11-05)

### 🎨 Rediseño UI Ultra-Compacto

**Reducción de espaciado (40-50% menos espacio vertical):**

| Elemento | Antes | Después | Ahorro |
|----------|-------|---------|--------|
| Section header padding | py-3 px-4 (12px/16px) | py-1.5 px-2.5 (6px/10px) | -50% |
| DirectLink padding | py-2.5 px-3 (10px/12px) | py-1 px-2 (4px/8px) | -60% |
| DynamicInput padding | p-3 (12px) | p-1.5 (6px) | -50% |
| Font - labels | 14px | 12px | -14% |
| Font - descripción | 12px | 10px | -17% |
| Iconos | 18px | 14-16px | ~20% |
| Gap entre items | 4px | 0.5-1px | -75% |

**Impacto:**
- **Antes**: ~1400px de altura total para 20 shortcuts
- **Después**: ~700px de altura (con 2 secciones expandidas)
- **Mejora**: 50% menos scroll + 2x más shortcuts visibles simultáneamente

---

### 🎯 Sistema de Acordeón Multi-Expansión

**Características:**
- ✅ Click en header de sección para expandir/colapsar
- ✅ Múltiples secciones pueden estar abiertas simultáneamente
- ✅ Chevron animado (▼/▶) indica estado
- ✅ Badge con contador `(N)` muestra cantidad de shortcuts
- ✅ Animación suave (200ms) al colapsar/expandir
- ✅ Persistencia en localStorage - recuerda qué secciones estaban abiertas
- ✅ Auto-expansión de primera sección en primera carga

**Beneficios:**
- Navegación más rápida con muchos shortcuts
- Visión general clara de la organización
- Menos scroll innecesario

---

### 🔍 Búsqueda Rápida con Highlight

**Funcionalidad:**
- 🔍 Barra de búsqueda debajo del header principal
- ⚡ Filtrado instantáneo de shortcuts por:
  - Label (nombre del shortcut)
  - Descripción
  - URL o URL template
- 🎨 Highlight en amarillo del texto coincidente
- 🔓 Auto-expansión de secciones con resultados
- ❌ Botón "×" para limpiar búsqueda rápidamente
- 📭 Estado "Sin resultados" con opción de limpiar

**Ejemplo de uso:**
```
Usuario busca: "pedido"
→ Filtra y muestra solo:
  - Amazon > Pedido (dinámico)
  - Mercadolibre > Pedidos Pendientes
→ Ambas secciones se auto-expanden
→ Palabra "pedido" resaltada en amarillo
```

---

### 🎛️ Botón "Expandir/Colapsar Todo"

**Ubicación:** Header principal, al lado del botón de configuración

**Comportamiento:**
- Si todas las secciones están expandidas → Colapsa todas
- Si alguna o ninguna está expandida → Expande todas
- Icono dinámico:
  - ChevronsDown (⬇⬇) cuando puede expandir
  - ChevronsUp (⬆⬆) cuando puede colapsar
- Tooltip informativo

**Utilidad:**
- Vista rápida de todas las secciones
- Limpieza rápida de la UI
- Navegación eficiente

---

### 📊 Mejoras Visuales Adicionales

1. **Scrollbar más delgada**: 6px (antes 8px) para más espacio de contenido
2. **Header principal compacto**: 15px font, padding reducido
3. **Iconos consistentes**: 3-3.5px para acciones, 3.5px para indicadores
4. **Focus rings**: Accesibilidad mejorada para navegación por teclado
5. **Transiciones suaves**: 150-200ms para todas las animaciones

---

### 🏗️ Cambios Técnicos

**Nuevos archivos:**
- `src/utils/searchUtils.ts` - Utilidades de búsqueda y filtrado
- `src/popup/components/SearchBar.tsx` - Componente de búsqueda
- `src/popup/components/HighlightedText.tsx` - Componente de texto resaltado

**Archivos modificados:**
- `src/popup/App.tsx` - Lógica de acordeón, búsqueda, toggle all
- `src/popup/components/ShortcutSection.tsx` - Acordeón + compacto
- `src/popup/components/DirectLink.tsx` - Diseño compacto + highlight
- `src/popup/components/DynamicInput.tsx` - Diseño compacto + highlight
- `tailwind.config.js` - Nuevos tamaños de fuente y colores
- `src/styles/index.css` - Estilos de acordeón y highlight

**Nuevas dependencias:**
- Ninguna (solo código propio)

---

### 📈 Métricas de Build

```
Bundle sizes (gzipped):
- popup.js:   13.64 kB → 3.97 kB
- options.js:  9.19 kB → 2.59 kB
- index.js:  152.21 kB → 48.37 kB
- index.css:  13.52 kB → 3.41 kB

Total: ~189 KB (~58 KB gzipped)
```

**Performance:**
- Tiempo de build: ~1.6s
- Target de apertura: < 100ms ✅
- Animaciones: 60fps ✅

---

### 🔄 Compatibilidad

- ✅ Chrome 88+ (Manifest V3)
- ✅ Sincronización chrome.storage.sync
- ✅ Persistencia localStorage para UI state
- ✅ Totalmente responsive dentro del popup 380x600px
- ✅ Keyboard navigation completa
- ✅ Screen reader friendly (ARIA attributes)

---

### 🎯 Testing Checklist

- [x] Acordeón expande/colapsa suavemente
- [x] Múltiples secciones pueden estar abiertas
- [x] Estado persiste al recargar popup
- [x] Búsqueda filtra correctamente
- [x] Búsqueda resalta texto coincidente
- [x] Auto-expansión en búsqueda funciona
- [x] Botón "Expandir/Colapsar Todo" funciona
- [x] Badges muestran contadores correctos
- [x] Diseño compacto pero legible
- [x] Hover actions siguen funcionando
- [x] Build exitoso sin errores

---

### 🚀 Próximas Mejoras Potenciales

- [ ] Atajos de teclado por shortcut (ej: Ctrl+1, Ctrl+2)
- [ ] Historial de shortcuts más usados
- [ ] Dark mode automático
- [ ] Validación de inputs con regex personalizable
- [ ] Templates predefinidos de configuración
- [ ] Estadísticas de uso
- [ ] Exportar solo una sección
- [ ] Carpetas dentro de secciones

---

### 📝 Notas de Migración

**De v1.0.0 a v2.0.0:**

No se requiere migración de datos. La configuración existente es 100% compatible.

**Cambios en el comportamiento:**
1. Las secciones ahora están colapsadas por defecto (excepto la primera)
2. Nueva barra de búsqueda visible cuando hay secciones
3. Nuevo botón de expandir/colapsar todo en header

**Beneficios inmediatos:**
- 50% menos scroll para acceder a shortcuts
- Búsqueda instantánea entre todos los shortcuts
- Navegación más intuitiva con acordeón

---

### 🙏 Créditos

Desarrollado para optimizar el flujo de trabajo de usuarios con múltiples accesos frecuentes.

Stack: React 18 + TypeScript 5 + Vite 6 + Tailwind CSS 3 + Chrome Extensions API
