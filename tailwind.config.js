/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        DSEG7_MODERN: ["DSEG7-MODERN", "sans-serif"],
        DSEG7_CLASSIC: ["DSEG7-CLASSIC", "sans-serif"],
      },
    },
  },
  plugins: [],
};
