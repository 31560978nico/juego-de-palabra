import React from 'react';

export type TeclaColor = 'green' | 'yellow' | 'gray' | 'default';
export type ColoresTeclado = Record<string, TeclaColor>;

interface TecladoProps {
  colores: ColoresTeclado;
  onKeyPress: (letra: string) => void;
}

const TECLA_ENTER = 'ENTER';
const TECLA_BORRAR = '←';

const filas = [
  'QWERTYUIOP'.split(''),
  'ASDFGHJKL'.split(''),
  [TECLA_ENTER, ...'ZXCVBNM'.split(''), TECLA_BORRAR],
];

const Teclado: React.FC<TecladoProps> = ({ colores, onKeyPress }) => {
  const getColorClass = (tecla: string): string => {
    const color = colores[tecla] || 'default';
    const colorMap: Record<TeclaColor, string> = {
      green: 'bg-green-500 text-white hover:bg-green-600',
      yellow: 'bg-yellow-400 text-white hover:bg-yellow-500',
      gray: 'bg-gray-400 text-white hover:bg-gray-500',
      default: 'bg-gray-200 text-black hover:bg-gray-300',
    };
    return colorMap[color];
  };

  const isSpecialKey = (tecla: string): boolean => 
    tecla === TECLA_ENTER || tecla === TECLA_BORRAR;

  return (
    <div className="flex flex-col items-center gap-1 sm:gap-2 mt-2 sm:mt-4">
      {filas.map((fila, rowIndex) => (
        <div key={`row-${rowIndex}`} className="flex gap-1">
          {fila.map((tecla) => (
            <button
              key={tecla}
              className={`
                px-2 py-1 sm:px-3 sm:py-2 rounded font-semibold text-sm sm:text-base
                ${getColorClass(tecla)}
                ${isSpecialKey(tecla) ? 'w-12 sm:w-16' : 'w-7 sm:w-10 md:w-12'}
                transition-colors duration-200
                active:scale-95
              `}
              onClick={() => onKeyPress(tecla)}
            >
              {tecla === TECLA_BORRAR ? '←' : tecla}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Teclado;