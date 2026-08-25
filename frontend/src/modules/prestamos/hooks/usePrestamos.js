import { useState, useEffect } from 'react';
import { getPrestamos, crearPrestamo, devolverCompleto, getDetalles, devolverDetalle } from '../services/prestamos.service.js';
import { getEquipos } from '../../equipos/services/equipos.service.js';

export const usePrestamos = () => {
    const [prestamos, setPrestamos] = useState([]);
    const [equiposDisponibles, setEquiposDisponibles] = useState([]);
    const [todosEquipos, setTodosEquipos] = useState([]);
    const [form, setForm] = useState({ usuario_id: '', equipos: [] });
    const [filtros, setFiltros] = useState({ usuario: '', fecha: '', estado: '', equipo: '' });
    const [detallesModal, setDetallesModal] = useState(null);
    const [msgPrestamo, setMsgPrestamo] = useState(null);
    const [errorPrestamo, setErrorPrestamo] = useState(null);
    const [errorAcciones, setErrorAcciones] = useState(null);
    const [errorModal, setErrorModal] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async (filtrosActuales = filtros) => {
        try {
            const params = Object.fromEntries(Object.entries(filtrosActuales).filter(([, v]) => v !== ''));
            const resP = await getPrestamos(params);
            setPrestamos(resP.data);

            const resE = await getEquipos();
            setTodosEquipos(resE.data);
            setEquiposDisponibles(resE.data.filter(e => e.estado === 'disponible'));
        } catch (error) {
            console.error(error);
        }
    };

    const handleFiltroChange = (e) => setFiltros({ ...filtros, [e.target.name]: e.target.value });

    const handleFiltrar = (e) => {
        e.preventDefault();
        loadData(filtros);
    };

    const handleLimpiarFiltros = () => {
        const vacio = { usuario: '', fecha: '', estado: '', equipo: '' };
        setFiltros(vacio);
        loadData(vacio);
    };

    const handleCheckbox = (e) => {
        const value = parseInt(e.target.value);
        if (e.target.checked) {
            setForm({ ...form, equipos: [...form.equipos, value] });
        } else {
            setForm({ ...form, equipos: form.equipos.filter(id => id !== value) });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMsgPrestamo(null);
        setErrorPrestamo(null);
        try {
            await crearPrestamo(form);
            setForm({ usuario_id: '', equipos: [] });
            loadData();
            setMsgPrestamo('Préstamo creado con éxito');
        } catch (error) {
            setErrorPrestamo(error.message);
        }
    };

    const handleDevolverCompleto = async (id) => {
        if (confirm('¿Marcar todo el préstamo como devuelto?')) {
            setErrorAcciones(null);
            try {
                await devolverCompleto(id);
                loadData();
            } catch (error) {
                setErrorAcciones(error.message);
            }
        }
    };

    const verDetalles = async (id) => {
        setErrorAcciones(null);
        try {
            const res = await getDetalles(id);
            setDetallesModal({ id, detalles: res.data });
        } catch (error) {
            setErrorAcciones(error.message);
        }
    };

    const cerrarDetalles = () => {
        setDetallesModal(null);
        setErrorModal(null);
    };

    const handleDevolverDetalle = async (prestamoId, detalleId) => {
        setErrorModal(null);
        try {
            await devolverDetalle(prestamoId, detalleId);
            verDetalles(prestamoId);
            loadData();
        } catch (error) {
            setErrorModal(error.message);
        }
    };

    return {
        prestamos, equiposDisponibles, todosEquipos, form, setForm, filtros, detallesModal,
        msgPrestamo, errorPrestamo, errorAcciones, errorModal,
        handleFiltroChange, handleFiltrar, handleLimpiarFiltros, handleCheckbox,
        handleSubmit, handleDevolverCompleto, verDetalles, cerrarDetalles, handleDevolverDetalle
    };
};