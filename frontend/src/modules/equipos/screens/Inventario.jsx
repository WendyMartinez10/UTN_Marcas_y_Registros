import { useEquipos } from '../hooks/useEquipos.js';
import { getImagenEquipoUrl } from '../../../api/client.js';

export const Inventario = () => {
    const {
        equipos, form, editing, editingEstadoOriginal, errorForm, errorEliminar, confirmarEliminar,
        handleChange, handleSubmit, handleEdit, handleCancelEdit, handleDelete,
        cancelarEliminar, confirmarEliminarEquipo
    } = useEquipos();

    return (
        <div className="container mt-4 animate-fade-in-up">
            <h2 className="hero-gradient-text fw-bold mb-4">Inventario de Equipos</h2>

            <div className="glass-panel p-4 mb-4">
                <h5 className="fw-bold mb-3"><i className={`bi ${editing ? 'bi-pencil-square' : 'bi-plus-circle'} me-2 text-primary`}></i>{editing ? 'Editar Equipo' : 'Nuevo Equipo'}</h5>
                <form onSubmit={handleSubmit} className="row g-3">
                    <div className="col-md-3">
                        <input type="text" className="form-control form-control-glass" name="codigo" placeholder="Código" value={form.codigo} onChange={handleChange} required disabled={!!editing} />
                    </div>
                    <div className="col-md-4">
                        <input type="text" className="form-control form-control-glass" name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={handleChange} required />
                    </div>
                    <div className="col-md-2">
                        <select
                            className="form-select form-control-glass"
                            name="estado"
                            value={form.estado}
                            onChange={handleChange}
                            disabled={editingEstadoOriginal === 'prestado'}
                        >
                            <option value="disponible">Disponible</option>
                            {/* "Prestado" no es seleccionable manualmente: solo lo asigna
                                el sistema al registrar un préstamo (ver módulo Préstamos). */}
                            {editingEstadoOriginal === 'prestado' && <option value="prestado">Prestado</option>}
                            <option value="mantenimiento">Mantenimiento</option>
                            <option value="inactivo">Inactivo</option>
                        </select>
                        {editingEstadoOriginal === 'prestado' && (
                            <small className="text-muted d-block mt-1">
                                Este equipo está prestado. Registre la devolución desde "Préstamos" para cambiar su estado.
                            </small>
                        )}
                    </div>
                    <div className="col-md-3">
                        <input type="file" className="form-control form-control-glass" name="imagen" onChange={handleChange} accept="image/*" />
                    </div>
                    <div className="col-12 mt-4">
                        {errorForm && <div className="alert alert-danger p-2 text-center rounded-3 small">{errorForm}</div>}
                        <button type="submit" className="btn btn-premium px-4 me-2">{editing ? 'Actualizar' : 'Guardar Equipo'}</button>
                        {editing && <button type="button" className="btn btn-outline-danger px-4" onClick={handleCancelEdit}>Cancelar</button>}
                    </div>
                </form>
            </div>

            <div className="glass-panel overflow-hidden">
                {errorEliminar && <div className="alert alert-danger p-2 text-center rounded-3 small m-3 mb-0">{errorEliminar}</div>}
                <table className="table table-hover align-middle mb-0">
                    <thead className="bg-light">
                        <tr>
                            <th className="border-0 px-4 py-3 text-muted fw-semibold">Imagen</th>
                            <th className="border-0 px-4 py-3 text-muted fw-semibold">Código</th>
                            <th className="border-0 px-4 py-3 text-muted fw-semibold">Descripción</th>
                            <th className="border-0 px-4 py-3 text-muted fw-semibold">Estado</th>
                            <th className="border-0 px-4 py-3 text-muted fw-semibold text-end">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {equipos.length === 0 ? (
                            <tr><td colSpan="5" className="text-center py-4 text-muted">No hay equipos registrados en el inventario.</td></tr>
                        ) : equipos.map(eq => (
                            <tr key={eq.id}>
                                <td className="px-4">
                                    {eq.imagen ? (
                                        <img
                                            src={getImagenEquipoUrl(eq.imagen)}
                                            alt={`Imagen de ${eq.codigo}`}
                                            style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px' }}
                                        />
                                    ) : (
                                        <div
                                            className="d-flex align-items-center justify-content-center bg-light text-muted rounded"
                                            style={{ width: '48px', height: '48px' }}
                                            title="Sin imagen"
                                        >
                                            <i className="bi bi-image"></i>
                                        </div>
                                    )}
                                </td>
                                <td className="px-4 fw-bold">{eq.codigo}</td>
                                <td className="px-4">{eq.descripcion}</td>
                                <td className="px-4">
                                    <span className={`badge rounded-pill bg-${eq.estado === 'disponible' ? 'success' : eq.estado === 'prestado' ? 'warning' : 'danger'} bg-opacity-25 text-${eq.estado === 'disponible' ? 'success' : eq.estado === 'prestado' ? 'warning' : 'danger'} px-3 py-2`}>
                                        {eq.estado.toUpperCase()}
                                    </span>
                                </td>
                                <td className="px-4 text-end">
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-light text-primary me-2 shadow-sm rounded-circle"
                                        style={{
                                            width: '32px',
                                            height: '32px'
                                        }}
                                        onClick={() => handleEdit(eq)}
                                        disabled={eq.estado === 'prestado'}
                                        title={
                                            eq.estado === 'prestado'
                                                ? 'No se puede editar un equipo prestado'
                                                : 'Editar'
                                        }
                                    >
                                        <i className="bi bi-pencil"></i>
                                    </button>

                                    <button
                                        type="button"
                                        className="btn btn-sm btn-light text-danger shadow-sm rounded-circle"
                                        style={{
                                            width: '32px',
                                            height: '32px'
                                        }}
                                        onClick={() => handleDelete(eq.id)}
                                        disabled={
                                            eq.estado === 'prestado' ||
                                            eq.estado === 'mantenimiento'
                                        }
                                        title={
                                            eq.estado === 'prestado'
                                                ? 'No se puede eliminar un equipo prestado'
                                                : eq.estado === 'mantenimiento'
                                                    ? 'No se puede eliminar un equipo en mantenimiento'
                                                    : 'Eliminar'
                                        }
                                    >
                                        <i className="bi bi-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {confirmarEliminar && (
                <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center animate-fade-in-up" style={{backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060}}>
                    <div className="glass-panel p-4" style={{width: '420px', maxWidth: '90%'}}>
                        <div className="text-center mb-3">
                            <i className="bi bi-exclamation-triangle text-danger" style={{fontSize: '2.5rem'}}></i>
                        </div>
                        <p className="text-center fw-semibold mb-4">¿Eliminar equipo?</p>
                        <div className="d-flex justify-content-center gap-2">
                            <button className="btn btn-danger px-4" onClick={confirmarEliminarEquipo}>
                                <i className="bi bi-trash me-1"></i>Eliminar
                            </button>
                            <button className="btn btn-outline-secondary px-4" onClick={cancelarEliminar}>
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
