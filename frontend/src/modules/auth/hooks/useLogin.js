import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth.js';
import { login, getProfile } from '../services/auth.service.js';

export const useLogin = () => {
    const [credenciales, setCredenciales] = useState({ identificador: '', password: '' });
    const [error, setError] = useState(null);
    const { setUser } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredenciales({ ...credenciales, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            await login(credenciales);

            // El login solo devuelve id, nombre_usuario y rol. Se pide el
            // perfil completo (correo, fecha_nacimiento, nombre_completo,
            // departamento_id) para que el Navbar y la pantalla de Perfil
            // muestren los datos correctos desde el primer momento, sin
            // esperar a un refresh de la página.
            const perfil = await getProfile();
            setUser(perfil.data);

            navigate('/');
        } catch (err) {
            setError(err.message);
        }
    };

    return { credenciales, error, handleChange, handleSubmit };
};
