// -----------------------------------------------------------------------------
// To udpate:
//      Auto-send an SMS to annouce a new subscriber.
//      More testing and handling of invalid cases.
//      Option for auto-authorize-subscriber.
//
'use strict';
const twilio = require('twilio');
const client = twilio(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);
const notify = client.notify.services(process.env.NOTIFY_SERVICE_SID);
//
const initSuccessMessage = '+ Group phone number initialized and you are subscribed as the admin.';
const initFailMessage = '- Group phone number already initialized.';
const helpMessage = 'Help: Text "subscribe name" to join. "authorize +PhoneNumber" to accept a new subscriber. "unsubscribe" to leave the group. "who" to receive a group list.';
const subscribeSuccessMessage = "+ You are subscribed to this Group's SMS messages.";
const subscribeFailMessage = '- Subscription process failed, try again.';
const authorizeSuccessMessage = '+ You have authorized: ';
const authorizeFailMessage = '- Failed to authorize.';
const authorizeFailMessageNotAuthorized = '- You are not authorized to authorize.';
const authorizeFailMessageAlreadyAuthorized ='- Already authorized.';
const UnsubscribeMessage = '+ You have been unsubscribed from this group phone number.';
const UnsubscribeFailMessage = '- Failed to unsubscribe.';
const whoMessage = "+ Members: ";
const whoSuccessMessage = '';
const whoFailMessage = '- You must be a member of the group to make this request.';
const whoFailMessageNotAuthorized = '- You are not authorized.';
const broadcastSuccessMessage = '+ Your message was broadcast to the group.';
const broadcastFailMessage = '- Your message failed to send, try again.';
const broadcastFailMessageNotAuthorized = '- You are not authorized to broadcast messages.';
const broadcastNotAuthorizedMessage = '- You are not part of the group.';
// -----------------------------------------------------------------------------
console.log("+ Group SMS");
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
// console.log("+ ACCOUNT_SID      :" + accountSid + ":");
// console.log("+ AUTH_TOKEN       :" + authToken + ":");
const syncServiceSid = process.env.SYNC_SERVICE_SID;
console.log("+ SYNC_SERVICE_SID :" + syncServiceSid + ":");
const notifyServiceSid = process.env.NOTIFY_SERVICE_SID;
console.log("+ NOTIFY_SERVICE_SID  :" + notifyServiceSid + ":");

// -----------------------------------------------------------------------------
class Command {
    // Create an instance with arguments from the incoming SMS
    constructor(event) {
        this.toNumber = event.To.trim();
        this.fromNumber = event.From.trim();
        this.body = event.Body.trim() || '';
        this.event = event;
        if (this.fromNumber.indexOf('+') !== 0) {
            // If missing "+country code", fix it
            this.fromNumber = `+1${this.fromNumber}`;
        }
        // console.log("+ this.fromNumber: " + this.fromNumber);
        let smsTextArray = this.body.split(' ');
        this.word1 = smsTextArray[0].trim();
        if (smsTextArray.length === 2) {
            this.word2 = smsTextArray[1].trim();
        }
    }
    // Get an array of arguments after the first word for a command
    get commandArguments() {
        return this.body.trim().split(' ').slice(1);
    }
    // Get the full text after the command with spaces reinserted
    get commandText() {
        return this.commandArguments.join(' ');
    }
    // Execute command async (to be overridden by subclasses)
    run(callback) {
        callback(null, 'Command not implemented.');
    }
}

class HelpCommand extends Command {
    run(callback) {
        // console.log("++ callback: " + helpMessage);
        callback(null, helpMessage);
    }
}

class InitCommand extends Command {
    run(callback) {
        client.sync.services(syncServiceSid)
        .syncMaps
        .create({ttl: 0, uniqueName: this.toNumber})
        .then((sync_map) => {
            console.log("+ Initialized, created group SMS phone number Map: " + this.toNumber);
            // Create a new SMS Notify binding for this user's phone number
            let theData = {'name': this.word2, 'authorized': 'admin'};
            client.sync.services(syncServiceSid).syncMaps(this.toNumber).syncMapItems
                .create({key: this.fromNumber, data: theData})
                .then((sync_map_item) => {
                    console.log("+ Subscribed: " + this.word2 + " " + this.fromNumber);
                    callback(null, initSuccessMessage);
                }).catch(function (error) {
                callback(error, subscribeFailMessage);
            });
        })
        .catch(function (error) {
            callback(error, initFailMessage);
        });
    }
}

class SubscribeCommand extends Command {
    // Add the person into the DB.
    // Broadcast that they have joined.
    // Need error checking for this.word2, that it is valid.
    run(callback) {
        // Create a new SMS Notify binding for this user's phone number
        let theData = {'name': this.word2, 'authorized': 'new'};
        client.sync.services(syncServiceSid).syncMaps(this.toNumber).syncMapItems
                .create({key: this.fromNumber, data: theData})
                .then((sync_map_item) => {
                    console.log("+ Subscribed, name: " + this.word2 + " " + this.fromNumber);
                    callback(null, subscribeSuccessMessage);
                }).catch(function (error) {
            callback(error, subscribeFailMessage);
        });
    }
}

class AuthorizeCommand extends Command {
    // Update the person into the DB to be authorized.
    // 
    // Need error checking that this.word2 is valid.
    // Need better callback message when this.fromNumber is not found.
    //
    run(callback) {
        
client.sync.services(syncServiceSid).syncMaps(this.toNumber).syncMapItems(this.fromNumber)
    .fetch()
    .then((syncMapItems) => {

    let senderName = syncMapItems.data.name;
    let authorized = syncMapItems.data.authorized;
    console.log("+ Sender name: " + senderName + ", authorized: " + authorized);
    if (authorized === 'new') {
        callback(null, authorizeFailMessageNotAuthorized);
        return;
    }

client.sync.services(syncServiceSid).syncMaps(this.toNumber).syncMapItems(this.word2)
    .fetch()
    .then((syncMapItems) => {
        let personName = syncMapItems.data.name;
        let authorized = syncMapItems.data.authorized;
        console.log("+ name: " + personName + ", authorized: " + syncMapItems.data.authorized);
        if (authorized !== 'new') {
            callback(null, authorizeFailMessageAlreadyAuthorized);
            return;
        }

        let theData = {'name': personName, 'authorized': this.fromNumber};
        client.sync.services(syncServiceSid).syncMaps(this.toNumber).syncMapItems(this.word2)
            .update({key: this.word2, data: theData})
            .then((sync_map_item) => {
                console.log("+ Updated authorized, to: " + this.fromNumber);
                callback(null, authorizeSuccessMessage + personName);
            }).catch(function (error) {
            // console.log("- AuthorizeCommand, update: " + error);
            callback(error, authorizeFailMessage);
        });
        
    }).catch(function (error) {
        console.log("- AuthorizeCommand, retrieve parameter:  " + error);
        callback(error, authorizeFailMessage);
    });

}).catch(function (error) {
    console.log("- AuthorizeCommand, retrieve from-phone-number:  " + error);
    callback(error, authorizeFailMessage);
});

    } // run(callback)
}

class UnsubscribeCommand extends Command {
    // Remove the person into the DB.
    // Broadcast that they have left the group.
    run(callback) {
        client.sync.services(syncServiceSid).syncMaps(this.toNumber).syncMapItems(this.fromNumber)
            .remove()
            .then((sync_map) => {
                console.log("+ Deleted.");
                callback(null, UnsubscribeMessage);
            }).catch(function (error) {
            console.log("- " + error);
            callback(error, UnsubscribeFailMessage);
        }); 
    }
}

class WhoCommand extends Command {
    run(callback) {
    let returnMessage = '';
    
    // Check that the requester is in the group.
    // Need a proper error message returned to the requester.
    client.sync.services(syncServiceSid).syncMaps(this.toNumber).syncMapItems(this.fromNumber)
    .fetch()
    .then((syncMapItems) => {

    let senderName = syncMapItems.data.name;
    let authorized = syncMapItems.data.authorized;
    console.log("+ Sender name: " + senderName + ", authorized: " + authorized);
    if (authorized === 'new') {
        callback(null, whoFailMessageNotAuthorized);
        return;
    }

    client.sync.services(syncServiceSid).syncMaps(this.toNumber).syncMapItems.list()
    .then(
        syncMapItems => {
            console.log("++ Load syncMapItems.");
            syncMapItems.forEach((syncMapItem) => {
                console.log("+ Key: " + syncMapItem.key 
                + ", name: " + syncMapItem.data.name
                + ", authorized: " + syncMapItem.data.authorized
            );
            if (returnMessage === '') {
                returnMessage = syncMapItem.data.name;
            } else {
                returnMessage += ", " + syncMapItem.data.name;
            }
        });
        callback(null, whoMessage + returnMessage);
    });
    
    }).catch(function (error) {
        // console.log("- AuthorizeCommand, retrieve from-phone-number:  " + error);
        callback(error, whoFailMessage);
    });
    
    }
}

class BroadcastTheMessage extends Command {
    run(callback) {
    
    // Check that the requester is in the group.
    // Need a proper error message returned to the requester.
    client.sync.services(syncServiceSid).syncMaps(this.toNumber).syncMapItems(this.fromNumber)
    .fetch()
    .then((syncMapItems) => {

    let senderName = syncMapItems.data.name;
    let authorized = syncMapItems.data.authorized;
    console.log("+ Sender name: " + senderName + ", authorized: " + authorized);
    if (authorized === 'new') {
        callback(null, broadcastFailMessageNotAuthorized);
        return;
    }
    let counter = 0;
    let sendList = [];
    
    client.sync.services(syncServiceSid).syncMaps(this.toNumber).syncMapItems.list()
    .then(
        syncMapItems => {
            syncMapItems.forEach((syncMapItem) => {
                console.log("+ Key: " + syncMapItem.key 
                + ", name: " + syncMapItem.data.name
                + ", authorized: " + syncMapItem.data.authorized
            );
            if (this.fromNumber !== syncMapItem.key && syncMapItem.data.authorized !== "new") {
                // Don't send to the sender.
                sendList[counter] = JSON.stringify({"binding_type": "sms", "address": syncMapItem.key});
                counter += 1;
            }
        });
        let theMessage = "From: " + senderName + ", " + this.body;
        console.log("+ The message |" + theMessage + "| counter = " + counter + " sendList: " + sendList);
        client.notify.services(notifyServiceSid).notifications.create({
            body: theMessage,
            toBinding: sendList
        }).then((response) => {
            console.log("+ Notify response.sid: " + response.sid);
            callback(null, broadcastSuccessMessage);
        }).catch(err => {
            // console.log(err);
            callback(err, broadcastFailMessage);
        });
    });
    
    }).catch(function (error) {
        callback(error, broadcastFailMessage);
    });
    
    }
}

// -----------------------------------------------------------------------------
// Handle incoming SMS commands
//
//------------------
// For testing:
// https://about-time-1235.twil.io/groupsms?To=+16503791233&From=16508661234&body=okay
var event;
// event = {Body: "subscribe Harry", From: "+16508668888", To: "+16508661233"};
// event = {Body: "authorize +16508667777", From: "+16508668225", To: "+16508661233"};
event = {Body: "who", From: "+16508668888", To: "+16508661233"};
// event = {Body: "Hello to all!", From: "+16508668232", To: "+16508661233"};
function callback(aValue, theText) {
    console.log("++ function callback: " + theText);
}
// exports.handler = (context, event, callback) => {
//------------------
{
    let smsText = event.Body || '';
    let smsTextArray = smsText.split(' ');
    let cmd = smsText.trim().split(' ')[0].toLowerCase();
    let cmd2 = '';
    let echoSms = "+ cmd: " + cmd + ", From: " + event.From + ", To: " + event.To;
    if (smsTextArray.length === 2) {
        cmd2 = smsTextArray[1].trim();
        echoSms += ", second: " + cmd2;
    }
    console.log(echoSms);
    let cmdInstance;
    // let cmdInstance = new BroadcastCommand(event);
    switch (cmd) {
        case 'subscribe':
        case 'start':
            cmdInstance = new SubscribeCommand(event);      // create
            break;
        case 'authorize':
            cmdInstance = new AuthorizeCommand(event);      // retrieve and update
            break;
        case 'unsubscribe':
        case 'stop':
            cmdInstance = new UnsubscribeCommand(event);    // delete
            break;
        case 'who':
            cmdInstance = new WhoCommand(event);            // retrieve a list
            break;
        case 'help':
            cmdInstance = new HelpCommand(event);
            break;
        case 'init':
            cmdInstance = new InitCommand(event);
            break;
        default:
            cmdInstance = new BroadcastTheMessage(event);   // Use Notify
    }
    cmdInstance.run((err, message) => {
        let twiml = new twilio.twiml.MessagingResponse();
        if (err) {
            // console.log(err);
            console.log("- cmdInstance.run, " + cmdInstance.word1 + " error: " + err.status + ":" + err.message);
            if (err.status === 409 && cmdInstance.word1 === 'subscribe') {
                message = '- You are already subscribed.';
            } else if (err.status === 404 && cmdInstance.word1 === 'unsubscribe') {
                message = '- You are not subscribed.';
            } else if (err.status === 404) {
                message = 'There was a problem with your request, value not found: ' + cmdInstance.word2;
            } else if (err.status === 409 && cmdInstance.word1 === 'init') {
                message = initFailMessage;
            } else {
                message = 'There was a problem with your request.';
            }
        }
        console.log("+ cmdInstance.run: " + message);
        twiml.message(message);
        callback(null, twiml);
    });
}
// -----------------------------------------------------------------------------

