var request = require("request");

var getWikiData = function(getWikiData, cb){
    var base = "http://apaulling.com/swagriculture//api.php?";
    return request(base+"format=json&action=query&titles="+getWikiData+"&prop=extracts&exintro=",
        function(error, response, body) {
            body = JSON.parse(body);
            if (error) {
                return error;
            }
            else {
                var extract;
                console.log("wikiQuery.body: ", body);
                for (var page in body.query.pages) {
                    console.log("page: ", page);
                    console.log("extract beore replace: ", page.extract);
                    extract = body.query.pages[page].extract.replace(/<(?:.|\n)*?>/gm, '');
                    console.log("extract: ", extract)
                }
                cb(extract);
                  return body;
            }
    });
};

module.exports = {getWikiData: getWikiData};
