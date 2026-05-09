/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Syne'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
        body: ["'DM Sans'", "sans-serif"],
      },
      colors: {
        shelby: {
          bg: "#0A0D0F",
          surface: "#111518",
          border: "#1E2428",
          accent: "#00E5CC",
          accent2: "#0066FF",
          text: "#E8EDF2",
          muted: "#5A6A78",
          success: "#00C896",
          error: "#FF4D6A",
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
          from: { boxShadow: "0 0 10px #00E5CC33" },
          to: { boxShadow: "0 0 28px #00E5CC66, 0 0 60px #00E5CC22" },
        },
      },
    },
  },
  plugins: [],
};
