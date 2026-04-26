const mongoose = require('mongoose');

const conectarDB = async () => {
  try {
    const conexion = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB conectado: ${conexion.connection.host}`);
    console.log(`📦 Base de datos: ${conexion.connection.name}`);
  } catch (error) {
    console.error(`❌ Error al conectar con MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = conectarDB;
