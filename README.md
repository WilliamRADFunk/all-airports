# all-airports
Serves as an independent data scraping module, complete with ontology and full scraping ability for the airports of the world.

Also serves as child module for the larger [data-glutton](https://github.com/WilliamRADFunk/data-glutton.git), which culminates data from multiple locations and bridges them under a universal ontology.

***

## Data Already Scraped

Each time additional functionality is added to this module, the process is run through and the `dist/json/`, `dist/jsonld/`, and `dist/ontology/` folders/files are updated. If you only want the data, feel free to simply copy those files that you need.

If you want the most recent data possible, follow the instruction below to run the data scraper that will update the dist folder files for you.

***

## Using All Airports

### 1. Clone the repo

Run `git clone https://github.com/WilliamRADFunk/all-airports.git` from the folder level you want all-airports to be created.

### 2. Navigate to All Airports

Enter into the root level of all-airports. Typically done by using the command `cd all-airports`.

### 3. Install dependencies

Run the command `npm install` and wait for npm to finish installing all the packages all-airports needs.

### 4. Scrape the data

Run the command `npm run scrape` and wait until it processes through the countries.

Depending on the speed and throughput of your internet connection, some countries might timeout. For now, you will be prompted whether you want to retry those countries or not. If so, type the letter `y` and press `enter`/`return`. The scraper will run through the countries that failed.

### 5. Take the data

Now the `dist/json`, `dist/jsonld`, and `dist/ontology` files are updated. Use them as you need.

### 6. You want more?

There is a project at [data-glutton](https://github.com/WilliamRADFunk/data-glutton.git) that coordinates between multiple data scrapers like this one to create a uniform, ontologically defined, store of rich linked data.

Try it out.

## Credits

### Open Source Data Locations

airports-source.json    -->

https://jdelbourgo.opendatasoft.com/explore/dataset/natural-earth-airports/table/?flg=en&rows=20000&refine.featurecla=Airport&dataChart=eyJxdWVyaWVzIjpbeyJjb25maWciOnsiZGF0YXNldCI6Im5hdHVyYWwtZWFydGgtYWlycG9ydHMiLCJvcHRpb25zIjp7ImZsZyI6ImVuIn19LCJjaGFydHMiOlt7ImFsaWduTW9udGgiOnRydWUsInR5cGUiOiJwaWUiLCJmdW5jIjoiQVZHIiwieUF4aXMiOiJzY2FsZXJhbmsiLCJzY2llbnRpZmljRGlzcGxheSI6dHJ1ZSwiY29sb3IiOiJyYW5nZS1BY2NlbnQiLCJwb3NpdGlvbiI6ImNlbnRlciJ9XSwieEF4aXMiOiJzY2FsZXJhbmsiLCJtYXhwb2ludHMiOjUwLCJzb3J0IjoiIiwic2VyaWVzQnJlYWtkb3duIjoiIiwic2VyaWVzQnJlYWtkb3duVGltZXNjYWxlIjoiIn1dLCJ0aW1lc2NhbGUiOiIiLCJkaXNwbGF5TGVnZW5kIjp0cnVlLCJhbGlnbk1vbnRoIjp0cnVlfQ%3D%3D

airports-npm.json       -->

https://github.com/jbrooksuk/JSON-Airports/blob/master/airports.json

airports-datahub.json   -->

https://datahub.io/core/airport-codes
