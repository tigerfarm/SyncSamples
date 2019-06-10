// https://www.twilio.com/docs/sync/api/documents
// A document is a simple object with a single JSON object up to 16KB in size.
//
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
const syncServiceSid = process.env.SYNC_SERVICE_SID;
const syncDocName = 'SyncGame';
console.log("++ List documents, Sync SID: " + syncServiceSid);
console.log('-------------');
client.sync.services(syncServiceSid).documents
    .each(syncDocuments => {
        // console.log( "+ SID: " + syncDocItems.sid + ' ' + JSON.stringify(syncDocItems) );
        console.log( "+ uniqueName: " + syncDocuments.uniqueName + '\n'
                + '++ Created by: ' + syncDocuments.createdBy + '\n'
                + '++ data: ' + JSON.stringify( syncDocuments.data ) + '\n'
                + '-------------'
                );
    });

