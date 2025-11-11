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
      },

      animation: {
        "fade-in": "fadeIn 0.6s ease-in-out",
        "slide-up": "slideUp 0.6s ease-out",
        "scale-in": "scaleIn 0.4s ease-out",
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
      },
    },
  },
  plugins: [],
};

