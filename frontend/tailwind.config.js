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
          deep: "#111111",
          card: "#181818",
          border: "#292929",
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
          glow: "rgba(255, 255, 255, 0.12)",
        },
        silver: {
          DEFAULT: "#A1A1A1",
          light: "#D4D4D4",
          dark: "#777777",
        },
        charcoal: {
          DEFAULT: "#181818",
          50: "#292929",
          100: "#181818",
          200: "#111111",
          300: "#090909",
        },
        signal: {
          emerald: "#FFFFFF",
          emeraldLight: "#181818",
          crimson: "#D4D4D4",
          crimsonLight: "#111111",
          amber: "#A1A1A1",
          amberLight: "#181818",
        },
      },
      fontFamily: {
        sans: ["Inter", "Geist", "Manrope", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        mono: ["Geist Mono", "JetBrains Mono", "SF Mono", "Menlo", "Consolas", "monospace"],
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
        technical: "0 1px 3px 0 rgba(0, 0, 0, 0.8), 0 0 0 1px #292929",
        elevation: "0 10px 40px -10px rgba(0, 0, 0, 0.9), 0 0 0 1px #292929",
        subtleWhite: "0 0 25px -5px rgba(255, 255, 255, 0.1)",
      },
    },
  },
  plugins: [],
};
