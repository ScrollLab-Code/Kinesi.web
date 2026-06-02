/**
 * VITE CONFIG - OPTIMIZACIÓN PARA PERFORMANCE
 * Soportar 10k+ usuarios simultáneos
 */

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  
  // ========================================================================
  // BUILD OPTIMIZATION
  // ========================================================================
  build: {
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    
    // Code splitting
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks separados
          'vendor-react': ['react', 'react-dom'],
          'vendor-ui': ['framer-motion'],
          'vendor-supabase': ['@supabase/supabase-js'],
          'vendor-mp': ['@mercadopago/sdk-react'],
        },
      },
    },
    
    // Reportar tamaño de bundle
    reportCompressedSize: true,
    
    // CSS splitting
    cssCodeSplit: true,
    
    // Source maps solo en desarrollo
    sourcemap: process.env.NODE_ENV === 'production' ? false : 'inline',
    
    // Chunk size warning
    chunkSizeWarningLimit: 500,
  },

  // ========================================================================
  // DEV SERVER
  // ========================================================================
  server: {
    middlewareMode: false,
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
    },
  },

  // ========================================================================
  // OPTIMIZACIONES DE CACHÉ
  // ========================================================================
  preview: {
    headers: {
      'Cache-Control': 'public, max-age=3600',
    },
  },

  // ========================================================================
  // RESOLVER
  // ========================================================================
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
      '@hooks': '/src/hooks',
      '@lib': '/src/lib',
      '@sections': '/src/sections',
    },
  },
});
