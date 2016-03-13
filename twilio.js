var config = require('./config.js');
var client = require('twilio')(config.TWILIO.ACCOUNT_SID , config.TWILIO.AUTH_TOKEN);
var Q = require('q');

//client.sendMessage({
//    to: '',
//    from:'',
//    body:'yo you sexy mofo'
//
//}, function(err, responseData){
//    if(!err){
//
//        console.log(responseData.from); // outputs "+14506667788"
//        console.log(responseData.body); // outputs "word to your mother."
//
//    }
//
//});
var _successOpeningText = "Search Results: ";
var _helpText = 'HELP:\n Reply with a topic | i.e. "Cassava" \n for a description and a table of contents to access more information. \n Or reply with a topic + table of contents header | \n i.e. "Cassava + soil" \n to directly access specific information \n If you have already searched a topic you can reply with a + table of \n contents header | i.e. "+ soil" \n to directly access specific information \n You may access multiple headers at once using commas to seperate them \n i.e. | "Cassava + soil, climate, 3, 4"';

function _sendSearchResults (queryResp, replyPhoneNumber, cb){
    _sendSMSReply(_successOpeningText.concat(queryResp), replyPhoneNumber, cb);
}

function _sendHelp (replyPhoneNumber, cb){
    _sendSMSReply(_helpText, replyPhoneNumber, cb);
}

function _sendSMSReply (message, replyPhoneNumber, cb) {
    client.sendMessage({
        to: replyPhoneNumber,
        from: config.TWILIO.PHONE_NUMBER,
        body: message
    }, function(err, responseData){
        if(!err){
            console.log("message sent successfully!");
            console.log("message: ", message);
            if (cb) {
                cb();
            }
        }
    })
}

module.exports = {
    sendSMSReply: _sendSMSReply,
    sendSearchResults: _sendSearchResults,
    sendHelp: _sendHelp
};