var config = require("./config.js");
var express = require("express");
var app = express();
var request = require("request");
var client = require('twilio')(config.TWILIO.ACCOUNT_SID , config.TWILIO.AUTH_TOKEN);
var request = require("request");

request("http://apaulling.com/swagriculture//api.php?format=json&action=query&titles=Main_Page&prop=revisions&rvprop=content&callback=?", 
	function(error, response, body) {
  console.log(error);
  console.log(body);
});
// console.log("account SID ="+config.TWILIO.AUTH_TOKEN);

// client.sendMessage({
// 	to: '',
// 	from:'',
// 	body:'yo you sexy mofo'
	
// }, function(err, responseData){
// 	if(!err){

// 		console.log(responseData.from); // outputs "+14506667788"
//         console.log(responseData.body); // outputs "word to your mother."

// 	}

// });

app.get('/', function(req, res){
    res.send('you only yolo once');
});

app.listen(9000, '127.0.0.1', function(){
    console.log("listening on port ", 9000);
});