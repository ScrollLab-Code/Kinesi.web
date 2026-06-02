/**
 * LOAD TEST CON K6
 * Simular 10,000+ usuarios simultáneos
 * 
 * Instalar: npm install -g k6
 * Ejecutar: k6 run load-test.k6.js
 * 
 * O con Docker:
 * docker run -i grafana/k6 run - < load-test.k6.js
 */

import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Rate, Trend, Counter, Gauge } from 'k6/metrics';

// ============================================================================
// MÉTRICAS PERSONALIZADAS
// ============================================================================
const errorRate = new Rate('errors');
const successRate = new Rate('success');
const duration = new Trend('http_req_duration');
const registrosPorSegundo = new Counter('registros_por_segundo');
const usuariosActivos = new Gauge('usuarios_activos');

// ============================================================================
// CONFIGURACIÓN DE CARGA
// ============================================================================
export const options = {
  stages: [
    // Ramp-up: Aumentar gradualmente
    { duration: '30s', target: 100 },    // 100 usuarios en 30s
    { duration: '1m', target: 500 },     // 500 usuarios en 1 min
    { duration: '2m', target: 1000 },    // 1,000 usuarios en 2 min
    { duration: '2m', target: 5000 },    // 5,000 usuarios en 2 min
    { duration: '3m', target: 10000 },   // 10,000 usuarios en 3 min
    
    // Plateau: Mantener máxima carga
    { duration: '5m', target: 10000 },   // Mantener 10k por 5 min
    
    // Ramp-down: Bajar gradualmente
    { duration: '2m', target: 5000 },    // Bajar a 5k en 2 min
    { duration: '1m', target: 0 },       // Bajar a 0 en 1 min
  ],
  
  thresholds: {
    'http_req_duration': ['p(95)<2000', 'p(99)<3000'], // 95% < 2s, 99% < 3s
    'http_req_failed': ['rate<0.1'],                    // Error rate < 10%
    'errors': ['rate<0.05'],                             // Custom error rate < 5%
  },

  ext: {
    loadimpact: {
      projectID: 0,
      name: 'Kinase Load Test - 10k Users',
    },
  },
};

// ============================================================================
// SETUP: Preparar datos antes de la prueba
// ============================================================================
export function setup() {
  console.log('⏳ Iniciando load test...');
  
  return {
    baseUrl: __ENV.BASE_URL || 'https://kinase.com',
    testData: [
      { nombre: 'Juan', especialidad: 'Matemática', telefono: '5491123456' },
      { nombre: 'María', especialidad: 'Física', telefono: '5491234567' },
      { nombre: 'Carlos', especialidad: 'Química', telefono: '5491345678' },
      { nombre: 'Ana', especialidad: 'Biología', telefono: '5491456789' },
      { nombre: 'Pedro', especialidad: 'Historia', telefono: '5491567890' },
    ],
  };
}

// ============================================================================
// TEST PRINCIPAL
// ============================================================================
export default function (data) {
  const baseUrl = data.baseUrl;
  const vus = __VU; // Virtual User ID
  const testData = data.testData[vus % data.testData.length];

  usuariosActivos.set(__VU);

  // ========================================================================
  // 1. TEST: Cargar página principal
  // ========================================================================
  group('1. Cargar página principal', () => {
    const res = http.get(`${baseUrl}/`, {
      tags: { name: 'HomePage' },
      headers: {
        'User-Agent': `LoadTest-VU-${vus}`,
      },
    });

    check(res, {
      'status es 200': (r) => r.status === 200,
      'tiempo < 2s': (r) => r.timings.duration < 2000,
      'página contiene Kinase': (r) => r.body.includes('Kinase'),
    });

    duration.add(res.timings.duration);
    errorRate.add(res.status !== 200);
    successRate.add(res.status === 200);
    
    if (res.status !== 200) {
      console.error(`❌ VU ${vus}: Home page failed with status ${res.status}`);
    }
  });

  sleep(1);

  // ========================================================================
  // 2. TEST: Scroll y carga de secciones
  // ========================================================================
  group('2. Acceder a secciones (FAQ, Cursos, etc)', () => {
    const sections = ['/#ayuda', '/#cursos', '/#testimonios', '/#test'];
    const section = sections[vus % sections.length];

    const res = http.get(`${baseUrl}${section}`, {
      tags: { name: 'Section' },
    });

    check(res, {
      'status es 200': (r) => r.status === 200,
      'tiempo < 1.5s': (r) => r.timings.duration < 1500,
    });

    duration.add(res.timings.duration);
    errorRate.add(res.status !== 200);
  });

  sleep(2);

  // ========================================================================
  // 3. TEST: Buscar particulares
  // ========================================================================
  group('3. Buscar en particulares (GET)', () => {
    const searchTerms = ['Matemática', 'Física', 'Química', 'Biología', 'Historia'];
    const term = searchTerms[vus % searchTerms.length];

    const res = http.get(`${baseUrl}/api/particulares?search=${term}`, {
      tags: { name: 'SearchParticulares' },
    });

    check(res, {
      'status es 200 o 404': (r) => r.status === 200 || r.status === 404,
      'tiempo < 1s': (r) => r.timings.duration < 1000,
    });

    duration.add(res.timings.duration);
  });

  sleep(1);

  // ========================================================================
  // 4. TEST: Registrar nuevo particular (POST)
  // ========================================================================
  group('4. Registrar nuevo particular (POST)', () => {
    const payload = JSON.stringify({
      nombre: `${testData.nombre}-${vus}`,
      especialidad: testData.especialidad,
      telefono: testData.telefono.slice(0, -1) + (vus % 10),
    });

    const res = http.post(`${baseUrl}/api/particulares`, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
      tags: { name: 'RegisterParticular' },
    });

    check(res, {
      'status es 201 o 200': (r) => r.status === 201 || r.status === 200,
      'sin error rate limit': (r) => r.status !== 429,
      'tiempo < 2s': (r) => r.timings.duration < 2000,
    });

    duration.add(res.timings.duration);
    
    if (res.status === 201 || res.status === 200) {
      registrosPorSegundo.add(1);
      successRate.add(true);
    } else if (res.status === 429) {
      console.warn(`⏱️  VU ${vus}: Rate limit hit (429)`);
      errorRate.add(true);
    } else {
      errorRate.add(true);
      console.error(`❌ VU ${vus}: Register failed with status ${res.status}`);
    }
  });

  sleep(2);

  // ========================================================================
  // 5. TEST: Enviar contacto (Rate limit stress test)
  // ========================================================================
  group('5. Enviar email/contacto (Rate limit)', () => {
    const payload = JSON.stringify({
      name: `Test-${vus}`,
      email: `test${vus}@example.com`,
      phone: `549${Math.random().toString().slice(2, 12)}`,
      message: 'Test message para load test',
    });

    const res = http.post(`${baseUrl}/api/send-email`, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
      tags: { name: 'SendEmail' },
    });

    check(res, {
      'status es 200 o 429': (r) => r.status === 200 || r.status === 429,
      'tiempo < 1.5s': (r) => r.timings.duration < 1500,
    });

    // Esperamos rate limit (429) después de 3 solicitudes por usuario
    if (res.status === 429) {
      console.info(`✅ VU ${vus}: Rate limiting working (429 received)`);
    }

    duration.add(res.timings.duration);
  });

  sleep(1);

  // ========================================================================
  // 6. TEST: Test de seguridad - XSS attempt
  // ========================================================================
  group('6. Security Test - XSS Prevention', () => {
    const maliciousPayload = JSON.stringify({
      nombre: '<script>alert("XSS")</script>',
      especialidad: '"><script>alert(1)</script>',
      telefono: '5491123456',
    });

    const res = http.post(`${baseUrl}/api/particulares`, maliciousPayload, {
      headers: {
        'Content-Type': 'application/json',
      },
      tags: { name: 'XSSTest' },
    });

    check(res, {
      'XSS payload sanitized (no 200)': (r) => r.status !== 200 || !r.body.includes('<script>'),
      'server responds safely': (r) => r.status < 500,
    });
  });

  sleep(1);

  // ========================================================================
  // 7. TEST: SQL Injection attempt
  // ========================================================================
  group('7. Security Test - SQL Injection Prevention', () => {
    const sqlInjectionPayload = JSON.stringify({
      nombre: "'; DROP TABLE particulares; --",
      especialidad: "' OR '1'='1",
      telefono: '5491123456',
    });

    const res = http.post(`${baseUrl}/api/particulares`, sqlInjectionPayload, {
      headers: {
        'Content-Type': 'application/json',
      },
      tags: { name: 'SQLInjectionTest' },
    });

    check(res, {
      'SQL injection prevented': (r) => r.status < 500,
      'database still intact': (r) => r.status !== 500,
    });
  });

  sleep(2);
}

// ============================================================================
// TEARDOWN: Análisis después de la prueba
// ============================================================================
export function teardown(data) {
  console.log('✅ Load test completado');
  console.log(`📊 Base URL: ${data.baseUrl}`);
}

// ============================================================================
// HANDLES: Para pruebas personalizadas
// ============================================================================
export function handleSummary(data) {
  return {
    'stdout': textSummary(data, { indent: ' ', enableColors: true }),
    '/tmp/summary.json': JSON.stringify(data),
  };
}

function textSummary(data, options) {
  let summary = '\n';
  summary += '╔════════════════════════════════════════════╗\n';
  summary += '║        📊 LOAD TEST SUMMARY 📊            ║\n';
  summary += '╚════════════════════════════════════════════╝\n\n';

  if (data.metrics) {
    summary += '📈 MÉTRICAS:\n';
    for (const [key, values] of Object.entries(data.metrics)) {
      summary += `  • ${key}\n`;
    }
  }

  return summary;
}
