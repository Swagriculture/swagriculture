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
var _successOpeningText = "Search Results: "

function _sendSMSReply (queryResp, replyPhoneNumber, cb) {
    client.sendMessage({
        to: replyPhoneNumber,
        from: config.TWILIO.PHONE_NUMBER,
        body: _successOpeningText.concat(queryResp)
    }, function(err, responseData){
        if(!err){
            console.log("message sent successfully!");
            cb();
        }
    })
}

module.exports = {
    sendSMSReply: _sendSMSReply
};