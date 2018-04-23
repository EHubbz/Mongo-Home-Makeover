// Dependencies
var express = require("express");
var mongojs = require("mongojs");
// Require request and cheerio. This makes the scraping possible
var request = require("request");
var cheerio = require("cheerio");
var bodyParser = require("body-parser");
var logger = require("morgan");
var axios = require("axios");
var db = require("./models.js");
var mongoose = require("mongoose");
// Initialize Express
var app = express();
// Static (public) folder for web app
app.use(express.static("public"));
// Database configuration
var databaseUrl = "articles";
var collections = ["scrapedData"];
// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
mongoose.connect("mongodb://localhost/articles");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger("dev"));



// db.on("error", function(error) {
//   console.log("Database Error:", error);
// });

app.get("/", function(req, res) {
 res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/scrape", function(req, res) {
  // Make a request from the website
  request("https://domino.com/content/design/before-after", function(error, response, html) {
    // Load the html body from request into cheerio
    var $ = cheerio.load(html);
    var baseUrl = "https://domino.com";
    // For each element 
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

// Retrieve data from the db
app.get("/articles", function(req, res) {
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

// Route for grabbing a specific Article by id, populate it with it's comment
app.get("/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.scrapedData.findOne({ _id: req.params.id })
    // ..and populate all of the comments associated with it
    .populate("comment")
    .then(function(dbscrapedData) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbscrapedData);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  db.Comment.create(req.body)
    .then(function(dbComment) {
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.scrapedData.findOneAndUpdate({ _id: req.params.id }, { comment: dbComment._id }, { new: true });
    })
    .then(function(dbscrapedData) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbscrapedData);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Listen on port 3000
app.listen(8080, function() {
  console.log("App connected: port 8080");
});