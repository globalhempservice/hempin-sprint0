cat > tailwind.config.js <<'JS'
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: { extend: {} },
  plugins: []
}
JS

cat > postcss.config.js <<'JS'
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
}
JS