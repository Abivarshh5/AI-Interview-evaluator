/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: "#0f172a",        // dark navy
        primary: "#0ea5e9",      // cyan-ish
        accent: "#2563eb",       // blue
        softbg: "#f8fafc"
      },
      boxShadow: {
        soft: "0 6px 18px rgba(15,23,42,0.08)"
      }
    }
  },
  plugins: []
};
