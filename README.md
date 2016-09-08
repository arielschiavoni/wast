WASt: Web Application Store
===========================

## Quick start

Application Store made to try:
  - Responsive Web Designs concepts
  - JavaScript frameworks (Backbone.js, Angular.js)
  - CSS Preprocessors (Sass)


## How to setup server:

1. Install solr.

$ brew install solr

2. Save copy of current solrconfig.xml and schema.xml

3. Create sylinks for those files to CLONED_REPO/server/solr/schema.xml and solrconfig.xml

$ ln -s ~/Documents/Repos/wast/server/solr/solrconfig.xml solrconfig.xml
$ ln -s ~/Documents/Repos/wast/server/solr/schema.xml schema.xml

4. Update the following section on server/Gruntfile.js according to your file system. Also change every occurence of
host to host: "localhost"

mongoimport: {
  default: {
    appsFile: "/Users/arielschiavoni/Documents/Repos/wast/server/solr/cws-applications.json",
    usersFile: "/Users/arielschiavoni/Documents/Repos/wast/server/solr/users.json",
    reviewsFile: "/Users/arielschiavoni/Documents/Repos/wast/server/solr/reviews.json",
    backupAppsFile: "/Users/arielschiavoni/Documents/Repos/wast/server/solr/applications.json",
    // host: "ec2-23-23-106-149.compute-1.amazonaws.com",
    host: "localhost",
    port: 27017
  }
}

5. Start solr.

$ cd /usr/local/Cellar/solr/4.6.0/libexec/example
$ java -jar start.jar

6. Go to http://localhost:8983/solr/#/collection1

7. Import json files to mongodb (mongod should be running, please check mongoimport task --> host and port in Gruntfile.js)

$ cd /Users/arielschiavoni/Documents/Repos/wast/server/
$ grunt mongoimport

8. Synchronize mongodb with solr (solr should be runing, please check solr task --> host and port in Gruntfile.js)

$ grunt solr:export


## Authors

**Ariel Schiavoni**

+ [http://twitter.com/ingCAS](http://twitter.com/ingCAS)
+ [http://github.com/arielschiavoni](http://github.com/arielschiavoni)

## License

This code is under MIT license.
