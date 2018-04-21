function displayResults(scrapedData) {

  // For each entry of that json...
  scrapedData.forEach(function(article) {
    // Append each of the articles to the div
    $("#display").append("<p>" + scrapedData.title + "</p>" + 
                         "<p>" + scrapedData.link + "</p>" + 
                         "<button class='btn btn-secondary'>SAVE</button");
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
