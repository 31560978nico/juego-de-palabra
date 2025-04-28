export type ResultadoLetra = 'correcta' | 'presente' | 'ausente';

interface ResultadoIntento {
  nuevosEstados: ResultadoLetra[][];
  nuevosColores: Record<string, 'green' | 'yellow' | 'gray' | 'default'>;
}

export function verificarPalabra(
  palabraCorrecta: string, 
  intento: string
): ResultadoLetra[] {
  // Validación de entrada
  if (!palabraCorrecta || !intento || palabraCorrecta.length !== intento.length) {
    console.error('Parámetros inválidos para verificarPalabra');
    return Array(5).fill('ausente');
  }

  const resultado: ResultadoLetra[] = Array(palabraCorrecta.length).fill('ausente');
  const letrasRestantes = palabraCorrecta.split('');

  // Primero marcamos las letras correctas
  for (let i = 0; i < palabraCorrecta.length; i++) {
    if (intento[i] === palabraCorrecta[i]) {
      resultado[i] = 'correcta';
      letrasRestantes[i] = '';
    }
  }

  // Luego marcamos las letras presentes en posición incorrecta
  for (let i = 0; i < palabraCorrecta.length; i++) {
    if (resultado[i] !== 'correcta') {
      const indice = letrasRestantes.indexOf(intento[i]);
      if (indice !== -1) {
        resultado[i] = 'presente';
        letrasRestantes[indice] = '';
      }
    }
  }

  return resultado;
}

export function manejarIntento(
  palabraActual: string,
  palabraSecreta: string,
  intentosAnteriores: ResultadoLetra[][] = [],
  tecladoColoresAnteriores: Record<string, 'green' | 'yellow' | 'gray' | 'default'> = {}
): ResultadoIntento {
  // Validación de entrada
  if (!palabraActual || !palabraSecreta || palabraActual.length !== palabraSecreta.length) {
    console.error('Parámetros inválidos para manejarIntento');
    return {
      nuevosEstados: [...intentosAnteriores],
      nuevosColores: {...tecladoColoresAnteriores}
    };
  }

  const resultado = verificarPalabra(palabraSecreta, palabraActual);
  const nuevosEstados = [...intentosAnteriores, resultado];
  const nuevosColores = { ...tecladoColoresAnteriores };

  // Actualizar colores del teclado
  palabraActual.split('').forEach((letra, i) => {
    const resultadoLetra = resultado[i];
    const colorActual = nuevosColores[letra];

    // Solo actualizar si no es verde (prioridad a las letras correctas)
    if (resultadoLetra === 'correcta') {
      nuevosColores[letra] = 'green';
    } else if (resultadoLetra === 'presente' && colorActual !== 'green') {
      nuevosColores[letra] = 'yellow';
    } else if (resultadoLetra === 'ausente' && !colorActual) {
      nuevosColores[letra] = 'gray';
    }
  });

  return { nuevosEstados, nuevosColores };
}