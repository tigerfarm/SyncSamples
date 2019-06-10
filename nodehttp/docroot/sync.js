// -----------------------------------------------------------------------------
// Based on the GitHub repository:
//  https://github.com/TwilioDevEd/sdk-starter-node/tree/master/public/sync
//
// Source:
//  https://media.twiliocdn.com/sdk/js/sync/releases/0.11.1/twilio-sync.js
//  
// -----------------------------------------------------------------------------

var thisIdentity = '';
var syncClientObject;
var thisSyncDoc;
var $buttons = $('#board .board-row button');

function logger(message) {
    var aTextarea = document.getElementById('log');
    aTextarea.value += "\n> " + message;
    aTextarea.scrollTop = aTextarea.scrollHeight;
}
function clearLog() {
    log.value = "+ Ready";
}
window.onload = function () {
    log.value = "+++ Start.";
};

function getToken() {
    thisIdentity = $("#userIdentity").val();
    if (thisIdentity === "") {
        $("#mUserIdentity").html("Required");
        logger("Required: user identity.");
        return;
    }
    var syncDocumentName = $("#syncDocumentName").val();
    if (syncDocumentName === "") {
        $("#mSyncDocumentName").html("Required");
        logger("Required: Game name.");
        return;
    }
    $.getJSON('/token?identity=' + thisIdentity, function (tokenResponse) {
        if (tokenResponse.message !== '') {
            logger(tokenResponse.message);
            return;
        }
        $("#mUserIdentity").html("Token refreshed");
        logger('tokenResponse.token: ' + tokenResponse.token);
        //
        logger('Create Sync object.');
        syncClientObject = new Twilio.Sync.Client(tokenResponse.token, {logLevel: 'info'});
        //
        syncClientObject.on('connectionStateChanged', function (state) {
            if (state === 'connected') {
                logger('Sync is connected.');
            } else {
                logger('Sync is not connected (websocket connection <span style="color: red">' + state + '</span>)…');
                return;
            }
        });
        // -------------------------------------------------------------------------
        // The game state is stored in a Sync document: SyncGame.
        // Attach to the document; or if it doesn't exist, create it.
        // 
        syncClientObject.document(syncDocumentName).then(function (syncDoc) {
            thisSyncDoc = syncDoc;
            logger('Loading board data.');
            var data = syncDoc.value;
            if (data.board) {
                updateUserInterface(data);
            }
            //
            logger('Subscribed to updates for Sync document : ' + syncDocumentName);
            syncDoc.on('updated', function (syncEvent) {
                theMessage = '';
                if (syncEvent.isLocal) {
                    theMessage = "syncDoc updated by this player: ";
                } else {
                    theMessage = "syncDoc updated by another player: ";
                }
                // logger(theMessage + JSON.stringify(syncEvent.value) + ': ' + syncEvent.value.useridentity);
                logger(theMessage + syncEvent.value.useridentity);
                updateUserInterface(syncEvent.value);
            });
        });
    });
}

// -------------------------------------------------------------------------
// HTML Tic-Tac Board Functions

function buttonClick() {
    $square = $(event.target);
    var squareValue = $square.html();
    if (squareValue === 'X') {
        $square.html('O');
    } else if (squareValue === 'O') {
        $square.html('&nbsp;');
    } else {
        $square.html('X');
    }
    var data = readGameBoardFromUserInterface();
    // logger('Button clicked, thisSyncDoc: ' + thisSyncDoc.uniqueName + ' : ' + JSON.stringify(data));
    thisSyncDoc.set(data);
}

//Read the state of the UI and create a new document
function readGameBoardFromUserInterface() {
    // logger('readGameBoardFromUserInterface()');
    var board = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];
    for (var row = 0; row < 3; row++) {
        for (var col = 0; col < 3; col++) {
            var selector = '[data-row="' + row + '"]' +
                    '[data-col="' + col + '"]';
            board[row][col] = $(selector).html().replace('&nbsp;', '');
        }
    }
    // Example: {"board":[["X","O","X"],["","O",""],["","",""]],"useridentity":"david"}
    return {board: board, useridentity: thisIdentity};
}

//Update the buttons on the board to match our document
function updateUserInterface(data) {
    // logger('updateUserInterface()');
    for (var row = 0; row < 3; row++) {
        for (var col = 0; col < 3; col++) {
            var this_cell = '[data-row="' + row + '"]' + '[data-col="' + col + '"]';
            var cellValue = data.board[row][col];
            $(this_cell).html(cellValue === '' ? '&nbsp;' : cellValue);
        }
    }
}
