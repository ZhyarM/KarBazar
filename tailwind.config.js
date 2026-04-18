/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  safelist: [
    { pattern: /w-(4|6|8|10|12)/ },
    { pattern: /h-(4|6|8|10|12)/ },
    { pattern: /border-(blue|green|red|white)-500/ },
  ],

  theme: {
    extend: {},
  },
  plugins: [],
};
