import { useState } from 'react';
import { getReportes } from '../services/marcas.service.js';
import { API_URL } from '../../../api/client.js';

export const useReportes = () => {
    const [marcas, setMarcas] = useState([]);
    const [filtros, setFiltros] = useState({ anio: '', mes: '', dia: '', usuario: '', departamento: '' });

    const handleChange = (e) => {
        if (e.target.type === 'number' && e.target.value.includes('-')) return;
        setFiltros({ ...filtros, [e.target.name]: e.target.value });
    };

    const handleBuscar = async (e) => {
        e.preventDefault();
        try {
            const res = await getReportes(filtros);
            setMarcas(res.data);
        } catch (error) {
            alert(error.message);
        }
    };

    const handleExportar = (formato) => {
        const query = new URLSearchParams({ ...filtros, formato }).toString();
    
        window.open(`${API_URL}/marcas/exportar?${query}`, '_blank');
    };

    return { marcas, filtros, handleChange, handleBuscar, handleExportar };
};