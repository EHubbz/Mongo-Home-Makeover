// Dependencies
var express = require("express");
var mongojs = require("mongojs");
// Require request and cheerio. This makes the scraping possible
var request = require("request");
var cheerio = require("cheerio");
var fs = require("fs");

// Initialize Express
var app = express();
// Static (public) folder for web app
app.use(express.static("public"));
// Database configuration
var databaseUrl = "articles";
var collections = ["scrapedData"];

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);

db.on("error", function(error) {
  console.log("Database Error:", error);
});

app.get("/", function(req, res) {
 res.sendFile(path.join(__dirname, "index.html"));
});

// Retrieve data from the db
app.get("/all", function(req, res) {
  // Find all results from the scrapedData collection in the db
  db.scrapedData.find({}, function(error, found) {
  
    // Throw any errors to the console
    if (error) {
      console.log(error);
    }
    // If there are no errors, send the data to the browser as json
    else {
      res.json(found);
    }
  });
});

app.get("/scrape", function(req, res) {
  // Make a request for the news section of `ycombinator`
  request("https://domino.com/content/design/before-after", function(error, response, html) {
    // fs.writeFileSync("log.txt", html, "utf8");
    // Load the html body from request into cheerio
    var $ = cheerio.load(html);
    var baseUrl = "https://domino.com";
    // For each element with a "title" class
    $("h2.truncate").each(function(i, element) {
      // Save the text and href of each link enclosed in the current element
      var title = $(this).children("a").text();
      var link = $(this).children("a").attr("href");
      var modLink = baseUrl + link;
      console.log(modLink);

      // If this found element had both a title and a link
     
        // Insert the data in the scrapedData db
        db.scrapedData.insert({
          title: title,
          link: modLink
        },
        function(err, inserted) {
          if (err) {
            // Log the error if one is encountered during the query
            console.log(err);
          }
          else {
            // Otherwise, log the inserted data
            console.log(inserted);
          }
        });
      
    });
  });

  // Send a "Scrape Complete" message to the browser
  res.send("complete");
});


// Listen on port 3000
app.listen(8080, function() {
  console.log("App connected: port 8080");
});