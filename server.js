const express = require('express')
const server = express()

//configuar o servidor para apresentar arquivos estáticos
server.use(express.static('public'))

//habilitar body do formulario
server.use(express.urlencoded({extended: true}))

//Configurar a conexão com o banco de dados
const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: 'gustavo',
    host: 'localhost',
    port: 5432,
    database: 'doe'
})

//Configurando o template engine
const nunjucks = require("nunjucks")
nunjucks.configure("./", {
    express: server,
    noCache: true,
})


//Configurar a apresentação da página
server.get("/", function(req, res){
    db.query("select * from donors", function(err, result){
        if (err) return res.send("Erro de Banco de Dados")

        const donors = result.rows
        return res.render("index.html", {donors})
    })
})


server.post("/", function(req, res){
    //pegar dados do formulário
    const name = req.body.name;
    const email = req.body.email;
    const blood = req.body.blood;

    if(name == "" || email == "" || blood == ""){
        return res.send("Todos os Campos são Obrigatórios")
    }

    const query ='insert into donors("name", "email", "blood") VALUES ($1, $2, $3)'

    const values = [name, email, blood]

    db.query(query, values, function(err){
        if(err) return res.send("Erro no Banco de Dados")

        return res.redirect("/")
    })
})


//Ligar o Servidor
server.listen(3000, function(){
    console.log("Iniciei o servidor")
})