$(function() {

    var chatButtonTemplate = function(label, text) {
        return '<div class="chat-button-config"><input type="text" size="4" class="chat-btn-label" value="' + label + '"> <input type="text" size="25" class="chat-btn-text" value="' + text + '"> </div>';
    }

    chrome.storage.sync.get('config', function(stored) {
        console.log("Stored Config", stored.config);
        _.each(stored.config['chatbuttons'], function(c) {
            $(".chat-buttons").append(
                chatButtonTemplate(c.label, c.text)
            );
        });
    });



    $(".add-chat").bind('click', function() {
        $(".chat-buttons").append(chatButtonTemplate());
    });

    $(".save-button").bind('click', function() {

        var config = {
            active: true,
            chatbuttons: [],
            theme:{}
        };

        $(".chat-button-config").each(function(){
            var label = $(this).find('.chat-btn-label').val();
            var text = $(this).find('.chat-btn-text').val();
            if (label && text) {
                config.chatbuttons.push({
                    label:label,
                    text:text
                });
            }
        });

        console.log("Config saving", config);


        chrome.storage.sync.set({
            'config': config
        }, function() {
            console.log('okdice configuration saved');
        });
    });



});