var twilioHandler = require('./twilio.js');
function _handleHelpRequest (req, res, next) {
    console.log("handling help request");
    if (req.body.Body.toUpperCase() === '+HELP'){
        twilioHandler.sendHelp(req.body.From);
    } else {
        next();
    }
}

module.exports = {
    handleHelpRequest: _handleHelpRequest
};