// -----------------------------------------------------------------------------
// Based on the GitHub repository:
//  https://github.com/TwilioDevEd/sdk-starter-node/tree/master/public/sync
//
$(function () {
    //
    // -------------------------------------------------------------------------
    var syncClientObject;
    var $message = $('#message');
    var $buttons = $('#board .board-row button');
    //
    // -------------------------------------------------------------------------
    $message.html('+ Get Sync token.');
    $.getJSON('/token', function (tokenResponse) {
        if (tokenResponse.message !== '') {
            $message.html(tokenResponse.message);
            return;
        }
        syncClientObject = new Twilio.Sync.Client(tokenResponse.token, {logLevel: 'info'});
        syncClientObject.on('connectionStateChanged', function (state) {
            if (state === 'connected') {
                // Set the board for playing.
                $buttons.attr('disabled', false);
                $message.html('Sync is live!');
            } else {
                $message.html('Sync is not live (websocket connection <span style="color: red">' + state + '</span>)…');
                return;
            }
        });
        //
        $message.html('+ Loading board data…');
        //
        // The game state is stored in a Sync document: SyncGame.
        // Attach to the document; or create it, if it doesn't exist.
        // 
        syncClientObject.document('SyncGame').then(function (syncDoc) {
            var data = syncDoc.value;
            if (data.board) {
                updateUserInterface(data);
            }
            // Sync event handler.
            syncDoc.on('updated', function (event) {
                console.debug("Board was updated", event.isLocal ? "locally." : "by the other player.");
                updateUserInterface(event.value);
            });
            // Buttons to control the game Sync state.
            $buttons.on('click', function (e) {
                // Toggle the value: X, O, or empty
                toggleCellValue($(e.target));
                var data = readGameBoardFromUserInterface();
                // Send updated document to Sync.
                // This will trigger "updated" events for all players.
                syncDoc.set(data);
            });
        });

    });

    // -------------------------------------------------------------------------
    // HTML Tic-Tac Board Functions

    //Toggle the value: X, O, or empty (&nbsp; for UI)
    function toggleCellValue($cell) {
        var cellValue = $cell.html();

        if (cellValue === 'X') {
            $cell.html('O');
        } else if (cellValue === 'O') {
            $cell.html('&nbsp;');
        } else {
            $cell.html('X');
        }
    }

    //Read the state of the UI and create a new document
    function readGameBoardFromUserInterface() {
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
        return {board: board};
    }

    //Update the buttons on the board to match our document
    function updateUserInterface(data) {
        for (var row = 0; row < 3; row++) {
            for (var col = 0; col < 3; col++) {
                var this_cell = '[data-row="' + row + '"]' + '[data-col="' + col + '"]';
                var cellValue = data.board[row][col];
                $(this_cell).html(cellValue === '' ? '&nbsp;' : cellValue);
            }
        }
    }
});
