var usuarrioregistro = require("../modelos/usuario").usuario;
var dispositivo = require("../modelos/dispositivos").dispositivo;
module.exports = function(req,res,next){
    if(!req.session.user_id){
        res.redirect("/login");
    }
    else{
        usuarrioregistro.findById(req.session.user_id,function(err,user){
            if(err){
                console.log(err);
                res.redirect("/login");
            }else{
                res.locals = {user:user};
                dispositivo.find({id_usuario:user._id},function(err,chip){
                   // console.log(chip)
                    res.session = {user:chip};
                  });
                //console.log(user.email);
                next();

            }

        })
       
    }

}