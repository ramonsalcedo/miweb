var mongoose = require("mongoose");
var Schema = mongoose.Schema;
mongoose.set("useNewUrlParser",true);
mongoose.set("useUnifiedTopology",true);
mongoose.connect("mongodb://localhost/mensaje",()=>{
console.log("Me conecte a la DB");
}); 
var  LBX_schema = new Schema({
		nombrelbx: String,
		battery: String,
		load1: String,
		linea1: String,
		R_status: String,
		linea2: String,
		v_salida2: String,
		error: String,
		porsalida2: String,
		type:String,
		RELAY: String,
		DELAY: String,
		SETHIGH: String,
		SETLOW: String,
		cal: String,
		fechahora: Date
});

var LBX = mongoose.model("LBX",LBX_schema)
module.exports.LBX = LBX;

