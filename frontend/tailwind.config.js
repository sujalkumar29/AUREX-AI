/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core Palette requested by User:
        midnight: {
          DEFAULT: "#14231F",
          50: "#F2F5F4",
          100: "#E2E8E6",
          200: "#C4D0CC",
          300: "#8FA49D",
          400: "#4D6B62",
          500: "#2B433C",
          600: "#1E322C",
          700: "#182924",
          800: "#14231F", // Midnight Green (Signature)
          900: "#0D1815",
          950: "#080F0D",
        },
        slate: {
          deep: "#202C35", // Deep Slate
          card: "#192229",
          border: "#2A3843",
        },
        offwhite: {
          DEFAULT: "#F3F5F2", // Cool Off-White
          pure: "#FFFFFF",
          muted: "#E8ECE6",
          dark: "#D7DDD5",
        },
        teal: {
          muted: "#71958C", // Muted Teal
          light: "#8AAEA5",
          dark: "#54736C",
          glow: "rgba(113, 149, 140, 0.25)",
        },
        silver: {
          DEFAULT: "#DCE2DE", // Soft Silver
          light: "#EAEFEA",
          dark: "#B8C1BC",
        },
        charcoal: {
          DEFAULT: "#242B2A", // Charcoal
          50: "#323B3A",
          100: "#242B2A",
          200: "#1C2221",
          300: "#131716",
        },
        // Semantic indicator tokens:
        signal: {
          emerald: "#2E856E",
          emeraldLight: "#E6F4F0",
          crimson: "#B34033",
          crimsonLight: "#FBEBE9",
          amber: "#C28629",
          amberLight: "#FBF3E6",
        },
      },
      fontFamily: {
        sans: ["Manrope", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        serif: ["Instrument Serif", "Georgia", "serif"],
        mono: ["JetBrains Mono", "SF Mono", "Menlo", "Consolas", "monospace"],
      },
      borderRadius: {
        sm: "2px",
        DEFAULT: "4px",
        md: "6px",
        lg: "8px",
        xl: "12px",
        "2xl": "16px",
      },
      boxShadow: {
        technical: "0 1px 3px 0 rgba(0, 0, 0, 0.2), 0 1px 2px -1px rgba(0, 0, 0, 0.2)",
        elevation: "0 8px 32px -4px rgba(12, 20, 18, 0.4)",
        glowMuted: "0 0 24px -4px rgba(113, 149, 140, 0.18)",
      },
    },
  },
  plugins: [],
};
