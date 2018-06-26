# Twilio Sync PHP Samples

Sync components:
````
Sync Service: name = counters
   |
Sync Map: name = counters
   |
Sync Map item: key name = countera, data = {"counter":  1 } --- Initial counter value = 1
````

Create a Sync service: In the Twilio Console, go to:

    https://www.twilio.com/console/sync/services

Click the create icon and create:
````
Friendly name: counters
Example:
Sync service SID: ISXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
````

After creating your Sycn Service, create environment variables for use in the programs:
````
ACCOUNT_SID=your_account_SID
AUTH_TOKEN=your_account_auth_token
SYNC_SERVICE_SID=your_sync_service_SID
export ACCOUNT_SID
export AUTH_TOKEN
export SYNC_SERVICE_SID
````

Requirements:

- Twilio account. A free Trial account will work.
- PHP installed to run programs locally on your computer.

Note, can create Map with an empty name, "". However, cannot delete it.

## Files

The Client files:
- [createMap.php](createMap.php) : Given a Sync service, create a Map.
- [createMapItem.php](createMapItem.php) : Given a Sync service and a Map, create a Map Item.
- [listMaps.php](listMaps.php) : List Sync Maps.
- [listMapItems.php](listMapItems.php) : List Sync Map Items.
- [listMapItem.php](listMapItem.php) : List a specific Sync Map Item.
- [updateMapItem.php](listMapItem.php) : Update a specific Sync Map Item.
- [delMapItem.php](delMapItem.php) : Delete a specific Sync Map Item.
- [delMap.php](delMap.php) : Delete a specific Sync Map, which deletes all the related Items.

To do:
- Update the programs echo-messages.
- Standardize parameters, example: createMapItem.php.
- Add some more error handling, example: duplicate map, in createMap.php.

## Implementation

### Create a Sync Service.

Documentation link: https://www.twilio.com/docs/sync/maps

### Use the programs to create and manage Sync map data.

Edit createMap.php, then run it a create a Sync map: phpcreateMap.php

List the new Sync Map using: php listMaps.php

...

Cheers...
