/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  darkMode: "class",
  theme: {
    screens: {
      sm: "768px",
      md: "1440px",
    },
    colors: {
      transparent: "transparent",
      black: "#000112",
      "dark-bg": "#20212c",
      "dark-gray": "#2b2c37",
      "dark-lines": "#3e3f4e",
      "medium-gray": "#828fa3",
      "light-lines": "#e4ebfa",
      "light-bg": "#f4f7fd",
      white: "#fff",
      purple: "#635fc7",
      "purple-hover": "#a8a4ff",
      "secondary-button": "hsl(242, 48%, 58%, .1)",
      "secondary-button-hover": "hsl(242, 48%, 58%, .25)",
      red: "#ea5555",
      "red-hover": "#ff9898",
      blue: "#49c4e5",
      green: "#67e2ae",
      violet: "#8471f2",
      input: "hsl(216, 15%, 57%, .25)",
    },
    fontSize: {
      xl: "24px",
      lg: "18px",
      md: "15px",
      sm: "13px",
      xs: "12px",
    },
    lineHeight: {
      xl: "30px",
      lg: "23px",
      md: "19px",
      sm: "15px",
    },
    letterSpacing: {
      sm: "2.4px",
    },
    fontFamily: {
      sans: "Plus Jakarta Sans, sans-serif",
    },
    extend: {},
  },
  plugins: [],
};
