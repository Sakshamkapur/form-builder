/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          dark: "#2E382E",
          teal: "#50C9CE",
          blue: "#72A1E5",
          purple: "#9883E5",
          pink: "#FCD3DE",
        },
      },
    },
  },
  plugins: [],
};
