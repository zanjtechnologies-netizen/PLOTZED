/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Navy tones (main background + accents)
      colors: {
        navy: {
          950: "#0A0D1A", // Deepest navy
          900: "#112250", // Primary navy
          800: "#0A0D1A",
          900: "#112250", // 100%
          800: "#1A2D50",
          700: "#253A64",
          // Opacity variants (exact matches from Figma)
          900.95: "rgba(17, 34, 80, 0.95)", // 95%
        },

        // Golds
        gold: {
          400: "#E0C58F", // Primary gold
          500: "#DBB893", // Muted gold
          600: "#CA9376", // Deep gold
          400: "#E0C58F", // 100%
          500: "#DBB893", // 100%
          600: "#CA9376",
          400.20: "rgba(224, 197, 143, 0.20)", // 20%
        },

        // Accent Green
        green: {
          500: "#147001",
          500: "#147001", // 100%
        },

        // Teal/Blue gradient base
        teal: {
          500: "#006D8B",
          600: "#094D88",
          500: "#006D8B", // 100%
          600: "#006D8B", // align to same blue if gradient used
        },

        // Base whites with opacity utility references
        white: {
          DEFAULT: "#FFFFFF", // 100%
          20: "rgba(255, 255, 255, 0.20)", // 20%
        },

        // Beige (optional)
        beige: {
          400: "#E0C58F",
          500: "#DBB893",
        },
      },

      fontFamily: {
        sans: ["var(--font-libre)", "serif"],
        display: ["var(--font-playfair)", "serif"],
      },

      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-luxury":
          "linear-gradient(135deg, #006D8B 0%, #094D88 100%)",
        "gradient-gold":
          "linear-gradient(135deg, #DBB893 0%, #E0C58F 100%)",
      },

      boxShadow: {
        luxury: "0 10px 40px rgba(0, 109, 184, 0.3)",
        "luxury-hover": "0 20px 60px rgba(0, 109, 184, 0.4)",
        "3xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)",
      },

      animation: {
        "fade-in": "fadeIn 0.6s ease-in-out",
        "slide-up": "slideUp 0.6s ease-out",
        "scale-in": "scaleIn 0.4s ease-out",
        "pulse-slow": "pulseSlow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-in-tooltip": "fadeInTooltip 0.3s ease-out",
        "ping-slow": "pingSlow 2s cubic-bezier(0, 0, 0.2, 1) infinite",
      },

      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(30px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        pulseSlow: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.95" },
        },
        fadeInTooltip: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pingSlow: {
          "75%, 100%": { transform: "scale(1.5)", opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};

