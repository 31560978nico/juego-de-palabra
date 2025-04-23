import React from 'react';
// Importa ResultadoLetra desde su fuente original
import type { ResultadoLetra } from '../lib/validarPalabra';
interface CeldaProps {
  letra: string;
  estado?: 'correcta' | 'posicion' | 'incorrecta';
  esActual?: boolean;
}

const Celda: React.FC<CeldaProps> = ({ letra, estado = 'incorrecta', esActual = false }) => {
  const baseClasses = "w-12 h-12 border-2 flex items-center justify-center text-xl font-bold transition-all duration-200";
  
  const estadoClasses = esActual 
    ? "border-gray-400 bg-white" 
    : estado === 'correcta' 
      ? 'bg-green-500 text-white border-green-500' 
      : estado === 'posicion' 
        ? 'bg-yellow-400 text-white border-yellow-400' 
        : 'bg-gray-400 text-white border-gray-400';

  return (
    <div 
      className={`${baseClasses} ${estadoClasses}`}
      role="gridcell"
      aria-label={`Letra ${letra || 'vacía'}, ${estado}`}
    >
      {letra}
    </div>
  );
};

interface TableroProps {
  intentos: ResultadoLetra[][];
  palabraActual?: string;
}

const LONGITUD_PALABRA = 5;

const Tablero: React.FC<TableroProps> = ({ 
  intentos = [], 
  palabraActual = '' 
}) => {
  const filasVacias = Array.from({ length: Math.max(0, LONGITUD_PALABRA - intentos.length) }, () =>
    Array.from({ length: LONGITUD_PALABRA }, () => ({ letra: '', estado: 'incorrecta' as const }))
  );

  return (
    <div className="grid gap-2 mb-6" role="grid">
      {[...intentos, ...filasVacias].map((fila, filaIndex) => (
        <div key={filaIndex} className="flex gap-1 justify-center" role="row">
          {fila.map(({ letra, estado }, letraIndex) => (
            <Celda 
              key={`${filaIndex}-${letraIndex}`}
              letra={letra}
              estado={estado}
            />
          ))}
        </div>
      ))}
      
      <div className="flex gap-1 justify-center" role="row">
        {Array.from({ length: LONGITUD_PALABRA }).map((_, i) => (
          <Celda
            key={`current-${i}`}
            letra={palabraActual[i] || ''}
            esActual={true}
          />
        ))}
      </div>
    </div>
  );
};

export default Tablero;