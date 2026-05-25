require("colors");

var http = require("http");
var express = require("express");
var bodyParser = require("body-parser")
var mongodb = require("mongodb");

var mongodb = require("mongodb");

const MongoClient = mongodb.MongoClient;


const uri = 'mongodb+srv://mabilymachado:mabiduda@cluster0.zl15qjy.mongodb.net/blog';

const client = new MongoClient(uri);


async function conectarMongo() {
    await client.connect();
    console.log("MongoDB conectado!");
}
conectarMongo();

var app = express();
app.use(express.static("./public"));
app.use(bodyParser.urlencoded({extended: false }))
app.use(bodyParser.json())
app.set('view engine', 'ejs')
app.set('views', './views');

var server = http.createServer(app);
server.listen(80);

console.log("Servidor rodando ...".rainbow);

////////////////////////////////////////////// 


app.get('/', function(requisicao, resposta){
    resposta.redirect('home.html');
})

app.get('/login', function(req, res){
    res.sendFile(__dirname + '/public/login.html');
});

app.get('/cadastrar_usuarios', function(req, res){
    res.sendFile(__dirname + '/public/cadastrar_usuarios.html');
});

app.get('/cadastrar_carros', function(req, res){
    res.sendFile(__dirname + '/public/cadastrar_carros.html');
});

app.get('/cadastrar',function(requisicao, resposta){
    let nome = requisicao.query.nome;
    let login = requisicao.query.login;
    let senha = requisicao.query.senha;
    resposta.render('resposta_usuarios', {metodo:"GET", nome, login, senha});
})

app.post('/cadastrar',function(requisicao, resposta){
    let nome = requisicao.body.nome;
    let login = requisicao.body.login;
    let senha = requisicao.body.senha;
    resposta.render('resposta_usuarios', {metodo:"POST", nome, login, senha});
})

app.get('/for', function(requisicao, resposta){
    let qtde = requisicao.query.qtde;
    resposta.render('for', {qtde})
})

////////////////////////////////////////////// 

var dbo = client.db("exemplo_bd");
var usuarios = dbo.collection("usuarios");

app.post("/cadastrar_usuario", function(req, resp) {
    var data = { db_nome: req.body.nome, db_login: req.body.login, db_senha: req.body.senha };

    usuarios.insertOne(data, function (err) {
      if (err) {
        resp.render('resposta_usuarios', {resposta: "Erro ao cadastrar usuário!"})
      }else {
        resp.render('resposta_usuarios', {resposta: "Usuário cadastrado com sucesso!"})        
      };
    });
});

app.post("/login_usuario", function(req, resp) {
    var data = {db_login: req.body.login, db_senha: req.body.senha };

    usuarios.find(data).toArray(function(err, items) {
      if (items.length == 0) {
        resp.render('resposta_login', {resposta: "Usuário/senha não encontrado!"})
      }else if (err) {
        resp.render('resposta_login', {resposta: "Erro ao logar usuário!"})
      }else {
        resp.render('resposta_login', {resposta: "Usuário logado com sucesso!"})        
      };
    });
});

app.post("/atualizar_usuario", function(req, resp) {
    var data = { db_login: req.body.login, db_senha: req.body.senha };
    var newData = { $set: {db_senha: req.body.novasenha} };

    usuarios.updateOne(data, newData, function (err, result) {
      if (result.modifiedCount == 0) {
        resp.render('resposta_usuarios', {resposta: "Usuário/senha não encontrado!"})
      }else if (err) {
        resp.render('resposta_usuarios', {resposta: "Erro ao atualizar usuário!"})
      }else {
        resp.render('resposta_usuarios', {resposta: "Usuário atualizado com sucesso!"})        
      };
    });
});

app.post("/remover_usuario", function(req, resp) {
    var data = { db_login: req.body.login, db_senha: req.body.senha };

    usuarios.deleteOne(data, function (err, result) {
      if (result.deletedCount == 0) {
        resp.render('resposta_usuarios', {resposta: "Usuário/senha não encontrado!"})
      }else if (err) {
        resp.render('resposta_usuarios', {resposta: "Erro ao remover usuário!"})
      }else {
        resp.render('resposta_usuarios', {resposta: "Usuário removido com sucesso!"})        
      };
    });
});