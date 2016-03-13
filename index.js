var config = require("./config.js");
var express = require("express");
var app = express();
var wikiHandler = require("./wiki.js");
var bodyParser = require('body-parser');
var twilioHandler = require('./twilio.js');

// Run test on startup
mockQuery = "cassava";
console.log('Asking api for '+mockQuery);

wikiHandler.getWikiData(mockQuery, function (queryResp) {
	// No point
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/', function(req, res){
    console.log('Receiving get request');
    res.send('I listen to lesbians licking while I lie longitudially late at night lamenting my lack of involvement');
});

// async mock of Ji's wikiQuerying function
//function _mockQuerier (stringOfQueries, cb) {
//    console.log("calling mockQuerier");
//    console.log("stringofQueries: ");
//    var mockQueryResp = 'pretend this is a response for '+ stringOfQueries;
//    setTimeout(function(){
//        cb(mockQueryResp);
//    }, 0);
//}

//sends success to Twilio, dunno if they do anything with it though.
function _sendSuccess (res) {
    res.sendStatus(201);
}

app.post('/incoming', function(req, res) {
    console.log("processing incoming text");
    console.log("req.body: ", req.body);
    var replyPhoneNumber = req.body.From;
    var queryText = req.body.Body;

    wikiHandler.getWikiData(queryText, sessionQuery, function (queryResp, seesionLevel) {
        twilioHandler.sendSMSReply(queryResp, replyPhoneNumber, _sendSuccess.bind(null, res));
        
    });

});

app.listen(9000, '127.0.0.1', function(){
    console.log("listening on port ", 9000);
});
