import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // プライマリカラー: オレンジ
        primary: {
          DEFAULT: "#F95F06",
          foreground: "#FFFFFF",
          50: "#FFF7ED",
          100: "#FFEDD5",
          200: "#FFD5AA",
          300: "#FFAB6F",
          400: "#FF8134",
          500: "#F95F06",
          600: "#D65205",
          700: "#B34504",
          800: "#8F3803",
          900: "#6B2B02",
        },
        // セカンダリカラー: グレー
        background: "#FFFFFF",
        foreground: "#0F172A",
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#0F172A",
        },
        border: "#E2E8F0",
        input: "#E2E8F0",
        muted: {
          DEFAULT: "#F8FAFC",
          foreground: "#64748B",
        },
        accent: {
          DEFAULT: "#F8FAFC",
          foreground: "#0F172A",
        },
        // セマンティックカラー
        success: {
          DEFAULT: "#22C55E",
          foreground: "#FFFFFF",
        },
        warning: {
          DEFAULT: "#EAB308",
          foreground: "#0F172A",
        },
        error: {
          DEFAULT: "#EF4444",
          foreground: "#FFFFFF",
        },
        info: {
          DEFAULT: "#3B82F6",
          foreground: "#FFFFFF",
        },
      },
      borderRadius: {
        lg: "0.5rem",
        md: "0.375rem",
        sm: "0.25rem",
      },
      fontFamily: {
        sans: ['"Noto Sans JP"', '"Hiragino Kaku Gothic ProN"', '"Hiragino Sans"', '"Yu Gothic"', '"Meiryo"', "sans-serif"],
        mono: ['"Fira Code"', '"Consolas"', '"Monaco"', "monospace"],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;


