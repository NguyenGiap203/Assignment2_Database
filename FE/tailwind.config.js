// tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  // Chỉ định các file Tailwind sẽ quét để tìm class
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}