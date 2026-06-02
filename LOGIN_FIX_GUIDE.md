# 🔐 Guía Rápida: Arreglando el Login de Kinase Academy

## 🚨 ¿Qué está mal?

Los usuarios se registran pero no pueden hacer login porque:

1. **Supabase requiere confirmación de email** por defecto
2. **No existe tabla `public.users`** para sincronizar usuarios  
3. **Falta trigger automático** que cree usuarios al registrarse

---

## ✅ Solución en 5 pasos

### **PASO 1: Desabilitar verificación de email en Supabase** (2 min)

1. Abre tu proyecto en **Supabase Dashboard**
2. Ve a **Authentication > Providers > Email**
3. Busca **"Confirm email"** o **"Email verification"**
4. **Deshabilita** esa opción
5. **Guarda** los cambios

**Resultado:** Los usuarios podrán iniciar sesión sin confirmar email ✅

---

### **PASO 2: Ejecutar SQL de autenticación en Supabase** (3 min)

1. En Supabase Dashboard, ve a **SQL Editor**
2. Abre un nuevo archivo SQL
3. **Copia todo el contenido** de: `supabase/auth-users-setup.sql`
4. **Pega y ejecuta** en Supabase
5. Deberías ver: ✅ Success - sin errores

**Qué hace:**
- ✅ Crea tabla `public.users` (perfil público del usuario)
- ✅ Crea trigger automático que sincroniza usuarios nuevos
- ✅ Configura permisos de lectura/escritura (RLS)
- ✅ Crea índices para performance

---

### **PASO 3: Actualizar variables de entorno** (2 min)

En la carpeta raíz, crea o actualiza `.env.local`:

```env
VITE_SUPABASE_URL=https://tuproyecto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
```

Dónde encontrar estas claves:
- **Supabase Dashboard > Project Settings > API**
- Copia **Project URL** y **Anon/public key**

---

### **PASO 4: Reiniciar servidor de desarrollo** (1 min)

```bash
# Detén el servidor actual (Ctrl+C)
npm run dev

# Abre en navegador
# http://localhost:5173
```

---

### **PASO 5: Probar el flujo completo** (3 min)

```bash
# PRUEBA 1: Registro nuevo
1. Abre http://localhost:5173
2. Haz clic en "Creémosla rápido aquí"
3. Completa: nombre, email, contraseña
4. Haz clic "Crear mi cuenta"
5. Deberías ver ✅ "¡Cuenta creada con éxito!"

# PRUEBA 2: Login con la cuenta nueva
1. Haz clic en "Inicia sesión directo"
2. Ingresa: email, contraseña
3. Haz clic "Ingresar ahora"
4. Deberías ver ✅ "¡Bienvenido de nuevo!" y acceso a la app
```

---

## 🧪 Verificar configuración (Opcional)

Si algo no funciona, usa el debug:

```bash
node debug-auth.js
```

Te pedirá:
- URL de Supabase
- Clave anón

Y probará automáticamente:
- ✅ Conexión a Supabase
- ✅ Registro de usuario
- ✅ Login de usuario
- ✅ Eliminación de usuario de prueba

---

## 🐛 Troubleshooting

### "El email no es una cuenta activa"
**Solución:** Desabilita "Email verification" en Supabase (PASO 1)

### "Usuario o contraseña incorrectos"  
**Solución:** Verifica que escribas email y contraseña exactamente igual

### "La contraseña debe tener al menos 6 caracteres"
**Solución:** Usa una contraseña más larga (mínimo 6 caracteres)

### "Este email ya está registrado"
**Solución:** Usa otro email o intenta login con ese mismo email

### "Tabla de usuarios no existe"
**Solución:** Ejecuta `supabase/auth-users-setup.sql` (PASO 2)

---

## 📋 Checklist Final

- [ ] Desabilité email verification en Supabase
- [ ] Ejecuté `auth-users-setup.sql` sin errores
- [ ] Actualicé `.env.local` con credenciales
- [ ] Reinicié `npm run dev`
- [ ] Probé registro (funciona ✅)
- [ ] Probé login (funciona ✅)
- [ ] Probé cambio entre Login/Register
- [ ] Probé con Google Auth

---

## 🚀 Próximo paso: Producción

Una vez que funciona en desarrollo:

```bash
# Commit y push
git add .
git commit -m "🔐 Fix auth: enable login and sync users"
git push origin main

# Vercel automáticamente redeploya
# Las variables de entorno en Supabase permanecen igual
```

---

**¿Necesitas ayuda?** Revisa los mensajes de error exactos en tu navegador (F12 > Console)

