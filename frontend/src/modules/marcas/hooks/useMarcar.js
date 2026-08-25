import { useState } from 'react';
import { registrarMarca } from '../services/marcas.service.js';
import { registrarDispositivo } from '../../dispositivos/services/dispositivos.service.js';
import { useAutoDismiss } from '../../../shared/hooks/useAutoDismiss.js';

export const useMarcar = () => {
    const [mensajeMarca, setMensajeMarca] = useState(null);
    const [errorMarca, setErrorMarca] = useState(null);
    const [mensajeDisp, setMensajeDisp] = useState(null);
    const [errorDisp, setErrorDisp] = useState(null);
    const [nombreDisp, setNombreDisp] = useState('');

    useAutoDismiss(mensajeMarca, setMensajeMarca);
    useAutoDismiss(errorMarca, setErrorMarca);
    useAutoDismiss(mensajeDisp, setMensajeDisp);
    useAutoDismiss(errorDisp, setErrorDisp);

    const handleMarcar = async () => {
        setMensajeMarca(null);
        setErrorMarca(null);
        try {
            const res = await registrarMarca();
            setMensajeMarca(res.data.message);
        } catch (err) {
            setErrorMarca(err.message);
        }
    };

    const handleRegistrarDispositivo = async (e) => {
        e.preventDefault();
        setMensajeDisp(null);
        setErrorDisp(null);
        try {
            await registrarDispositivo({ nombre: nombreDisp });
            setMensajeDisp('Dispositivo registrado correctamente. Ya puedes marcar.');
            setNombreDisp('');
        } catch (err) {
            setErrorDisp(err.message);
        }
    };

    return {
        mensajeMarca,
        errorMarca,
        mensajeDisp,
        errorDisp,
        nombreDisp,
        setNombreDisp,
        handleMarcar,
        handleRegistrarDispositivo
    };
};
