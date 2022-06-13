const mongoose = require("mongoose");

//1. definir el schema
let dispo_schema = new mongoose.Schema({
nombre : String,
chipid: String,
id_usuario: String
});

// 2.definir el modelo
//mongoose.model("usuario",usuarioSchema);
var dispositivo = mongoose.model("dispositivos",dispo_schema)
module.exports.dispositivo = dispositivo;
