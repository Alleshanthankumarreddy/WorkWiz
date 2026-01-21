import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // <-- Make sure your new component is inside src
  ],
  plugins: [
    tailwindcss(),
  ],
})