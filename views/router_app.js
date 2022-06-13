var express = require("express");
var router = express.Router();

router.get("/",function(req,res){
res.render("app/prueba");

});

router.get("/agregardisp",function(req,res){

    res.render("app/prueba");
    });

module.exports = router;