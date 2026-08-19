import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        google: {
          blue: "#1A73E8",
          red: "#EA4335",
          yellow: "#FBBC04",
          green: "#34A853",
        },
        surface: "#FFFFFF",
        canvas: "#F8F9FA",
        ink: {
          DEFAULT: "#202124",
          soft: "#5F6368",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Roboto", "Arial", "sans-serif"],
      },
      borderRadius: {
        "4xl": "1.75rem",
        "5xl": "2.25rem",
      },
      boxShadow: {
        elevate: "0 1px 2px 0 rgba(60,64,67,0.08), 0 2px 8px 2px rgba(60,64,67,0.06)",
        "elevate-lg": "0 2px 6px 0 rgba(60,64,67,0.10), 0 8px 24px 4px rgba(60,64,67,0.10)",
      },
      keyframes: {
        rainbow: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" },
        },
        ripple: {
          "0%": { transform: "scale(0)", opacity: "0.45" },
          "100%": { transform: "scale(2.5)", opacity: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
      },
      animation: {
        rainbow: "rainbow 2s linear infinite",
        ripple: "ripple 0.6s ease-out",
        "fade-in": "fade-in 0.4s ease-out both",
        blink: "blink 1s step-start infinite",
      },
      backgroundSize: {
        "rainbow-size": "200% 100%",
      },
    },
  },
  plugins: [],
};

export default config;
