import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { createHtmlPlugin } from "vite-plugin-html";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
  createHtmlPlugin({
    pages: [
      {
        template: 'index.html',
        filename: 'index.html',
        injectOptions: {
          data: {
            buildTime: new Date().toLocaleString()
          }
        }
      }
    ]
  })
  ],
  server: {
    /** 仅监听本机访问 */
    host: 'localhost',
    port: 5174,
    proxy: {
      '/system-api': {
        // target: 'http://localhost:9091',
        target: 'http://localhost:9091',
        // target: 'http://localhost:9091',//ztx
        // target: 'http://localhost:9091',//wzg
        changeOrigin: true,
      },
      '/prime-api': {
        target: 'http://localhost:9092',
        // target: 'http://localhost:9092',
        // target: 'http://localhost:9092',
        // target: 'http://localhost:9092',//ztx
        // target: 'http://localhost:9092',//wzg
        changeOrigin: true,
      },
    },
  },
})
