# Instrucciones para Crear un GitHub Release

## 📦 Paso 1: Preparar el Release

Ya has generado el archivo ZIP con el comando:
```bash
npm run package
```

El archivo se encuentra en:
```
releases/smart-shortcuts-v2.1.0.zip
```

## 🚀 Paso 2: Crear el Release en GitHub

### Opción A: Usando la interfaz web de GitHub

1. **Ve a tu repositorio en GitHub**
   - URL: `https://github.com/YOUR_USERNAME/shortcuts`

2. **Navega a Releases**
   - Click en "Releases" en la barra lateral derecha
   - O ve directamente a: `https://github.com/YOUR_USERNAME/shortcuts/releases`

3. **Crea un nuevo Release**
   - Click en "Draft a new release"
   - O ve a: `https://github.com/YOUR_USERNAME/shortcuts/releases/new`

4. **Completa la información del Release**

   **Tag version:**
   ```
   v2.1.0
   ```
   - Click en "Choose a tag" → "Create new tag: v2.1.0"

   **Release title:**
   ```
   v2.1.0 - Nested Folders & Drag-and-Drop
   ```

   **Description:** (Copia y pega esto)
   ```markdown
   ## 🎉 What's New in v2.1.0

   ### 🆕 Major Features

   - **📂 Nested Folders**: Organize shortcuts in unlimited nested folder hierarchies
   - **🔀 Drag & Drop**: Reorder shortcuts and folders with intuitive drag-and-drop
   - **🔍 Recursive Search**: Search finds shortcuts inside any level of nested folders
   - **⚙️ Enhanced Options Page**: Full folder management in the advanced settings

   ### ✨ Improvements

   - Completely refactored storage system for nested structures
   - Automatic migration from v2.0 to v2.1
   - Visual grip handles for drag-and-drop
   - Background highlighting for valid drop zones
   - Recursive delete for folders with all their contents

   ### 🐛 Bug Fixes

   - Fixed folder/shortcut deletion in nested structures
   - Fixed folder editing at any nesting level
   - Improved search performance with large folder structures

   ## 📥 Installation

   1. Download the `smart-shortcuts-v2.1.0.zip` file below
   2. Unzip the file
   3. Open Chrome and go to `chrome://extensions/`
   4. Enable "Developer mode" (top right)
   5. Click "Load unpacked"
   6. Select the unzipped folder

   ## 🔄 Upgrading from v2.0

   Your existing shortcuts will be automatically migrated to the new folder structure. No manual action needed!

   ---

   **Full Changelog**: https://github.com/YOUR_USERNAME/shortcuts/compare/v2.0.0...v2.1.0
   ```

5. **Sube el archivo ZIP**
   - Arrastra el archivo `releases/smart-shortcuts-v2.1.0.zip` a la sección "Attach binaries"
   - O click en "Attach files by dragging & dropping, selecting or pasting them"

6. **Marca como "Latest release"**
   - Asegúrate de que "Set as the latest release" esté marcado

7. **Publica el Release**
   - Click en "Publish release"

### Opción B: Usando GitHub CLI (gh)

Si tienes GitHub CLI instalado:

```bash
# Asegúrate de estar autenticado
gh auth login

# Crear el release
gh release create v2.1.0 \
  releases/smart-shortcuts-v2.1.0.zip \
  --title "v2.1.0 - Nested Folders & Drag-and-Drop" \
  --notes "$(cat <<'EOF'
## 🎉 What's New in v2.1.0

### 🆕 Major Features
- **📂 Nested Folders**: Organize shortcuts in unlimited nested folder hierarchies
- **🔀 Drag & Drop**: Reorder shortcuts and folders with intuitive drag-and-drop
- **🔍 Recursive Search**: Search finds shortcuts inside any level of nested folders
- **⚙️ Enhanced Options Page**: Full folder management in the advanced settings

## 📥 Installation
1. Download the smart-shortcuts-v2.1.0.zip file below
2. Unzip the file
3. Open Chrome and go to chrome://extensions/
4. Enable "Developer mode"
5. Click "Load unpacked"
6. Select the unzipped folder

## 🔄 Upgrading
Your existing shortcuts will be automatically migrated. No manual action needed!
EOF
)"
```

## 📝 Paso 3: Actualizar el README

El README ya incluye el enlace de descarga. Actualiza las URLs con tu nombre de usuario:

1. Reemplaza `YOUR_USERNAME` con tu nombre de usuario de GitHub en:
   - `README.md` (líneas 3-5 y 21)
   - Este archivo `RELEASE_INSTRUCTIONS.md`

## ✅ Verificación

Después de publicar el release:

1. Ve a `https://github.com/YOUR_USERNAME/shortcuts/releases`
2. Verifica que v2.1.0 aparece como "Latest"
3. Verifica que el archivo ZIP se puede descargar
4. Verifica que los badges en README funcionan

## 🔄 Releases Futuros

Para crear releases futuros:

1. Actualiza la versión en `package.json`
2. Actualiza `CHANGELOG.md` con los cambios
3. Ejecuta `npm run package`
4. Sigue estos mismos pasos con la nueva versión

---

## 📚 Recursos

- [GitHub Releases Documentation](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository)
- [GitHub CLI Releases](https://cli.github.com/manual/gh_release_create)
