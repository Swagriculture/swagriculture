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
    str = wiki2html.wiki2html(str);  // Remove ===h2=== and ''bold''
    str = str.replace(/<(?:.|\n)*?>/gm, '');  // Remove html tags
    str = entities.decode(str);  // Replace &lt; with <

    return str;
}

var parseQueryArgs = function(argsString, tableOfContents){
    argsArray = argsString.split(",");

    var indexes = [];
    for (var arg in argsArray){
        if (isInt(arg)){
            if (tableOfContents[arg] !== undefined)
                indexes.push(arg);
            else
                indexes.push(false);
        }
        // Query is a title like "Soil"
        else {
            sectionIndex = tableOfContents.indexOf(arg);
            if (sectionIndex > -1) 
                indexes.push(sectionIndex);
            else
                indexes.push(false);
        }
    }
    return indexes;
};

// API Calls
var _getWikiSectionFromTitleIndex = function(getWikiData, sectionIndex, cb){
    request(wikiBase+"format=json&action=query&prop=revisions&rvprop=content&rvsection="+sectionIndex+"&titles="+getWikiData,
        function(error, response, body) {
            body = JSON.parse(body);
            if (error) {
                cb("Sorry, something went wrong with your request: "+error);
            }
            else {
                var page = Object.keys(body.query.pages)[0];
                var extract = body.query.pages[page].revisions[0]['*'];

                // Remove wikipeadia and html
                extract = cleanWikiResponse(extract);
                
                // Send the text
                cb(extract);
            }
        }
    );
};

var _getWikiPageSectionTitles = function(getWikiData, cb){
    request(wikiBase+"action=parse&format=json&prop=sections&page="+getWikiData,
        function(error, response, body) {
            body = JSON.parse(body);
            if (error) {
                cb("Sorry, something went wrong with your request: "+error);
            }
            else {
                var sections = body.parse.sections;
                var tableOfContents = [];
                for (var section in sections) {
                    // 1 : "Soil"
                    tableOfContents.push(sections[section].line);
                }
                
                // Send the text
                cb(tableOfContents);
            }
        }
    );
};


// Open Methods (called from index.js)
function getDescriptionAndToc(queryTitle, sendText){

    _getWikiSectionFromTitleIndex(queryTitle, 0, function(description){
        if (description == "No Match"){
            // TODO Search for queryTitle in page content
        }
        else {
            // Get TOC            
            _getWikiPageSectionTitles(queryTitle, function(sectionTitles){
                var prettyTableOfContents = "";
                for (var sectionIndex in sectionTitles){
                    prettyTableOfContents += sectionIndex+". "+sectionTitles[sectionIndex]+"\n";
                }
                // Save stuff in session
                // TODO

                // Respond with text
                sendText(description+"\nWhatchu wanna do?\n"+prettyTableOfContents+"Reply with..");
            });

        }
    });
}

function getSections(queryTitle, queryArgs, session, sendText){
    console.log(session.title);
    console.log(queryTitle);
    if (session.title == queryTitle) {
        console.log('Session active');

        // Check if args exist in session table of content
        queryArgs = parseQueryArgs(queryTitle, session.tableOfContents);
        for (var arg in queryArgs) {
            if (!arg){
                // Index recieved not sent
                textMsg += "Secion x not found\n";
            }
            else {
                // Get that section
                _getWikiSectionFromTitleIndex(queryTitle, arg, function(s){
                    textMsg += s;
                });
            }
        }
        console.log(textMsg);
    }
    else {
        console.log('New Query, no session');

        // New query. Check if page exists.
        _getWikiSectionFromTitleIndex(queryTitle, 0, function(description){
            console.log('New Query, no session');
            if (description == "No Match"){
                // TODO Search for queryTitle in page content
            }
            else {
                // Get TOC            
                _getWikiPageSectionTitles(queryTitle, function(sectionTitles){

                    queryArgs = parseQueryArgs(queryTitle, sectionTitles);
                    for (var arg in queryArgs) {
                        if (!arg){
                            // Index recieved not sent
                            textMsg += "Secion x not found\n";
                        }
                        else {
                            // Get that section
                            _getWikiSectionFromTitleIndex(queryTitle, arg, function(s){
                                textMsg += s;
                                if (callBackFinished(arg,queryArgs))
                                    sendText(textMsg);
                            });
                        }
                    }
                    // Save stuff in session
                    // TODO

                    // Respond with text
                    sendText(description+"\nWhatchu wanna do?\n"+prettyTableOfContents+"Reply with..");
                });

            }
        });

    }
}
var calls = 0;
function callBackFinished(total){
    calls++;
    console.log(calls);
    return (calls == total);
}

module.exports = {
    getDescriptionAndToc: getDescriptionAndToc,
    getSections: getSections
};
