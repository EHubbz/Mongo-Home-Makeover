//get articles from db as JSON
$("#displayBtn").on("click", function() {
  $.getJSON("/articles", function(data) {
    for (var i = 0; i <data.length; i++) {
    // Display the information on the browser
    $("#display").append(`<p data-id='${data[i]._id}' class='title'>${data[i].title}</p> <p class='link'>${data[i].link}</p><button class='btn btn-primary' data-toggle="toggle" id='saveBtn' data-id='${data[i]._id}'> SAVE</button><button class='btn btn-primary' data-toggle="toggle" id='unSaveBtn' data-id='${data[i]._id}'> UNSAVE</label>`);
    }
  });
  //console.log("clicked");
});

$("#scrapeBtn").on("click", function() {
  $.getJSON("/scrape"), function() {
    console.log("contents scraped");
  }
});
// $("#savedArticlesBtn").click(function(){
//     $("#savedDisplay").html("<h2>YOUR SAVED ARTICLES</h2>");
// });

$(document).on("click", "#saveBtn", function() {
  //console.log("clicked");
  var thisId = $(this).attr("data-id");
  console.log(thisId);
  $.ajax({
    method: "POST",
    url: "/save/" + thisId,
    success: function(data){
      console.log("article saved");
      //if successful then make THIS buttongreen and change text to saved with a check mark glyphicon
    },
    error: function(error){
      console.log(error);
      //if there is an error make this button red (for 3 seconds) and say next to it "there was an error"
    }
  });
});

//mark article as unsaved
$(document).on("click", "#unSaveBtn", function() {
  console.log("clicked");
  var thisId = $(this).attr("data-id");
  console.log(thisId);
  $.ajax({
    method: "GET",
    url: "/unsave/" + thisId,
    success: function(data){
      console.log("article removed from saved");
      //if successful then make THIS buttongreen and change text to saved with a check mark glyphicon
    },
    error: function(error){
      console.log(error);
      //if there is an error make this button red (for 3 seconds) and say next to it "there was an error"
    }
  });
});

function getSaved() {
  $("#savedDisplay").empty(); 
  $.getJSON("/saved")
  .then(function(data) {
    for (var i = 0; i < data.length; i++) {
      $("#savedDisplay").append("<p class='title' data-id='" + data[i]._id + "'>" + data[i].title + "</p>" + "<p class='link'>" + data[i].link + "</p>" + "<button id='comment' class='btn btn-primary' role='button'>COMMENT</button>");
    };
  });
};

$(document).on("click", "p", function() {
    // Empty the notes from the comment section
  $("#comments").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");
  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
  .then(function(data) {
      console.log(data);
      $("#comments").append("<h2>ADD A COMMENT</h2>" + "<hr>");
      // The title of the article
      $("#comments").append("<h3>" + data.title + "</h3>");
      // An input to enter a new title
      $("#comments").append("<input id='titleinput' placeholder='TITLE' name='title' >"  + "<br>" + "<br>");
      // A textarea to add a new note body
      $("#comments").append("<textarea id='bodyinput' placeholder='COMMENT' name='body'></textarea>"  + "<br>" + "<br>");
      // A button to submit a new note, with the id of the article saved to it
      $("#comments").append("<button class='btn btn-primary' data-id='" + data._id + "' id='savecomment'>SAVE COMMENT</button>");

      // If there's a note in the article
      if (data.comment) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.comment.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.comment.body);
      }
    });
});

$(document).on("click", "#savecomment", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
  .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      
    });
  $("#comments").empty();
  $("#titleinput").val("");
  $("#bodyinput").val("");
});

$("#viewCommentsBtn").on("click", function() {
  $("#comments").empty();
  $.getJSON("/comments", function(data) {
    for (var i = 0; i <data.length; i++) {
    // Display the information on the browser
    $("#comments").append("<h3>" + data[i].title + "</h3>" + "<p>" + data[i].body + "</p>" + "<button id='delCommentBtn' data-id='" + data[i]._id + "' class='btn btn-primary' >x</button>" + "<hr>"  + "<br>");
    }
  });
  //console.log("clicked");
});

//delete a comment from the display and db
$(document).on("click", "#delCommentBtn", function() {
  var thisId = $(this).attr("data-id");
  $.ajax({
    type: "DELETE",
    url: "/deletecomment/:id" + thisId,
  });
  $("#comments").remove(thisId);
  console.log("clicked")
});

getSaved();
