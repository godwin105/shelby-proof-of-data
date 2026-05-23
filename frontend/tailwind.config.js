const withOpacity = (name) => ({ opacityValue }) => {
  if (opacityValue === undefined) return `rgb(var(${name}))`;
  return `rgb(var(${name}) / ${opacityValue})`;
};

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
          bg: withOpacity("--bg"),
          surface: withOpacity("--surface"),
          surface2: withOpacity("--surface-2"),
          border: withOpacity("--border"),
          accent: withOpacity("--accent"),
          accent2: withOpacity("--accent"),
          onAccent: withOpacity("--on-accent"),
          text: withOpacity("--text"),
          muted: withOpacity("--muted"),
          success: withOpacity("--accent"),
          error: withOpacity("--error"),
          warning: withOpacity("--warning"),
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
