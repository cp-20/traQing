import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
    cors: {
      origin: [
        /localhost(:\d+)?$/,
        /((.+)\.)?trap\.jp$/,
        /((.+)\.)?trap\.show$/,
        /((.+)\.)?trap\.games$/,
        /((.+)\.)?cp20\.dev$/,
      ],
      methods: 'GET, POST, OPTIONS',
      allowedHeaders: 'Content-Type, Cookie',
      // maxAge: 86400,
      credentials: true,
    },
  },
  resolve: {
    alias: {
      '@tabler/icons-react': '@tabler/icons-react/dist/esm/icons/index.mjs',
    },
  },
});
