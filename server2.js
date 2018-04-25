var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");
var path = require("path");
// scraping tools
var axios = require("axios");
var cheerio = require("cheerio");
// Require all models
var db = require("./models");

var PORT = 8080;
// Initialize Express
var app = express();
app.set("views", path.join(__dirname, "views"));
app.engine("handlebars", exphbs ({defaultLayout: "main"}));
app.set("view engine", "handlebars");
// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Connect to the Mongo DB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scrapedData";
mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/scrapedData");
mongoose.connect(MONGODB_URI, {
 // useMongoClient: true
});

// Routes
app.get("/", function(req, res) {
  res.render("index", {
    // res.preventDefault();
  });
});
// A GET route for scraping the scandinavian standard website
app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with request
  axios.get("http://www.scandinaviastandard.com/category/design/").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);
    
    // Now, we grab every h2 within an article tag, and do the following:
    $("h1.entry-title").each(function(i, element) {
      var result = {};
      result.title = $(this).children("a").text();
      result.link = $(this).children("a").attr("href");
      saved: false;
      db.Article.create(result)
        .then(function(dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function(err) {
          // If an error occurred, send it to the client
          return (err);
        });
    });
// If we were able to successfully scrape and save an Article, send a message to the client
    res.send("Here are your articles.");
  });
});

// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
  db.Article.find({})
    .then(function(dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      return (err);
    });
});

// Mark an article as having been saved
app.get("/save/:id", function(req, res) {
  var id = req.params.id;
  db.Article.update(
    { _id: req.params.id
    }, 
    { $set: {
      saved: true }
    }, function(error, found) {
      if (error) {
        console.log(error);
      }
      else {
        console.log(id + " is saved");
  res.send("itworked!");
      }
  });
});

//mark an article as unsaved
app.get("/unsave/:id", function(req, res) {
  // Go into the mongo collection, and find all docs where "read" is false
  db.Article.update(
    { 
      _id: req.params.id
    },
    { 
      $set: {
        saved: false 
      }
    }, 
    function(error, found) {
    // Show any errors
    if (error) {
      console.log(error);
    }
    else {
      // Otherwise, send the books we found to the browser as a json
      console.log(found);
      res.json(found);
    }
  });
});

// Go into the Article collection, and find all articles where "saved" is true
app.get("/saved/", function(req, res) {
  db.Article.find({ saved: true }, function(error, found) {
    // Show any errors
    if (error) {
      console.log(error);
    }
    else {
      // Otherwise, send the articles we found to the browser as a json
      res.json(found);
    }
  });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article.findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("comment")
    .then(function(dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      return (err);
    });
});

// Route for saving/updating an Article's associated Comment
app.post("/articles/:id", function(req, res) {
  // Create a new comment and pass the req.body to the entry
  db.Comment.create(req.body)
    .then(function(dbComment) {
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { comment: dbComment._id }, { new: true });
    })
    .then(function(dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      return (err);
    });
});
//get all comments from bd and display
app.get("/comments", function(req, res) {
  db.Comment.find({})
    .then(function(dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      return (err);
    });
});

//delete a comment
app.get("/deletecomment/:id", function(req, res) {
  // Go into the mongo collection, and find all docs where "read" is false
  db.Comment.findOneAndRemove({ _id: req.params.id }, function(error, found) {
    // Show any errors
    if (error) {
      console.log(error);
    }
    else {
      // Otherwise, send the books we found to the browser as a json
      console.log("comment deleted");
    }
  });
});
// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
