(function (okdice) {


        function say(message) {
            okdice.ui.chatinput.val(message.toString());
            okdice.ui.chatsendbutton.click();
        }

        function focus() {
            okdice.ui.chatinput.focus();
        }

        function sit(table) {
            if (table) {
                window.location = "#" + table;
            }
            okdice.ui.sitInButton.click();
        }

        function stand() {
            okdice.ui.sitOutButton.click();
        }

        function endturn() {
            okdice.ui.gamecontrols.find("button").each(function() {
                if ($(this).html() === "End Turn" && $(this).is(":visible")) {
                    $(this).click();
                    console.log("Ended turn");
                }
            });
        }

        function move(table) {
            window.location = "#" + table;
        }

        // say is throttled to execute no more than once every 2 seconds
        return {
            say: _.throttle(say, 2000),
            focus: focus,
            stand: stand,
            sit: sit,
            endturn: endturn,
            move: move
        }


})(okdice);