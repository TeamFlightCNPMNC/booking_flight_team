/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      height: {
        "custom-height": "140px",
      },
      gridTemplateColumns: {},
      animation: { "bounce-hozi": "bounce-hozi 1s infinite" },
      keyframes: {
        "bounce-hozi": {
          "0%, 100%": { transform: "translateX(25%)" },
          "50%": { transform: "translateX(-25%)" },
        },
      },
      animation: {
        progress: "progressMove 2s linear infinite",
      },
      keyframes: {
        progressMove: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(calc(100% + 60px))" },
        },
      },
    },
  },
  plugins: [
    require("tailwind-scrollbar"),
    function ({ addUtilities }) {
      const newUtilities = {
        ".no-scrollbar::-webkit-scrollbar": {
          display: "none",
        },
        ".no-crollbar": {
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
        },
      };
      addUtilities(newUtilities);
    },
  ],
};
