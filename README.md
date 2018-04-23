# Mongo-Home-Makeover

##What It Is-

Mongo Home Makeover is a data-scraping app that pulls in articles from https://www.Domino.com featuring headlines for before and after photos to give the user inspiration for their home makeover projects. 

##How It Works-

When the '/scrape'route is run, the targeted data from https://www.Domino.com is scraped from the website and stored in the Mongo db, each with an id, title and link. 

When the user clicks "GET ARTICLES" the articles stored in the database are retrieved and populated on the page along with a 'COMMENT' button, which allows the user to leave a comment about the selected article, as see any previous comments they may have left. The user can delete their comments associated with that article as well. 

