// https://www.twilio.com/docs/sync/api/maps#create-a-map
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const syncServiceSid = process.env.SYNC_SERVICE_SID;
const syncMapName = process.env.SYNC_MAP_NAME;
console.log("+ ACCOUNT_SID      :" + accountSid + ":");
console.log("+ AUTH_TOKEN       :" + authToken + ":");
console.log("+ SYNC_SERVICE_SID :" + syncServiceSid + ":");
console.log("+ SYNC_MAP_NAME    :" + syncMapName + ":");
const client = require('twilio')(accountSid, authToken);
//
console.log("+++ Create Map: " + syncMapName + ", in Sync service SID: " + syncServiceSid);
let theData = {'name': 'Millenium Falcon'};
client.sync.services(syncServiceSid).maps(syncMapName).syncMapItems.create({
        key: 'k1',
        data: theData
    }).then((sync_map_item) => {
            console.log("+ Created, Map SID: " + sync_map_item.map_sid);
    }).catch(function (error) {
        console.log("- " + error);
        // callback("- Error: " + error);
    });
