import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const categoryIndex = resolve(__dirname, 'public/category-index.json');

export default defineConfig({
  publicDir: false,
  plugins: [
    react(),
    {
      name: 'category-index',
      configureServer(server) {
        server.middlewares.use('/category-index.json', (_request, response) => {
          response.setHeader('Content-Type', 'application/json');
          response.end(readFileSync(categoryIndex));
        });
      },
      generateBundle() {
        this.emitFile({
          type: 'asset',
          fileName: 'category-index.json',
          source: readFileSync(categoryIndex),
        });
      },
    },
  ],
});
