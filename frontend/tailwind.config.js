/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx,mdx}",
    "./services/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  // Desactivar prefijos innecesarios para reducir el tamaño del CSS
  corePlugins: {
    float: false,
    clear: false,
    skew: false,
  },
  theme: {
    extend: {
      colors: {
        spotify: {
          green: '#1DB954',
          black: '#121212',
          darkGray: '#282828',
          lightGray: '#B3B3B3',
        },
      },
      // Optimizar animaciones
      transitionProperty: {
        'width': 'width',
        'spacing': 'margin, padding',
      },
    },
  },
  // Purge CSS para producción
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  plugins: [
    require('@tailwindcss/typography'),
    // Plugin para ocultar la barra de desplazamiento pero mantener el scroll
    function({ addUtilities }) {
      const newUtilities = {
        '.scrollbar-hide': {
          /* Hide scrollbar for Chrome, Safari and Opera */
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          /* Hide scrollbar for IE, Edge and Firefox */
          '-ms-overflow-style': 'none',  /* IE and Edge */
          'scrollbar-width': 'none',  /* Firefox */
        },
        '.scrollbar-default': {
          /* Revert to default scrollbar */
          '&::-webkit-scrollbar': {
            display: 'block',
          },
          '-ms-overflow-style': 'auto',  /* IE and Edge */
          'scrollbar-width': 'auto',  /* Firefox */
        },
      };
      addUtilities(newUtilities, ['responsive', 'hover']);
    },
  ],
}