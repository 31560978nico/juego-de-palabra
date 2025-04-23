import React from 'react';

interface InputProps {
  onSubmit: (palabra: string) => void;
  valor: string;  // Recibe el valor del input
  setValor: React.Dispatch<React.SetStateAction<string>>;  // Función para actualizar el valor
}

const Input: React.FC<InputProps> = ({ onSubmit, valor, setValor }) => {
  const manejarEnvio = (e: React.FormEvent) => {
    e.preventDefault();
    if (valor.length === 5) {
      onSubmit(valor);
      setValor('');
    }
  };

  return (
    <form onSubmit={manejarEnvio} className="mb-4 flex gap-2">
      <input
        type="text"
        maxLength={5}
        value={valor}
        onChange={(e) => setValor(e.target.value.toUpperCase())}  // Actualiza el valor
        className="border border-gray-400 px-4 py-2 text-lg uppercase"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 font-semibold rounded"
      >
        Enviar
      </button>
    </form>
  );
};

export default Input;