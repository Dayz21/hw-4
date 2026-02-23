import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/App'),
      "@components": path.resolve(__dirname, './src/App/components'),
      "@config": path.resolve(__dirname, './src/App/config'),
      "@styles": path.resolve(__dirname, './src/App/styles'),
      "@utils": path.resolve(__dirname, './src/App/utils')
    },
  },
})