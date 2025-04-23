export const PALABRAS = [
    'REACT', 'VISTA', 'JUEGO', 'MUNDO', 'CLAVE',
    'PODER', 'FLUJO', 'CICLO', 'CLASE', 'NODOS',
    'DATOS', 'LISTA','VALOR',
    'CAMPO', 'FORMA', 'TEXTO', 'GRUPO', 'ORDEN',
    'CARGA', 'FINAL', 'NIVEL', 'PUNTO', 'SERIE'
  ];
  
  export function obtenerPalabraAleatoria(): string {
    const indice = Math.floor(Math.random() * PALABRAS.length);
    return PALABRAS[indice];
  }