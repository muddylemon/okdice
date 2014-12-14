//
// okdice, kdice helper
//
// copyright 2014, @muddylemon
// use of this source code is governed by a MIT license
//

(function() {


    window.okdice = {};

    okdice.options = {
        active: true,
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
            "label": "gl",
        }],
        theme: {
            active: true,
            hideHeader: true,
            fontsize: "14px"
        }
    };

    okdice.start = function(options) {

        _.extend(okdice.options, options);

        /** 
         ** trigger loaded event
         ** run options.onStart(options)
         ** load any interface elements (option dialogs, new buttons)
         ** bind events
         **/

        okdice.test(options);

        okdice.chatButtons(options);
        okdice.flagButtons();

    }

    okdice.ui = function(name) {

        var elements = {
            game: $("#KGame"),
            gametable: $(".iogc-GameWindow-table"),
            gamecontrols: $(".iogc-Controls"),
            header: $("#hd"),
            chatbox: $(".iogc-ChatPanel"),
            chatinput: $(".iogc-ChatPanel").find(".gwt-TextBox"),
            chatsendbutton: $(".iogc-ChatPanel").find(".iogc-NewButton"),
            chatmessages: $(".iogc-ChatPanel").find(".iogc-ChatPanel-messages"),
            tablelist: $(".gwt-DialogBox"),
            sitOutButton: $(".iogc-GameWindow-sitOutButton"),
            sitInButton: $(".iogc-GameWindow-sitDownButton")
        };

        if (name && elements[name]) {
            return elements[name];
        }
        return elements;


    };

/*
    Okdice Utility functions
*/


    okdice.say = function(message) {
        // should be a string
        // put it in the chat input and push the send button
        okdice.ui("chatinput").val(message);
        okdice.ui("chatsendbutton").click();
    };

    okdice.chatFocus = function() {
        okdice.ui("chatinput").focus();
    };

    okdice.flagUser = function(user) {
        okdice.say("Flag " + user);
    };

    okdice.muteUser = function(user) {
        okdice.say("/mute " + user);
        okdice.say("User "+ user + " has been muted.");
    };


    okdice.sitIn = function(table) {
        if (table) {
            // if we"re not in the right table, move there    
        }
        // click "sit in" button if available
        okdice.ui('sitInButton').click();
    };

    okdice.sitOut = function() {
        // click the sit out button
        okdice.ui('sitOutButton').click();
    };

    okdice.endTurn = function() {

    };


    /**
        add UI features 
     **/

    okdice.chatButtons = function(options) {

        var btns = $('<div class="btn_collection"></div>');

        _.each(options.chatbuttons, function(btn_config) {
            btns.append('<button data-txt="' + btn_config.text + '" class="'+ btn_config.className +'">' + btn_config.label + '</button>');
        });

        $("button", btns).bind("click", function(e) {
            okdice.say($(this).data("txt"));
        });

        okdice.ui("chatinput").after(btns);

    };

    okdice.flagButtons = function() {

        var btns = $('<div class="flag_btn_collection"></div>');
        
        _.each(okdice.colors, function(color, index) {
            var b = $('<button>');
                b.data('txt','Flag ' + color);

                b.css({
                    "background-color":okdice.rgb[index],
                    "width": "25px",
                    "height": "25px"
                });

            btns.append(b);

        });
    
        $("button", btns).bind("click", function(e) {
            okdice.say($(this).data("txt"));
        });

        okdice.ui("gamecontrols").after(btns);

    };

    okdice.linkifyChat = function() {
        // bind to chat window
        // each new entry, look for links
        // replace with html <a href="LINK">LINK</a>

    };

    okdice.imgInlineChat = function() {
        // same as above, except produces image tags with image links
        // from select sources
        // thumbnailed, and click to view in modal bigger
    };
    

    okdice.keyboardControls = function(options) {
        // listen to keystrokes 
        // if alt/ctrl clicked, listen for signals
        // like pressing c which will focus in chat

    };




    okdice.test = function(options) {
        // run tests
        console.log("Testing Okdice", options);
    };



    okdice.colors = ["red","green","purple","yellow","blue","brown","teal"];
    okdice.rgb = ["#F00","#090","#60C","#FF0","#009","#630","#0CC"];


    return okdice;


})();