/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        "surface-variant": "#E5E1D8",
        "surface-container-lowest": "#FFFFFF",
        "surface-container-high": "#F0EDE4",
        "on-tertiary": "#FFFFFF",
        "primary": "#1a1f2e", // Deep Forest Green -> Admin Dark
        "on-surface": "#1E1E1E", // Soft Charcoal
        "inverse-on-surface": "#F9F7F2",
        "tertiary-fixed": "#d4a843", // Honey -> Admin Gold
        "on-secondary-fixed-variant": "#464557",
        "outline": "#858C83",
        "error": "#BA1A1A",
        "inverse-surface": "#2D3136",
        "surface-dim": "#D9D9D9",
        "on-primary": "#FFFFFF",
        "inverse-primary": "#8BB49E",
        "error-container": "#FFDAD6",
        "tertiary": "#d4a843", // Honey -> Admin Gold
        "secondary-container": "#d4a843",
        "tertiary-fixed-dim": "#D4AF37",
        "on-primary-fixed": "#002114",
        "on-tertiary-fixed": "#261A00",
        "on-surface-variant": "#444943",
        "surface-container": "#F5F2EA",
        "surface-container-highest": "#E5E1D8",
        "secondary-fixed-dim": "#C6C4DA",
        "secondary": "#d4a843", // Honey/Accent -> Admin Gold
        "primary-fixed-dim": "#8BB49E",
        "tertiary-container": "#E3B448",
        "on-primary-fixed-variant": "#005234",
        "on-background": "#1E1E1E",
        "on-secondary-container": "#41414F",
        "on-tertiary-fixed-variant": "#5B4300",
        "on-secondary": "#FFFFFF",
        "surface": "#f5f0e8", // Soft Bone/Parchment -> Admin Parchment
        "surface-bright": "#f5f0e8",
        "on-error": "#FFFFFF",
        "background": "#f5f0e8",
        "primary-fixed": "#A7D1B9",
        "on-secondary-fixed": "#1A1A2A",
        "surface-container-low": "#FDFBF7",
        "primary-container": "#1a1f2e",
        "secondary-fixed": "#E3E0F7",
        "outline-variant": "#C4C9BC",
        "on-primary-container": "#FDFBF7",
        "surface-tint": "#1A362E",
        "on-tertiary-container": "#FFFFFF",
        "on-error-container": "#93000A"
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
      spacing: {
        "section-gap": "32px",
        "gutter": "16px",
        "container-margin": "24px",
        "card-padding": "20px",
        "sidebar-width": "260px"
      },
      fontFamily: {
        "headline-xl": ["Inter", "sans-serif"],
        "headline-lg": ["Inter", "sans-serif"],
        "body-md": ["Inter", "sans-serif"],
        "stat-value": ["Inter", "sans-serif"],
        "label-bold": ["Inter", "sans-serif"],
        "label-sm": ["Inter", "sans-serif"],
        "headline-md": ["Inter", "sans-serif"],
        "body-lg": ["Inter", "sans-serif"],
        "epilogue": ["Epilogue", "sans-serif"],
        "be-vietnam-pro": ["Be Vietnam Pro", "sans-serif"],
      },
      fontSize: {
        "headline-xl": ["32px", {"lineHeight": "40px", "letterSpacing": "-0.02em", "fontWeight": "700"}],
        "headline-lg": ["24px", {"lineHeight": "32px", "letterSpacing": "-0.01em", "fontWeight": "700"}],
        "body-md": ["14px", {"lineHeight": "20px", "fontWeight": "400"}],
        "stat-value": ["28px", {"lineHeight": "34px", "letterSpacing": "-0.01em", "fontWeight": "700"}],
        "label-bold": ["12px", {"lineHeight": "16px", "fontWeight": "600"}],
        "label-sm": ["12px", {"lineHeight": "16px", "fontWeight": "500"}],
        "headline-md": ["20px", {"lineHeight": "28px", "fontWeight": "600"}],
        "body-lg": ["16px", {"lineHeight": "24px", "fontWeight": "400"}]
      }
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/container-queries')],
}
