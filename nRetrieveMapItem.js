// https://www.twilio.com/docs/sync/api/maps
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
const syncServiceSid = process.env.SYNC_SERVICE_SID;
const syncMapName = process.env.SYNC_MAP_NAME;
const syncMapItem = 'counterg';
//
console.log("++ Retrieve Sync Service:Map:Item: " + syncServiceSid + ":" + syncMapName + ":" + syncMapItem);
//
client.sync.services(syncServiceSid).syncMaps(syncMapName).syncMapItems(syncMapItem)
    .fetch()
    .then((sync_map_item) => {
        console.log("+ Counter: " + sync_map_item.key + " = " + sync_map_item.data.counter);
    }).catch(function (error) {
        console.log("- " + error);
        // callback("- " + error);
});