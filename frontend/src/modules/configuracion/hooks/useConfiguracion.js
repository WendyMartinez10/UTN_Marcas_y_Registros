import { useState, useEffect } from 'react';
import { getConfiguracion, actualizarConfiguracion } from '../services/configuracion.service.js';
import { useAutoDismiss } from '../../../shared/hooks/useAutoDismiss.js';

export const useConfiguracion = () => {
    const [config, setConfig] = useState({});
    const [msg, setMsg] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useAutoDismiss(msg, setMsg);
    useAutoDismiss(error, setError);

    useEffect(() => {
        loadConfig();
    }, []);

    const loadConfig = async () => {
        setLoading(true);
        try {
            const res = await getConfiguracion();
            setConfig(res.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (clave, valor) => {
        if (/^-?\d*\.?\d*$/.test(valor) && valor.includes('-')) return;
        setConfig({ ...config, [clave]: valor });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMsg(null);
        setError(null);

        const camposNumericos = ['tiempo_max_sesion_min', 'tamano_max_archivo_mb'];
        for (const campo of camposNumericos) {
            if (campo in config && Number(config[campo]) < 0) {
                setError('Los valores numéricos de la configuración no pueden ser negativos.');
                return;
            }
        }

        try {
            await actualizarConfiguracion(config);
            setMsg('Configuración actualizada correctamente.');
        } catch (err) {
            setError(err.message);
        }
    };

    return { config, msg, error, loading, handleChange, handleSubmit };
};
