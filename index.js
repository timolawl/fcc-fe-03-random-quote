// FCC Zipline - Random Quote Generator
// User story 1: Click button to show random quote
// User story 2: Press button to tweet out quote


// Wrap everything in an IIFE
!function() {

  // Get JSON via JSON-P
  var script = document.createElement('script');
  script.src = 'https://en.wikiquote.org/w/api.php?action=parse&format=json&page=Bruce%20Lee' + '&callback=processWikiDump';
  document.head.appendChild(script);
  /*
  // Can't use XMLHttpRequest because CORS
  // Get JSON
    function startQuotesRequest() {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
          if(xhr.readyState == 4 && xhr.status == 200) {
              var dump = JSON.parse(xhr.responseText);
              parseWikiDump(dump);
          }
      };
      xhr.open("GET", );
   //   xhr.responseType = 'json';
   //   xhr.setRequestHeader('Accept', 'application/json');
      xhr.send();
  }
  */

  // Retrieve text to parse
  this.processWikiDump = function(jsonData) {
    var textDump = JSON.stringify(jsonData.parse.text);
    var parsedQuotes = parseWikiDump(textDump);
  }

  // Main function. Get the substring to parse. With parsed list, randomly generate a quote and update twitter message.
  function parseWikiDump (unparsedText) {
    // First only keep the section between the first <li> and the 'Quotes about Bruce Lee' section.
    var firstLiPos = unparsedText.indexOf('<li>');
    var qAboutBLPos = unparsedText.indexOf('\"Quotes_about_Bruce_Lee');
    var offsetPos = qAboutBLPos - firstLiPos;
    var subUnparsedText = unparsedText.substr(firstLiPos, offsetPos);
    var unparsedList = subUnparsedText.match(/<li>(.*?)<\/li>/g); 
    var parsedList = [];

    parsedList = fullParse(unparsedList);
    generateQuote(parsedList);
    document.getElementById('generate-quote').onclick = function() {
      generateQuote(parsedList);
    };
  }

  // Parse unparsed array of quotes
  function fullParse(unparsed) {
    var parsed = [];

    parsed = unparsed.map(function(str) {
      return str.replace(/(<[^>]+)>|[pP]\.\. \d.*$|Part \d.*$|[pP]\. \d.*$|[pP] \d.*$|As quoted.*$|Bruce Lee.*$/ig, '')
                  .replace(/\\n|\\"|\\'/ig, function ($0)  {
        var index = {
          '\\n': ' ', // '&NewLine;',
          '\\"': '&quot;',
          "\\'": "&apos;" 
        };
        return index[$0] !== undefined ? index[$0] : $0;
      });
    });

    return parsed;
  }

  // Function to generate a quote
  function generateQuote(list) {
    // Randomize the quote to display:
    var quoteNumber = Math.floor(Math.random() * list.length);

    // Make the div to display the quote:
    var quoteDiv = document.getElementById("quoteDiv");
    quoteDiv.innerHTML = list[quoteNumber];  

    updateTwitterMsg(list[quoteNumber]);
  }

  // Twitter stuff
  function updateTwitterMsg(quote) {    
    var twitterfiedQuote = quote.replace(/&quot;|&apos;|;/ig, function ($0)  {
        var index = {
          '&quot;': '%22',
          '&apos;': '%27',
          ';': '%3B'
        };
      return index[$0] !== undefined ? index[$0] : $0;
    });
    
    if(quote.length > 125) {
      document.getElementById('tweet').setAttribute("href", "https://twitter.com/intent/tweet?text=" + twitterfiedQuote.substr(0, 125) + '... — Bruce Lee');
    }
    else {
      document.getElementById('tweet').setAttribute("href", "https://twitter.com/intent/tweet?text=" + twitterfiedQuote.substr(0, 140) + ' — Bruce Lee');
    }
  }
    
}();


