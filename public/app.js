//get articles from db as JSON
$("#scrapeBtn").on("click", function() {
  $.getJSON("/articles", function(data) {
    for (var i = 0; i <data.length; i++) {
    // Display the information on the browser
    $("#display").append("<p class='title' data-id='" + data[i]._id + "'>" + data[i].title + "</p>" + "<p class='link'>" + data[i].link + "</p>" + "<button id='saveBtn' class='btn btn-primary' role='button'>SAVE</button>" + " " + "<button id='commentBtn' class='btn btn-primary' role='button'>COMMENT</button>");
    }
  });
  //console.log("clicked");
});

// $("#savedArticlesBtn").click(function(){
//     $("#savedDisplay").html("<h2>YOUR SAVED ARTICLES</h2>");
// });

$(document).on("click", "#saveBtn", function() {
  console.log("clicked");
  var thisId = $(this).attr("data-id");
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
  .then(function(data) {
  $("#savedDisplay").append("<p class='title' data-id='" + data[i]._id + "'>" + data[i].title + "</p>" + "<p class='link'>" + data[i].link + "</p>" + "<button id='comment' class='btn btn-primary' data-toggle='modal' data-target='#commentModal' role='button'>COMMENT</button>");
  });
});

$(document).on("click", "p", function() {
  // $("#commentModal").modal("show")
  // Empty the notes from the comment section
 // $("#comments").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");
  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
  .then(function(data) {
      console.log(data);
      $("#comments").append("<h3>COMMENTS</h3>" + "<hr>");
      // The title of the article
      $("#comments").append("<h3>" + data.title + "</h3>");
      // An input to enter a new title
      $("#comments").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#comments").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#comments").append("<button data-id='" + data._id + "' id='savecomment'>SAVE COMMENT</button>");

      // If there's a note in the article
      if (data.comment) {
        // Place the title of the note in the title input
        //$("#titleinput").val(data.comment.title);
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
      $("#comments").empty();
    });

  $("#titleinput").val("");
  $("#bodyinput").val("");
});

