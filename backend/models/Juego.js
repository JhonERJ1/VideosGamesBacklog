const mongoose = require('mongoose');

const juegoSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: [true, 'El título es obligatorio'],
      trim: true,
      minlength: [2, 'El título debe tener al menos 2 caracteres'],
      maxlength: [100, 'El título no puede superar los 100 caracteres']
    },
    genero: {
      type: String,
      required: [true, 'El género es obligatorio'],
      enum: {
        values: [
          'Acción',
          'Aventura',
          'RPG',
          'Estrategia',
          'Deportes',
          'Carreras',
          'Shooter',
          'Puzzle',
          'Plataformas',
          'Simulación',
          'Terror',
          'Indie',
          'Otro'
        ],
        message: 'Género no válido'
      }
    },
    plataforma: {
      type: String,
      required: [true, 'La plataforma es obligatoria'],
      enum: {
        values: [
          'PC',
          'PlayStation 5',
          'PlayStation 4',
          'Xbox Series X/S',
          'Xbox One',
          'Nintendo Switch',
          'Mobile',
          'Otro'
        ],
        message: 'Plataforma no válida'
      }
    },
    estado: {
      type: String,
      required: [true, 'El estado es obligatorio'],
      enum: {
        values: ['Pendiente', 'Jugando', 'Terminado', 'Abandonado'],
        message: 'Estado no válido'
      },
      default: 'Pendiente'
    },
    calificacion: {
      type: Number,
      min: [0, 'La calificación mínima es 0'],
      max: [10, 'La calificación máxima es 10'],
      default: 0
    },
    horasJugadas: {
      type: Number,
      min: [0, 'Las horas no pueden ser negativas'],
      default: 0
    },
    comentarios: {
      type: String,
      trim: true,
      maxlength: [500, 'Los comentarios no pueden superar 500 caracteres'],
      default: ''
    }
  },
  {
    timestamps: true // crea createdAt y updatedAt automáticamente
  }
);

module.exports = mongoose.model('Juego', juegoSchema);
