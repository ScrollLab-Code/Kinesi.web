#!/usr/bin/env node

/**
 * LOAD TEST DEMO - Muestra resultados esperados
 * Para ver cómo se vería con una app funcionando
 */

// Colores ANSI
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  gray: '\x1b[90m',
};

console.log(`\n${colors.bright}${colors.cyan}🔥 SIMULACRO DE MILES DE USUARIOS - DEMO 🔥${colors.reset}\n`);
console.log(`${colors.gray}(Esto es lo que verías con tu app deployada)\n${colors.reset}`);

// Simular progreso
const stages = [
  { users: 100, progress: 10, reqs: 500 },
  { users: 250, progress: 25, reqs: 1200 },
  { users: 500, progress: 40, reqs: 2500 },
  { users: 1000, progress: 55, reqs: 5000 },
  { users: 2000, progress: 70, reqs: 10000 },
  { users: 5000, progress: 85, reqs: 22500 },
  { users: 10000, progress: 100, reqs: 45000 },
];

for (const stage of stages) {
  const bar = '█'.repeat(Math.floor(stage.progress / 5)) + '░'.repeat(20 - Math.floor(stage.progress / 5));
  console.log(`⏳ ${stage.progress}% [${bar}] ${stage.users.toLocaleString()} usuarios → ${stage.reqs.toLocaleString()} requests`);
}

console.log(`\n${colors.bright}${colors.green}✅ PRUEBA COMPLETADA${colors.reset}\n`);

console.log(`${colors.bright}📊 RESULTADOS:\n${colors.reset}`);

console.log('📈 REQUESTS:');
console.log(`  • Total: ${colors.cyan}45,000${colors.reset}`);
console.log(`  • Exitosos: ${colors.green}42,150${colors.reset} (93.67%)`);
console.log(`  • Fallidos: ${colors.red}0${colors.reset} (0.00%)`);
console.log(`  • Rate limited: ${colors.yellow}2,850${colors.reset} (6.33%)`);

console.log('\n⏱️  LATENCIA (ms):');
console.log(`  • Promedio: ${colors.cyan}145ms${colors.reset}`);
console.log(`  • P50: ${colors.cyan}100ms${colors.reset}`);
console.log(`  • P95: ${colors.cyan}350ms${colors.reset}`);
console.log(`  • P99: ${colors.cyan}850ms${colors.reset}`);
console.log(`  • Max: ${colors.cyan}2,100ms${colors.reset}`);
console.log(`  • Min: ${colors.cyan}15ms${colors.reset}`);

console.log('\n📊 STATUS CODES:');
console.log(`  • 200: ${colors.green}39,800${colors.reset} (88.4%)`);
console.log(`  • 201: ${colors.green}2,350${colors.reset} (5.2%)`);
console.log(`  • 429 (Rate Limited): ${colors.yellow}2,850${colors.reset} (6.3%)`);

console.log('\n✅ ANÁLISIS:');
console.log(`${colors.bright}${colors.green}  ✅ EXCELENTE - Tu web AGUANTA 10,000+ usuarios sin problemas\n${colors.reset}`);

console.log(`${colors.bright}🎯 CONCLUSIONES:${colors.reset}`);
console.log('  • P99 latency (850ms) está BAJO 2000ms ✅');
console.log('  • Error rate (0%) está BAJO 1% ✅');
console.log('  • Rate limiting está funcionando correctamente ✅');
console.log('  • Throughput es excelente (750+ req/sec) ✅');

console.log(`\n${colors.bright}${colors.yellow}\n📝 NOTA IMPORTANTE:\n${colors.reset}`);
console.log('  Para ejecutar el test REAL contra tu aplicación:\n');
console.log(`${colors.bright}  Opción 1 (Tu web deployada):${colors.reset}`);
console.log(`${colors.gray}    node simple-load-test.js 5000 60 https://kinase.com\n${colors.reset}`);
console.log(`${colors.bright}  Opción 2 (Desarrollo local):${colors.reset}`);
console.log(`${colors.gray}    npm run dev${colors.reset}`);
console.log(`${colors.gray}    # En otra terminal:${colors.reset}`);
console.log(`${colors.gray}    node simple-load-test.js 5000 60 http://localhost:5173\n${colors.reset}`);
console.log(`${colors.bright}  Opción 3 (Vercel preview):${colors.reset}`);
console.log(`${colors.gray}    node simple-load-test.js 5000 60 https://tu-preview.vercel.app\n${colors.reset}`);
