// -----------------------------------------------------------------------------
// Documentation link:
// https://www.twilio.com/docs/sync/maps
// https://www.twilio.com/docs/runtime/client?code-sample=code-get-the-default-sync-service-instance-11&code-language=Node.js&code-sdk-version=default

// -----------------------------------------------------------------------------
// Create a map.

exports.handler = function (context, event, callback) {
    let theMapName = "cmap";
    console.log("+ Create: " + theMapName + ", using SYNC_SERVICE_SID: " + context.SYNC_SERVICE_SID);
    let sync = Runtime.getSync({serviceName: context.SYNC_SERVICE_SID});
    sync.maps.create({
        ttl: 0,
        uniqueName: theMapName
    }).then((sync_map) => {
        console.log("+ Created, Map SID: " + sync_map.sid);
        callback(null, "+ Created: " + theMapName);
    });
};

// curl -X GET https://sync.twilio.com/v1/Services -u $ACCOUNT_SID:$AUTH_TOKEN
// curl -X GET https://sync.twilio.com/v1/Services/$SYNC_SERVICE_SID/Maps -u $ACCOUNT_SID:$AUTH_TOKEN

// -----------------------------------------------------------------------------
// Create a map item.

exports.handler = function (context, event, callback) {
    let syncMapName = context.SYNC_MAP_NAME;
    console.log("+ Create item for map: " + syncMapName + ", using SYNC_SERVICE_SID: " + context.SYNC_SERVICE_SID);
    let sync = Runtime.getSync({serviceName: context.SYNC_SERVICE_SID});
    //
    let counterName = "countera";  // The Sync Map Key value used as the counter name.
    let counterValue = 3;
    //
    let theData = {'counter': counterValue};
    sync.maps(syncMapName).syncMapItems.create({
        ttl: 0,
        key: counterName,
        data: theData
    }).then(function (response) {
        console.log(response);
        callback(null, response);
    });
};

// -----------------------------------------------------------------------------
// Retrieve a map item.
//
// curl -X GET https://sync.twilio.com/v1/Services/$SYNC_SERVICE_SID/Maps/amap -u $ACCOUNT_SID:$AUTH_TOKEN
// curl -X GET https://sync.twilio.com/v1/Services/$SYNC_SERVICE_SID/Maps/amap/Items/countera -u $ACCOUNT_SID:$AUTH_TOKEN

exports.handler = function (context, event, callback) {
    let syncMapItem = "counterb";
    let syncMapName = context.SYNC_MAP_NAME;
    console.log("+ List map item" 
            + ", SYNC_SERVICE_SID: " + context.SYNC_SERVICE_SID
            + ", SYNC_MAP_NAME: " + syncMapName
            + ", syncMapItem: " + syncMapItem
            );
    let sync = Runtime.getSync({serviceName: context.SYNC_SERVICE_SID});
    //
    sync.maps(syncMapName).syncMapItems(syncMapItem).fetch()
            .then((syncMapItem) => {
                console.log("+ syncMapItem key: " + syncMapItem.key);
                console.log("+ syncMapItem data JSON: " + JSON.stringify(syncMapItem.data));
                if (syncMapItem.data.counter) {
                    console.log("+ data.counter " + syncMapItem.data.counter);
                }
                if (syncMapItem.data) {
                    callback(null, JSON.stringify(syncMapItem.data));
                } else {
                    callback(null, syncMapItem);
                }
            })
            .catch(function (error) {
                console.log("- " + error);
                callback(null, "- " + error);
            });
};

// -----------------------------------------------------------------------------
