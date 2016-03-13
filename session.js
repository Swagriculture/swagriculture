/***
 *
 * Session data model:
 * session[phoneNumber] = {
 *  previousQuery: <found title string>
 *  headers: [headerTitle, headerTitle, etc.]
 *  lastActive: Date
 *  }
 *  To clear: session.clear()
 */

//POJSO session store
var sessions = {};

function Session(phoneNumber) {
    //add a view to the session
    this.id = phoneNumber;
    this.previousQuery = null;
    this.headers = null;
    this.lastActive = new Date();
}

Session.prototype.isRecent = function() {
    return _isRecent(this.lastActive);
};

Session.prototype.clear = function() {
    sessions[this.id] = null;
};

Session.prototype.updateSession = function(){
    this.lastActive = new Date();
};

function _isRecent (date){
    var now = new Date();
    return now.getTime() - date.getTime()  <= 300000;
}

function _findOrCreate (phoneNumber, query) {
    //remove plus
    phoneNumber = phoneNumber.slice(1);
    var currSession = sessions[phoneNumber];
    if (currSession && currSession.isRecent()){
        //update session and return that session
        return currSession.updateSession(query) && currSession;
    } else {
        // return a new session and put it in storage
        return sessions[phoneNumber] = new Session(phoneNumber);
    }
}

function _getSession(req, res, next){
    console.log("calling getSession");
    req.session = _findOrCreate(req.body.From, req.body.Body);
    next();
}

module.exports = {
    getSession: _getSession
};