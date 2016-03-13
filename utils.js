var twilioHandler = require('./twilio.js');

function _handleHelpRequest (req, res, next) {
    console.log("handling help request");
    if (req.body.Body.toUpperCase() === '+HELP'){
        twilioHandler.sendHelp(req.body.From);
    } else {
        next();
    }
}


function _isTitleOnly(s){
    return s.length == 1;
}
function _isTitleAndArgs(s){
    return (s.length == 2 && s[0] !== "");
}
function _isArgsOnly(s){
    return s[0] === "";
}
function _parseQuery (queryStr){
    //query format: title, args (if there are args)
    var query = {};
    var parsedQuery = queryStr.split('+');
    if (_isTitleOnly(parsedQuery)){ 
        query.isTitleOnly = true;
        query.title = parsedQuery[0].trim();
        // query.args = null;
    }
    else if (_isTitleAndArgs(parsedQuery)) {
        query.isTitleAndArgs = true;
        query.title = parsedQuery[0].trim();
        query.args = parsedQuery[1].trim();
    }
    else if (_isArgsOnly(parsedQuery)) {
        query.isArgsOnly = true;
        query.args = parsedQuery[1].trim(); 
    }

    return query;
}
module.exports = {
    handleHelpRequest: _handleHelpRequest,
    parseQuery: _parseQuery
};
