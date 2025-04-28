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
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const fotoDataUrl = canvas.toDataURL('image/jpeg', 0.7);
        setFoto(fotoDataUrl);

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
      <form 
        onSubmit={manejarRegistro} 
        className="bg-white rounded-lg shadow-xl p-4 sm:p-6 w-full max-w-xs sm:max-w-sm md:max-w-md"
      >
        <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-800 mb-4 sm:mb-6">
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
            className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
            required
            autoFocus
          />
        </div>

        <div className="mb-4 sm:mb-6 flex flex-col items-center">
          <div className="relative mb-3 sm:mb-4">
            {foto ? (
              <img
                src={foto}
                alt="Foto del jugador"
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-purple-200"
              />
            ) : (
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500 text-sm">Sin foto</span>
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
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors text-sm sm:text-base"
              >
                Capturar foto
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setCamaraActiva(true)}
              disabled={!!foto}
              className={`px-4 py-2 rounded-md transition-colors text-sm sm:text-base ${
                foto ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {foto ? 'Foto tomada' : 'Tomar foto'}
            </button>
          )}
        </div>

        <div className="flex justify-between gap-2 mt-4 sm:mt-6">
          {foto && (
            <button
              type="button"
              onClick={() => {
                setFoto(null);
                setCamaraActiva(false);
              }}
              className="px-3 py-1 sm:px-4 sm:py-2 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm sm:text-base"
            >
              Eliminar foto
            </button>
          )}
          
          <button
            type="submit"
            disabled={!nombre.trim()}
            className={`ml-auto px-4 py-1 sm:px-6 sm:py-2 rounded-md font-medium text-sm sm:text-base ${
              !nombre.trim() 
                ? 'bg-gray-300 cursor-not-allowed' 
                : 'bg-purple-600 hover:bg-purple-700 text-white'
            }`}
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