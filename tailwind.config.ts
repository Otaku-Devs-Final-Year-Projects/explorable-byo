import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Direct font reference instead of variables
        serif: ['"Playfair Display"', "serif"],
        sans: ['"Manrope"', "sans-serif"],
      },
      colors: {
        "hotel-black": "#1C1C1C",
        "hotel-bronze": "#C5A880",
        "hotel-cream": "#FAF8F5",
        "hotel-sand": "#E6E0D5",
        "hotel-brown": "#5A4C40",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
      animation: {
        "fade-in-up": "fadeInUp 1s ease-out forwards",
        "slow-pan": "slowPan 30s linear infinite alternate",
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slowPan: {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.15)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
