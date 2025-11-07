# 🔥 Configuración de Firestore - FASE 4

## 📋 Paso 1: Habilitar Firestore Database

1. **Abre Firebase Console:**
   ```
   https://console.firebase.google.com/project/smart-shortcuts-359e0
   ```

2. **Navega a Firestore Database:**
   - En el menú lateral izquierdo: **Build** → **Firestore Database**

3. **Crear la base de datos:**
   - Click en **"Create database"** o **"Get started"**

4. **Seleccionar modo de producción:**
   - Selecciona: **"Start in production mode"**
   - (Configuraremos las reglas de seguridad en el siguiente paso)
   - Click **"Next"**

5. **Seleccionar región:**
   - Región recomendada: **us-central (Iowa)** o **us-east1 (South Carolina)**
   - (Selecciona la más cercana a tus usuarios)
   - Click **"Enable"**

6. **Esperar a que se habilite:**
   - Toma 1-2 minutos
   - Verás "Cloud Firestore is being provisioned"
   - Cuando termine, verás la interfaz de Firestore

---

## 🔒 Paso 2: Configurar Reglas de Seguridad

1. **En Firebase Console, ve a:**
   - **Firestore Database** → **Rules** (pestaña superior)

2. **Reemplaza las reglas actuales con las siguientes:**

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Reglas para colección de usuarios
    match /users/{userId} {
      // Solo el usuario autenticado puede leer/escribir sus propios datos
      allow read, write: if request.auth != null && request.auth.uid == userId;

      // Subcolección 'data' (config y profile)
      match /data/{document=**} {
        // Solo el usuario autenticado puede leer/escribir sus propios datos
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }

    // Denegar todo lo demás
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

3. **Click en "Publish"**

4. **Verificar que se guardaron correctamente**
   - Verás "Rules published successfully"

---

## 📊 Estructura de Datos en Firestore

Una vez habilitado, los datos se guardarán con esta estructura:

```
users/
  └── {userId}           # ID del usuario autenticado
      └── data/
          ├── config/    # Configuración de shortcuts
          │   ├── sections: Array<Section>
          │   ├── version: string
          │   └── lastModified: Timestamp
          │
          └── profile/   # Perfil del usuario
              ├── email: string
              ├── displayName: string
              ├── photoURL: string
              └── lastLogin: Timestamp
```

### Ejemplo de documento `config`:

```json
{
  "sections": [
    {
      "id": "abc-123",
      "name": "Productividad",
      "icon": "📊",
      "color": "#3b82f6",
      "order": 0,
      "items": [
        {
          "id": "def-456",
          "type": "direct",
          "label": "Gmail",
          "url": "https://mail.google.com",
          "icon": "📧",
          "order": 0
        }
      ]
    }
  ],
  "version": "3.0.0",
  "lastModified": Timestamp(2025, 11, 6, 12, 30, 0)
}
```

---

## ✅ Verificar que Funciona

### Opción 1: Desde la Consola de Firebase

1. Ve a **Firestore Database** → **Data** (pestaña)
2. Abre la extensión en Chrome
3. Haz login con Google
4. Crea o edita un shortcut
5. Refresca la consola de Firestore
6. Deberías ver:
   ```
   users/
     └── {tu-user-id}/
         └── data/
             ├── config
             └── profile
   ```

### Opción 2: Desde DevTools de la Extensión

1. Abre la extensión en Chrome
2. Click derecho → **Inspeccionar**
3. Ve a la pestaña **Console**
4. Busca mensajes como:
   ```
   ✅ [FIRESTORE] Config guardada exitosamente
   📥 [FIRESTORE] Cargando config para usuario: xxx
   ```

---

## 🎯 Próximo Paso

Una vez completada la configuración de Firestore:

1. **Probar sincronización:**
   - Abre la extensión
   - Haz login
   - Crea/edita shortcuts
   - Verifica en Firebase Console que se guardan

2. **Probar sincronización entre tabs:**
   - Abre la extensión en 2 tabs diferentes
   - Edita en una tab
   - Verifica que se actualiza en la otra tab automáticamente

3. **Continuar con FASE 5:** Migración de datos de `chrome.storage.sync` a Firestore

---

## 🐛 Solución de Problemas

### Error: "Missing or insufficient permissions"

**Causa:** Las reglas de seguridad no están configuradas correctamente.

**Solución:**
1. Verifica que las reglas en Firebase Console coincidan exactamente con las del Paso 2
2. Asegúrate de hacer click en "Publish"
3. Espera 30 segundos y vuelve a intentar

### Error: "auth/user-not-found"

**Causa:** El usuario no está autenticado.

**Solución:**
1. Asegúrate de hacer login primero
2. Verifica en DevTools que `user` no es null
3. Revisa que Firebase Authentication esté habilitado

### Los datos no se sincronizan entre tabs

**Causa:** La suscripción en tiempo real no está activa.

**Solución:**
1. Verifica en DevTools Console que ves:
   ```
   👂 [FIRESTORE] Suscribiéndose a cambios para usuario: xxx
   ```
2. Si no ves ese mensaje, revisa que `useFirestoreConfig` esté siendo usado correctamente
3. Asegúrate de que ambas tabs tienen el usuario autenticado

---

## 📚 Referencias

- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firestore Data Structure Best Practices](https://firebase.google.com/docs/firestore/manage-data/structure-data)
- [Firestore Limits and Quotas](https://firebase.google.com/docs/firestore/quotas)

---

**Creado:** 6 de Noviembre, 2025
**Proyecto:** Smart Shortcuts Extension v3.0.0
**FASE:** 4 - Firestore Database
