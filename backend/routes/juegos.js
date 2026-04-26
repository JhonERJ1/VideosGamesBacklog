const express = require('express');
const router = express.Router();
const Juego = require('../models/Juego');

// GET /api/juegos - Obtener todos los juegos 
router.get('/', async (req, res) => {
  try {
    const { estado, genero, plataforma, busqueda } = req.query;
    const filtro = {};

    if (estado && estado !== 'Todos') filtro.estado = estado;
    if (genero && genero !== 'Todos') filtro.genero = genero;
    if (plataforma && plataforma !== 'Todos') filtro.plataforma = plataforma;
    if (busqueda) {
      filtro.titulo = { $regex: busqueda, $options: 'i' };
    }

    const juegos = await Juego.find(filtro).sort({ createdAt: -1 });
    res.json(juegos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener los juegos', error: error.message });
  }
});

// GET /api/juegos/estadisticas - Obtener estadísticas 
router.get('/estadisticas', async (req, res) => {
  try {
    const total = await Juego.countDocuments();
    const pendientes = await Juego.countDocuments({ estado: 'Pendiente' });
    const jugando = await Juego.countDocuments({ estado: 'Jugando' });
    const terminados = await Juego.countDocuments({ estado: 'Terminado' });
    const abandonados = await Juego.countDocuments({ estado: 'Abandonado' });

    const juegosConCalif = await Juego.find({ calificacion: { $gt: 0 } });
    const promedioCalificacion =
      juegosConCalif.length > 0
        ? juegosConCalif.reduce((acc, j) => acc + j.calificacion, 0) / juegosConCalif.length
        : 0;

    const totalHoras = await Juego.aggregate([
      { $group: { _id: null, total: { $sum: '$horasJugadas' } } }
    ]);

    res.json({
      total,
      pendientes,
      jugando,
      terminados,
      abandonados,
      promedioCalificacion: Number(promedioCalificacion.toFixed(2)),
      totalHoras: totalHoras.length > 0 ? totalHoras[0].total : 0
    });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener estadísticas', error: error.message });
  }
});

// GET /api/juegos/:id - Obtener un juego específico
router.get('/:id', async (req, res) => {
  try {
    const juego = await Juego.findById(req.params.id);
    if (!juego) {
      return res.status(404).json({ mensaje: 'Juego no encontrado' });
    }
    res.json(juego);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener el juego', error: error.message });
  }
});

// POST /api/juegos - Crear un nuevo juego
router.post('/', async (req, res) => {
  try {
    const nuevoJuego = new Juego(req.body);
    const juegoGuardado = await nuevoJuego.save();
    res.status(201).json(juegoGuardado);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errores = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ mensaje: 'Error de validación', errores });
    }
    res.status(500).json({ mensaje: 'Error al crear el juego', error: error.message });
  }
});

// PUT /api/juegos/:id - Actualizar un juego
router.put('/:id', async (req, res) => {
  try {
    const juegoActualizado = await Juego.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!juegoActualizado) {
      return res.status(404).json({ mensaje: 'Juego no encontrado' });
    }
    res.json(juegoActualizado);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errores = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ mensaje: 'Error de validación', errores });
    }
    res.status(500).json({ mensaje: 'Error al actualizar el juego', error: error.message });
  }
});

// DELETE /api/juegos/:id - Eliminar un juego
router.delete('/:id', async (req, res) => {
  try {
    const juegoEliminado = await Juego.findByIdAndDelete(req.params.id);
    if (!juegoEliminado) {
      return res.status(404).json({ mensaje: 'Juego no encontrado' });
    }
    res.json({ mensaje: 'Juego eliminado correctamente', juego: juegoEliminado });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar el juego', error: error.message });
  }
});

module.exports = router;
