// import { defineConfig } from 'vite'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react({ include: /\.(js|jsx|ts|tsx)$/ })],
})

declare module 'vite';
declare module '@vitejs/plugin-react';