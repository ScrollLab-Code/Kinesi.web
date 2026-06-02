/**
 * LOAD TEST CON AUTOCANNON (Node.js)
 * Alternativa más simple a k6
 * 
 * Instalar: npm install -g autocannon
 * Ejecutar: node load-test-autocannon.js
 */

import autocannon from 'autocannon';
import chalk from 'chalk';

const BASE_URL = process.env.BASE_URL || 'https://kinase.com';

console.log(chalk.bold.cyan('\n🚀 INICIANDO LOAD TEST CON AUTOCANNON\n'));
console.log(chalk.gray(`📍 URL: ${BASE_URL}`));
console.log(chalk.gray(`⏱️  Duración: 60 segundos\n`));

const results = await autocannon({
  url: BASE_URL,
  
  // ========================================================================
  // CONFIGURACIÓN DE CARGA
  // ========================================================================
  connections: 1000,          // 1000 conexiones simultáneas
  pipelining: 10,             // 10 requests por conexión
  duration: 60,               // 60 segundos
  
  // ========================================================================
  // RUTAS A PROBAR
  // ========================================================================
  requests: [
    // Página principal
    {
      path: '/',
      method: 'GET',
      weight: 30, // 30% de los requests
    },
    
    // Buscar particulares
    {
      path: '/api/particulares?search=Matematica',
      method: 'GET',
      weight: 20,
    },
    
    // Registrar particular
    {
      path: '/api/particulares',
      method: 'POST',
      body: JSON.stringify({
        nombre: 'Test User',
        especialidad: 'Matemática',
        telefono: '5491234567',
      }),
      weight: 25,
      setupClient: (client) => {
        client.setHeader('Content-Type', 'application/json');
      },
    },
    
    // Enviar email
    {
      path: '/api/send-email',
      method: 'POST',
      body: JSON.stringify({
        name: 'Test',
        email: 'test@example.com',
        phone: '5491234567',
        message: 'Test message',
      }),
      weight: 15,
      setupClient: (client) => {
        client.setHeader('Content-Type', 'application/json');
      },
    },
    
    // XSS attempt
    {
      path: '/api/particulares',
      method: 'POST',
      body: JSON.stringify({
        nombre: '<script>alert("xss")</script>',
        especialidad: 'Hack',
        telefono: '5491234567',
      }),
      weight: 5,
      setupClient: (client) => {
        client.setHeader('Content-Type', 'application/json');
      },
    },
    
    // SQL Injection attempt
    {
      path: '/api/particulares',
      method: 'POST',
      body: JSON.stringify({
        nombre: "'; DROP TABLE particulares; --",
        especialidad: 'SQL',
        telefono: '5491234567',
      }),
      weight: 5,
      setupClient: (client) => {
        client.setHeader('Content-Type', 'application/json');
      },
    },
  ],
  
  // ========================================================================
  // VALIDACIÓN
  // ========================================================================
  setupClient: (client) => {
    client.on('response', (statusCode, resBytes, responseTime) => {
      if (statusCode === 429) {
        console.log(chalk.yellow(`⏱️  Rate limit hit (429) - Good! Protección activa`));
      }
    });
  },
});

// ========================================================================
// ANÁLISIS DE RESULTADOS
// ========================================================================
printResults(results);

function printResults(results) {
  console.log(chalk.bold.green('\n\n╔════════════════════════════════════════════╗'));
  console.log(chalk.bold.green('║      📊 RESULTADOS DEL LOAD TEST 📊       ║'));
  console.log(chalk.bold.green('╚════════════════════════════════════════════╝\n'));

  // Requests
  console.log(chalk.bold('📈 REQUESTS:'));
  console.log(`  • Total: ${chalk.cyan(results.requests.total)}`);
  console.log(`  • Promedio/seg: ${chalk.cyan(results.requests.mean.toFixed(2))}`);
  console.log(`  • Min: ${chalk.cyan(results.requests.min)}`);
  console.log(`  • Max: ${chalk.cyan(results.requests.max)}`);
  
  // Latency
  console.log(chalk.bold('\n⏱️  LATENCIA (ms):'));
  console.log(`  • Promedio: ${chalk.cyan(results.latency.mean.toFixed(2))}ms`);
  console.log(`  • P50: ${chalk.cyan(results.latency.p50)}ms`);
  console.log(`  • P95: ${chalk.cyan(results.latency.p95)}ms`);
  console.log(`  • P99: ${chalk.cyan(results.latency.p99)}ms`);
  console.log(`  • Max: ${chalk.cyan(results.latency.max)}ms`);

  // Throughput
  console.log(chalk.bold('\n📤 THROUGHPUT:'));
  console.log(`  • Avg: ${chalk.cyan((results.throughput.mean / 1024).toFixed(2))} KB/s`);
  console.log(`  • Max: ${chalk.cyan((results.throughput.max / 1024).toFixed(2))} KB/s`);

  // Errores
  console.log(chalk.bold('\n🔴 ERRORES:'));
  const totalRequests = results.requests.total;
  const errorCount = results.errors || 0;
  const errorRate = ((errorCount / totalRequests) * 100).toFixed(2);
  
  if (errorCount > 0) {
    console.log(chalk.red(`  • Total: ${errorCount}`));
    console.log(chalk.red(`  • Rate: ${errorRate}%`));
  } else {
    console.log(chalk.green(`  • Total: 0 ✅`));
    console.log(chalk.green(`  • Rate: 0% ✅`));
  }

  // Status codes
  if (results.statusCodeStats) {
    console.log(chalk.bold('\n📊 STATUS CODES:'));
    for (const [code, count] of Object.entries(results.statusCodeStats)) {
      const percentage = ((count / totalRequests) * 100).toFixed(1);
      if (code === '200') {
        console.log(`  • ${code}: ${chalk.green(count)} (${percentage}%)`);
      } else if (code === '429') {
        console.log(`  • ${code} (Rate Limited): ${chalk.yellow(count)} (${percentage}%)`);
      } else if (code.startsWith('4') || code.startsWith('5')) {
        console.log(`  • ${code}: ${chalk.red(count)} (${percentage}%)`);
      } else {
        console.log(`  • ${code}: ${chalk.cyan(count)} (${percentage}%)`);
      }
    }
  }

  // Resumen
  console.log(chalk.bold('\n✅ RESUMEN:'));
  if (results.latency.p99 < 2000 && errorRate < 5) {
    console.log(chalk.green(`  ✅ Rendimiento EXCELENTE - Listo para producción`));
  } else if (results.latency.p99 < 3000 && errorRate < 10) {
    console.log(chalk.yellow(`  ⚠️  Rendimiento BUENO - Puede mejorar`));
  } else {
    console.log(chalk.red(`  ❌ Rendimiento POBRE - Necesita optimización`));
  }

  console.log(chalk.gray('\n\nPara más información: https://autocannon.tech/\n'));
}
