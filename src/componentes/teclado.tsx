import React from 'react';

// Definimos tipos para los colores del teclado
export type TeclaColor = 'green' | 'yellow' | 'gray' | 'default';
export type ColoresTeclado = Record<string, TeclaColor>;

interface TecladoProps {
  colores: ColoresTeclado;
  onKeyPress: (letra: string) => void;
}

// Teclas especiales con sus respectivos símbolos
const TECLA_ENTER = 'ENTER';
const TECLA_BORRAR = '←';

const filas = [
  'QWERTYUIOP'.split(''),
  'ASDFGHJKL'.split(''),
  [TECLA_ENTER, ...'ZXCVBNM'.split(''), TECLA_BORRAR],
];

const Teclado: React.FC<TecladoProps> = ({ colores, onKeyPress }) => {
  // Mapeo de colores a clases de Tailwind
  const getColorClass = (tecla: string): string => {
    const color = colores[tecla] || 'default';
    const colorMap: Record<TeclaColor, string> = {
      green: 'bg-green-500 text-white',
      yellow: 'bg-yellow-400 text-white',
      gray: 'bg-gray-400 text-white',
      default: 'bg-white text-black hover:bg-gray-100',
    };
    return colorMap[color];
  };

  // Determina si es una tecla especial
  const isSpecialKey = (tecla: string): boolean => 
    tecla === TECLA_ENTER || tecla === TECLA_BORRAR;

  return (
    <div className="flex flex-col items-center gap-2 mt-4" role="group" aria-label="Teclado virtual">
      {filas.map((fila, rowIndex) => (
        <div key={`row-${rowIndex}`} className="flex gap-1">
          {fila.map((tecla) => (
            <button
              key={tecla}
              className={`
                px-3 py-2 rounded font-semibold 
                ${getColorClass(tecla)}
                ${isSpecialKey(tecla) ? 'w-16' : 'w-12'}
                transition-colors duration-200
                focus:outline-none focus:ring-2 focus:ring-blue-300
              `}
              onClick={() => onKeyPress(tecla)}
              aria-label={
                tecla === TECLA_ENTER ? 'Enviar palabra' : 
                tecla === TECLA_BORRAR ? 'Borrar letra' : 
                `Tecla ${tecla}`
              }
            >
              {tecla === TECLA_BORRAR ? (
                <span aria-hidden="true">←</span>
              ) : (
                tecla
              )}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Teclado;