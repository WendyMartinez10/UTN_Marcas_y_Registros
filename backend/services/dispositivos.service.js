import crypto from 'crypto';
import * as dispositivosModel from '../models/dispositivos.model.js';
import { AppError } from '../common/AppError.js';
import { toDispositivosPublico } from '../dtos/dispositivo.dto.js';

export const listarPorUsuario = async (usuarioId) => {
    const rows = await dispositivosModel.findByUsuarioId(usuarioId);
    return toDispositivosPublico(rows);
};

/**
 * Registra un nuevo dispositivo para el usuario. Cada registro genera
 * siempre un identificador propio con crypto.randomUUID(), de modo que un
 * mismo usuario pueda registrar varios dispositivos (laptop, celular,
 * equipo de la oficina, etc.), incluso desde el mismo navegador.
 *
 * El identificador recién creado se guarda en la cookie `device_id`
 * (esNuevo = true siempre), por lo que ese navegador queda asociado al
 * dispositivo que se acaba de registrar para efectos de marcar asistencia.
 */
export const registrar = async ({ usuarioId, nombre, descripcion }) => {
    const identificador = crypto.randomUUID();

    await dispositivosModel.create({ identificador, nombre, descripcion, usuario_id: usuarioId });

    return { identificador, esNuevo: true };
};

export const cambiarEstado = async ({ id, estado, usuarioId }) => {
    const result = await dispositivosModel.updateEstado(id, estado, usuarioId);
    if (!result.affectedRows) {
        throw new AppError('Dispositivo no encontrado', 404);
    }
};
