# ⚡ EJECUTAR SIMULACRO DE MILES DE USUARIOS - GUÍA RÁPIDA

## 3 FORMAS MÁS FÁCILES (De más fácil a más profesional)

---

## ✅ OPCIÓN 1: Simple Load Test (MÁS FÁCIL - SIN INSTALAR NADA)

**Perfecta para**: Prueba rápida ahora mismo

### Ejecutar:
```bash
cd "C:\Users\PC\Downloads\Kinesi.web-main (1)"

# Simular 1,000 usuarios durante 30 segundos
node simple-load-test.js 1000 30

# O simular 10,000 usuarios
node simple-load-test.js 10000 60
```

### Resultado esperado:
```
⏳ 60s/60s [100%] 45,000 requests

📈 REQUESTS:
  • Total: 45,000
  • Exitosos: 42,000 (93%)
  • Fallidos: 0 (0%)
  • Rate limited: 3,000 (7%) ← Protección funcionando ✅

⏱️  LATENCIA (ms):
  • Promedio: 150ms
  • P50: 120ms
  • P95: 350ms
  • P99: 800ms ← Bajo 2000ms ✅

✅ ANÁLISIS:
  ✅ EXCELENTE - Tu web aguanta miles de usuarios sin problemas
```

---

## 🚀 OPCIÓN 2: Autocannon (FÁCIL - 1 Instancia)

**Perfecta para**: Prueba más realista

### Paso 1: Instalar
```bash
npm install -g autocannon
```

### Paso 2: Ejecutar
```bash
cd "C:\Users\PC\Downloads\Kinesi.web-main (1)"

# Simular miles de usuarios
node load-test-autocannon.js

# O contra local:
BASE_URL=http://localhost:5173 node load-test-autocannon.js
```

### Resultado esperado:
```
📈 REQUESTS:
  • Total: 50,000
  • Promedio/seg: 833

⏱️  LATENCIA (ms):
  • Promedio: 145ms
  • P50: 100ms
  • P95: 400ms
  • P99: 850ms
  • Max: 2,200ms

🔴 ERRORES:
  • Total: 0 ✅
  • Rate: 0% ✅

📊 STATUS CODES:
  • 200: 47,000 (94%)
  • 429: 3,000 (6%) ← Rate limit ✅
```

---

## 🎯 OPCIÓN 3: K6 (PROFESIONAL - Recomendado)

**Perfecta para**: Testing serio, reportes, análisis detallado

### Paso 1: Instalar K6

**Windows (PowerShell Admin):**
```powershell
choco install k6
```

**Mac:**
```bash
brew install k6
```

**Linux:**
```bash
sudo apt-get install k6
```

### Paso 2: Ejecutar
```bash
cd "C:\Users\PC\Downloads\Kinesi.web-main (1)"

# Test completo (ramp-up a 10k)
k6 run load-test.k6.js

# O simular 5,000 usuarios
k6 run load-test.k6.js --stage "5m:5000"

# O prueba rápida
k6 run load-test.k6.js --stage "1m:1000"
```

### Resultado esperado:
```
✓ http_req_duration: avg=150ms, p(95)=350ms, p(99)=850ms
✓ http_req_failed: rate=0.01 (1%)
✓ errors: rate=0.05 (5% rate limit)
✓ success: rate=0.95 (95%)

     1 ✓ Cargar página principal (GET /)
     1 ✓ Buscar particulares (GET /search)
     1 ✓ Registrar particular (POST)
     1 ✓ Enviar email (POST)
     1 ✓ XSS test - sanitizado ✅
     1 ✓ SQL injection test - prevenido ✅
```

---

## 📊 COMPARAR HERRAMIENTAS

| Aspecto | Simple Script | Autocannon | K6 |
|---------|---------------|-----------|-----|
| Instalar | ✅ Nada | ✅ NPM | ✅ Chocolatey |
| Facilidad | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| Usuarios | ~1k-5k | ~5k-10k | ~10k-100k |
| Reportes | Básicos | Buenos | Excelentes |
| Nube | ❌ | ❌ | ✅ |

---

## 🎯 RECOMENDACIÓN POR CASO

### "Quiero probar AHORA"
```bash
node simple-load-test.js 1000 30
```

### "Quiero una prueba realista"
```bash
npm install -g autocannon
node load-test-autocannon.js
```

### "Quiero test profesional con reportes"
```bash
choco install k6
k6 run load-test.k6.js
```

---

## 📈 INTERPRETAR RESULTADOS

### ✅ BIEN (Lo que debes ver)
```
✓ P99 latency: 800ms-1800ms
✓ Error rate: 0-1%
✓ Rate limit: 5-10% (429 responses)
✓ Throughput: >800 requests/sec
→ Tu web AGUANTA 10k+ usuarios ✅
```

### ⚠️ MEJORABLE
```
⚠️  P99 latency: 2000-3000ms
⚠️  Error rate: 1-5%
⚠️  Rate limit: 20-30%
→ Funciona pero puede mejorar
Solución: Agregar caché, índices BD, CDN
```

### ❌ MALO (No debes ver)
```
❌ P99 latency: >5000ms
❌ Error rate: >10%
❌ Timeouts frecuentes
❌ 500 errors
→ Tu web NO aguanta
Solución: Revisar logs, optimizar, scale
```

---

## 🔥 EJEMPLOS REALES

### Ejemplo 1: Test rápido (1,000 usuarios, 30 seg)
```bash
node simple-load-test.js 1000 30

Resultado: ~12,000 requests
```

### Ejemplo 2: Test mediano (5,000 usuarios, 60 seg)
```bash
node simple-load-test.js 5000 60

Resultado: ~45,000 requests
```

### Ejemplo 3: Test full (10,000 usuarios, 120 seg)
```bash
node simple-load-test.js 10000 120

Resultado: ~150,000 requests
```

### Ejemplo 4: K6 profesional (ramp-up a 10k)
```bash
k6 run load-test.k6.js

Resultado:
- Comienza con 0 usuarios
- Sube a 100 en 30s
- Sube a 500 en 1m
- Sube a 1k en 2m
- Sube a 5k en 2m
- Sube a 10k en 3m ← MÁXIMA CARGA
- Mantiene 10k por 5 minutos
- Baja gradualmente
- Total: ~500,000 requests
```

---

## 🛠️ TROUBLESHOOTING

### Error: "fetch timeout"
```
→ La URL es incorrecta o el sitio no responde
Solución:
BASE_URL=https://tu-url.com node simple-load-test.js 100 30
```

### Error: "connection refused"
```
→ El sitio no está disponible
Solución:
1. Verificar que Vercel deployment está OK
2. Verificar URL en vercel.json
3. Esperar 5 min si recién deployaste
```

### Error: "Too many connections"
```
→ Tu SO no permite tantas conexiones
Solución (Linux):
ulimit -n 65536
node simple-load-test.js 5000 30
```

### Latencia muy alta
```
→ K6 está saturando tu conexión
Solución:
1. Reducir NUM_USERS
2. Usar connection pooling
3. Ejecutar desde un servidor más potente
```

---

## 📞 PRÓXIMOS PASOS

### Después del test:
- ✅ Guardar resultados
- ✅ Comparar con benchmarks anteriores
- ✅ Documentar hallazgos
- ✅ Aplicar optimizaciones si es necesario

### Si P99 > 2000ms:
1. Agregar índices en BD
2. Implementar Redis caché
3. Usar CDN más fuerte
4. Verificar queries SQL

### Si error rate > 1%:
1. Revisar logs en Sentry
2. Revisar Supabase logs
3. Optimizar endpoints
4. Agregar timeout handling

---

## ✅ CHECKLIST

```
☐ Elegir opción (Simple/Autocannon/K6)
☐ Ejecutar test
☐ Copiar resultados
☐ Analizar métricas
☐ Comparar con benchmarks
☐ Documentar
☐ Share en equipo
```

---

**¿Listo para simular miles de usuarios? 🚀**

```bash
# ¡EJECUTA AHORA!
node simple-load-test.js 5000 60
```
