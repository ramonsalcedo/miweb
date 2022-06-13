/*
 * server.js
 */
 
/* Librerías necesarias para crear la aplicación */
const express  = require('express');
var app  = express();
var http = require('http').Server(app);
var io   = require('socket.io')(http);
var session = require('express-session');
var session_niddleware = require('./middlewares/session');
var router_app = require('./views/router_app');
var moment = require('moment-timezone');
//moment().tz("America/Santo_Domingo").format();
var date_Domingo = moment.tz(Date.now(), 'America/Santo_Domingo').format();

//moment.tz("America/Santo_Dominigo"));
//process.env.TZ = "America/Santo_Domingo";
app.set('view engine' ,'jade');
//const path = require('path'); 
// var public = path.join(__dirname, 'public');
// app.use('/', express.static(public));
//var redis = require("redis");
var bodyParser = require("body-parser");
var  mongoose = require("mongoose");
var LBX = require("./modelos/lbx").LBX;

//var usuarrioregistro = mongoose.model("usuario");
var usuarrioregistro = require("./modelos/usuario").usuario;
var dispositivo = require("./modelos/dispositivos").dispositivo;
//require("./modelos/usuario");

app.use(bodyParser.json()); //para peticiones json
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
  secret:"123byunhdhdc",
  resave:false,
  saveUninitialized:false

}))

app.use("/static",express.static("public"));
// Declaro este par de variables con valores de tipo array 
//modelo definido

/*
 *  Configuramos nuestra ruta (index) principal con
 *  express para mostrar el chat
 */

app.get('/', function(req, res) {
  res.render('index');
  console.log(req.session.user_id)
});
app.get('/login', function(request, response) {
	var username = request.body.username;
  response.render('login');
});
app.post('/user', function(request, response) {
	var username = request.body.username;
  var password = request.body.password;
  //console.log(username);
  //console.log(password);
  usuarrioregistro.findOne({email:username,password:password},function(err,user){
    if(user !== null){
    request.session.user_id = user._id;
    //console.log(user)
    dispositivo.find({id_usuario:user._id},function(err,chip){
     // console.log(chip)
      //io.emit("dispositivo",chip);
    });
    response.redirect('/app');
  }else {
    response.send("Usuario o Password incorrecto");
  }
  });

});
app.get('/login', function(request, response) {
  response.render('home');
});
app.get('/registrar', function(request, response){
//	var username = request.body.username;
  response.render('registrar');
});
app.get('/disp_registrar', function(request, response){
  //	var username = request.body.username;
    response.render('agregardisp');
  });
app.post('/usurio_registrar', function(request, response) {
  var registro = new usuarrioregistro({usuario: request.body.username 
                                    ,email: request.body.email , password: request.body.password 
                                    ,password_confirmation:request.body.password_confirmation});
  registro.save(function(){
    response.render('login');
  });	
   
  });
  app.post('/disp_registrar', function(req, res) {
    //console.log(req.body.dipositivo);
    //console.log(req.session.user_id);
    //console.log(req.body.nombre);
     var deipo = new  dispositivo({id_usuario :req.session.user_id
       ,chipid: req.body.dipositivo , nombre: req.body.nombre}
      );
      deipo.save(function(){
        console.log("upadtes  s");
        res.redirect('app');
      });
  
  });
/*
 *  Configuramos Socket.IO para estar a la escucha de
 *  nuevas conexiones.
 */
io.on('connection', function(socket) { 
  console.log('nuevo usuario connectado');

  socket.on('new user', function (nuser) {
    var mensaje1 = JSON.stringify(nuser )
    //var mensaje = JSON.parse(mensaje1)
    //socket.user = mensaje.Soy;F
   /// console.log(mensaje.Soy);
   // io.emit('llego +', mensaje.Soy);
  });
//io.to(socket.id).emit('new user',"quieres");

/*
   * Cada nueva conexión deberá estar a la escucha
   * del evento 'nuevo mensaje', el cual se activa
   * cada vez que un usuario envia un mensaje.
   * 
   * @param  msj : Los datos enviados desde el cliente a 
   *               través del socket.
   */
  var clientIp = socket.request.connection.remoteAddress;
  var ip = socket.conn.remoteAddress;  
  console.log('ip   ' + clientIp +": ->> "+socket.id);
  socket.on('nuevo mensaje', function(msj, nomb) {
     //console.log("quien soy :"+ socket.id )
     //io.emit('nowx',msj); 
     // io.emit('nuevo mensaje',msj,nomb); 
  Mensajes.find({"usuario": nomb },"usuario",function(err,doc){
  console.log(err);
  //console.log(doc);
  });
  var mensajet = new Mensajes({usuario: nomb,mensajess: msj , socket: socket.id});
  mensajet.save(function(){
  
  });	
});

  var   numero =0;
 socket.on('event_name', function(msj) {
  console.log(msj);

 //var mensaje1 = JSON.stringify(msj )
 //var mensaje = JSON.parse(mensaje1)
 //console.log("modulos :" + numero++);

//   var mensajet = new LBX({battery: mensaje.battery ,nombrelbx: mensaje.ID
//     ,load1:mensaje.load1,linea1:mensaje.linea1
//     ,R_status:mensaje.R_status,linea2:mensaje.linea2,v_salida2:mensaje.v_salida2
//   ,error:mensaje.error,porsalida2:mensaje.porsalida2});
//   mensajet.save(function(){
//  // console.log(rep);
//  //console.log(err);
  
//   });
});
  

socket.on('cambio', function(msj) {
    console.log(msj);
    //console.log(user)
 // dispositivo.find({id_usuario:msj},function(err,chip){
   // console.log(chip)
  // io.emit("cambioe",msj);

  });
  socket.on("now", function(msj) {
   console.log(msj);
    //console.log(user)
    var comando = JSON.parse(msj);
 // dispositivo.find({id_usuario:msj},function(err,chip){
   // console.log(chip)
   //io.emit(comando);

  });
  socket.on("event_name", function(msj) {
    // console.log(msj);
    var mensaje1 = JSON.stringify(msj);
    console.log(mensaje1);
    //console.log(user)
   // var comando = JSON.parse(msj);
 // dispositivo.find({id_usuario:msj},function(err,chip){
    //console.log(chip)
   io.emit( '{/"cmd/":"/off/"}');

  });
  socket.on('evento_lbx', function(msj){
  //console.log(msj);
   var mensaje1 = JSON.stringify(msj )
   var mensaje = JSON.parse(mensaje1)
   var date = new Date().getTime();
   var date_T = moment.tz(Date.now(), 'America/Santo_Domingo').format();
   
    var mensajet = new LBX({battery:mensaje.BATTERY,nombrelbx: mensaje.ID
      ,load1:mensaje.load1,linea1:mensaje.linea1,TYPE:mensaje.TYPE,RELAY:mensaje.RELAY
      ,R_status:mensaje.R_status,linea2:mensaje.linea2,v_salida2:mensaje.v_salida2
      ,error:mensaje.error,porsalida2:mensaje.porsalida2
      ,DELAY:mensaje.DELAY,SETHIGH:mensaje.SETHIGH,SETLOW:mensaje.SETLOW,cal:mensaje.CAL,fechahora:date_T
  });
    mensajet.save(function(){
      
    });
  
  });

  socket.on('evento_swg', function(msj){
      console.log(msj);
     var mensaje1 = JSON.stringify(msj)
     var mensaje = JSON.parse(mensaje1)
     var date = new Date().getTime();
     //
     //const myJSON = { "comando": "off"};
     var comando1 = '{"comando":"off"}';
     //var comando = JSON.parse(myJSON);
     var comando2 = JSON.stringify(comando1);
    var bateria = parseFloat(mensaje.BATTERY); 
     //io.emit(''+mensaje.ID,date,bateria); 
     //console.log(comando);
     console.log(comando2);
     // io.to(socket.id).emit(comando2);
     //console.log("modulos :" + numero++);
      var mensajet = new LBX({battery:mensaje.BATTERY,nombrelbx: mensaje.ID
        ,load1:mensaje.load1,linea1:mensaje.linea1,TYPE:mensaje.TYPE,RELAY:mensaje.RELAY
        ,R_status:mensaje.R_status,linea2:mensaje.linea2,v_salida2:mensaje.v_salida2
      ,error:mensaje.error,porsalida2:mensaje.porsalida2
      ,DELAY:mensaje.DELAY,SETHIGH:mensaje.SETHIGH,SETLOW:mensaje.SETLOW,cal:mensaje.CAL});
      mensajet.save(function(){
      });});

socket.on('LBX', function(msj) {
  
  var mensaje = JSON.stringify(msj );
 var mensaje1 = JSON.parse(mensaje);

  //io.emit('nowx',mensaje1); 
 
 var mensajet = new LBX({mensajess: mensaje.now, socket: socket.id});
  mensajet.save(function(){
  });});

  socket.on('nuevo', function(msj) {
      console.log(msj);
      //console.log(user)
    dispositivo.find({id_usuario:msj},function(err,chip){
     // console.log(chip)
   //  io.emit("dispositivo",chip);
     
  })
 
});
socket.on('nuevochip', function(msj) {
  //console.log(user)
  String:chipid = msj;
  console.log(chipid);
//setInterval(function(){
  LBX.find({'nombrelbx': chipid}).select('battery fechahora value -_id').sort({'fechahora': -1}).limit(1).exec(function(err, lbx){    
    if (err) return next(err);
     // io.emit('update', lbx );
      console.log(lbx);
  });
//}, 2000);
});

socket.on('old mensaje', function(msj) {
// client.get("mastersocket", function(err, socketId) { 
 //if (err) throw err; 
 //io.sockets.socket(socketId).emit(msj); });
 Mensajes.find({},function(err,doc){
                 console.log(doc);
  				 console.log(err);
   					io.to(socket.id).emit('old mensaje', doc);
                 });     
 });
  /*
   * Imprimimos en consola cada vez que un usuario
   * se desconecte del sistema.
   */
  socket.on('disconnect', function() {
   
  console.log('Usuario desconectado');
  console.log(socket.id);
  //Mensajes.find({"socket": socket.id},"usuario",function(err,doc){
  // io.emit('usuario des',doc);
 // });

  });

});
process.on('uncaughtException', function (err) {
      console.error(err.stack);
      console.log("Node error de socket ...");
    });
/*
 * Iniciamos la aplicación en el puerto 80
 */
app.use("/app",session_niddleware);
app.use("/app",router_app);
http.timeout = 0;
http.listen(3000, function() {
  console.log('Excuchando on *:3000');
});
// setInterval(function(){
//   LBX.find({chipid:""}).select('battery fechahora value -_id').sort({'fechahora': -1}).limit(10).exec(function (err, lbx) {
//       if (err) return next(err);
//       io.emit('update', lbx );
//       console.log(lbx);
//   });
// }, 2000);