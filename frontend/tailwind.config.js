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
        // Strict Monochromatic Enterprise System:
        mono: {
          black: "#000000",
          deep: "#090909",
          surface: "#111111",
          elevated: "#181818",
          border: "#292929",
          muted: "#777777",
          secondary: "#A1A1A1",
          light: "#D4D4D4",
          white: "#FFFFFF",
          offwhite: "#F5F5F5",
        },
        // Universal color aliases mapped strictly to monochrome
        black: "#000000",
        white: "#FFFFFF",
        midnight: {
          DEFAULT: "#000000",
          50: "#F5F5F5",
          100: "#E5E5E5",
          200: "#D4D4D4",
          300: "#A1A1A1",
          400: "#777777",
          500: "#555555",
          600: "#333333",
          700: "#292929",
          800: "#181818",
          900: "#111111",
          950: "#090909",
        },
        slate: {
          deep: "rgba(18, 18, 18, 0.75)",
          card: "rgba(24, 24, 24, 0.75)",
          border: "rgba(255, 255, 255, 0.1)",
        },
        offwhite: {
          DEFAULT: "#F5F5F5",
          pure: "#FFFFFF",
          muted: "#D4D4D4",
          dark: "#A1A1A1",
        },
        teal: {
          muted: "#D4D4D4",
          light: "#FFFFFF",
          dark: "#A1A1A1",
          glow: "rgba(255, 255, 255, 0.15)",
        },
        silver: {
          DEFAULT: "#A1A1A1",
          light: "#D4D4D4",
          dark: "#777777",
        },
        charcoal: {
          DEFAULT: "rgba(24, 24, 24, 0.8)",
          50: "#292929",
          100: "#181818",
          200: "#111111",
          300: "#090909",
        },
        signal: {
          emerald: "#FFFFFF",
          emeraldLight: "rgba(255, 255, 255, 0.08)",
          crimson: "#D4D4D4",
          crimsonLight: "rgba(255, 255, 255, 0.04)",
          amber: "#A1A1A1",
          amberLight: "rgba(255, 255, 255, 0.06)",
        },
      },
      fontFamily: {
        sans: ["Inter", "Geist", "Manrope", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        mono: ["Geist Mono", "JetBrains Mono", "SF Mono", "Menlo", "Consolas", "monospace"],
      },
      borderRadius: {
        sm: "3px",
        DEFAULT: "6px",
        md: "8px",
        lg: "10px",
        xl: "14px",
        "2xl": "18px",
      },
      boxShadow: {
        technical: "0 1px 3px 0 rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.08)",
        elevation: "0 12px 40px -10px rgba(0, 0, 0, 0.85), 0 0 0 1px rgba(255, 255, 255, 0.1)",
        subtleWhite: "0 0 25px -5px rgba(255, 255, 255, 0.08)",
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.45), inset 0 1px 0 0 rgba(255, 255, 255, 0.08)",
        glassHover: "0 16px 44px 0 rgba(0, 0, 0, 0.65), 0 0 24px 0 rgba(255, 255, 255, 0.08), inset 0 1px 0 0 rgba(255, 255, 255, 0.2)",
        glassElevated: "0 20px 50px 0 rgba(0, 0, 0, 0.8), inset 0 1px 0 0 rgba(255, 255, 255, 0.14)",
        glassGlow: "0 0 30px -5px rgba(255, 255, 255, 0.15), inset 0 1px 0 0 rgba(255, 255, 255, 0.2)",
        glassInner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.7)",
      },
      keyframes: {
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: 0.4, transform: "scale(1)" },
          "50%": { opacity: 0.8, transform: "scale(1.02)" },
        },
      },
      animation: {
        shimmer: "shimmer 3s infinite",
        pulseGlow: "pulseGlow 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
