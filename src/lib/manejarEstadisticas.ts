import { ResultadoLetra, verificarIntento } from './validarPalabra';  

// Tipos
export type TeclaColor = 'green' | 'yellow' | 'gray' | 'default';

// Función para manejar un nuevo intento del jugador
export function manejarIntento(
  palabra: string,
  palabraSecreta: string,
  intentosActuales: ResultadoLetra[][],
  tecladoColoresActual: Record<string, TeclaColor>
): { nuevosIntentos: ResultadoLetra[][]; nuevosColores: Record<string, TeclaColor> } {
  
  const palabraMayus = palabra.toUpperCase();
  const resultado = verificarIntento(palabraMayus, palabraSecreta);

  const nuevosIntentos = [...intentosActuales, resultado];
  const nuevosColores = { ...tecladoColoresActual };

  resultado.forEach(({ letra, estado }) => {
    if (estado === 'correcta') {
      nuevosColores[letra] = 'green';
    } else if (estado === 'posicion' && nuevosColores[letra] !== 'green') {
      nuevosColores[letra] = 'yellow';
    } else if (estado === 'incorrecta' && !nuevosColores[letra]) {
      nuevosColores[letra] = 'gray';
    }
  });

  return { nuevosIntentos, nuevosColores };
}

// Función para calcular estadísticas del juego
export function calcularEstadisticas(intentos: ResultadoLetra[][]): {
  aciertos: number;
  intentosTotales: number;
} {
  const aciertos = intentos.filter(intento =>
    intento.every(letra => letra.estado === 'correcta')
  ).length;

  return { aciertos, intentosTotales: intentos.length };
}