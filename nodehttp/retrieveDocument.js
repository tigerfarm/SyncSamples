// https://www.twilio.com/docs/sync/api/documents
// A document is a simple object with a single JSON object up to 16KB in size.
//
var syncDocName = process.argv[2] || "";
if (syncDocName === "") {
    console.log("+ A Sync document name is required.");
    process.exit();
}

const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
const syncServiceSid = process.env.SYNC_SERVICE_SID;
console.log("++ Retrieve Sync SID, Document name: " + syncServiceSid + ", " + syncDocName);
client.sync.services(syncServiceSid).documents(syncDocName)
    .fetch()
    .then((syncDocItems) => {
        // console.log( "+ SID: " + syncDocItems.sid + ' ' + JSON.stringify(syncDocItems) );
        console.log( "+ uniqueName: " + syncDocItems.uniqueName + '\n'
                + '++ Created by: ' + syncDocItems.createdBy + '\n'
                + '++ data: ' + JSON.stringify( syncDocItems.data ) + '\n'
                );
    }).catch(function (error) {
        console.log("- " + error);
        // callback("- " + error);
});
// Sample document based on the Tic Tac quickstart sample
// {
// "sid":"ET4af16c82e00d4801b8bf05512b0ac2e8",
// "uniqueName":"SyncGame",
// "accountSid":"Twilio.account_SID","serviceSid":"ISfc81c9b7b8a3ba7bf4e799cd8b5d5641","url":"https://sync.twilio.com/v1/Services/ISf...1/Documents/ET4af16c82e00d4801b8bf05512b0ac2e8",
// "links":{"permissions":"https://sync.twilio.com/v1/Services/ISf...1/Documents/ET4af16c82e00d4801b8bf05512b0ac2e8/Permissions"},
// "revision":"1e",
// "data":{"board":[["X","","O"],["","",""],["","",""]]},
// "dateExpires":null,
// "dateCreated":"2019-06-08T17:33:49.000Z",
// "dateUpdated":"2019-06-08T17:57:39.000Z",
// "createdBy":"me"
// }
//