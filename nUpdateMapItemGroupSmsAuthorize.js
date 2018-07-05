// https://www.twilio.com/docs/sync/api/maps
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
const syncServiceSid = process.env.SYNC_SERVICE_SID;
const syncMapName = '+16508661233';
const syncMapItem = '+12223331234';
const authorizedBy = 'me';
console.log("++ Update Sync Service:Map:Item: " + syncServiceSid + ":" + syncMapName + ":" + syncMapItem);

client.sync.services(syncServiceSid).syncMaps(syncMapName).syncMapItems(syncMapItem)
    .fetch()
    .then((syncMapItems) => {
        console.log("+ name: " + syncMapItems.data.name + ", authorizedBy: " + syncMapItems.data.authorizedBy);
        let theData = {'name': syncMapItems.data.name, 'authorizedBy': authorizedBy};
        client.sync.services(syncServiceSid).syncMaps(syncMapName).syncMapItems(syncMapItem)
            .update({key: syncMapItem, data: theData})
            .then((sync_map_item) => {
                console.log("+ Updated authorizedBy, to:" + authorizedBy);
            }).catch(function (error) {
            console.log("- " + error);
            // callback("- " + error);
        });
    }).catch(function (error) {
    console.log("- " + error);
    // callback("- " + error);
});