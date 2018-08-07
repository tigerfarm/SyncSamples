// https://www.twilio.com/docs/sync/api/maps#create-a-map
console.log("+++ Create Map.");
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const syncServiceSid = process.env.SYNC_SERVICE_SID;
console.log("+ ACCOUNT_SID      :" + accountSid + ":");
console.log("+ AUTH_TOKEN       :" + authToken + ":");
console.log("+ SYNC_SERVICE_SID :" + syncServiceSid + ":");
const client = require('twilio')(accountSid, authToken);
client.sync.services(syncServiceSid)
        .syncMaps
        .create({ttl: 0, uniqueName: '+16508661233'})
        .then((sync_map) => {
            console.log("+ Created, Map SID: " + sync_map.sid);
        })
        .catch(function (error) {
            console.log("- " + error);
            // callback("- Error: " + error);
        });
