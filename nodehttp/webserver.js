// -----------------------------------------------------------------------------
// $ npm install --save express
const express = require('express');
var app = express();

// $ npm install --save twilio
var AccessToken = require('twilio').jwt.AccessToken;
var SyncGrant = AccessToken.SyncGrant;

var userIdentity = '';

// -----------------------------------------------------------------------------
app.get('/token', function (request, response) {
    // Docs: https://www.twilio.com/docs/sync/identity-and-access-tokens
    if (userIdentity === '') {
        response.send({message: '- Indentity required.'});
        return;
    }
    var identity = userIdentity;
    var syncGrant = new SyncGrant({
        serviceSid: process.env.SYNC_SERVICE_SID
    });
    var token = new AccessToken(
            process.env.ACCOUNT_SID,
            process.env.API_KEY,
            process.env.API_KEY_SECRET
            );
    token.addGrant(syncGrant);
    token.identity = identity;
    response.send({
        message: '',
        identity: identity,
        token: token.toJwt()
    });
    // Reset, which requires the next person to set their identity before getting a token.
    userIdentity = '';
});

// -----------------------------------------------------------------------------
app.get('/hello', function (req, res) {
    if (req.query.username) {
        userIdentity = req.query.username
        res.send('Hello ' + userIdentity + '.');
    } else {
        res.send('Hello there.');
    }
});
// -----------------------------------------------------------------------------
app.use(express.static('docroot'));
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('HTTP Error 500.');
});

// const path = require('path');
const PORT = process.env.PORT || 8000;
app.listen(PORT, function () {
    console.log('+ Listening on port: ' + PORT);
});
