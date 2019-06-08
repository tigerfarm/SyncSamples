# Twilio Sync Sample Website Application

This repository application is based on the Twilio Sync quickstart:
https://www.twilio.com/docs/sync/quickstart/js

## Twilio Console Configuration

These are the steps to configure to use the Chat Web Application.
No development or credit card information required to try Chat.

1. Create a Chat Service:

[https://www.twilio.com/console/chat/dashboard](https://www.twilio.com/console/chat/dashboard)

2. Create an API key and secret string:

[https://www.twilio.com/console/chat/runtime/api-keys](https://www.twilio.com/console/chat/runtime/api-keys)


## Application Environment Setup

Use your Twilio account values to set the Environment variables used in webserver.js.
````
$ export ACCOUNT_SID ACxxx...xxx
$ export SYNC_SERVICE_SID ISxxx...xxx
$ export API_KEY SKxxx...xxx
$ export API_KEY_SECRET xxx...xxx
````
Install the required packages.
````
$ npm install twilio
$ npm install express

$ node webserver.js
````
Run the webserver program.
````
$ node webserver.js
````

## Test

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
## Program Descriptions

webserver.js : basic HTTP webserver that using Express.

docroot : static website with Ajax call to get a Sync token from the webserver.

listDocuments.js : list Sync documents.

retrieveDocument.js : retrieve a Sync document, the one used in the sample application.

--------------------------------------------------------------------------------

Cheers...
