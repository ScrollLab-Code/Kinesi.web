/**
 * SIMPLE LOAD TEST - Node.js
 * Sin dependencias externas, ejecutable inmediatamente
 * 
 * Uso: node simple-load-test.js [usuarios] [duracion] [URL]
 * Ej: node simple-load-test.js 1000 60 https://kinase.com
 * Ej: node simple-load-test.js 1000 60 http://localhost:5173
 */

import https from 'https';
import http from 'http';

// ============================================================================
// CONFIGURACIÓN
// ============================================================================
let BASE_URL = process.argv[4] || process.env.BASE_URL || 'https://kinase.com';
const NUM_USERS = parseInt(process.argv[2]) || 100;
const DURATION_SEC = parseInt(process.argv[3]) || 30;
const BATCH_SIZE = 50; // Requests simultáneos

// Validar URL
if (!BASE_URL.startsWith('http')) {
  BASE_URL = 'https://' + BASE_URL;
}

console.log(`\n📍 URL a testear: ${BASE_URL}`);
console.log(`👥 Usuarios simulados: ${NUM_USERS}`);
console.log(`⏱️  Duración: ${DURATION_SEC}s\n`);

// ============================================================================
// MÉTRICAS
// ============================================================================
let metrics = {
  totalRequests: 0,
  successRequests: 0,
  failedRequests: 0,
  rateLimitedRequests: 0,
  totalTime: 0,
  responseTimes: [],
  statusCodes: {},
  startTime: Date.now(),
  endTime: null,
};

// ============================================================================
// HELPER: HTTP GET
// ============================================================================
function httpGet(url, timeout = 5000) {
  return new Promise((resolve) => {
    const lib = url.startsWith('https') ? https : http;
    const timeoutHandle = setTimeout(() => {
      resolve({ statusCode: 0, body: '', time: timeout });
    }, timeout);

    try {
      lib.get(url, (res) => {
        clearTimeout(timeoutHandle);
        const startTime = Date.now();
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          const time = Date.now() - startTime;
          resolve({ statusCode: res.statusCode, body: data, time });
        });
      }).on('error', () => {
        clearTimeout(timeoutHandle);
        resolve({ statusCode: 0, body: '', time: 0 });
      });
    } catch (error) {
      clearTimeout(timeoutHandle);
      resolve({ statusCode: 0, body: '', time: 0 });
    }
  });
}

// ============================================================================
// HELPER: HTTP POST
// ============================================================================
function httpPost(url, payload, timeout = 5000) {
  return new Promise((resolve) => {
    const lib = url.startsWith('https') ? https : http;
    const urlObj = new URL(url);
    const timeoutHandle = setTimeout(() => {
      resolve({ statusCode: 0, body: '', time: timeout });
    }, timeout);

    try {
      const options = {
        hostname: urlObj.hostname,
        port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
        path: urlObj.pathname + urlObj.search,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload),
        },
      };

      const startTime = Date.now();
      const req = lib.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          clearTimeout(timeoutHandle);
          const time = Date.now() - startTime;
          resolve({ statusCode: res.statusCode, body: data, time });
        });
      });

      req.on('error', () => {
        clearTimeout(timeoutHandle);
        resolve({ statusCode: 0, body: '', time: 0 });
      });

      req.write(payload);
      req.end();
    } catch (error) {
      clearTimeout(timeoutHandle);
      resolve({ statusCode: 0, body: '', time: 0 });
    }
  });
}

// ============================================================================
// HACER UN REQUEST
// ============================================================================
async function makeRequest(userId) {
  const requests = [];

  // 1. GET home
  requests.push(
    httpGet(`${BASE_URL}/`).then((res) => {
      recordMetric(res, 'GET /');
    })
  );

  // 2. GET search
  requests.push(
    httpGet(`${BASE_URL}/api/particulares?search=Matematica`).then((res) => {
      recordMetric(res, 'GET /api/particulares');
    })
  );

  // 3. POST register
  const registerPayload = JSON.stringify({
    nombre: `User-${userId}`,
    especialidad: 'Matemática',
    telefono: `549${Math.random().toString().slice(2, 12)}`,
  });

  requests.push(
    httpPost(`${BASE_URL}/api/particulares`, registerPayload).then((res) => {
      recordMetric(res, 'POST /api/particulares');
    })
  );

  // 4. POST email (con delay para evitar rate limit)
  if (userId % 3 === 0) {
    const emailPayload = JSON.stringify({
      name: `Test-${userId}`,
      email: `test${userId}@example.com`,
      phone: `549${Math.random().toString().slice(2, 12)}`,
      message: 'Test message',
    });

    requests.push(
      httpPost(`${BASE_URL}/api/send-email`, emailPayload).then((res) => {
        recordMetric(res, 'POST /api/send-email');
      })
    );
  }

  await Promise.all(requests);
}

// ============================================================================
// REGISTRAR MÉTRICA
// ============================================================================
function recordMetric(res, endpoint) {
  metrics.totalRequests++;
  metrics.responseTimes.push(res.time);
  metrics.totalTime += res.time;

  if (!metrics.statusCodes[res.statusCode]) {
    metrics.statusCodes[res.statusCode] = 0;
  }
  metrics.statusCodes[res.statusCode]++;

  if (res.statusCode === 200 || res.statusCode === 201) {
    metrics.successRequests++;
  } else if (res.statusCode === 429) {
    metrics.rateLimitedRequests++;
  } else {
    metrics.failedRequests++;
  }
}

// ============================================================================
// EJECUTAR TEST
// ============================================================================
async function runLoadTest() {
  console.log('\n╔════════════════════════════════════════════╗');
  console.log('║   🔥 LOAD TEST SIMULANDO MILES DE USUARIOS 🔥  ║');
  console.log('╚════════════════════════════════════════════╝\n');

  console.log(`📍 URL: ${BASE_URL}`);
  console.log(`👥 Usuarios: ${NUM_USERS}`);
  console.log(`⏱️  Duración: ${DURATION_SEC}s`);
  console.log(`\n🚀 Iniciando...\n`);

  const startTime = Date.now();
  let userCount = 0;

  while (Date.now() - startTime < DURATION_SEC * 1000) {
    const batch = [];

    // Crear batch de requests
    for (let i = 0; i < Math.min(BATCH_SIZE, NUM_USERS - userCount); i++) {
      batch.push(makeRequest(userCount + i));
    }

    // Ejecutar batch
    await Promise.all(batch);
    userCount += batch.length;

    // Progress
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    const progress = Math.round((elapsed / DURATION_SEC) * 100);
    process.stdout.write(`\r⏳ ${elapsed}s/${DURATION_SEC}s [${progress}%] ${metrics.totalRequests} requests`);
  }

  metrics.endTime = Date.now();
  console.log('\n\n✅ Test completado!\n');

  // Mostrar resultados
  printResults();
}

// ============================================================================
// MOSTRAR RESULTADOS
// ============================================================================
function printResults() {
  const avgResponseTime = metrics.totalTime / metrics.totalRequests;
  const sortedTimes = metrics.responseTimes.sort((a, b) => a - b);
  const p50 = sortedTimes[Math.floor(sortedTimes.length * 0.5)];
  const p95 = sortedTimes[Math.floor(sortedTimes.length * 0.95)];
  const p99 = sortedTimes[Math.floor(sortedTimes.length * 0.99)];
  const successRate = ((metrics.successRequests / metrics.totalRequests) * 100).toFixed(2);
  const errorRate = ((metrics.failedRequests / metrics.totalRequests) * 100).toFixed(2);
  const rateLimitRate = ((metrics.rateLimitedRequests / metrics.totalRequests) * 100).toFixed(2);

  console.log('╔════════════════════════════════════════════╗');
  console.log('║          📊 RESULTADOS FINALES 📊         ║');
  console.log('╚════════════════════════════════════════════╝\n');

  console.log('📈 REQUESTS:');
  console.log(`  • Total: ${metrics.totalRequests}`);
  console.log(`  • Exitosos: ${green(metrics.successRequests)} (${successRate}%)`);
  console.log(`  • Fallidos: ${red(metrics.failedRequests)} (${errorRate}%)`);
  console.log(`  • Rate limited: ${yellow(metrics.rateLimitedRequests)} (${rateLimitRate}%)`);

  console.log('\n⏱️  LATENCIA (ms):');
  console.log(`  • Promedio: ${avgResponseTime.toFixed(2)}ms`);
  console.log(`  • P50: ${p50}ms`);
  console.log(`  • P95: ${p95}ms`);
  console.log(`  • P99: ${p99}ms`);
  console.log(`  • Max: ${sortedTimes[sortedTimes.length - 1]}ms`);
  console.log(`  • Min: ${sortedTimes[0]}ms`);

  console.log('\n📊 STATUS CODES:');
  for (const [code, count] of Object.entries(metrics.statusCodes)) {
    const percentage = ((count / metrics.totalRequests) * 100).toFixed(1);
    if (code === '200' || code === '201') {
      console.log(`  • ${code}: ${green(count)} (${percentage}%)`);
    } else if (code === '429') {
      console.log(`  • ${code} (Rate Limited): ${yellow(count)} (${percentage}%)`);
    } else {
      console.log(`  • ${code}: ${red(count)} (${percentage}%)`);
    }
  }

  console.log('\n✅ ANÁLISIS:');
  if (p99 < 2000 && errorRate < 5 && rateLimitRate > 0) {
    console.log(
      green(
        '  ✅ EXCELENTE - Tu web aguanta miles de usuarios sin problemas'
      )
    );
  } else if (p99 < 3000 && errorRate < 10) {
    console.log(yellow('  ⚠️  BUENO - Puede mejorar performance'));
  } else {
    console.log(red('  ❌ POBRE - Necesita optimización'));
  }

  console.log('\n');
}

// ============================================================================
// COLORS
// ============================================================================
function green(text) {
  return `\x1b[32m${text}\x1b[0m`;
}

function red(text) {
  return `\x1b[31m${text}\x1b[0m`;
}

function yellow(text) {
  return `\x1b[33m${text}\x1b[0m`;
}

// ============================================================================
// EJECUTAR
// ============================================================================
runLoadTest().catch(console.error);
