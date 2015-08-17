# CMS-Vanilla
A sample CMS system using a Angular front end and a Spring RESTful backend

To get things up and running you will need:

    Maven
    Java 7
    Tomcat
    Node + NPM
    Gulp
    Apache
    

Build the API with:

   mvn package

Run the API with:

    java -jar target/cms-1.0-SNAPSHOT.war
    
    (or run the api/uk.co.opentuned.cms/Application main class from your IDE)
   
Build the CMS front end with:

    gulp build
    gulp inject
    
Then browse to:

    frontend/www/