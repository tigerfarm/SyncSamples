# Sync Sample Website Application

Setup:
````
$ export ACCOUNT_SID ACxxx...xxx
$ export SYNC_SERVICE_SID ISxxx...xxx
$ export API_KEY SKxxx...xxx
$ export API_KEY_SECRET xxx...xxx
````
Run the Node.JS server program, install the required packages, then run the chat server or command line program.
````
$ npm install twilio
$ npm install express

$ node webserver.js
````
Use a browser to set the Sync client username:

http://localhost:8000/hello?username=me

Use a browser to call the application:

http://localhost:8000/

Click one of the square to change it to an X.

In another browser tab, to set the Sync client username:

http://localhost:8000/hello?username=you

Use a browser to call the application:

http://localhost:8000/

You will see the board as set in the other tab.
Click another square to change it to an X.
Change to the other tab to see the change.

--------------------------------------------------------------------------------
## Sample programs.

webserver.js : basic HTTP webserver that using Express.

docroot : static website with Ajax call to get a Sync token from the webserver.

listDocuments.js : list Sync documents.

retrieveDocument.js : retrieve a Sync document, the one used in the sample application.

--------------------------------------------------------------------------------

Cheers...
