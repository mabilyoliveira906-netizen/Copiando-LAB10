const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({

    nome: String,
    login: String,
    senha: String

});

module.exports = mongoose.model('Usuario', UsuarioSchema);
