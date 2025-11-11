/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      appearance: [
        "none",
        "button",
        "textfield",
        "checkbox",
        "radio",
        "progressbar",
        "meter",
        "button-arrow-down",
        "button-arrow-up",
      ],
    },
  },
  plugins: [],
};
