# Guía de Instalación - Smart Shortcuts

## Opción 1: Para Desarrolladores (tienes Node.js)

1. Clona o descarga este repositorio
2. Instala dependencias:
   ```bash
   npm install
   ```
3. Compila la extensión:
   ```bash
   npm run build
   ```
4. Genera los iconos:
   - Abre `scripts/create-icon-html.html` en tu navegador
   - Click en "Generate Icons"
   - Guarda cada icono (click derecho > guardar como):
     - `icon16.png` en `dist/icons/`
     - `icon48.png` en `dist/icons/`
     - `icon128.png` en `dist/icons/`
5. Carga la extensión en Chrome:
   - Abre `chrome://extensions/`
   - Activa "Modo de desarrollador"
   - Click "Cargar extensión sin empaquetar"
   - Selecciona la carpeta `dist/`

## Opción 2: Para Usuarios Finales (sin Node.js)

Si alguien te compartió la carpeta `dist/` compilada:

1. Descarga y descomprime la carpeta `dist/`
2. Asegúrate que tenga estos archivos:
   ```
   dist/
   ├── manifest.json
   ├── index.js
   ├── popup.js
   ├── options.js
   ├── index.css
   ├── src/
   │   ├── popup/index.html
   │   └── options/index.html
   └── icons/
       ├── icon16.png
       ├── icon48.png
       └── icon128.png
   ```
3. Abre Chrome
4. Ve a `chrome://extensions/`
5. Activa el "Modo de desarrollador" (toggle arriba a la derecha)
6. Click en "Cargar extensión sin empaquetar"
7. Selecciona la carpeta `dist/`
8. ¡Listo! Usa `Ctrl+Shift+S` (o `Cmd+Shift+S` en Mac) para abrir

## Cómo Compartir la Extensión (Sin Node.js)

Para compartir con alguien que NO tiene Node.js:

1. **Después de compilar**, comprime la carpeta `dist/`:
   ```bash
   zip -r smart-shortcuts.zip dist/
   ```

2. **Comparte** el archivo `smart-shortcuts.zip`

3. **El receptor** solo necesita:
   - Descomprimir el ZIP
   - Seguir los pasos de "Opción 2" arriba
   - NO necesita instalar Node.js ni npm
   - NO necesita compilar nada

## Generar Iconos (Alternativa Rápida)

Si no quieres usar el HTML generator, puedes:

1. Usar cualquier editor de imágenes (Photoshop, GIMP, Canva, etc.)
2. Crear 3 imágenes PNG:
   - 16x16px (icon16.png)
   - 48x48px (icon48.png)
   - 128x128px (icon128.png)
3. Diseño sugerido: Fondo azul (#1A73E8) con un ícono blanco
4. Guardar en `dist/icons/`

## Notas Importantes

- La carpeta `dist/` es todo lo que necesitas para instalar la extensión
- Puedes distribuir solo la carpeta `dist/` sin el código fuente
- Los usuarios finales NO necesitan Node.js, npm, ni compilar nada
- La extensión usa Manifest V3 (la versión más reciente de Chrome)

## Solución de Problemas

**Error: "Manifest file is missing or unreadable"**
- Verifica que `manifest.json` esté en la raíz de `dist/`

**Error: "Could not load icon"**
- Asegúrate de tener los 3 iconos PNG en `dist/icons/`
- Usa el generador HTML o crea iconos manualmente

**La extensión no aparece**
- Verifica que el "Modo de desarrollador" esté activado
- Recarga la extensión desde `chrome://extensions/`

**El atajo `Ctrl+Shift+S` no funciona**
- Puede estar en conflicto con otro atajo
- Ve a `chrome://extensions/shortcuts` para cambiarlo
