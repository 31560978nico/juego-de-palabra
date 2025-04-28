import React from 'react';
import type { ResultadoLetra } from '../lib/manejarEstadisticas';

interface CeldaProps {
  letra: string;
  estado?: ResultadoLetra;
}

const Celda: React.FC<CeldaProps> = ({ letra, estado = 'ausente' }) => {
  const baseClasses = "w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 border-2 flex items-center justify-center text-lg sm:text-xl font-bold transition-all duration-200";
  
  const estadoClasses = 
    estado === 'correcta' 
      ? 'bg-green-500 text-white border-green-500' 
      : estado === 'presente' 
        ? 'bg-yellow-400 text-white border-yellow-400' 
        : estado === 'ausente'
          ? 'bg-gray-400 text-white border-gray-400'
          : 'bg-white border-gray-300';

  return (
    <div 
      className={`${baseClasses} ${estadoClasses} ${!letra && 'animate-pulse'}`}
      role="gridcell"
      aria-label={letra ? `Letra ${letra}, ${estado}` : 'Celda vacía'}
    >
      {letra}
    </div>
  );
};

interface TableroProps {
  intentos: {letras: string[], estados: ResultadoLetra[]}[];
}

const LONGITUD_PALABRA = 5;
const MAX_INTENTOS = 6;

const Tablero: React.FC<TableroProps> = ({ intentos = [] }) => {
  // Filas completadas (con estados)
  const filasCompletadas = intentos.map((intento, filaIndex) => (
    <div 
      key={`completed-${filaIndex}`} 
      className="flex gap-1 justify-center"
      role="row"
      aria-label={`Intento ${filaIndex + 1}`}
    >
      {intento.estados.map((estado, letraIndex) => (
        <Celda 
          key={`completed-${filaIndex}-${letraIndex}`}
          letra={intento.letras[letraIndex] || ''}
          estado={estado}
        />
      ))}
    </div>
  ));

  // Filas vacías restantes
  const filasVacias = Array.from({ 
    length: MAX_INTENTOS - intentos.length 
  }).map((_, filaIndex) => (
    <div 
      key={`empty-${filaIndex}`} 
      className="flex gap-1 justify-center"
      role="row"
      aria-label={`Intento vacío ${intentos.length + filaIndex + 1}`}
    >
      {Array.from({ length: LONGITUD_PALABRA }).map((_, letraIndex) => (
        <Celda
          key={`empty-${filaIndex}-${letraIndex}`}
          letra=""
        />
      ))}
    </div>
  ));

  return (
    <div 
      className="grid gap-1 sm:gap-2 mb-4 sm:mb-6"
      role="grid"
      aria-label="Tablero de Wordle"
    >
      {filasCompletadas}
      {filasVacias}
    </div>
  );
};

export default Tablero;