var request = require("request");

var getWikiData = function(getWikiData, cb){
    var base = "http://apaulling.com/swagriculture//api.php?";
    return request(base+"format=json&action=query&titles=Main_Page&prop=extracts&exintro=", 
        function(error, response, body) {
            if (error) {
                return error;
            }
            else {
                var extract;
                  for (var page in body.query.pages) {
                      extract = page.extract;
                  }
                cb(extract);
                  return body;
            }
    });
};

module.exports = {getWikiData: getWikiData};