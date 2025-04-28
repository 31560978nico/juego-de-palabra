import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import ErrorBoundary from './componentes/ErrorBoundary';
import Tablero from './componentes/tablero';
import Teclado from './componentes/teclado';
import PlayerRegistration from './componentes/PlayerResgistration';
import { manejarIntento, ResultadoLetra } from './lib/manejarEstadisticas';
import { obtenerPalabraAleatoria } from './lib/palabra';
import './App.css';

const LIMITE_PALABRAS = 5;

const lanzarFuegosArtificiales = () => {
  const duration = 3000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

  const randomInRange = (min: number, max: number) => {
    return Math.random() * (max - min) + min;
  };

  const interval: any = setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);

    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
    });
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
    });
  }, 250);
};

const App: React.FC = () => {
  const [intentos, setIntentos] = useState<{letras: string[], estados: ResultadoLetra[]}[]>([]);
  const [palabraActual, setPalabraActual] = useState('');
  const [tecladoColores, setTecladoColores] = useState<Record<string, 'green' | 'yellow' | 'gray' | 'default'>>({});
  const [jugador, setJugador] = useState<{ nombre: string; foto: string | null } | null>(null);
  const [palabraSecreta, setPalabraSecreta] = useState(obtenerPalabraAleatoria());
  const [juegoTerminado, setJuegoTerminado] = useState(false);
  const [palabrasJugadas, setPalabrasJugadas] = useState(0);
  const [sesionTerminada, setSesionTerminada] = useState(false);
  const [aciertos, setAciertos] = useState(0);
  const [fallos, setFallos] = useState(0);
  const [winAnimation, setWinAnimation] = useState(false);

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
    setWinAnimation(false);
  }, [palabrasJugadas]);

  const reiniciarSesion = () => {
    setPalabrasJugadas(0);
    setSesionTerminada(false);
    setAciertos(0);
    setFallos(0);
    iniciarNuevoJuego();
  };

  const enviarPalabra = useCallback(() => {
    if (palabraActual.length === 5 && !juegoTerminado) {
      const { nuevosEstados, nuevosColores } = manejarIntento(
        palabraActual,
        palabraSecreta,
        intentos.map(i => i.estados),
        tecladoColores
      );
      
      setIntentos(prev => [...prev, {
        letras: palabraActual.split(''),
        estados: nuevosEstados[nuevosEstados.length - 1]
      }]);
      
      setTecladoColores(nuevosColores);
      setPalabraActual('');

      const ultimoIntento = nuevosEstados[nuevosEstados.length - 1];
      const gano = ultimoIntento.every(resultado => resultado === 'correcta');
      const perdio = nuevosEstados.length === 6;

      if (gano || perdio) {
        setJuegoTerminado(true);
        setPalabrasJugadas(prev => prev + 1);
        
        if (gano) {
          setAciertos(prev => prev + 1);
          setWinAnimation(true);
          lanzarFuegosArtificiales();
          setTimeout(() => {
            alert('¡Felicitaciones! ¡Has adivinado la palabra!');
          }, 500);
        } else {
          setFallos(prev => prev + 1);
          setTimeout(() => {
            alert(`Game Over. La palabra era: ${palabraSecreta}`);
          }, 500);
        }
      }
    }
  }, [palabraActual, intentos, tecladoColores, palabraSecreta, juegoTerminado]);

  const handleKeyPress = useCallback((tecla: string) => {
    if (sesionTerminada) return;

    if (juegoTerminado) {
      if (tecla === 'ENTER') iniciarNuevoJuego();
      return;
    }

    if (tecla === 'ENTER') {
      enviarPalabra();
    } else if (tecla === '←') {
      setPalabraActual(prev => prev.slice(0, -1));
    } else if (palabraActual.length < 5) {
      setPalabraActual(prev => prev + tecla);
    }
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
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md text-center max-w-md w-full">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">¡Sesión Terminada!</h2>
          <div className="mb-6">
            <p className="text-base sm:text-lg mb-2">Estadísticas finales:</p>
            <div className="flex justify-center gap-4 sm:gap-6">
              <div className="text-center">
                <p className="text-xs sm:text-sm text-gray-600">Aciertos</p>
                <p className="text-xl sm:text-2xl font-bold text-green-500">{aciertos}</p>
              </div>
              <div className="text-center">
                <p className="text-xs sm:text-sm text-gray-600">Fallos</p>
                <p className="text-xl sm:text-2xl font-bold text-red-500">{fallos}</p>
              </div>
            </div>
          </div>
          <button
            onClick={reiniciarSesion}
            className="px-4 py-2 sm:px-6 sm:py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors w-full text-sm sm:text-base"
          >
            Iniciar Nueva Sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6 lg:p-8">
      <div className="max-w-md mx-auto w-full sm:w-11/12 md:w-5/6 lg:w-2/3">
        {/* Encabezado con nombre y foto */}
        <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 mb-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {jugador.foto && (
              <img 
                src={jugador.foto} 
                alt="Jugador" 
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-purple-500 object-cover"
              />
            )}
            <span className="font-bold text-sm sm:text-base md:text-lg truncate max-w-[120px] sm:max-w-[180px]">
              {jugador.nombre}
            </span>
          </div>
          
          <div className="flex space-x-3 sm:space-x-4">
            <div className="text-center">
              <p className="text-xs sm:text-sm text-gray-600">Aciertos</p>
              <p className="text-sm sm:text-lg font-bold text-green-500">{aciertos}</p>
            </div>
            <div className="text-center">
              <p className="text-xs sm:text-sm text-gray-600">Fallos</p>
              <p className="text-sm sm:text-lg font-bold text-red-500">{fallos}</p>
            </div>
            <div className="text-center">
              <p className="text-xs sm:text-sm text-gray-600">Restantes</p>
              <p className="text-sm sm:text-lg font-bold text-purple-500">
                {LIMITE_PALABRAS - palabrasJugadas}
              </p>
            </div>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-6">Wordle React</h1>

        <ErrorBoundary>
          <div className={`mb-4 sm:mb-6 ${winAnimation ? 'win-animation' : ''}`}>
            <Tablero intentos={intentos} />
          </div>
        </ErrorBoundary>

        {/* Campo de entrada visible */}
        <div className="mb-4 sm:mb-6 bg-white p-4 rounded-lg shadow-md">
          <div className="flex justify-center items-center gap-2 mb-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div 
                key={`input-${i}`}
                className={`w-10 h-12 sm:w-12 sm:h-14 border-2 rounded flex items-center justify-center text-xl font-bold uppercase
                  ${palabraActual[i] ? 'border-purple-500 bg-purple-50' : 'border-gray-300'}`}
              >
                {palabraActual[i] || ''}
              </div>
            ))}
          </div>
          <input
            type="text"
            value={palabraActual}
            onChange={(e) => {
              const value = e.target.value.toUpperCase();
              if (/^[A-ZÑ]{0,5}$/.test(value)) {
                setPalabraActual(value);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && palabraActual.length === 5) {
                enviarPalabra();
                e.preventDefault();
              }
            }}
            className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent text-center uppercase text-lg"
            maxLength={5}
            autoFocus
            placeholder="Escribe aquí"
          />
          <p className="text-xs text-gray-500 mt-2 text-center">
            Escribe tu palabra de 5 letras y presiona Enter
          </p>
        </div>

        <div className="mt-4 sm:mt-6">
          <Teclado 
            colores={tecladoColores}
            onKeyPress={handleKeyPress}
          />
        </div>

        {juegoTerminado && !sesionTerminada && (
          <button
            onClick={iniciarNuevoJuego}
            className="mt-4 sm:mt-6 w-full py-2 sm:py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-medium text-sm sm:text-base"
          >
            Jugar de nuevo
          </button>
        )}
      </div>
    </div>
  );
};

export default App;