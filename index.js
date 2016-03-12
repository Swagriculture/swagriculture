var config = require("./config.js");
var express = require("express");
var app = express();


console.log("Hello World");

app.get('/', function(req, res){
    res.send('you only yolo once');
});

app.listen(9000, '127.0.0.1', function(){
    console.log("listening on port ", 9000);
});