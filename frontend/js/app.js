// ==========================================
// CONFIGURACIÓN
// ==========================================
const API_URL = '/api/juegos';

// ==========================================
// ESTADO DE LA APLICACIÓN
// ==========================================
let juegos = [];
let modoEdicion = false;
let idJuegoActual = null;
let idJuegoEliminar = null;

// ==========================================
// REFERENCIAS DEL DOM
// ==========================================
const listaJuegos = document.getElementById('listaJuegos');
const mensajeVacio = document.getElementById('mensajeVacio');
const formularioJuego = document.getElementById('formularioJuego');
const modalFormulario = document.getElementById('modalFormulario');
const modalDetalle = document.getElementById('modalDetalle');
const modalConfirmacion = document.getElementById('modalConfirmacion');
const tituloModal = document.getElementById('tituloModal');
const contenidoDetalle = document.getElementById('contenidoDetalle');
const notificacion = document.getElementById('notificacion');

// Filtros
const inputBusqueda = document.getElementById('busqueda');
const filtroEstado = document.getElementById('filtroEstado');
const filtroGenero = document.getElementById('filtroGenero');
const filtroPlataforma = document.getElementById('filtroPlataforma');

// Botones
const btnAgregar = document.getElementById('btnAgregar');
const btnCancelar = document.getElementById('btnCancelar');
const cerrarModal = document.getElementById('cerrarModal');
const cerrarDetalle = document.getElementById('cerrarDetalle');
const btnCancelarEliminar = document.getElementById('btnCancelarEliminar');
const btnConfirmarEliminar = document.getElementById('btnConfirmarEliminar');

// ==========================================
// INICIALIZACIÓN
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  cargarJuegos();
  cargarEstadisticas();
  configurarEventos();
});

function configurarEventos() {
  // Botón agregar -> abre el modal
  btnAgregar.addEventListener('click', abrirModalCrear);

  // Cerrar modales
  btnCancelar.addEventListener('click', cerrarModalFormulario);
  cerrarModal.addEventListener('click', cerrarModalFormulario);
  cerrarDetalle.addEventListener('click', () => modalDetalle.classList.add('hidden'));
  btnCancelarEliminar.addEventListener('click', () => {
    modalConfirmacion.classList.add('hidden');
    idJuegoEliminar = null;
  });

  // Confirmar eliminación
  btnConfirmarEliminar.addEventListener('click', confirmarEliminar);

  // Cerrar al hacer clic en el fondo del modal
  modalFormulario.addEventListener('click', (e) => {
    if (e.target === modalFormulario) cerrarModalFormulario();
  });
  modalDetalle.addEventListener('click', (e) => {
    if (e.target === modalDetalle) modalDetalle.classList.add('hidden');
  });

  // Submit del formulario
  formularioJuego.addEventListener('submit', manejarSubmit);

  // Filtros y búsqueda en tiempo real
  inputBusqueda.addEventListener('input', cargarJuegos);
  filtroEstado.addEventListener('change', cargarJuegos);
  filtroGenero.addEventListener('change', cargarJuegos);
  filtroPlataforma.addEventListener('change', cargarJuegos);

  // Contador de caracteres en comentarios
  const comentarios = document.getElementById('comentarios');
  const contadorComentarios = document.getElementById('contador-comentarios');
  comentarios.addEventListener('input', () => {
    contadorComentarios.textContent = `${comentarios.value.length} / 500`;
  });
}

// ==========================================
// CARGAR DATOS
// ==========================================
async function cargarJuegos() {
  try {
    const params = new URLSearchParams();
    if (inputBusqueda.value) params.append('busqueda', inputBusqueda.value);
    if (filtroEstado.value !== 'Todos') params.append('estado', filtroEstado.value);
    if (filtroGenero.value !== 'Todos') params.append('genero', filtroGenero.value);
    if (filtroPlataforma.value !== 'Todos') params.append('plataforma', filtroPlataforma.value);

    const url = params.toString() ? `${API_URL}?${params.toString()}` : API_URL;
    const respuesta = await fetch(url);

    if (!respuesta.ok) throw new Error('Error al cargar los juegos');

    juegos = await respuesta.json();
    renderizarJuegos();
  } catch (error) {
    console.error('Error:', error);
    mostrarNotificacion('Error al cargar los juegos', 'error');
  }
}

async function cargarEstadisticas() {
  try {
    const respuesta = await fetch(`${API_URL}/estadisticas`);
    if (!respuesta.ok) throw new Error('Error al cargar estadísticas');

    const stats = await respuesta.json();

    document.getElementById('statTotal').textContent = stats.total;
    document.getElementById('statPendientes').textContent = stats.pendientes;
    document.getElementById('statJugando').textContent = stats.jugando;
    document.getElementById('statTerminados').textContent = stats.terminados;
    document.getElementById('statPromedio').textContent = stats.promedioCalificacion.toFixed(1);
    document.getElementById('statHoras').textContent = stats.totalHoras;
  } catch (error) {
    console.error('Error al cargar estadísticas:', error);
  }
}

// ==========================================
// RENDERIZAR JUEGOS
// ==========================================
function renderizarJuegos() {
  listaJuegos.innerHTML = '';

  if (juegos.length === 0) {
    mensajeVacio.classList.remove('hidden');
    listaJuegos.classList.add('hidden');
    return;
  }

  mensajeVacio.classList.add('hidden');
  listaJuegos.classList.remove('hidden');

  juegos.forEach((juego) => {
    const card = crearTarjetaJuego(juego);
    listaJuegos.appendChild(card);
  });
}

function crearTarjetaJuego(juego) {
  const card = document.createElement('div');
  card.className = 'game-card';

  const calificacion = juego.calificacion > 0
    ? `<div class="game-card-rating">⭐ ${juego.calificacion.toFixed(1)}</div>`
    : '';

  card.innerHTML = `
    <div class="game-card-header">
      <h3 class="game-card-title">${escapeHtml(juego.titulo)}</h3>
      ${calificacion}
    </div>
    <div class="game-card-info">
      <span class="tag tag-estado estado-${juego.estado}">${juego.estado}</span>
      <span class="tag tag-genero">${juego.genero}</span>
      <span class="tag tag-plataforma">${juego.plataforma}</span>
    </div>
    <div class="game-card-meta">
      ${juego.horasJugadas > 0 ? `⏱️ ${juego.horasJugadas} horas jugadas` : 'Sin horas registradas'}
    </div>
    <div class="game-card-actions">
      <button class="btn btn-secondary btn-sm btn-icon" data-action="ver">
        👁️ Ver
      </button>
      <button class="btn btn-primary btn-sm btn-icon" data-action="editar">
        ✏️ Editar
      </button>
      <button class="btn btn-danger btn-sm btn-icon" data-action="eliminar">
        🗑️
      </button>
    </div>
  `;

  // Listeners para los botones
  card.querySelector('[data-action="ver"]').addEventListener('click', (e) => {
    e.stopPropagation();
    mostrarDetalle(juego);
  });

  card.querySelector('[data-action="editar"]').addEventListener('click', (e) => {
    e.stopPropagation();
    abrirModalEditar(juego);
  });

  card.querySelector('[data-action="eliminar"]').addEventListener('click', (e) => {
    e.stopPropagation();
    pedirConfirmacionEliminar(juego);
  });

  // Click sobre la tarjeta -> ver detalle
  card.addEventListener('click', () => mostrarDetalle(juego));

  return card;
}

// ==========================================
// MODAL: CREAR
// ==========================================
function abrirModalCrear() {
  modoEdicion = false;
  idJuegoActual = null;
  tituloModal.textContent = '➕ Agregar Juego';
  formularioJuego.reset();
  document.getElementById('juegoId').value = '';
  document.getElementById('contador-comentarios').textContent = '0 / 500';
  limpiarErrores();
  modalFormulario.classList.remove('hidden');
  document.getElementById('titulo').focus();
}

// ==========================================
// MODAL: EDITAR
// ==========================================
function abrirModalEditar(juego) {
  modoEdicion = true;
  idJuegoActual = juego._id;
  tituloModal.textContent = '✏️ Editar Juego';

  document.getElementById('juegoId').value = juego._id;
  document.getElementById('titulo').value = juego.titulo;
  document.getElementById('genero').value = juego.genero;
  document.getElementById('plataforma').value = juego.plataforma;
  document.getElementById('estado').value = juego.estado;
  document.getElementById('calificacion').value = juego.calificacion;
  document.getElementById('horasJugadas').value = juego.horasJugadas;
  document.getElementById('comentarios').value = juego.comentarios || '';
  document.getElementById('contador-comentarios').textContent =
    `${(juego.comentarios || '').length} / 500`;

  limpiarErrores();
  modalFormulario.classList.remove('hidden');
}

function cerrarModalFormulario() {
  modalFormulario.classList.add('hidden');
  formularioJuego.reset();
  modoEdicion = false;
  idJuegoActual = null;
  limpiarErrores();
}

// ==========================================
// VALIDACIÓN DEL FORMULARIO (CLIENTE)
// ==========================================
function validarFormulario(datos) {
  const errores = {};

  if (!datos.titulo || datos.titulo.trim().length < 2) {
    errores.titulo = 'El título debe tener al menos 2 caracteres';
  } else if (datos.titulo.length > 100) {
    errores.titulo = 'El título no puede superar 100 caracteres';
  }

  if (!datos.genero) errores.genero = 'Selecciona un género';
  if (!datos.plataforma) errores.plataforma = 'Selecciona una plataforma';

  if (datos.calificacion < 0 || datos.calificacion > 10) {
    errores.calificacion = 'La calificación debe estar entre 0 y 10';
  }

  if (datos.horasJugadas < 0) {
    errores.horasJugadas = 'Las horas no pueden ser negativas';
  }

  return errores;
}

function mostrarErrores(errores) {
  limpiarErrores();
  Object.keys(errores).forEach((campo) => {
    const elementoError = document.getElementById(`error-${campo}`);
    const input = document.getElementById(campo);
    if (elementoError) elementoError.textContent = errores[campo];
    if (input) input.classList.add('error');
  });
}

function limpiarErrores() {
  document.querySelectorAll('.error-message').forEach((el) => (el.textContent = ''));
  document.querySelectorAll('.error').forEach((el) => el.classList.remove('error'));
}

// ==========================================
// SUBMIT (CREAR/ACTUALIZAR)
// ==========================================
async function manejarSubmit(e) {
  e.preventDefault();

  const datos = {
    titulo: document.getElementById('titulo').value.trim(),
    genero: document.getElementById('genero').value,
    plataforma: document.getElementById('plataforma').value,
    estado: document.getElementById('estado').value,
    calificacion: parseFloat(document.getElementById('calificacion').value) || 0,
    horasJugadas: parseFloat(document.getElementById('horasJugadas').value) || 0,
    comentarios: document.getElementById('comentarios').value.trim()
  };

  // Validar en el cliente
  const errores = validarFormulario(datos);
  if (Object.keys(errores).length > 0) {
    mostrarErrores(errores);
    return;
  }

  try {
    let respuesta;
    if (modoEdicion) {
      respuesta = await fetch(`${API_URL}/${idJuegoActual}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      });
    } else {
      respuesta = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      });
    }

    const resultado = await respuesta.json();

    if (!respuesta.ok) {
      if (resultado.errores) {
        mostrarNotificacion(resultado.errores.join(', '), 'error');
      } else {
        mostrarNotificacion(resultado.mensaje || 'Error al guardar', 'error');
      }
      return;
    }

    cerrarModalFormulario();
    mostrarNotificacion(
      modoEdicion ? '✅ Juego actualizado correctamente' : '✅ Juego agregado correctamente',
      'success'
    );

    await cargarJuegos();
    await cargarEstadisticas();
  } catch (error) {
    console.error('Error:', error);
    mostrarNotificacion('Error al conectar con el servidor', 'error');
  }
}

// ==========================================
// MOSTRAR DETALLE
// ==========================================
function mostrarDetalle(juego) {
  const fechaCreacion = new Date(juego.createdAt).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const fechaActualizacion = new Date(juego.updatedAt).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  contenidoDetalle.innerHTML = `
    <div class="detalle-grid">
      <div class="detalle-row">
        <span class="detalle-label">Título</span>
        <span class="detalle-value"><strong>${escapeHtml(juego.titulo)}</strong></span>
      </div>
      <div class="detalle-row">
        <span class="detalle-label">Estado</span>
        <span class="detalle-value">
          <span class="tag tag-estado estado-${juego.estado}">${juego.estado}</span>
        </span>
      </div>
      <div class="detalle-row">
        <span class="detalle-label">Género</span>
        <span class="detalle-value">${juego.genero}</span>
      </div>
      <div class="detalle-row">
        <span class="detalle-label">Plataforma</span>
        <span class="detalle-value">${juego.plataforma}</span>
      </div>
      <div class="detalle-row">
        <span class="detalle-label">Calificación</span>
        <span class="detalle-value">
          ${juego.calificacion > 0 ? `⭐ ${juego.calificacion.toFixed(1)} / 10` : 'Sin calificar'}
        </span>
      </div>
      <div class="detalle-row">
        <span class="detalle-label">Horas jugadas</span>
        <span class="detalle-value">${juego.horasJugadas} horas</span>
      </div>
      <div class="detalle-row">
        <span class="detalle-label">Comentarios</span>
        <span class="detalle-value">${juego.comentarios ? escapeHtml(juego.comentarios) : '<em>Sin comentarios</em>'}</span>
      </div>
      <div class="detalle-row">
        <span class="detalle-label">Agregado el</span>
        <span class="detalle-value">${fechaCreacion}</span>
      </div>
      <div class="detalle-row">
        <span class="detalle-label">Última edición</span>
        <span class="detalle-value">${fechaActualizacion}</span>
      </div>
    </div>
  `;

  modalDetalle.classList.remove('hidden');
}

// ==========================================
// ELIMINAR
// ==========================================
function pedirConfirmacionEliminar(juego) {
  idJuegoEliminar = juego._id;
  document.getElementById('nombreEliminar').textContent = juego.titulo;
  modalConfirmacion.classList.remove('hidden');
}

async function confirmarEliminar() {
  if (!idJuegoEliminar) return;

  try {
    const respuesta = await fetch(`${API_URL}/${idJuegoEliminar}`, {
      method: 'DELETE'
    });

    if (!respuesta.ok) throw new Error('Error al eliminar');

    modalConfirmacion.classList.add('hidden');
    idJuegoEliminar = null;
    mostrarNotificacion('🗑️ Juego eliminado correctamente', 'success');

    await cargarJuegos();
    await cargarEstadisticas();
  } catch (error) {
    console.error('Error:', error);
    mostrarNotificacion('Error al eliminar el juego', 'error');
  }
}

// ==========================================
// NOTIFICACIONES
// ==========================================
function mostrarNotificacion(mensaje, tipo = 'info') {
  notificacion.textContent = mensaje;
  notificacion.className = `notificacion ${tipo}`;
  notificacion.classList.remove('hidden');

  setTimeout(() => {
    notificacion.classList.add('hidden');
  }, 3000);
}

// ==========================================
// UTILIDADES
// ==========================================
function escapeHtml(texto) {
  const div = document.createElement('div');
  div.textContent = texto;
  return div.innerHTML;
}
