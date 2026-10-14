/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        stone: {
          50: "#F6F3EE",
          100: "#EFEAE1",
          200: "#E4DFD3",
        },
        ink: {
          DEFAULT: "#211F1C",
          soft: "#4A463F",
        },
        bronze: {
          DEFAULT: "#8A7B5C",
          dark: "#6E6248",
        },
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        sans: ["\"Work Sans\"", "sans-serif"],
      },
      maxWidth: {
        prose: "68ch",
      },
    },
  },
  plugins: [],
};
