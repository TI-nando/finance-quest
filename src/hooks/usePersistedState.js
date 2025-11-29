import { useState, useEffect } from "react";

// Esse Hook funciona igual ao useState, mas salva no navegador automaticamente
function usePersistedState(key, initialState) {
  const [state, setState] = useState(() => {
    // 1. Tenta ler o Save Game existente
    const storageValue = localStorage.getItem(key);

    if (storageValue) {
      return JSON.parse(storageValue); // Carrega o jogo salvo
    } else {
      return initialState; // Começa um jogo novo
    }
  });

  // 2. Sempre que o 'state' mudar, salva automaticamente
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
}

export default usePersistedState;
