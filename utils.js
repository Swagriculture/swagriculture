var twilioHandler = require('./twilio.js');
function _handleHelpRequest (req, res, next) {
    console.log("handling help request");
    if (req.body.Body.toUpperCase() === '+HELP'){
        twilioHandler.sendHelp(req.body.From);
    } else {
        next();
    }
}
function _isFullQuery(string){
    return string.indexOf('+') > 0;
}
function _parseQuery (string){
    //query format: title, header (if there is a header)
    var query = {};
    var parsedQuery = string.split('+');
    query.title = parsedQuery[0];
    if(_isFullQuery(string)) {
        query.header = parsedQuery[1];
        query.isFull = true;
    }
    return query
}
module.exports = {
    handleHelpRequest: _handleHelpRequest,
    parseQuery: _parseQuery
};
