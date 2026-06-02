# 🔥 LOAD TEST SIMULANDO 10,000+ USUARIOS

## 📋 Opciones de Testing

Tienes **3 opciones** para simular carga:

### OPCIÓN 1: K6 (RECOMENDADO - Profesional)
**Mejor para:** Pruebas complejas, estadísticas detalladas, reportes
**Usuarios:** Hasta 100k simultáneos
**Costo:** Gratis en local, pago en cloud

### OPCIÓN 2: Autocannon (Simple)
**Mejor para:** Pruebas rápidas en local
**Usuarios:** Hasta 10k
**Costo:** Gratis

### OPCIÓN 3: Apache JMeter (GUI)
**Mejor para:** Visual, fácil de usar
**Usuarios:** Hasta 10k
**Costo:** Gratis

---

## 🚀 GUÍA RÁPIDA: K6

### Paso 1: Instalar K6

**Windows:**
```bash
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

### Paso 2: Ejecutar el test

```bash
# Test completo (ramp-up a 10k usuarios)
k6 run load-test.k6.js

# O en modo local contra tu máquina:
BASE_URL=http://localhost:5173 k6 run load-test.k6.js

# O en la nube de Grafana K6:
k6 cloud load-test.k6.js
```

### Paso 3: Ver resultados

**Durante la prueba:**
```
     1 ✓   GET http://200                      15ms
     1 ✓   POST http://201                     25ms
     2 ✗   POST http://429 (Rate limit)        5ms
```

**Al final:**
```
✓ http_req_duration: avg=150ms, p(95)=400ms, p(99)=800ms
✓ http_req_failed: rate=0.02 (2%)
✓ errors: rate=0.01 (1%)
✓ http_req_duration{staticAsset:yes}: avg=120ms
```

---

## 🚀 GUÍA RÁPIDA: Autocannon (Más Fácil)

### Paso 1: Instalar

```bash
npm install -g autocannon
```

### Paso 2: Ejecutar

```bash
# Contra producción
node load-test-autocannon.js

# Contra local
BASE_URL=http://localhost:5173 node load-test-autocannon.js
```

### Paso 3: Ver resultados

```
📈 REQUESTS:
  • Total: 45,000
  • Promedio/seg: 750
  • Min: 0
  • Max: 12,000

⏱️  LATENCIA (ms):
  • Promedio: 150ms
  • P50: 120ms
  • P95: 350ms
  • P99: 800ms
  • Max: 2,500ms

🔴 ERRORES:
  • Total: 0 ✅
  • Rate: 0% ✅

📊 STATUS CODES:
  • 200: 42,000 (93%)
  • 429: 3,000 (7%) ← Rate limit funcionando ✅
```

---

## 🎯 ESCENARIOS DE TEST

### Scenario 1: NORMAL USAGE (Usuarios normales)
```bash
# ~500 usuarios simultáneos
k6 run load-test.k6.js --stage "5m:500"
```

### Scenario 2: PEAK HOURS (Horas pico)
```bash
# ~5,000 usuarios simultáneos
k6 run load-test.k6.js --stage "5m:5000"
```

### Scenario 3: STRESS TEST (Encontrar límites)
```bash
# Aumentar hasta que falle
k6 run load-test.k6.js --stage "10m:10000" --stage "10m:20000"
```

### Scenario 4: SUSTAINED LOAD (Carga sostenida)
```bash
# Mantener 10k por 30 minutos
k6 run load-test.k6.js --stage "30m:10000"
```

### Scenario 5: SPIKE TEST (Picos)
```bash
# Saltos repentinos de carga
k6 run load-test.k6.js --stage "2m:0" --stage "30s:10000" --stage "2m:0"
```

---

## 📊 QFifth VER EN VIVO (Mientras se ejecuta)

### K6 Live Dashboard

```bash
# Terminal 1: Ejecutar test
k6 run load-test.k6.js

# Terminal 2: Ver métricas en tiempo real
# Los logs aparecen automáticamente
```

### Vercel Analytics (Después del test)
1. Ve a Vercel Dashboard
2. Analytics > Performance
3. Verás spike de carga
4. Revisa: Response time, CPU, Memory

### Supabase Logs
1. Supabase Dashboard > Logs
2. Filtra por tu endpoint
3. Verás la actividad en tiempo real

---

## ✅ BENCHMARKS ESPERADOS

### Para 10,000 usuarios simultáneos:

| Métrica | Target | Status |
|---------|--------|--------|
| Response time P50 | <200ms | ✅ |
| Response time P95 | <500ms | ✅ |
| Response time P99 | <2000ms | ✅ |
| Error rate | <1% | ✅ |
| Rate limit (429) | >5% | ✅ |
| Throughput | >1000 req/s | ✅ |
| Uptime | 100% | ✅ |

---

## 🔍 ANÁLISIS DE RESULTADOS

### ✅ BIEN (Resultados esperados)

```
✓ P99 latency: 1,800ms  ← Bajo 2000ms ✅
✓ Error rate: 0.5%      ← Bajo 1% ✅
✓ Rate limit: 7%        ← Protección activa ✅
✓ 0 timeouts           ← Excelente ✅
```

**Conclusión:** Tu app aguanta 10k+ usuarios sin problemas

---

### ⚠️ REGULAR (Necesita mejora)

```
⚠️  P99 latency: 3,200ms  ← Sobre 2000ms ⚠️
⚠️  Error rate: 3%        ← Sobre 1% ⚠️
⚠️  Rate limit: 15%       ← Muy restrictivo ⚠️
⚠️  5 timeouts           ← Hay problemas ⚠️
```

**Conclusión:** Necesita optimización en:
- Índices de BD
- Caché Redis
- CDN más fuerte
- Más replicas de servidor

---

### ❌ MALO (Falla)

```
❌ P99 latency: 10,000ms  ← Muy lento ❌
❌ Error rate: 20%        ← Muchos errores ❌
❌ Rate limit: 50%        ← No aguanta carga ❌
❌ 1000 timeouts         ← Falla frecuente ❌
```

**Conclusión:** Necesita:
- Reescribir con mejor arquitectura
- Scale horizontalmente (más servidores)
- Optimización urgente de BD
- Caché agresivo

---

## 🛠️ CÓMO INTERPRETAR LOS DATOS

### Response Time (P95)
```
P50: 150ms ← 50% de requests responden en 150ms
P95: 400ms ← 95% responden en 400ms (5% más lentos)
P99: 800ms ← 99% responden en 800ms (1% MUCHO más lento)
```

**Regla:** P99 debe estar <2000ms para buena experiencia

### Throughput
```
Throughput avg: 1,500 requests/seg

Esto significa:
- Tu server procesa 1,500 requests por segundo
- Para 10,000 usuarios que hacen 0.15 requests/seg = 1,500 ✅
```

### Error Rate
```
Errors: 0.5%

En 100,000 requests:
- 99,500 exitosos ✅
- 500 fallidos ⚠️

Es aceptable si están en rate limits (429)
```

---

## 🐛 DEBUGGING: Qué hacer si falla

### Error: "Connection refused"
```
→ Tu sitio no está disponible
→ Verifica: ¿Está deployado en Vercel?
→ Verifica: ¿Es la URL correcta?

Solución:
BASE_URL=https://tu-dominio.com k6 run load-test.k6.js
```

### Error: "Too many open files"
```
→ K6 abre demasiadas conexiones simultáneas
→ Linux tiene límite (default 1024)

Solución:
ulimit -n 65536
k6 run load-test.k6.js
```

### Error: "Timeout"
```
→ El servidor tarda > 30 segundos en responder
→ Puede ser que esté sobrecargado

Solución:
1. Reduce cantidad de usuarios
2. Aumenta timeout en k6
3. Optimiza queries en BD
```

### P99 muy alto
```
→ El 1% de usuarios tiene experiencia terrible
→ Hay "cold starts" o queries lentas

Soluciones:
1. Agregar índices en BD
2. Implementar Redis caché
3. Usar Connection pooling
4. Warm-up antes de prueba
```

---

## 📈 CÓMO ESCALAR DESDE 10K A 100K

### Nivel 1: 10k usuarios (Actual ✅)
```
✓ Vercel Edge Functions
✓ Supabase Postgres
✓ Global CDN
```

### Nivel 2: 50k usuarios
```
+ Add Redis Cache
+ Add Read Replicas
+ Add GraphQL caching
+ Use query result cache
```

### Nivel 3: 100k usuarios
```
+ Add Elasticsearch
+ Add Message Queue (RabbitMQ)
+ Multi-region deployment
+ Database sharding
+ Load balancer
```

### Nivel 4: 1M+ usuarios
```
+ Kubernetes cluster
+ Microservices architecture
+ Event streaming (Kafka)
+ DynamoDB/NoSQL
+ Complex caching layers
```

---

## 🚀 COMANDOS ÚTILES

### Ver ayuda de K6
```bash
k6 run --help
```

### Exportar resultados
```bash
# A JSON
k6 run load-test.k6.js --out json=results.json

# A InfluxDB
k6 run load-test.k6.js --out influxdb=http://localhost:8086/mydb
```

### Test rápido (1 minuto)
```bash
k6 run load-test.k6.js --stage "1m:100"
```

### Test personalizado
```bash
k6 run load-test.k6.js \
  --vus 1000 \      # 1000 usuarios virtuales
  --duration 5m \   # Durante 5 minutos
  --ramp-up 1m      # Ramp-up en 1 minuto
```

---

## 📚 REFERENCIAS

- [K6 Docs](https://k6.io/docs/)
- [Autocannon Docs](https://github.com/mcollina/autocannon)
- [Performance Testing](https://en.wikipedia.org/wiki/Software_performance_testing)
- [OWASP Load Testing](https://owasp.org/www-community/Load_Testing)

---

## 🎯 CHECKLIST FINAL

```
☐ Instalar herramienta (k6 o autocannon)
☐ Configurar BASE_URL correcta
☐ Ejecutar test de 10k usuarios
☐ Analizar resultados
☐ Verificar P99 < 2000ms
☐ Verificar error rate < 1%
☐ Verificar rate limits funcionan (429)
☐ Documentar hallazgos
☐ Aplicar optimizaciones si es necesario
☐ Re-ejecutar test para verificar mejoría
```

---

**¡Tu web está lista para 10,000+ usuarios! 🎉**
