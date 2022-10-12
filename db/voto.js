const mongoose = require("mongoose");

//conectando no BD
mongoose.connect('mongodb+srv://rafaelnator:T1EvLO5K0X040UEU@cluster0.dfqswv3.mongodb.net/Votos?retryWrites=true&w=majority')
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

  pegaVotos: function(){
      return Votos.findAll();
  },

  pegaVoto: function (imgPath_init){
    return Votos.findOne({}, { Votos: { imgPath: imgPath_init } } );
  }
};

