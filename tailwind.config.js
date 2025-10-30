/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        rahaBlue: "#005086",
        rahaGreen: "#10A245",
        rahaBlack: "#000000",
      },
    },
  },
  plugins: [],
};
