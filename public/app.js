//get articles from db as JSON
$("#displayBtn").on("click", function() {
  $.getJSON("/articles", function(data) {
    for (var i = 0; i <data.length; i++) {
    // Display the information on the browser
    $("#display").append(`<p data-id='${data[i]._id}' class='title'>${data[i].title}</p> <p class='link'>${data[i].link}</p><button class='btn btn-primary' data-toggle="toggle" id='saveBtn' data-id='${data[i]._id}'> SAVE</button>>`);
    }
  });
});

$("#scrapeBtn").on("click", function() {
  $.getJSON("/scrape"), function() {
    console.log("contents scraped");
  }
});

$(document).on("click", "#saveBtn", function() {
  //console.log("clicked");
  var thisId = $(this).attr("data-id");
  console.log(thisId);
  $.ajax({
    type: "GET",
    url: "/save/" + thisId
    })
  
.then(function(data) {
  console.log("article" + thisId + "saved");
  });
});

//mark article as unsaved
$(document).on("click", "#unSaveBtn", function() {
  console.log("clicked");
  var thisId = $(this).attr("data-id");
  console.log(thisId);
  $.ajax({
    type: "GET",
    url: "/unsave/" + thisId
  })
    .then(function(data) {
  console.log("article" + thisId + "unsaved");
  });
});

$(document).on("click", "#savedArticlesBtn", function() {
  $("#display").empty();
  console.log("clicked");

  $.getJSON("/saved/", function(data) {
    for (var i = 0; i < data.length; i++) {
      $("#display").append("<p class='title' data-id='" + data[i]._id + "'>" + data[i].title + "</p>" + "<p class='link'>" + data[i].link + "</p>" + "<button class='btn btn-primary' data-toggle='toggle' id='unSaveBtn' data-id='" + data[i]._id + "'> UNSAVE</button>");
    };
    console.log("clicked");
  });
}); // click works all throughout function but does not display saved info, likely because they aren't getting saved initially

$(document).on("click", "p", function() {
    // Empty the notes from the comment section
  $("#comments").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");
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

      if (data.comment) {
        // Places the title of the note in the title input
        $("#titleinput").val(data.comment.title);
        // Places the body of the note in the body textarea
        $("#bodyinput").val(data.comment.body);
      }
    });
});

$(document).on("click", "#savecomment", function() {
  // Grabs the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Runs a POST request to change the comment
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      title: $("#titleinput").val(),
      body: $("#bodyinput").val()
    }
  })
  .then(function(data) {
      console.log(data);
      // Empties the notes section
    });
  $("#titleinput").val("");
  $("#bodyinput").val("");
  $("#comments").empty();
});
//grabs all comments and displays
$("#viewCommentsBtn").on("click", function() {
  $("#comments").empty();
  $.getJSON("/comments", function(data) {
    for (var i = 0; i <data.length; i++) {
    $("#comments").append("<h3>" + data[i].title + "</h3>" + "<p>" + data[i].body + "</p>" + "<button id='delCommentBtn' data-id='" + data[i]._id + "' class='btn btn-primary' >x</button>" + "<hr>"  + "<br>");
    }
  });
});

//delete a comment from the display and db
$(document).on("click", "#delCommentBtn", function() {
  var thisId = $(this).attr("data-id");
  $.ajax({
    type: "GET",
    url: "/deletecomment/:id" + thisId,
  });
  $(this).remove(); 
  //deletes from display but deletes all content 
  //and does not yet delete from database 
  console.log("clicked");
});

//getSaved();
