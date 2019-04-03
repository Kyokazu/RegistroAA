const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const asesoriaSchema = new mongoose.Schema({
    serialCarnetAmigo: String,
    serialCarnetEstudiante: String,
    nombreAmigo:String,
    nombreEstudiante: String,
    materia: String,
    tema: String,
    fecha: String,
    fechaNumero:Number
});


module.exports = mongoose.model('Asesoria', asesoriaSchema);
