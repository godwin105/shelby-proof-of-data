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
          bg: "#070B0D",
          surface: "#101619",
          surface2: "#151D22",
          border: "#223039",
          accent: "#13E7CF",
          accent2: "#2F80FF",
          text: "#EDF6F8",
          muted: "#81919E",
          success: "#00C896",
          error: "#FF4D6A",
          warning: "#F5B84B",
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
