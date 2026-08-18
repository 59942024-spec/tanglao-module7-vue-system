import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: '/tanglao-module7-vue-system/', // ✅ MUST MATCH YOUR REPO NAME!
})