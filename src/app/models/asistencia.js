const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const asistenciaSchema = new mongoose.Schema({
    serialCarnet: String,
    fecha: String,
    fechaNumero: Number,
    horaEntrada: String,
    minutoEntrada: String,
    horaSalida: String,
    minutoSalida: String
});


module.exports = mongoose.model('Asistencia', asistenciaSchema);
