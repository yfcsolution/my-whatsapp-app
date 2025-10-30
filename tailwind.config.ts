import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
      },
      colors: {
        whatsapp: {
          green: "#25D366",
          "green-dark": "#128C7E",
          "green-light": "#DCF8C6",
          teal: "#075E54",
          "blue-light": "#34B7F1",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
