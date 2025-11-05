# Flujo de Trabajo para Releases

## 🎯 Proceso Automatizado

Cada commit **automáticamente**:
1. ✅ Compila la extensión
2. ✅ Crea el ZIP
3. ✅ Crea/actualiza el release en GitHub

## 📝 Para crear una nueva versión:

### 1. Actualiza la versión

Edita `public/manifest.json`:
```json
{
  "version": "2.2.0"  // ← Cambia aquí
}
```

También actualiza `package.json`:
```json
{
  "version": "2.2.0"  // ← Cambia aquí
}
```

### 2. Actualiza el CHANGELOG

Agrega una nueva sección en `CHANGELOG.md`:
```markdown
## v2.2.0 - Título del Release (2025-XX-XX)

### 🎉 Nuevas Características
- Feature 1
- Feature 2

### 🐛 Bugs Corregidos
- Fix 1
- Fix 2
```

### 3. Haz commit y push

```bash
git add .
git commit -m "release: v2.2.0 - Título del Release"
git push
```

**¡Eso es todo!** El sistema automáticamente:
- Compila la extensión
- Crea `smart-shortcuts-v2.2.0.zip`
- Crea release en GitHub: `https://github.com/gustavojmarrero/smart-shortcuts-extension/releases/tag/v2.2.0`
- Adjunta el ZIP al release
- Extrae notas del CHANGELOG

## 🔍 Verificar el release

Ve a: https://github.com/gustavojmarrero/smart-shortcuts-extension/releases

Deberías ver tu nuevo release con:
- ✅ Tag correcto (v2.2.0)
- ✅ ZIP adjunto
- ✅ Notas del CHANGELOG
- ✅ Fecha de publicación

## 🚫 Si algo falla

### No duplicar releases
El script verifica si ya existe un release con esa versión. Si existe, se omite.

### Crear release manualmente
```bash
npm run release
```

### Borrar un release (si necesitas recrearlo)
```bash
gh release delete v2.2.0
git tag -d v2.2.0
git push origin :refs/tags/v2.2.0
```

Luego haz commit de nuevo para recrearlo.

## 📦 Requisitos

- **GitHub CLI** (`gh`) instalado: `brew install gh`
- **Autenticado**: `gh auth login`
- **Permisos**: Push access al repositorio

## 🎨 Ejemplo completo

```bash
# 1. Actualizar versión
vim public/manifest.json  # 2.1.0 → 2.2.0
vim package.json          # 2.1.0 → 2.2.0

# 2. Actualizar CHANGELOG
vim CHANGELOG.md          # Agregar sección v2.2.0

# 3. Commit
git add .
git commit -m "release: v2.2.0 - Mejoras de rendimiento"

# 4. Push (el resto es automático)
git push

# 5. Verificar
open https://github.com/gustavojmarrero/smart-shortcuts-extension/releases
```

## 💡 Tips

- **Versionado semántico**: Usa `MAJOR.MINOR.PATCH`
  - `MAJOR`: Cambios que rompen compatibilidad
  - `MINOR`: Nuevas features compatibles
  - `PATCH`: Bug fixes

- **Commits claros**: Usa prefijos como:
  - `feat:` - Nueva funcionalidad
  - `fix:` - Bug fix
  - `docs:` - Documentación
  - `release:` - Nueva versión

- **CHANGELOG detallado**: Cuanto más claro, mejor para los usuarios

## 🔗 Links útiles

- **Releases**: https://github.com/gustavojmarrero/smart-shortcuts-extension/releases
- **Issues**: https://github.com/gustavojmarrero/smart-shortcuts-extension/issues
- **Chrome Web Store**: (pendiente de publicar)
