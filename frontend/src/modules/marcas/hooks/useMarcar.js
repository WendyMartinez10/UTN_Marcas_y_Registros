import { useState } from 'react';
import { registrarMarca } from '../services/marcas.service.js';
import { registrarDispositivo } from '../../dispositivos/services/dispositivos.service.js';

export const useMarcar = () => {
    const [mensajeMarca, setMensajeMarca] = useState(null);
    const [errorMarca, setErrorMarca] = useState(null);
    const [mensajeDisp, setMensajeDisp] = useState(null);
    const [errorDisp, setErrorDisp] = useState(null);
    const [nombreDisp, setNombreDisp] = useState('');

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