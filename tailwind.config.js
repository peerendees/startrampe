/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html", "./public/*.html"],
  theme: {
    extend: {
      colors: {
        berent: {
          primary: "#80331A",
          "primary-hover": "#A0522D",
          accent: "#D6B366",
        },
      },
    },
  },
  plugins: [],
};
