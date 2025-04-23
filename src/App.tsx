import React, { useState, useEffect, useCallback, useRef } from 'react';
import ErrorBoundary from './componentes/ErrorBoundary';
import Tablero from './componentes/tablero';
import Teclado from './componentes/teclado';
import PlayerRegistration from './componentes/PlayerResgistration';
import { manejarIntento } from './lib/manejarEstadisticas';
import { obtenerPalabraAleatoria } from './lib/palabra';
import type { ResultadoLetra } from './lib/manejarEstadisticas';

const LIMITE_PALABRAS = 5;

const App: React.FC = () => {
  const [intentos, setIntentos] = useState<ResultadoLetra[][]>([]);
  const [palabraActual, setPalabraActual] = useState('');
  const [tecladoColores, setTecladoColores] = useState<Record<string, 'green' | 'yellow' | 'gray' | 'default'>>({});
  const [jugador, setJugador] = useState<{ nombre: string; foto: string | null } | null>(null);
  const [palabraSecreta, setPalabraSecreta] = useState(obtenerPalabraAleatoria());
  const [juegoTerminado, setJuegoTerminado] = useState(false);
  const [palabrasJugadas, setPalabrasJugadas] = useState(0);
  const [sesionTerminada, setSesionTerminada] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Enfocar el input oculto al cargar, al registrarse y al iniciar nuevo juego
  useEffect(() => {
    if (inputRef.current && jugador) {
      inputRef.current.focus();
    }
  }, [jugador, juegoTerminado, sesionTerminada]);

  const iniciarNuevoJuego = useCallback(() => {
    if (palabrasJugadas >= LIMITE_PALABRAS) {
      setSesionTerminada(true);
      return;
    }

    setPalabraSecreta(obtenerPalabraAleatoria());
    setIntentos([]);
    setTecladoColores({});
    setJuegoTerminado(false);
    setPalabraActual('');
    
    // Asegurarse de que el input mantenga el foco
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  }, [palabrasJugadas]);

  const reiniciarSesion = () => {
    setPalabrasJugadas(0);
    setSesionTerminada(false);
    iniciarNuevoJuego();
    
    // Asegurarse de que el input mantenga el foco
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const enviarPalabra = useCallback(() => {
    if (palabraActual.length === 5 && !juegoTerminado) {
      const { nuevosIntentos, nuevosColores } = manejarIntento(
        palabraActual,
        palabraSecreta,
        intentos,
        tecladoColores
      );
      setIntentos(nuevosIntentos);
      setTecladoColores(nuevosColores);
      setPalabraActual('');

      // Verificar si el jugador ganó o perdió
      const ultimoIntento = nuevosIntentos[nuevosIntentos.length - 1];
      const gano = ultimoIntento.every(resultado => resultado === 'correcta');
      const perdio = nuevosIntentos.length === 6;

      if (gano || perdio) {
        setJuegoTerminado(true);
        setPalabrasJugadas(prev => prev + 1);
        setTimeout(() => {
          alert(gano ? '¡Felicitaciones! ¡Has ganado!' : `Game Over. La palabra era: ${palabraSecreta}`);
          inputRef.current?.focus();
        }, 500);
      }
    }
  }, [palabraActual, intentos, tecladoColores, palabraSecreta, juegoTerminado]);

  // Manejador para teclado en pantalla
  const handleKeyPress = useCallback((tecla: string) => {
    if (sesionTerminada) {
      return;
    }

    if (juegoTerminado) {
      if (tecla === 'ENTER') {
        iniciarNuevoJuego();
      }
      return;
    }

    if (tecla === 'ENTER') {
      enviarPalabra();
    } else if (tecla === '←') {
      setPalabraActual(prev => prev.slice(0, -1));
    } else if (palabraActual.length < 5) {
      setPalabraActual(prev => prev + tecla);
    }
    
    // Mantener el foco en el input
    inputRef.current?.focus();
  }, [juegoTerminado, sesionTerminada, palabraActual, enviarPalabra, iniciarNuevoJuego]);

  const handleRegister = (nombre: string, foto: string | null) => {
    setJugador({ nombre, foto });
  };

  if (!jugador) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <PlayerRegistration onRegister={handleRegister} />
      </div>
    );
  }

  if (sesionTerminada) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold mb-4">¡Sesión Terminada!</h2>
          <p className="mb-4">Has completado tus {LIMITE_PALABRAS} palabras en esta sesión.</p>
          <button
            onClick={reiniciarSesion}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
          >
            Iniciar Nueva Sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app min-h-screen bg-gray-100 p-4" onClick={() => inputRef.current?.focus()}>
      <input
        type="text"
        ref={inputRef}
        className="absolute opacity-0 h-0 w-0"
        value={palabraActual}
        onChange={(e) => {
          const value = e.target.value.toUpperCase();
          if (/^[A-ZÑ]{0,5}$/.test(value)) {
            setPalabraActual(value);
          }
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            if (juegoTerminado) {
              iniciarNuevoJuego();
            } else if (palabraActual.length === 5) {
              enviarPalabra();
            }
            e.preventDefault();
          } else if (e.key === 'Backspace') {
            setPalabraActual(prev => prev.slice(0, -1));
            e.preventDefault();
          }
        }}
        onBlur={() => {
          // Recuperar el foco cuando se pierde
          setTimeout(() => {
            inputRef.current?.focus();
          }, 0);
        }}
      />

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
        <div className="md:w-1/4 flex flex-col items-center">
          {jugador.foto && (
            <div className="mb-4">
              <img 
                src={jugador.foto} 
                alt="Jugador" 
                className="w-48 h-48 rounded-full object-cover border-4 border-purple-500"
              />
              <h2 className="text-center mt-2 text-xl font-semibold">{jugador.nombre}</h2>
            </div>
          )}
          <div className="mt-4 text-center">
            <p className="text-lg">
              Palabras restantes: <span className="font-bold">{LIMITE_PALABRAS - palabrasJugadas}</span>
            </p>
          </div>
        </div>

        <div className="md:w-3/4 flex flex-col items-center">
          <h1 className="text-3xl font-bold mb-8">Wordle React</h1>
          
          <ErrorBoundary>
            <Tablero 
              intentos={intentos}
              palabraActual={palabraActual}
            />
          </ErrorBoundary>

          <div className="mt-8">
            <Teclado 
              colores={tecladoColores}
              onKeyPress={handleKeyPress}
            />
          </div>

          {juegoTerminado && !sesionTerminada && (
            <button
              onClick={iniciarNuevoJuego}
              className="mt-4 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
            >
              Jugar de nuevo
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;