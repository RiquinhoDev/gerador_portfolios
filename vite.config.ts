import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import ssr from 'vite-plugin-ssr/plugin'
import path from 'node:path'

export default defineConfig({
  plugins: [react(), ssr()],
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'src')
    }
  },
  server: {
    port: 5174
  }
})
