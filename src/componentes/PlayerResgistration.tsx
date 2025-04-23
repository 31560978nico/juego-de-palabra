import React, { useRef, useState, useEffect } from 'react';

interface PlayerRegistrationProps {
  onRegister: (nombre: string, foto: string | null) => void;
}

const PlayerRegistration: React.FC<PlayerRegistrationProps> = ({ onRegister }) => {
  const [nombre, setNombre] = useState('');
  const [foto, setFoto] = useState<string | null>(null);
  const [errorCamara, setErrorCamara] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [camaraActiva, setCamaraActiva] = useState(false);

  // Limpieza de la cámara al desmontar
  useEffect(() => {
    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (camaraActiva && !foto) {
      const iniciarCamara = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
              facingMode: 'user',
              width: { ideal: 1280 },
              height: { ideal: 720 }
            } 
          });
          
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            setErrorCamara(null);
          }
        } catch (err) {
          console.error('Error al acceder a la cámara:', err);
          setErrorCamara('No se pudo acceder a la cámara. Asegúrate de dar los permisos necesarios.');
          setCamaraActiva(false);
        }
      };

      iniciarCamara();
    }
  }, [camaraActiva, foto]);

  const capturarFoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        // Ajustar tamaño del canvas al video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Reducir tamaño de la imagen para optimización
        const fotoDataUrl = canvas.toDataURL('image/jpeg', 0.7);
        setFoto(fotoDataUrl);

        // Detener la cámara
        const stream = video.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        setCamaraActiva(false);
      }
    }
  };

  const manejarRegistro = (e: React.FormEvent) => {
    e.preventDefault();
    if (nombre.trim()) {
      onRegister(nombre.trim(), foto);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <form 
        onSubmit={manejarRegistro} 
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md animate-fade-in"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Registro del Jugador
        </h2>
        
        <div className="mb-4">
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre completo
          </label>
          <input
            id="nombre"
            type="text"
            placeholder="Ingresa tu nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
            autoFocus
          />
        </div>

        <div className="mb-6 flex flex-col items-center">
          <div className="relative mb-4">
            {foto ? (
              <img
                src={foto}
                alt="Foto del jugador"
                className="w-32 h-32 rounded-full object-cover border-4 border-purple-200"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">Sin foto</span>
              </div>
            )}
          </div>

          {errorCamara && (
            <p className="text-red-500 text-sm mb-2">{errorCamara}</p>
          )}

          {camaraActiva ? (
            <div className="space-y-3 flex flex-col items-center">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline
                muted
                className="w-full max-w-xs rounded-lg border border-gray-300"
              />
              <button
                type="button"
                onClick={capturarFoto}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
              >
                <span className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Capturar foto
                </span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setCamaraActiva(true)}
              disabled={!!foto}
              className={`px-4 py-2 rounded-md transition-colors ${foto ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
            >
              <span className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                </svg>
                {foto ? 'Foto tomada' : 'Tomar foto'}
              </span>
            </button>
          )}
        </div>

        <div className="flex justify-between mt-6">
          {foto && (
            <button
              type="button"
              onClick={() => {
                setFoto(null);
                setCamaraActiva(false);
              }}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            >
              Eliminar foto
            </button>
          )}
          
          <button
            type="submit"
            disabled={!nombre.trim()}
            className={`ml-auto px-6 py-2 rounded-md font-medium transition-colors ${!nombre.trim() ? 'bg-gray-300 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700 text-white'}`}
          >
            Comenzar juego
          </button>
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </form>
    </div>
  );
};

export default PlayerRegistration;