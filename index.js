var config = require("./config.js");
var express = require("express");
var app = express();
var wikiHandler = require("./wiki.js");
var bodyParser = require('body-parser');
var twilioHandler = require('./twilio.js');
var session = require('./session.js');
var utils = require('./utils.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(req, res){
    console.log('receiving get request');
    res.send('you only yolo once');
});

// Run test on startup
// var mockQuery = "cassava";
// console.log('Asking api for '+mockQuery);

// var session = {title: "cassavaa", tableOfContents: ""};
// var query = utils.parseQuery(mockQuery);

// if (query.isTitleOnly){
//     console.log("calling full query handler with,", query);
//     wikiHandler.getDescriptionAndToc(query.title, function (textMessage) {
//         console.log("textMessage", textMessage);
//     });
// } else if (query.isTitleAndArgs) {
//     console.log("calling get header handler with", query);
//     wikiHandler.getSections(query.title, query.args, session, function(textMessage) {
//         console.log("textMessage", textMessage);
//     });
// }



app.post('/incoming', utils.handleHelpRequest, session.getSession, function(req, res) {
    console.log("processing incoming text");
    console.log("req.body: ", req.body);
    console.log("req.session: ", req.session);

    var replyPhoneNumber = req.body.From;
    var queryText = req.body.Body;
    var query = utils.parseQuery(queryText);

    if (query.isTitleOnly){
        console.log("calling full query handler with,", query);
        wikiHandler.getDescriptionAndToc(query.title, function (textMessage) {
            twilioHandler.sendSMSReply(textMessage, replyPhoneNumber);
        });
    } else if (query.isTitleAndArgs) {
        console.log("calling get header handler with", query);
        wikiHandler.getSections(query.title, query.args, session, function(textMessage) {
            twilioHandler.sendSMSReply(textMessage, replyPhoneNumber);
        });
    }
    //wikiHandler.getWikiData(queryText, function (queryResp) {
    //    twilioHandler.sendSMSReply(queryResp, replyPhoneNumber);
    //});

});

app.listen(9000, '127.0.0.1', function(){
    console.log("listening on port ", 9000);
});
