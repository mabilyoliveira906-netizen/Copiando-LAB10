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

// Conectando ao MongoDB

var mongodb = require("mongodb");

const MongoClient = mongodb.MongoClient;


const uri = 'mongodb+srv://mabilymachado:mabiduda@cluster0.zl15qjy.mongodb.net/blog';

const client = new MongoClient(uri);


async function conectarMongo() {
    await client.connect();
    console.log("MongoDB conectado!");
}

conectarMongo();
// Criando o servidor HTTP para rodar a aplicação porta 80

var server = http.createServer(app);
server.listen(80);

console.log('Servidor rodando ...'.rainbow);

app.get('/', function (requisicao, resposta){
resposta.redirect('home.html')
})

app.get('/inicio', function (requisicao, resposta){
var nome = requisicao.query.info;
console.log(nome);
})

app.post('/inicio', function (requisicao, resposta){
var data = requisicao.body.data;
console.log(data);
})

// Salvando um usuário e cadastrando um usuario

app.post('/cadastro', async function (requisicao, resposta){

    console.log(requisicao.body);

    var db = client.db("blog");

    var nome = requisicao.body.nome;
    var sobrenome = requisicao.body.sobrenome;
    var nascimento = requisicao.body.nascimento;
    var civil = requisicao.body.civil;

    await db.collection("usuarios").insertOne({
        nome,
        sobrenome,
        nascimento,
        civil
    });

    resposta.render('resposta_usuario', { nome, sobrenome,nascimento, civil});

});

// cadastro do produto - salvando um produto
app.post("/cadastro_produto", async (requisicao, resposta) => {

    var db = client.db("blog");

    await db.collection("produtos").insertOne({
        nome_produto: requisicao.body.nome_produto,
        preco_produto: requisicao.body.preco_produto,
        quantidade: Number(requisicao.body.quantidade)
    });

    resposta.render("resposta_produto", {
        nome_produto: requisicao.body.nome_produto,
        preco_produto: requisicao.body.preco_produto,
        quantidade: Number(requisicao.body.quantidade)
    });

});

// atualização do código para o LAB10 Salvando um produto


  app.post("/cadastrar_produto", function(req, resp) {
    var data = { db_nome: req.body.nome, db_login: req.body.login, db_senha: req.body.senha };

    usuarios.insertOne(data, function (err) {
      console.log(err)
      if (err) {
        resp.render('resposta_produto', {resposta: "Erro ao cadastrar produto!"})
      }else {
        resp.render('resposta_produto', {resposta: "Produto cadastrado com sucesso!"})        
      };
    });
   
  });

  
// remover produto

app.get("/remover/:id", async function(req, resp){

    var db = client.db("blog");

    await db.collection("produtos").deleteOne({
        _id: new mongodb.ObjectId(req.params.id)
    });

    resp.redirect("/gerenciar_produto");
});

// vender produto

app.get("/vender/:id", async function(req, resp){

    var db = client.db("blog");

    await db.collection("produtos").updateOne(
        { _id: new mongodb.ObjectId(req.params.id) },
        { $inc: { quantidade: -1 } }
    );

    resp.redirect("/gerenciar_produto");
});
  
  // gerenciamento de produtos

  app.get("/gerenciar_produto", async function(req, res){

    var db = client.db("blog");

    var produtos = await db.collection("produtos").find().toArray();

    res.render("gerenciar_produto", { produtos });

});


