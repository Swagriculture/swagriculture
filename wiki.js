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
    // console.log("str before clean: ", str);

    str = wiki2html.wiki2html(str);  // Remove ===h2=== and ''bold''
    str = str.replace(/<(?:.|\n)*?>/gm, '');  // Remove html tags
    str = entities.decode(str);  // Replace &lt; with <

    // console.log("str after clean: ", str);
    return str;
}

var parseQueryArgs = function(argsString, tableOfContents){
    argsArray = argsString.split(",");
    // if (commaSep.length > 1){ // found strings as args
    //     return commaSep;
    // }
    // else if (commaSep.length == 1) { // found list of space seperated numbers
    //     spaceSep = commaSep.split(" ");
    //     return spaceSep;
    // }
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

var sendText = function(str){
    console.log(str);
};

var parseWikiQuery = function(queryStr, req, cb){
    console.log ("querying", queryStr);
    console.log ("req", req);
    var textMsg;  // message to respond to the user
   
    queryStr = queryStr.split("+");
    if (queryStr.length == 1){ 
        // Is "title"
        console.log('Is "title"');        

        // API search for page
        var description;
        getWikiSectionFromTitleIndex(queryStr, 0, function(description){
            if (description == "No Match"){
                // Search for queryStc in page content
                // TODO
            }
            else {
                // Get TOC
                
                getWikiPageSectionTitles(queryStr, function(sectionTitles){
                    console.log(sectionTitles);
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
    else if (queryStr.length == 2 && queryStr[0] !== "") {
        // Is "Title + headings"
        console.log('Is "Title + headings"');
        queryTitle = queryStr[0];
        
        console.log(req.session.title);
        console.log(queryTitle);
        if (req.session.title == queryTitle) {
        console.log('Is here');
            // Check if args exist in session table of content
            queryArgs = parseQueryArgs(queryStr[1], req.session.tableOfContents);
            for (var arg in queryArgs) {
                if (!arg){
                    // Index recieved not sent
                    textMsg += "Secion x not found\n";
                }
                else {
                    // Get that section
                    getWikiSectionFromTitleIndex(queryTitle, arg, function(s){
                        textMsg += s;
                    });
                }
            }
            console.log(textMsg);
        }
        else {
            // New query. Check if page exists
            // TODO

        }


    }
    else if (queryStr[0] === "") {
        // check for previous title
        if (!req.session.prevQuery) {
            return "NO PREVIOUS QUERY, chose a topic";

        }

        // Return sections
        queryTitle = previousQueryTerm;
        queryArgs = parseQueryArgs(queryStr[1]);


    }
    else {
        // Couldnt make sense of sting
        console.log("Couldnt make sense of sting");
    }

    
    

    // // No previous search, expect user is asking for a page i.e. cassava
    //  if (!previousQueryTerm){
    //     var blurb = getWikiSectionFromTitleIndex(queryStr, 0);

    //     // Return user with search options if queried page doesnt exist
    //     if (sctionTitles == "gotNothing"){
    //         textMsg = clarify();
    //     }
    //     else {
    //         var sectionTitles = getWikiPageSectionTitles(queryStr);
    //         textMsg = blurb+"\nWhatchu wanna do?"+sectionTitles;

    //     }

    // }
    // else if (previousQueryTerm) {
    //     // If there was a previous search, show the items in more detail
    //     var sctionTitles = getWikiPageSectionTitles(previousQueryTerm);

    //     // Return user with search options if queried page doesnt exist
    //     if (sctionTitles == "gotNothing")
    //         textMsg = clarify();
    //     else {
    //         // Page exists, get section info
    //         queryArgs = queryStr.split(' ');
    //         for (var queryParam in queryArgs) {
    //             // Query is a number
    //             var sectionIndex;
    //             if (isInt(queryParam)){
    //                 sectionIndex = queryParam;
    //             }
    //             // Query is a title like "Soil"
    //             else {
    //                 sectionIndex = sctionTitles.queryParam;
    //             }
    //             textMsg =+ getWikiSectionFromTitleIndex(previousQueryTerm, sectionIndex);
    //         }
    //     }
    // }

    // cb(textMsg);

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


var getWikiSectionFromTitleIndex = function(getWikiData, sectionIndex, cb){
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

var getWikiPageSectionTitles = function(getWikiData, cb){
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

module.exports = {parseWikiQuery: parseWikiQuery};
