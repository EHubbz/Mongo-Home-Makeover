// function displayResults(scrapedData) {
// // For each entry of that json...
//   scrapedData.forEach(function(article) {
//     //console.log(article);
//     // Append each of the articles to the div
//     $("#display").append("<p>" + article.title + "</p>" + 
//                          "<a href='#'>" + article.link + "</a>" + 
//                          "<a href='saved.html' id='saveBtn' class='btn btn-secondary'> SAVE</a>" + "<hr>");
//   });
// }

// $.getJSON("/all", function(data) {
//   // For each one
  
// });

$("#getBtn").on("click", function() {
  $.getJSON("/all", function(scrapedData) {
      //console.log(scrapedData);
    for (var i = 0; i <scrapedData.length; i++) {
    // Display the apropos information on the page
    $("#display").append("<a href='modLink'><p data-id='" + scrapedData[i]._id + "'>" + scrapedData[i].title + "<br />" + scrapedData[i].link + "</p></a>" + "<a href='saved.html' id='saveBtn' class='btn btn-secondary'> SAVE</a>" + "<button id='commentBtn' data-target='#commentModal' class='btn btn-secondary'> COMMENT</button>");
  }
   // displayResults(scrapedData);
      });
  console.log("clicked");
});

// $("#commentBtn").on("click", function() {
//   // Grab the id associated with the article from the submit button
//   var thisId = $(this).attr("data-id");

//   // Run a POST request to change the note, using what's entered in the inputs
//   $.ajax({
//     method: "POST",
//     url: "/all/" + thisId,
//     data: {
//       // Value taken from title input
//       title: $("#titleinput").val(),
//       // Value taken from note textarea
//       body: $("#bodyinput").val()
//     }
//   })
//     // With that done
//     .then(function(data) {
//       // Log the response
//       console.log(data);
//       // Empty the notes section
//       //$("#comments").empty();
//     });
