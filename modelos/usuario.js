const mongoose = require("mongoose");
const  ismail = require("validator").isEmail;

//1. definir el schema
let usuarioSchema = new mongoose.Schema({
nombre : String,
usuario: String,
password: String,
chipid: String,
email:{
type: String,
required: true,
validate:[ismail,'el email es valido']
}
});
usuarioSchema.virtual("password_confirmation").get(function(){
return this.p_c;
}).set(function(password){
this.p_c = password;
});
// 2.definir el modelo
//mongoose.model("usuario",usuarioSchema);
var usuario = mongoose.model("usuario",usuarioSchema)
module.exports.usuario = usuario;


