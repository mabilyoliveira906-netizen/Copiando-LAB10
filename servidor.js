var http = require('http');
var express = require('express');
var colors = require('colors');
var bodyParser = require('body-parser');

var app = express();
app.use(express.static('./public'));
app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json())
app.set('view engine', 'ejs')
app.set('views', './views');

var mongodb = require("mongodb");

const MongoClient = mongodb.MongoClient;


const uri = 'mongodb+srv://mabilymachado:mabiduda@cluster0.zl15qjy.mongodb.net/blog';

const client = new MongoClient(uri);


async function conectarMongo() {
    await client.connect();
    console.log("MongoDB conectado!");
}

conectarMongo();

var server = http.createServer(app);
server.listen(80);

console.log('Servidor rodando ...'.rainbow);

app.get('/', function (requisicao, resposta){
resposta.redirect('loja.html')
})

app.get('/inicio', function (requisicao, resposta){
var nome = requisicao.query.info;
console.log(nome);
})

app.post('/inicio', function (requisicao, resposta){
var data = requisicao.body.data;
console.log(data);
})

app.post('/cadastro', function (requisicao, resposta){

console.log(requisicao.body);

var db = client.db("blog");

var nome = requisicao.body.nome;
var sobrenome = requisicao.body.sobrenome;
var nascimento = requisicao.body.nascimento;
var civil = requisicao.body.civil;

db.collection("usuarios").insertOne({
    nome,
    sobrenome,
    nascimento,
    civil
});

resposta.render('resposta_usuario', {nome, sobrenome, nascimento, civil})
})


app.post("/cadastro_produto", (requisicao, resposta) => {

    var db = client.db("blog");

    db.collection("produtos").insertOne({
        nome_produto: requisicao.body.nome_produto,
        descricao_produto: requisicao.body.descricao_produto,
        preco_produto: requisicao.body.preco_produto
    });

    resposta.render("resposta_produto", {
        nome_produto: requisicao.body.nome_produto,
        descricao_produto: requisicao.body.descricao_produto,
        preco_produto: requisicao.body.preco_produto
    });
});