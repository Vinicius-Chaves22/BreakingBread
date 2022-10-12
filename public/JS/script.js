let socket = io();

const opt1 = document.getElementById("opcao-1-img");
const opt2 = document.getElementById("opcao-2-img");
const divPaes = document.getElementById("paes-div");
const btnRestart = document.getElementById("btnRestart");
const textoVitoriaRoyale = document.querySelector(".vitoria-royale-text");

paesRequest();

opt1.addEventListener("click", () => {
    votar(opt1);
});
opt2.addEventListener("click", () => {
    votar(opt2);
});
btnRestart.addEventListener("click", () => {
    restart();
});


function gerarOpcoes(paes){

    if (paes[0] == paes[1]){
        paesRequest();
    }
    else if (paes.length == 1){
        vitoriaRoyale();
    }
    else {
        opt1.src = "../imgs/" + paes[0];
        opt2.src = "../imgs/" + paes[1];
    }

}

function votar(opt){

    if (opt == opt1){
        socket.emit("votar", opt2.src.slice(opt2.src.lastIndexOf("/") + 1));
        opt2.src = "";
    }
    else{
        socket.emit("votar", opt1.src.slice(opt1.src.lastIndexOf("/") + 1));
        opt1.src = "";
    }

    paesRequest();

}

function vitoriaRoyale(){

    // Remover outra div
    if (opt1.src == "")
        opt1.parentElement.remove();
    else 
        opt2.parentElement.remove();

    // Texto comemoração
    textoVitoriaRoyale.style.display = "block";

    // Aparecer botão de restart
    btnRestart.style.display = "block";
    

}

function restart(){

    window.location.reload();

}

function paesRequest(){
    socket.emit("paesRequest", null);
}

socket.on("paesRequest", (data) => {
    const { user, paes } = data;

    if (user == socket.id){
        gerarOpcoes(paes);
    }
});