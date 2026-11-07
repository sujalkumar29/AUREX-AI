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
        // Official AUREX AI Lavender + Purple Palette
        aurex: {
          primary: "#0D0B2D",       // Deep midnight purple
          accent: "#5B4BFF",        // Electric purple
          secondary: "#A78BFA",     // Soft purple / violet
          surface: "#E6E0FF",       // Lavender surface tint
          bg: "#F7F8FF",            // Soft cloud white background
          textPrimary: "#17143A",   // Deep purple headings & primary text
          textSecondary: "#77738F", // Muted secondary text
          border: "#E5E1F2",        // Soft border
          mutedSurface: "#F0EDFF",  // Light lavender card background
        },
        lavender: {
          50: "#F7F8FF",
          100: "#F0EDFF",
          200: "#E6E0FF",
          300: "#D3CAFF",
          400: "#A78BFA",
          500: "#8057FF",
          600: "#5B4BFF",
          700: "#4534D4",
          800: "#29205C",
          900: "#17143A",
          950: "#0D0B2D",
        },
        primary: "#0D0B2D",
        accent: "#5B4BFF",
        secondary: "#A78BFA",
        surface: "#E6E0FF",
        midnight: {
          DEFAULT: "#0D0B2D",
          50: "#F7F8FF",
          100: "#F0EDFF",
          200: "#E6E0FF",
          300: "#D3CAFF",
          400: "#A78BFA",
          500: "#8057FF",
          600: "#5B4BFF",
          700: "#4534D4",
          800: "#29205C",
          900: "#17143A",
          950: "#0D0B2D",
        },
      },
      fontFamily: {
        sans: ["Inter", "Geist", "Manrope", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        mono: ["Geist Mono", "JetBrains Mono", "SF Mono", "Menlo", "Consolas", "monospace"],
      },
      borderRadius: {
        sm: "4px",
        DEFAULT: "8px",
        md: "10px",
        lg: "12px",
        xl: "16px",
        "2xl": "22px",
      },
      boxShadow: {
        technical: "0 1px 3px 0 rgba(13, 11, 45, 0.06), 0 0 0 1px #E5E1F2",
        elevation: "0 12px 40px -10px rgba(91, 75, 255, 0.15), 0 0 0 1px rgba(91, 75, 255, 0.1)",
        purpleGlow: "0 0 30px -5px rgba(91, 75, 255, 0.25)",
        glass: "0 8px 32px 0 rgba(91, 75, 255, 0.06), inset 0 1px 0 0 rgba(255, 255, 255, 0.95)",
        glassHover: "0 16px 44px 0 rgba(91, 75, 255, 0.12), 0 0 24px 0 rgba(167, 139, 250, 0.15), inset 0 1px 0 0 rgba(255, 255, 255, 1)",
        glassElevated: "0 20px 50px 0 rgba(91, 75, 255, 0.10), inset 0 1px 0 0 rgba(255, 255, 255, 1)",
        glassInner: "inset 0 2px 4px 0 rgba(13, 11, 45, 0.04)",
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
