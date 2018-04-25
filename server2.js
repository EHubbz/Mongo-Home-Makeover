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
    
    $("h1.entry-title").each(function(i, element) {
      var result = {};
      result.title = $(this).children("a").text();
      result.link = $(this).children("a").attr("href");
      saved: false;
      db.Article.create(result)
        .then(function(dbArticle) {
          console.log(dbArticle);
        })
        .catch(function(err) {
          return (err);
        });
    });
    res.send("Here are your articles.");
  });
});

// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
  db.Article.find({})
    .then(function(dbArticle) {
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
      else { //does not show as saved in db and does not give error
        console.log(id + " is saved");
  res.send("itworked!");
      }
  });
});

//mark an article as unsaved
app.get("/unsave/:id", function(req, res) {
  db.Article.findOneAndUpdate(
    { 
      _id: req.params.id
    },
    { 
      $set: {
        saved: false 
      }
    }, 
    function(error, found) {
    if (error) {
      console.log(error);
    }
    else { //does not show as unsaved in database and does not give error
      console.log(found);
      res.json(found);
    }
  });
});

// find all articles where "saved" is true
app.get("/saved/", function(req, res) {
  db.Article.find({ saved: true }, function(error, found) {
    if (error) {
      console.log(error);
    }//does not get saved articles, likely because they aren't getting marked as saved
    else {
      res.json(found);
    }
  });
});

// Article by id, populate it with it's comments
app.get("/articles/:id", function(req, res) {
  db.Article.findOne({ _id: req.params.id })
    .populate("comment")
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      return (err);
    });
});

// Route for saving/updating an Article's associated Comment
app.post("/articles/:id", function(req, res) {
  // Create a new comment and pass the req.body to the entry
  db.Comment.create(req.body)
    .then(function(dbComment) {
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { comment: dbComment._id }, { new: true });
    })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      return (err);
    });
});
//get all comments from bd and display
app.get("/comments", function(req, res) {
  db.Comment.find({})
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      return (err);
    });
});

//delete a comment
app.get("/deletecomment/:id", function(req, res) {
  db.Comment.findOneAndRemove({ _id: req.params.id }, function(error, found) {
    if (error) {
      console.log(error);
    }
    else { //does not delete from database
      console.log("comment deleted");
    }
  });
});
// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
