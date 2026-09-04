import type { Config } from "tailwindcss"

/**
 * Espejo de DESIGN.md para tooling / IntelliSense.
 * La fuente runtime son las custom properties en globals.css (@theme).
 */
const config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary)",
        "on-primary": "var(--on-primary)",
        "primary-container": "var(--primary-container)",
        "on-primary-container": "var(--on-primary-container)",
        secondary: "var(--secondary)",
        "on-secondary": "var(--on-secondary)",
        "secondary-container": "var(--secondary-container)",
        "on-secondary-container": "var(--on-secondary-container)",
        surface: "var(--surface)",
        "surface-container": "var(--surface-container)",
        "surface-container-low": "var(--surface-container-low)",
        "surface-container-lowest": "var(--surface-container-lowest)",
        "surface-container-high": "var(--surface-container-high)",
        "surface-container-highest": "var(--surface-container-highest)",
        "on-surface": "var(--on-surface)",
        "on-surface-variant": "var(--on-surface-variant)",
        outline: "var(--outline)",
        "outline-variant": "var(--outline-variant)",
        "accent-gold": "var(--accent-gold)",
        "accent-blush": "var(--accent-blush)",
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-jakarta)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        column: "480px",
        "notebook-page": "440px",
      },
      boxShadow: {
        "paper-1": "var(--elevation-1)",
        "paper-2": "var(--elevation-2)",
        "paper-3": "var(--elevation-3)",
      },
    },
  },
} satisfies Config

export default config
