function displayResults(scrapedData) {


  // For each entry of that json...
  scrapedData.forEach(function(article) {
    console.log(article);
    // Append each of the articles to the div
    $("#display").append("<p>" + article.title + "</p>" + 
                         "<a>" + "<p>" + article.link + "</p>" + "</a>" + 
                         "<button class='btn btn-secondary'>SAVE</button" + "<hr>");
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
