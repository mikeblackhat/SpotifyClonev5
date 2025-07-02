// Solución para el botón de cierre del sidebar
// Asegúrate de que el botón de cierre no se corte con el borde
export const fixCloseButton = {
  button: {
    base: "p-1.5 -mr-1 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors",
    icon: "text-lg"
  },
  container: {
    base: "flex flex-col h-full w-full overflow-hidden no-scrollbar pr-1"
  }
};
