var http = require('http');
var express = require('express');
var colors = require('colors');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var app = express();

app.use(express.static('./public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.set('views', './views');

mongoose.connect('mongodb+srv://mabilymachado:mabiduda@cluster0.zl15qjy.mongodb.net/blog')
.then(function(){
    console.log("Banco conectado!");
})
.catch(function(err){
    console.log(err);
});

// MODELOS
const Usuario = require('./modelos/usuarios');
const Carro = require('./modelos/carros');

// SERVIDOR
var server = http.createServer(app);
server.listen(80);

console.log('Servidor rodando ...'.rainbow);




// HOME (opcional se você usa)

app.get('/', function(req, res){
    res.render('home');
});




// LISTAR CARROS
app.get('/carros', async function(req, res){
    const carros = await Carro.find();
    res.render('carros', { carros });
});




// GERÊNCIA DE CARROS (NOVO)

app.get('/gerenciarCarro', async function(req, res){
    const carros = await Carro.find();
    res.render('gerenciarCarro', { carros });
});


// NOVO CARRO
app.get('/novoCarro', function(req, res){
    res.render('novoCarro');
});

app.post('/novoCarro', async function(req, res){

    await Carro.create({
        marca: req.body.marca,
        modelo: req.body.modelo,
        ano: req.body.ano,
        qtde_disponivel: req.body.qtde
    });

    res.redirect('/carros');
});


// EDITAR CARRO

app.get('/editar/:id', async function(req, res){

    const carro = await Carro.findById(req.params.id);

    res.render('editarCarro', { carro });

});

app.post('/editar/:id', async function(req, res){

    await Carro.findByIdAndUpdate(req.params.id, {
        marca: req.body.marca,
        modelo: req.body.modelo,
        ano: req.body.ano,
        qtde_disponivel: req.body.qtde
    });

    res.redirect('/carros');
});




// VENDER CARRO

app.get('/vender/:id', async function(req, res){

    const carro = await Carro.findById(req.params.id);

    if(carro.qtde_disponivel > 0){
        carro.qtde_disponivel--;
        await carro.save();
    }

    res.redirect('/gerenciarCarro');
});




// DELETAR CARRO

app.get('/deletar/:id', async function(req, res){

    await Carro.findByIdAndDelete(req.params.id);

    res.redirect('/gerenciarCarro');
});

// cadastro de usuário (opcional)
app.get('/cadastro', function(req, res){
    res.render('cadastro');
});

app.post('/cadastro', async function(req, res){

    await Usuario.create({
        nome: req.body.nome,
        login: req.body.login,
        senha: req.body.senha
    });

    res.redirect('/login');
});

// login de usuário (opcional)
app.get('/login', function(req, res){
    res.render('login');
});

app.post('/login', async function(req, res){

    const usuario = await Usuario.findOne({
        login: req.body.login,
        senha: req.body.senha
    });

    if(usuario){
        res.redirect('/carros');
    } else {
        res.send('Login inválido');
    }
});