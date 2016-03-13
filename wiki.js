var request = require("request");
var wiki2html = require('./wiki2html.js');
var entities = require('html-entities').XmlEntities;

// Global
var wikiBase = "http://apaulling.com/swagriculture/api.php?";

// Check for number
function isInt(n){
    return Number(n) === n && n % 1 === 0;
}

function cleanWikiResponse(str) {
    console.log("str before clean: ", extract);

    str = wiki2html.wiki2html(str);  // Remove ===h2=== and ''bold''
    str = str.replace(/<(?:.|\n)*?>/gm, '');  // Remove html tags
    str = entities.decode(str);  // Replace &lt; with <

    console.log("str after clean: ", extract);
    return str;
}



var parseWikiQuery = function(queryStr, previousQueryTerm, cb){

    var textMsg;  // message to respond to the user
    
    if (queryStr == 'help')
        textMsg = respondWithHelp();

    // No previous search, expect user is asking for a page i.e. cassava
    else if (!previousQueryTerm){
        var blurb = getWikiSectionFromTitleIndex(queryStr, 0);

        // Return user with search options if queried page doesnt exist
        if (sctionTitles == "gotNothing"){
            textMsg = clarify();
        }
        else {
            var sectionTitles = getWikiPageSectionTitles(queryStr, "text");
            textMsg = blurb+"\nWhatchu wanna do?"+sectionTitles;
            
        }

    }
    else if (previousQueryTerm) {
        // If there was a previous search, show the items in more detail
        var sctionTitles = getWikiPageSectionTitles(previousQueryTerm, "JSON");

        // Return user with search options if queried page doesnt exist
        if (sctionTitles == "gotNothing")
            textMsg = clarify();
        else {
            // Page exists, get section info
            queryParams = queryStr.split(' ');
            for (var queryParam in queryParams) {
                // Query is a number
                var sectionIndex;
                if (isInt(queryParam)){
                    sectionIndex = queryParam;
                }
                // Query is a title like "Soil"
                else {
                    sectionIndex = sctionTitles.queryParam;
                }
                textMsg =+ getWikiSectionFromTitleIndex(previousQueryTerm, sectionIndex);
            }
        }
    }

    cb(textMsg);

    // inputs: help, cassava, cassava soil, cassava 0 3 4

    // They're gonna ask for a page. i.e. cassava
    // If we have it, serve them the blurb and the titles with indexs
    // If we find a close match send the snippet with index
    // If nothing's found, say sorry. You could help...

    // Get page blurb
    // action=query&format=json&prop=revisions&rvprop=content&rvsection=0&titles=Cassava&categories=
    // Cheaters
    // action=query&format=json&prop=extracts&exlimit=max&explaintext&exintro&titles=Cassava
    // action=query&format=json&titles="+getWikiData+"&prop=extracts&exintro=

    // Search page title
    // action=query&list=search&srsearch=cassava

    // Seach including keyword
    // action=query&list=search&srsearch=yuca&srwhat=text&continue=

    // Get page section titles
    // action=parse&format=jsonfm&prop=sections&page=cassava

    // Get section title and content by index
    // action=query&prop=revisions&rvprop=content&rvsection=1&titles=Cassava
};


var getWikiSectionFromTitleIndex = function(getWikiData, sectionIndex){
    return request(wikiBase+"format=json&action=query&prop=revisions&rvprop=content&rvsection="+sectionIndex+"&titles="+getWikiData,
        function(error, response, body) {
            body = JSON.parse(body);
            if (error) {
                return "Sorry, something went wrong with your request: "+error;
            }
            else {
                // Sanity check
                // console.log("wikiQuery.body: ", body);
                // console.log("wikiQuery.body.query: ", body.query);

                var page = Object.keys(body.query.pages)[0];
                var extract = body.query.pages[page].revisions[0]['*'];

                // Remove wikipeadia and html
                extract = cleanWikiResponse(extract);
                
                // Send the text
                return extract;
            }
        }
    );
};

var getWikiPageSectionTitles = function(getWikiData, jsonORtext){
    return request(wikiBase+"action=parse&format=json&prop=sections&page="+getWikiData,
        function(error, response, body) {
            body = JSON.parse(body);
            if (error) {
                return "Sorry, something went wrong with your request: "+error;
            }
            else {
                var tableOfContents;
                var sections = body.prase.sections;
                for (var section in sections) {
                    if (jsonORtext == 'JSON')
                        // Soil : 1
                        tableOfContents.section.line = section.index;
                    else
                        tableOfContents += section.index+". "+section.line;
                }
                
                // Send the text
                return tableOfContents;
            }
        }
    );
};

module.exports = {parseWikiQuery: parseWikiQuery};
