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
    /** true = 监听 0.0.0.0，可用本机局域网 IP（如 http://192.168.x.x:5174）访问 */
    host: true,
    port: 5174,
    proxy: {
      '/system-api': {
        // target: 'http://172.22.71.96:9080',
        target: 'http://192.168.192.2:9091',
        // target: 'http://192.168.18.22:9091',//ztx
        // target: 'http://192.168.18.118:9091',//wzg
        changeOrigin: true,
      },
      '/prime-api': {
        target: 'http://192.168.192.177:9092',
        // target: 'http://172.22.71.96:9080',
        // target: 'http://192.168.192.72:9092',
        // target: 'http://192.168.18.22:9092',//ztx
        // target: 'http://192.168.18.118:9092',//wzg
        changeOrigin: true,
      },
    },
  },
})
