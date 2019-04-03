const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const usuarioSchema = new mongoose.Schema({
    serialCarnet: String,
    nombre: String,
    codigo: String,
    correo: String,
    tipo: String
});

module.exports = mongoose.model('Usuario', usuarioSchema);
