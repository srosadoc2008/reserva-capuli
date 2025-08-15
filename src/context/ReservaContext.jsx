import React, { createContext, useReducer, useContext, useMemo } from 'react';

const initialState = {
  reservas: [],
  filtro: '',
  seleccion: null,
  estadoCarga: 'idle', // 'idle' | 'loading' | 'success' | 'error'
  error: null
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_RESERVAS':
      return { ...state, reservas: action.payload };
    case 'SET_FILTRO':
      return { ...state, filtro: action.payload };
    case 'SET_SELECCION':
      return { ...state, seleccion: action.payload };
    case 'SET_CARGA':
      return { ...state, estadoCarga: action.payload.estado, error: action.payload.error || null };
    default:
      return state;
  }
}

const ReservaContext = createContext(null);

export function ReservaProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return <ReservaContext.Provider value={value}>{children}</ReservaContext.Provider>;
}

export function useReserva() {
  const ctx = useContext(ReservaContext);
  if (!ctx) throw new Error('useReserva debe usarse dentro de <ReservaProvider />');
  return ctx;
}

// Acciones sugeridas (para usar en componentes):
// dispatch({ type: 'SET_CARGA', payload: { estado: 'loading' } });
// dispatch({ type: 'SET_RESERVAS', payload: data });
// dispatch({ type: 'SET_SELECCION', payload: reserva });
// dispatch({ type: 'SET_FILTRO', payload: texto });
