import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/auth.service.js';
import { getDepartamentos } from '../../departamentos/services/departamentos.service.js';
import { useAutoDismiss } from '../../../shared/hooks/useAutoDismiss.js';

export const useRegistro = () => {
    const [formData, setFormData] = useState({
        nombre_usuario: '',
        nombre_completo: '',
        fecha_nacimiento: '',
        correo: '',
        password: '',
        confirmar_password: '',
        departamento_id: ''
    });
    const [departamentos, setDepartamentos] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    useAutoDismiss(error, setError);

    useEffect(() => {
        const getDeps = async () => {
            try {
                const res = await getDepartamentos();
                if (res.data) setDepartamentos(res.data);
            } catch (err) {
                console.error('Error al cargar departamentos', err);
            }
        };
        getDeps();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const calcularEdad = (fechaNacimiento) => {
        const hoy = new Date();
        const nacimiento = new Date(fechaNacimiento);
        let edad = hoy.getFullYear() - nacimiento.getFullYear();
        const mes = hoy.getMonth() - nacimiento.getMonth();
        if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
            edad--;
        }
        return edad;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (formData.password !== formData.confirmar_password) {
            setError('La contraseña y su confirmación no coinciden.');
            return;
        }

        if (!formData.fecha_nacimiento) {
            setError('Debe indicar una fecha de nacimiento.');
            return;
        }

        const edad = calcularEdad(formData.fecha_nacimiento);
        if (edad < 17 || edad > 100) {
            setError('La edad debe estar entre 17 y 100 años para poder registrarse.');
            return;
        }

        try {
            await register(formData);
            setSuccess(true);
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.message);
        }
    };

    return { formData, departamentos, error, success, handleChange, handleSubmit };
};
