//scrape articles from Scandinavian Standard website
$("#scrapeBtn").on("click", function () {
  $.getJSON("/scrape"), function () {
    console.log("contents scraped");
  }
});

//get articles from db as JSON
$("#displayBtn").on("click", function() {
  $("#display").empty();
  $.getJSON("/articles", function(data) {
    $("#display").append("<h2>ARTICLES</h2>" + "<hr>");
    for (var i = 0; i <data.length; i++) {
    // Display the information on the browser
    $("#display").append(`<p data-id='${data[i]._id}' class='title'>${data[i].title}</p> <p class='link'>${data[i].link}</p><button class='btn btn-primary' data-toggle="toggle" id='saveBtn' data-id='${data[i]._id}'> SAVE</button>`);
    }
  });
});
//mark articles saved in db
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

//mark article as unsaved in db
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
//view all saved articles
$(document).on("click", "#savedArticlesBtn", function() {
  $("#display").empty();
  console.log("clicked");
  $.getJSON("/saved/", function(data) {
    $("#display").append("<h2>YOUR SAVED ARTICLES</h2>" + "<hr>");
    for (var i = 0; i < data.length; i++) {
      $("#display").append("<div data-id='" + data[i]._id + "'>" + "<p class='title' data-id='" + data[i]._id + "'>" + data[i].title + "</p>" + "<p class='link'>" + data[i].link + "</p>" + "<button class='btn btn-primary' data-toggle='toggle' id='unSaveBtn' data-id='" + data[i]._id + "'> UNSAVE</button></div>");
    };
    console.log("clicked");
  });
}); 
//click on scraped link to leave a comment
$(document).on("click", "p", function() {
    // Empty the notes from the comment section
  $("#comments2").empty();
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
      // A textarea to add a new comment body
      $("#comments").append("<textarea id='bodyinput' placeholder='COMMENT' name='body'></textarea>"  + "<br>" + "<br>");
      // A button to submit a new comment, with the id of the article saved to it
      $("#comments").append("<button class='btn btn-primary' data-id='" + data._id + "' id='savecomment'>SAVE COMMENT</button>");

      if (data.comment) {
        // Places the title of the note in the title input
        $("#titleinput").val(data.comment.title);
        // Places the body of the note in the body textarea
        $("#bodyinput").val(data.comment.body);
      }
    });
});
//saves comment with associated article
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
  });
  $("#titleinput").val("");
  $("#bodyinput").val("");
  $("#comments").empty();
});
//grabs all comments and displays
$("#viewCommentsBtn").on("click", function() {
  $("#comments").empty();
  $.getJSON("/comments", function(data) {
    $("#comments").append("<h2>COMMENTS</h2>" + "<hr>");
    for (var i = 0; i <data.length; i++) {
      $("#comments").append("<div class='comment' data-id='" + data[i]._id + "'>" + "<h3>" + data[i].title + "</h3>" + "<p>" + data[i].body + "</p>" + "<button id='delCommentBtn' data-id='" + data[i]._id + "' class='btn btn-primary' >x</button>" + "<hr>" + "</div>" + "<br>");
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
  $(`#comments.${$(this).data("data[i]._id")}`).remove();
  //deletes from display but deletes all content 
  //and does not yet delete from database 
  console.log("clicked");
});

