$(function() {

    var chatButtonTemplate = function(label, text) {
        return '<div class="chat-button-config"><input type="text" size="4" class="chat-btn-label" value="' + label + '"> <input type="text" size="25" class="chat-btn-text" value="' + text + '"> </div>';
    }



    chrome.storage.sync.get('config', function(stored) {

        console.log("Stored Config", stored.config);

        $("#activeOkdice").prop('checked', stored.config.active );
        $("#debug").prop('checked', stored.config.debug );

        _.each(stored.config.chatbuttons, function(c) {
            $(".chat-buttons").append(
                chatButtonTemplate(c.label, c.text)
            );
        });

        _.each(stored.config.theme, function(val, key){
            if (key === 'active') {
                $("#themeActive").prop('checked', val);
            }

            $("#" + key).prop('checked', val);
        });
    });



    $(".add-chat").bind('click', function() {
        $(".chat-buttons").append(chatButtonTemplate('',''));
    });

    $(".save-button").bind('click', function() {

        var config = {
            active: $("#activeOkdice").is(":checked"),
            debug: $("#debug").is(":checked"),
            chatbuttons: getChatButtonConfig(),
            theme: getThemeConfig()
        };

        function getChatButtonConfig() {

            var buttons = [];

            $(".chat-button-config").each(function() {

                var label = $(this).find('.chat-btn-label').val();
                var text = $(this).find('.chat-btn-text').val();

                if (label && text) {

                    buttons.push({
                        label: label,
                        text: text
                    });

                }

            });

            return buttons;
        }


        function getThemeConfig() {
            var theme = {};

            theme.active = $("#themeActive").is(":checked");
            theme.leftAlign = $("#leftAlign").is(":checked");
            theme.hideHeader = $("#hideHeader").is(":checked");
            theme.colorizePlayers = $("#colorizePlayers").is(":checked");
            theme.showNativeAet = $("#showNativeAet").is(":checked");

            return theme;
        }

        chrome.storage.sync.set({
            'config': config
        }, function() {

            console.log('okdice configuration saved');
        });
    });



});