const express = require("express");
const sql = require("./db/voto.js");
const port = 5000;

/* Express */
const app = express();
let server = app.listen(port);

app.use(express.static("./public/"));
app.use(express.json());

app.get("/", (req, res) => {
    res.sendFile("./public/index.html", { root: __dirname });
});

app.get("/breaking-bread", (req, res) => {
    res.sendFile("./public/breakingbread.html", { root: __dirname });
});

app.post('/addvoto', async(req,res) => {
    //vamos pegar o Json postado no body para usar as infos
	const {imgPath} = req.body

    //nosso modelo de dados do registro de carro
    const voto = {imgPath}

    //validação minima para o insert
    if (!imgPath){
        res.status(422).json({ error: 'A imagem está vazio!'})
    }

    //tratamento para realizar o insert
    try{
        //espera salvar os dados todos no banco
        await Votos.create(voto);

        //deu certo, retorna msg http status com sucesso - HTTP CREATE - 201
        res.status(201).json({message: 'Voto cadastrado'});

    } catch (error) {
        //se der erro, retorna json com msg erro
        res.status(500).json({error: error})
    }
});

app.post('/add', (req,res) => {
    //vamos pegar o Json postado no body para usar as infos
	const {imgPath} = req.body

    //validação minima para o insert
    if (!imgPath){
        res.status(422).json({ error: 'A imagem está vazio!'})
    }


    //tratamento para realizar o insert
    try{
        //espera salvar os dados todos no banco
        sql.insertVoto(imgPath);

        //deu certo, retorna msg http status com sucesso - HTTP CREATE - 201
        res.status(201).json({message: 'Voto cadastrado'});

    } catch (error) {
        //se der erro, retorna json com msg erro
        res.status(500).json({error: error})
    }

})

/* Breaking Bread */
const fs = require("fs");
const Votos = require("./db/voto.js");
//const paes = fs.readdirSync("./public/imgs");

class Sala {
    constructor(userId, paes){
        this.votos = [];
        this.userId = userId;
        this.paes = paes;
    }

    adicionarVoto(voto){
        if (voto == null)
            console.log("O voto não pode ser nulo.");
        else
            this.votos.push(voto);
    }
}

let salas = [];

/* Socket.io */
const io = require("socket.io")(server);
io.on("connection", (socket) => {
    
    const sala = new Sala(socket.id, fs.readdirSync("./public/imgs"));
    salas[socket.id] = sala;

    socket.on("paesRequest", () => {
        let randPaes = [];

        if (salas[socket.id].paes.length > 1){
            for (let i = 0; i < 2; i++){
                const randN = Math.floor(Math.random() * salas[socket.id].paes.length);
                randPaes.push(salas[socket.id].paes[randN]);
            }
        }
        else{
            randPaes = salas[socket.id].paes;
        }

        io.sockets.emit("paesRequest", { user: socket.id, paes: randPaes });
    });

    socket.on("votar", (data) => {
        salas[socket.id].paes.splice(salas[socket.id].paes.indexOf(data), 1);

        console.log(data);

        // Registrar voto no banco 
        sql.insertVoto(data);
        
    });

    socket.on("disconnect", () => {

        salas[socket.id].paes = fs.readdirSync("./public/imgs");
        salas[socket.id].votos = [];
        salas[socket.id].userId = null;
        salas[socket.id].paes = null;

    });

});