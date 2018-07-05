// -----------------------------------------------------------------------------
'use strict';
const twilio = require('twilio');
const client = twilio(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);
const notify = client.notify.services(process.env.NOTIFY_SERVICE_SID);
//
const helpMessage = 'Help: Text "subscribe" to join. "authorize <phone#>" to accept a new subscriber. "unsubscribe" to leave the group. "who" to receive a group list.';
const subscribeSuccessMessage = "+ Subscribe: You are subscribed to this phone number's messages.";
const subscribeFailMessage = '- Subscription process failed, try again.';
const broadcastSuccessMessage = '+ Your message was broadcast to the group.';
const broadcastFailMessage = '- Your message failed to send, try again.';
const broadcastNotAuthorizedMessage = '- You are not part of the group.';
const startMessage = "+ Start: You are subscribed to this phone number's messages.";
const stopMessage = "+ Stop: You are unsubscribed from this phone number's messages.";
const authorizeMessage = '+ authorizeMessage';
const UnsubscribeMessage = '+ UnsubscribeMessage';
const whoMessage = "Members: ";
// -----------------------------------------------------------------------------
console.log("+++ Start echo.");
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const syncServiceSid = process.env.SYNC_SERVICE_SID;
const syncMap = process.env.SYNC_MAP_NAME;
// console.log("+ ACCOUNT_SID      :" + accountSid + ":");
// console.log("+ AUTH_TOKEN       :" + authToken + ":");
console.log("+ SYNC_SERVICE_SID :" + syncServiceSid + ":");
// console.log("+ SYNC_MAP_NAME    :" + syncMap + ":");

// -----------------------------------------------------------------------------
class Command {
    // Create a new instance with necessary arguments from the incoming SMS
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

class StartCommand extends Command {
    run(callback) {
        // console.log("++ callback: " + startMessage);
        callback(null, startMessage);
    }
}

class StopCommand extends Command {
    run(callback) {
        // console.log("++ callback: " + stopMessage);
        callback(null, stopMessage);
    }
}

class SubscribeCommand extends Command {
    // Add the person into the DB.
    // Broadcast that they have joined.
    run(callback) {
        // Create a new SMS Notify binding for this user's phone number
        let theData = {'name': this.word2, 'authorizedBy': 'new'};
        client.sync.services(syncServiceSid).syncMaps(this.toNumber).syncMapItems
                .create({key: this.fromNumber, data: theData})
                .then((sync_map_item) => {
                    console.log("+ Created, SID: " + sync_map_item.sid);
                    callback(null, subscribeSuccessMessage);
                }).catch(function (error) {
            callback(error, subscribeFailMessage);
        });
    }
}

class AuthorizeCommand extends Command {
    // Update the person into the DB to be authorized.
    run(callback) {
client.sync.services(syncServiceSid).syncMaps(this.toNumber).syncMapItems(this.word2)
    .fetch()
    .then((syncMapItems) => {
        console.log("+ name: " + syncMapItems.data.name + ", authorizedBy: " + syncMapItems.data.authorizedBy);
        let theData = {'name': syncMapItems.data.name, 'authorizedBy': this.fromNumber};
        client.sync.services(syncServiceSid).syncMaps(this.toNumber).syncMapItems(this.word2)
            .update({key: this.word2, data: theData})
            .then((sync_map_item) => {
                console.log("+ Updated authorizedBy, to:" + this.fromNumber);
            }).catch(function (error) {
            console.log("- " + error);
            // callback("- " + error);
        });
    }).catch(function (error) {
    console.log("- " + error);
    // callback("- " + error);
});
    }
}

class UnsubscribeCommand extends Command {
    // Remove the person into the DB.
    // Broadcast that they have left the group.
    run(callback) {
        callback(null, UnsubscribeMessage);
    }
}

class WhoCommand extends Command {
    run(callback) {
        // console.log("++ callback: " + stopMessage);
        callback(null, whoMessage);
    }
}

class BroadcastCommand extends Command {
    run(callback) {
        // Check if sender is in list of admins.
        let authorized = 1;
        if (authorized === 1) {
            return callback(null, broadcastNotAuthorizedMessage);
        }
        // Create a new SMS Notify binding for this user's phone number
        notify.notifications.create({
            tag: 'all',
            body: this.commandText
        }).then((response) => {
            console.log("++ response: " + response);
            callback(null, broadcastSuccessMessage);
        }).catch(err => {
            console.log(err);
            // console.log("++ callback: " + broadcastFailMessage);
            callback(err, broadcastFailMessage);
        });
    }
}

// -----------------------------------------------------------------------------
// Handle incoming SMS commands
//
//------------------
// For testing:
// https://obedient-machine-3163.twil.io/groupsms?To=+16503791233&From=6508661007&body=okay
var event = {Body: "authorize +12223331234", From: "+16508661234", To: "+16508667890"};
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
    let echoSms = "+ cmd: " + cmd + ", From: " + event.From + ", To: " + event.From;
    if (smsTextArray.length === 2) {
        cmd2 = smsTextArray[1].trim();
        echoSms += ", second: " + cmd2;
    }
    console.log(echoSms);
    let cmdInstance;
    // let cmdInstance = new BroadcastCommand(event);
    switch (cmd) {
        case 'help':
            cmdInstance = new HelpCommand(event);
            break;
        case 'subscribe':
            cmdInstance = new SubscribeCommand(event);
            break;
        case 'authorize':
            cmdInstance = new AuthorizeCommand(event);
            break;
        case 'unsubscribe':
            cmdInstance = new UnsubscribeCommand(event);
            break;
        case 'who':
            cmdInstance = new WhoCommand(event);
            break;
        case 'start':
            cmdInstance = new StartCommand(event);
            break;
        case 'stop':
            cmdInstance = new StopCommand(event);
            break;
        default:
            cmdInstance = new BroadcastCommand(event);
    }
    cmdInstance.run((err, message) => {
        let twiml = new twilio.twiml.MessagingResponse();
        if (err) {
            // console.log(err);
            console.log("- cmdInstance.run error: " + err.status + ":" + err.message);
            if (err.message.indexOf("already exists")>0) {
                message = 'You are already subscribed.';            
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

