import { createContext, useContext } from 'react';

export const ToastsContext = createContext(null);

export function useToasts() {
  const toasts = useContext(ToastsContext);
  if (!toasts) throw new Error('ToastsContext.Provider is missing');
  return toasts;
}
