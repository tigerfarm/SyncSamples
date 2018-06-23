# Twilio Sync Samples

Requirements:

- Twilio account. A free Trial account will work.
- NodeJS installed to run the Client locally on your computer.
Or a website that runs PHP programs such as Heroku. PHP is very common with service providers.

## Files

The Client files:
- [index.html](index.html) : Twilio JavaScript (JS) Client to make and receive phone calls.
- [custom/app.css](custom/app.css) : Styles

Twilio NodeJS Functions
- [generateToken.js](generateToken.js) : generates and returns a Client capability token.
- [makecall.js](makecall.js) : provides TwiML to make phone calls.


## Implementation

### Create a Notify Service.

Documentation link: https://www.twilio.com/docs/sync/maps

### Add Twilio Functions

You will need to replace the sample domain name, "about-time-6360.twil.io," with your Runtime Domain name.
You can view your Runtime Domain name at this link:

[https://www.twilio.com/console/runtime/overview](https://www.twilio.com/console/runtime/overview)

Create a Twilio Function to generate client capability tokens.
In the Console, go to:

[https://www.twilio.com/console/runtime/functions](https://www.twilio.com/console/runtime/functions)
    
1. Click the Create Function icon (circle with plus sign in the middle).
2. Click Blank. Click Create.
   - Properties, Function Name: Generate Client Token
   - URL Path: https://about-time-6360.twil.io /generateToken (note, your domain is display here)
   - Uncheck Configuration, Access Control to allow Twilio JS Client access.
   - Copy and paste the contents of [generateToken.js](generateToken.js) into the Code box.
3. Click Save.

Create a Twilio Function to provide TwiML to make phone calls.

[https://www.twilio.com/console/runtime/functions](https://www.twilio.com/console/runtime/functions)
    
1. Click the Create Function icon (circle with plus sign in the middle).
2. Click Blank. Click Create.
   - Properties, Function Name: Make a call
   - URL Path: https://about-time-6360.twil.io /makecall (note, your domain is display here)
   - For testing, uncheck Configuration, Access Control to allow accessible from a browser.
   - Copy and paste the contents of [makecall.js](makecall.js) into the Code box.
3. Click Save.

Create a Voice TwiML Application entry using the above Twilio Function URL.
In the Console, go to:

[https://www.twilio.com/console/voice/runtime/twiml-apps](https://www.twilio.com/console/voice/runtime/twiml-apps)
    
1. Click Create new TwiML Ap
2. Enter the following:
   - Friendly name: Make a call 
   - Voice, Request URL: https://about-time-6360.twil.io/makecall (Use URL of above, with your domain name)
3. After clicking Save, go back into the app entry to get the app SID.
   - The SID is used when creating a Function environment variable.
   - Example: APeb4627655a2a4be5ae1ba962fc9576cf

### Twilio Function Configuration

Configure your account's Twilio Functions settings.
In the Console, go to:
    
[https://www.twilio.com/console/runtime/functions/configure](https://www.twilio.com/console/runtime/functions/configure)
    
Check: Enable ACCOUNT_SID and AUTH_TOKEN.
- This allows your Functions to access your account SID and auth token as environment variables.

Create Function Environment Variables.

    (Key : value)
    CLIENT_ID : Example, owluser (Your default Client identity attribute, no spaces)
    CLIENT_PHONE_NUMBER : Example, +12223331234 (Your Twilio phone number)
    
    VOICE_TWIML_APP_SID_CALL_CLIENT : Example: APeb4627655a2a4be5ae1ba962fc9576cf
    (API key code to a Twilio Function URL)
    This is used in the token. This links the token Function to the TwiML provider Function.
    
    Click Save, to save the environment variables.

Update your Twilio Function host name into the Twilio Client server side programs.
You can view the host name by going to the following link. The host name, is Your Runtime Domain name.

[https://www.twilio.com/console/runtime/overview](https://www.twilio.com/console/runtime/overview)

    If you are using the NodeJS webserver, edit: nodeHttpServer.js.
    If you are using a remote webserver with PHP, edit: clientTokenGet.php.
    Change:
       tokenHost = "about-time-1235.twil.io";
    to use your Twilio Function host name.
    
    If you are running nodeHttpServer.js. Restart it.

## Ready to Test


Cheers...
