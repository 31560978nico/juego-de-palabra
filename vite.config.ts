// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })

import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [ tailwindcss(),],
  
})
// module.exports = {
//   content: [
//     './index.html',
//     './src/**/*.{js,ts,jsx,tsx}',
//   ],
//   safelist: [
//     'bg-green-500',
//     'bg-yellow-400',
//     'bg-gray-400',
//     'text-white',
//     'text-black',
//   ],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }