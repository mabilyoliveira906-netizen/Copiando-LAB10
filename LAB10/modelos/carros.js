const mongoose = require('mongoose');

const CarroSchema = new mongoose.Schema({

    marca: String,
    modelo: String,
    ano: Number,
    qtde_disponivel: Number

});

module.exports = mongoose.model('Carro', CarroSchema);