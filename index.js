var config = require("./config.js");
var express = require("express");
var app = express();
var client = require('twilio')(config.TWILIO.ACCOUNT_SID , config.TWILIO.AUTH_TOKEN);

// console.log("account SID ="+config.TWILIO.AUTH_TOKEN);

client.sendMessage({
	to: '+14084833869',
	from:'+13049072742',
	body:'yo you sexy mofo'
	
}, function(err, responseData){
	if(!err){

		console.log(responseData.from); // outputs "+14506667788"
        console.log(responseData.body); // outputs "word to your mother."

	}

});

app.get('/', function(req, res){
    res.send('you only yolo once');
});

app.listen(9000, '127.0.0.1', function(){
    console.log("listening on port ", 9000);
});