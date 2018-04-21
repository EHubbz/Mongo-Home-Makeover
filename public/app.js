function displayResults(articles) {

  // For each entry of that json...
  scrapedArticles.forEach(function(article) {
    // Append each of the articles to the div
    $("#display").append("<p>" + scrapedArticles.title + "</p>"
                         "<p>" + scrapedArticles.link + "</p>");
  });
}
// First thing: ask the back end for json with all articles
// $.getJSON("/all", function(data) {
//   // Call our function to display in browser
//   displayResults(data);
// });

$("#getBtn").on("click", function() {
  $.getJSON("/all", function(data) {
    displayResults(data);
  });
});

// $("#toSavedPage").click(function(){
//     var newURL = "saved.html";
//               window.location = newURL;
//   });