export type EstadoLetra = 'correcta' | 'posicion' | 'incorrecta';
export interface ResultadoLetra {
  letra: string;
  estado: EstadoLetra;
}

/**
 * Verifica una palabra intentada contra la palabra secreta.
 * Retorna un array con el estado de cada letra.
 */
export function verificarIntento(
  palabraIntentada: string,
  palabraSecreta: string
): ResultadoLetra[] {
  const resultado: ResultadoLetra[] = [];
  const letrasUsadas = palabraSecreta.split('');
  const letrasEvaluadas = palabraIntentada.split('');

  // Primera pasada: marcar letras correctas (posición exacta)
  letrasEvaluadas.forEach((letra, i) => {
    if (letra === palabraSecreta[i]) {
      resultado.push({ letra, estado: 'correcta' });
      letrasUsadas[i] = ''; // Marcar como usada
    } else {
      resultado.push({ letra, estado: 'incorrecta' });
    }
  });

  // Segunda pasada: marcar letras en posición incorrecta pero presentes
  resultado.forEach((res, i) => {
    if (res.estado === 'incorrecta' && letrasUsadas.includes(res.letra)) {
      resultado[i].estado = 'posicion';
      letrasUsadas[letrasUsadas.indexOf(res.letra)] = ''; // Marcar como usada
    }
  });

  return resultado;
}