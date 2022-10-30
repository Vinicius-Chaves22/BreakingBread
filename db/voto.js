const mongoose = require("mongoose");

//conectando no BD
mongoose.connect(process.env.MongoURI)
.then(() => 
    console.log('Conectado ao MongoDB Atlas')
)
.catch(
    (err) => console.log(err)
)

//criando o modelo para salvar os carros
const Votos = mongoose.model('Votos',{
	//campos a serem salvos no modelo
    imgPath: String
},'Votos');


//exportando o modelo Paes para usar no app
module.exports = Votos

module.exports = {
  insertVoto: function (imgPath_init){
    var voto = new Votos({ imgPath: imgPath_init });
    voto.save(function (err, book) {
      if (err) return console.error(err);
      console.log(voto.imgPath + " saved to collection.");
    });
  },

  pegaVotos: function(imgPath_init){
    let contador = Votos.find({ imgPath: imgPath_init }).countDocuments();
    
    console.log(contador);

    return contador.length;
  },

  limpaVotos: function(){
      Votos.remove({}, function (err, result) {
        if (err){
            console.log(err)
        }else{
            console.log("Result :", result) 
        }
      });
  }
};