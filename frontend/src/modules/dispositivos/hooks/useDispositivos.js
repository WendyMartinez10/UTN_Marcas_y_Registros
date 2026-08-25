import { useState, useEffect } from 'react';
import { getDispositivos, registrarDispositivo, cambiarEstadoDispositivo } from '../services/dispositivos.service.js';
import { useAutoDismiss } from '../../../shared/hooks/useAutoDismiss.js';

export const useDispositivos = () => {
    const [dispositivos, setDispositivos] = useState([]);
    const [form, setForm] = useState({ nombre: '', descripcion: '' });
    const [msg, setMsg] = useState(null);
    const [error, setError] = useState(null);

    useAutoDismiss(msg, setMsg);
    useAutoDismiss(error, setError);

    useEffect(() => {
        loadDispositivos();
    }, []);

    const loadDispositivos = async () => {
        try {
            const res = await getDispositivos();
            setDispositivos(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMsg(null);
        setError(null);
        try {
            await registrarDispositivo(form);
            setMsg('Dispositivo registrado. Ya puedes marcar asistencia desde este navegador.');
            setForm({ nombre: '', descripcion: '' });
            loadDispositivos();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleToggleEstado = async (disp) => {
        const nuevoEstado = disp.estado === 'activo' ? 'inactivo' : 'activo';
        try {
            await cambiarEstadoDispositivo(disp.id, nuevoEstado);
            loadDispositivos();
        } catch (err) {
            alert(err.message);
        }
    };

    return { dispositivos, form, setForm, msg, error, handleSubmit, handleToggleEstado };
};
