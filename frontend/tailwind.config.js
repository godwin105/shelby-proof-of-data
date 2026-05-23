/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Cormorant Garamond'", "serif"],
        mono: ["'JetBrains Mono'", "monospace"],
        body: ["'Inter'", "sans-serif"],
      },
      colors: {
        shelby: {
          bg: "#050506",
          surface: "#0B0B0E",
          surface2: "#121218",
          border: "#26242D",
          accent: "#FF7AD9",
          accent2: "#B98CFF",
          text: "#F5F2F6",
          muted: "#92909C",
          success: "#FF7AD9",
          error: "#FF5F7D",
          warning: "#F0B866",
        },
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-in": "fadeIn 0.5s ease forwards",
        "slide-up": "slideUp 0.4s ease forwards",
        "glow": "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: {
          from: { opacity: 0, transform: "translateY(16px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        glow: {
          from: { boxShadow: "0 0 10px #FF7AD933" },
          to: { boxShadow: "0 0 28px #FF7AD966, 0 0 60px #FF7AD922" },
        },
      },
    },
  },
  plugins: [],
};
