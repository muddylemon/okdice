$(function() {

    var chatButtonTemplate = function(label, text) {
        return '<div class="chat-button-config"><input type="text" size="4" class="chat-btn-label" value="' + label + '"> <input type="text" size="25" class="chat-btn-text" value="' + text + '"> </div>';
    }



    chrome.storage.sync.get('config', function(stored) {

        console.log("Stored Config", stored.config);
        if (!stored.config) {
            stored.config = {
                active: true,
                debug: true,
                beatpace: 1200,
                chatbuttons: [{
                    "text": "thank you",
                    "label": "ty",
                }, {
                    "text": "yes",
                    "label": "y",
                }, {
                    "text": "no",
                    "label": "n",
                }, {
                    "text": "gg",
                    "label": "gg",
                }, {
                    "text": "gt",
                    "label": "gt",
                }, {
                    "text": "gl 2 all friends lets warrr",
                    "label": "gadbois",
                }],
                theme: {
                    active: true,
                    hideHeader: true,
                    fontsize: "14px"
                }
            };

        }

        $("#activeOkdice").prop('checked', stored.config.active);
        $("#debug").prop('checked', stored.config.debug);

        _.each(stored.config.chatbuttons, function(c) {
            $(".chat-buttons").append(
                chatButtonTemplate(c.label, c.text)
            );
        });

        _.each(stored.config.theme, function(val, key) {
            if (key === 'active') {
                $("#themeActive").prop('checked', val);
            }

            // if (key === 'fontsize') {
            //     $("#fontsize").val(val);
            // }

            $("#" + key).prop('checked', val);
        });
    });



    $(".add-chat").bind('click', function() {
        $(".chat-buttons").append(chatButtonTemplate('', ''));
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
            // theme.fontsize =  parseInt($("#fontsize").val());
            return theme;
        }

        chrome.storage.sync.set({
            'config': config
        }, function() {

            var alert = $('<div class="save-alert">Settings Saved! Good Luck!</div>');

            alert.appendTo(".submit-buttons");
            setTimeout(function(){
                alert.fadeOut('slow');
            }, 5000)


            console.log('okdice configuration saved');
        });
    });



});