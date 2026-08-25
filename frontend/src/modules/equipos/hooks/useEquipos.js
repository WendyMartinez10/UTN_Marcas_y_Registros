import { useState, useEffect } from 'react';
import { getEquipos, crearEquipo, actualizarEquipo, eliminarEquipo } from '../services/equipos.service.js';
import { useAutoDismiss } from '../../../shared/hooks/useAutoDismiss.js';

const initialForm = { codigo: '', descripcion: '', estado: 'disponible', imagen: null };

export const useEquipos = () => {
    const [equipos, setEquipos] = useState([]);
    const [form, setForm] = useState(initialForm);
    const [editing, setEditing] = useState(null);
    const [editingEstadoOriginal, setEditingEstadoOriginal] = useState(null);
    const [errorForm, setErrorForm] = useState(null);
    const [errorEliminar, setErrorEliminar] = useState(null);
    const [confirmarEliminar, setConfirmarEliminar] = useState(null);

    useAutoDismiss(errorForm, setErrorForm);
    useAutoDismiss(errorEliminar, setErrorEliminar);

    useEffect(() => {
        loadEquipos();
    }, []);

    const loadEquipos = async () => {
        try {
            const res = await getEquipos();
            setEquipos(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleChange = (e) => {
        if (e.target.name === 'imagen') {
            setForm({ ...form, imagen: e.target.files[0] });
        } else {
            setForm({ ...form, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorForm(null);
        const formData = new FormData();
        formData.append('codigo', form.codigo);
        formData.append('descripcion', form.descripcion);
        formData.append('estado', form.estado);
        if (form.imagen) formData.append('imagen', form.imagen);

        try {
            if (editing) {
                await actualizarEquipo(editing, formData);
            } else {
                await crearEquipo(formData);
            }
            setForm(initialForm);
            setEditing(null);
            setEditingEstadoOriginal(null);
            loadEquipos();
        } catch (error) {
            setErrorForm(error.message);
        }
    };

    const handleEdit = (eq) => {
        setForm({ codigo: eq.codigo, descripcion: eq.descripcion, estado: eq.estado, imagen: null });
        setEditing(eq.id);
        setEditingEstadoOriginal(eq.estado);
    };

    const handleCancelEdit = () => {
        setEditing(null);
        setEditingEstadoOriginal(null);
        setForm(initialForm);
    };

    const handleDelete = (id) => {
        setErrorEliminar(null);
        setConfirmarEliminar(id);
    };

    const cancelarEliminar = () => setConfirmarEliminar(null);

    const confirmarEliminarEquipo = async () => {
        const id = confirmarEliminar;
        setConfirmarEliminar(null);
        setErrorEliminar(null);
        try {
            await eliminarEquipo(id);
            loadEquipos();
        } catch (error) {
            setErrorEliminar(error.message);
        }
    };

    return {
        equipos, form, editing, editingEstadoOriginal, errorForm, errorEliminar, confirmarEliminar,
        handleChange, handleSubmit, handleEdit, handleCancelEdit, handleDelete,
        cancelarEliminar, confirmarEliminarEquipo
    };
};