import { useEffect } from 'react';

/**
 * Limpia automáticamente un mensaje de alerta (error o éxito) después de
 * un tiempo determinado, para que no quede visible indefinidamente.
 *
 * @param {*} value - El valor actual del mensaje (string, null, false, etc.)
 * @param {Function} setValue - El setter de estado que limpia el mensaje.
 * @param {number} delay - Tiempo en milisegundos antes de limpiar (default 3000).
 */
export const useAutoDismiss = (value, setValue, delay = 3000) => {
    useEffect(() => {
        if (!value) return;
        const timer = setTimeout(() => setValue(null), delay);
        return () => clearTimeout(timer);
    }, [value, setValue, delay]);
};
