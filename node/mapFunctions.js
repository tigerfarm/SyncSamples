// -----------------------------------------------------------------------------
// Documentation link:
// https://www.twilio.com/docs/sync/maps
// https://www.twilio.com/docs/runtime/client?code-sample=code-get-the-default-sync-service-instance-11&code-language=Node.js&code-sdk-version=default
// 
// In the Twilio Function Configuration page, I created environment varialbes for use in the following Twilio Functions.
//  https://www.twilio.com/console/runtime/functions/configure
//      SYNC_SERVICE_SID    My/your Sync service SID.
//      SYNC_MAP_NAME       I used "amap" for the value. You can use anything.

// -----------------------------------------------------------------------------
// Create a map.

exports.handler = function (context, event, callback) {
    let theMapName = event.mapname || context.SYNC_MAP_NAME;
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

// https://about-time-2357.twil.io/scmi
// https://about-time-2357.twil.io/scmi?itemkey=counterc
// https://about-time-2357.twil.io/scmi?itemkey=counterf&itemdatacountervalue=15

exports.handler = function(context, event, callback) {
    let syncMapItemKey = event.itemkey || "countera";
    let syncMapItemDataCounterValue = parseInt(event.itemdatacountervalue) || 6;
    console.log("+ Create item"
        + ", SYNC_SERVICE_SID: " + context.SYNC_SERVICE_SID
        + ", SYNC_MAP_NAME: " + context.SYNC_MAP_NAME
        + ", Item key: " + syncMapItemKey
        + ", Data value: " + syncMapItemDataCounterValue
    );
    let sync = Runtime.getSync({serviceName: context.SYNC_SERVICE_SID});
    let theData = {"counter": syncMapItemDataCounterValue};
    sync.maps(context.SYNC_MAP_NAME).syncMapItems.create({
        ttl: 0,
        key: syncMapItemKey,
        data: theData
    }).then(function(response){
        console.log(response);
        callback(null,response);
    })
    .catch(function (error) {
        console.log("- " + error);
        callback(null, "- " + error);
    });
};

// -----------------------------------------------------------------------------
// Update a map item.

// https://about-time-2357.twil.io/sumu
// https://about-time-2357.twil.io/sumu?itemkey=counterc
// https://about-time-2357.twil.io/sumu?itemkey=counterf&itemdatacountervalue=15

exports.handler = function(context, event, callback) {
    let syncMapItemKey = event.itemkey || "countera";
    let syncMapItemDataCounterValue = parseInt(event.itemdatacountervalue) || 6;
    console.log("+ Update item"
        + ", SYNC_SERVICE_SID: " + context.SYNC_SERVICE_SID
        + ", SYNC_MAP_NAME: " + context.SYNC_MAP_NAME
        + ", Item key: " + syncMapItemKey
        + ", Data value: " + syncMapItemDataCounterValue
    );
    let sync = Runtime.getSync({serviceName: context.SYNC_SERVICE_SID});
    let theData = {"counter": syncMapItemDataCounterValue};
    sync.syncMaps(context.SYNC_MAP_NAME).syncMapItems(syncMapItemKey).update({
        ttl: 0,
        key: syncMapItemKey,
        data: theData
    }).then(function(response){
        console.log(response);
        callback(null,response);
    })
    .catch(function (error) {
        console.log("- " + error);
        callback(null, "- " + error);
    });
};

// -----------------------------------------------------------------------------
// Retrieve a map item.
//
// curl -X GET https://sync.twilio.com/v1/Services/$SYNC_SERVICE_SID/Maps/amap -u $ACCOUNT_SID:$AUTH_TOKEN
// curl -X GET https://sync.twilio.com/v1/Services/$SYNC_SERVICE_SID/Maps/amap/Items/countera -u $ACCOUNT_SID:$AUTH_TOKEN

exports.handler = function (context, event, callback) {
    let syncMapItem = event.item || "countera";
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
