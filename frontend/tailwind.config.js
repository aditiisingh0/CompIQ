/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ["'JetBrains Mono'", "monospace"],
        display: ["'Clash Display'", "sans-serif"],
        body: ["'Satoshi'", "sans-serif"],
      },
      colors: {
        ink: "#0A0A0F",
        surface: "#111118",
        panel: "#17171F",
        border: "#252533",
        muted: "#3A3A4D",
        subtle: "#6B6B8A",
        accent: "#7C6FFF",
        "accent-hot": "#FF5F6D",
        "accent-green": "#00D48A",
        "accent-amber": "#FFB800",
        "text-primary": "#F0F0F8",
        "text-secondary": "#9090B0",
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(rgba(124,111,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(124,111,255,0.05) 1px, transparent 1px)",
      },
      backgroundSize: {
        "grid-size": "40px 40px",
      },
    },
  },
  plugins: [],
};
