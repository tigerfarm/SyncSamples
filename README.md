# Twilio Sync PHP Samples

Requirements:

- Twilio account. A free Trial account will work.
- PHP installed to run programs locally on your computer.

## Files

The Client files:
- [createMap.php](createMap.php) : Given a Sync service, create a Map.
- [createMapItem.php](createMapItem.php) : Given a Sync service and a Map, create a Map Item.
- [listMaps.php](listMaps.php) : List Sync Maps.
- [listMapItems.php](listMapItems.php) : List Sync Map Items.
- [listMapItem.php](listMapItem.php) : List a specific Sync Map Item.
- [updateMapItem.php](listMapItem.php) : Update a specific Sync Map Item.
- [delMapItem.php](delMapItem.php) : Delete a specific Sync Map Item.

To do:
- delMap.php : Delete a specific Sync Map, which deletes all the related Items.
- Update the programs echo-messages.
- Standardize parameters, example: createMapItem.php.
- Add some error handling, example: duplicate map, in createMap.php.

## Implementation

### Create a Sync Service.

Documentation link: https://www.twilio.com/docs/sync/maps

### Use the programs to create and manage Sync map data.

Edit createMap.php, then run it a create a Sync map: phpcreateMap.php

List the new Sync Map using: php listMaps.php

...

Cheers...
