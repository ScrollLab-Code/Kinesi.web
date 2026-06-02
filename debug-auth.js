#!/usr/bin/env node

/**
 * DEBUG - Verificar configuración de autenticación
 * Este script ayuda a diagnosticar problemas de login
 */

import { createClient } from '@supabase/supabase-js';
import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (prompt) => new Promise(resolve => rl.question(prompt, resolve));

async function main() {
  console.log(`\n🔐 DEBUG DE AUTENTICACIÓN - Kinase Academy\n`);
  console.log('Este script ayuda a diagnosticar problemas de login.\n');

  // Solicitar credenciales de Supabase
  const supabaseUrl = await question('📍 URL de Supabase (ej: https://xxxxxxxxxxx.supabase.co): ');
  const supabaseKey = await question('🔑 Clave anón de Supabase: ');

  if (!supabaseUrl || !supabaseKey) {
    console.log('\n❌ Faltan credenciales de Supabase\n');
    rl.close();
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log('\n⏳ Verificando conexión...\n');

  // 1. Verificar conexión
  try {
    const { data, error } = await supabase.from('users').select('count', { count: 'exact', head: true });
    if (error) {
      console.log('❌ No se puede conectar a Supabase');
      console.log('   Error:', error.message);
      rl.close();
      return;
    }
    console.log('✅ Conexión exitosa\n');
  } catch (err) {
    console.log('❌ Error de conexión:', err.message);
    rl.close();
    return;
  }

  // 2. Contar usuarios registrados
  try {
    const { count, error } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.log('⚠️  No se puede leer tabla de usuarios');
      console.log('   Necesitas ejecutar: supabase/auth-users-setup.sql\n');
    } else {
      console.log(`📊 Usuarios registrados: ${count || 0}\n`);
    }
  } catch (err) {
    console.log('⚠️  Tabla de usuarios no existe\n');
  }

  // 3. Probar registro
  console.log('🧪 Probando registro...\n');
  const testEmail = `test-${Date.now()}@ejemplo.com`;
  const testPassword = 'Test@1234567';

  try {
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: { name: 'Usuario de Prueba' }
      }
    });

    if (signUpError) {
      console.log('❌ Error en registro:', signUpError.message);
      rl.close();
      return;
    }

    console.log('✅ Registro exitoso');
    console.log(`   Email: ${testEmail}`);
    console.log(`   Usuario ID: ${signUpData.user?.id}\n`);

    // 4. Probar login
    console.log('🧪 Probando login...\n');
    
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword
    });

    if (loginError) {
      console.log('❌ Error en login:', loginError.message);
      console.log('\n   PROBLEMAS POSIBLES:');
      console.log('   1. Email no confirmado (requiere confirmar link)');
      console.log('   2. Supabase está verificando emails por defecto');
      console.log('   3. Deshabilita "Email verification" en Supabase > Auth > Providers > Email\n');
      rl.close();
      return;
    }

    console.log('✅ Login exitoso');
    console.log(`   Token: ${loginData.session?.access_token?.substring(0, 20)}...`);
    console.log(`   Sesión activa: ${loginData.session?.user?.email}\n`);

    // 5. Limpiar (eliminar usuario de prueba)
    console.log('🧹 Limpiando usuario de prueba...\n');
    
    const { error: deleteError } = await supabase.auth.admin.deleteUser(signUpData.user.id);
    if (!deleteError) {
      console.log('✅ Usuario de prueba eliminado\n');
    }

  } catch (err) {
    console.log('❌ Error:', err.message, '\n');
  }

  console.log('═══════════════════════════════════════════════════════');
  console.log('📋 CHECKLIST DE CONFIGURACIÓN:\n');
  console.log('✅ Asegúrate de ejecutar: supabase/auth-users-setup.sql');
  console.log('✅ Desabilita email verification en Supabase Dashboard');
  console.log('✅ Verifica que VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY estén en .env');
  console.log('✅ Reinicia el servidor de desarrollo (npm run dev)\n');
  console.log('═══════════════════════════════════════════════════════\n');

  rl.close();
}

main().catch(console.error);
