//
// okdice, kdice helper
//
// copyright 2014, @muddylemon
// use of this source code is governed by a MIT license
//

(function() {


    window.okdice = {};

    okdice.version = "0.0.1";

    /**
        Default Options

    **/
    okdice.options = {
        active: true,
        debug: false,
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

        var opts = _.extend(okdice.options, options);

        /**
         ** trigger loaded event
         ** run options.onStart(options)
         ** load any interface elements (option dialogs, new buttons)
         ** bind events
         **/

        if (opts.debug) {
            okdice.test(opts);
        }

        okdice.theme(opts);
        okdice.loadButtons(opts);

    };

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
            tablelist: $(".iogc-ScrollTable-table"),
            sitOutButton: $(".iogc-GameWindow-sitOutButton"),
            sitInButton: $(".iogc-GameWindow-sitDownButton"),
            players: okdice.players.containers
        };

        if (name && elements[name]) {
            return elements[name];
        }
        return elements;


    };

    okdice.players = function() {

        var player = function(id) {
            return {
                id: id,
                color: okdice.colors[id],
                hex: okdice.rgb[id],
                container: $(".iogc-PlayerPanel" + id),
                name: function() {
                    return $(".iogc-PlayerPanel" + id).find('.iogc-PlayerPanel-name').text();
                }
            };
        };

        this.list = _.map(_.range(6), function(id) {
            return player(id);
        });

        this.containers = function(id) {
            if (id) {
                return this.list[id].container;
            }
            return _.pluck(this.list, 'container');
        };

        this.get = function(id) {
            if (id) {
                return player(id);
            }
        };

        return this;
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
        okdice.say("User " + user + " has been muted.");
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


    okdice.loadButtons = function(options) {
        okdice.chatButtons(options);
        okdice.flagButtons();
        okdice.playerButtons();
    };

    okdice.chatButtons = function(options) {

        var btns = $('<div class="btn_collection"></div>');

        _.each(options.chatbuttons, function(btn) {
            btns.append('<button data-txt="' + btn.text + '" class="' + btn.className + '">' + btn.label + '</button>');
        });

        $("button", btns).bind("click", function() {
            okdice.say($(this).data("txt"));
        });

        okdice.ui("chatinput").after(btns);

    };

    okdice.playerButtons = function() {

        var btnsTemplate = _.template('<div class="player_btn_collection"><button class="flag-player" data-txt="Flag <%= color %>"> &#9873; Flag </button><button class="mute-player" data-playerid="<%= id %>"> Mute </button></div>');

        _.each(okdice.players().list, function(player) {
            var control = $(btnsTemplate(player));
            control.appendTo(player.container);

            player.container.bind('mouseover', function() {
                control.show();
            });

            player.container.bind('mouseout', function() {
                control.hide();
            });

        });

        $(".flag-player").bind('click', function() {
            okdice.say($(this).data('txt'));
        });

        $(".mute-player").bind('click', function() {
            var player = okdice.players().get($(this).data('playerid'));
            okdice.muteUser(player.name());
        });

    };

    okdice.flagButtons = function() {

        var btns = $('<ul class="flag_btn_collection"></ul>');

        _.each(okdice.colors, function(color, index) {

            var b = $('<li>&#9873;</li>');
            b.data('txt', 'Flag ' + color);

            b.css({
                "margin": "0 2px",
                "color": okdice.rgb[index],
                "font-size": "25px"
            });

            btns.append(b);

        });

        $("li", btns).bind("click", function() {
            okdice.say($(this).data("txt"));
            $(this).addClass("flagged");
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

    okdice.theme = function(options) {

        var themeOptions = options.theme || {};

        console.log("Okdice Theme", themeOptions);

        if (themeOptions.active) {
            // do the theming
            if (themeOptions.hideHeader) {
                okdice.ui('header').addClass('nope');
            }

            if (themeOptions.leftAlign) {
                $("center").css({
                    "text-align": "left"
                });
            }



            // colorize the player boxes
            _.each(okdice.players().list, function(player) {
                console.log("Colorizing player", player.name());

                player.container.css({
                    "background-color": player.hex,
                    "border": "5px solid " + player.hex,
                    "border-collapse": "separate"
                }).addClass("player-" + player.color);

            });


        }
    };



    okdice.test = function(options) {
        // run tests
        console.log("Testing Okdice", options, okdice);

        /**
            Tests
            Chat button exists, makes chat when pushed


        **/
    };



    okdice.colors = ["red", "green", "purple", "yellow", "blue", "brown", "teal"];
    okdice.rgb = ["#F00", "#090", "#60C", "#FF0", "#009", "#630", "#0CC"];


    return okdice;


})();