//
// okdice, kdice helper
//
// copyright 2014, @muddylemon
// use of this source code is governed by a MIT license
//

(function() {


    window.okdice = {};

    okdice.version = "0.0.1";

    okdice.log = function(message) {
        console.log(message); // new relic or something?
    };

    okdice.default_options = {
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

        var opts = _.extend(okdice.default_options, options);

        /**
         ** trigger loaded event
         ** run options.onStart(options)
         ** load any interface elements (option dialogs, new buttons)
         ** bind events
         **/

        if (opts.debug) {
            okdice.test(opts);
        }

        okdice.events.init(); // initialize the event monitor
        okdice.theme(opts);
        okdice.loadButtons(opts);

        window.setInterval(okdice.beat, opts.beatpace || 1000);

    };


    okdice.events = {
        init: function() {
            _.extend(okdice, {
                isGameRunning: false,
                isMyTurn: false
            });
        },
        game: {
            start: function() {
                okdice.isGameRunning = true;
            },
            end: function() {
                okdice.isGameRunning = false;
            }
        },
        turn: {
            start: function() {
                okdice.isMyTurn = true;
            },
            end: function() {
                okdice.isMyTurn = false;
            }
        }
    };

    okdice.beat = function() {


        if (okdice.aet && okdice.aet.is(":checked")) {
            okdice.endTurn();
        }

        // check if auto end turn is on, run it
        // is it my turn? change the tab title
        // is it not my turn? stop that
        // did a game just start? note that
        // flip the events toggles
        // call the event functions
        // etc
    };

    okdice.ui = function(name) {

        var elements = {
            game: $("#KGame"),
            gametable: $(".iogc-GameWindow-table"),
            gamecontrols: $(".iogc-Controls"),
            sidebar: $("#iogc-PlayerPanel"),
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
        this.ui("gamecontrols").find("button").each(function() {
            if ($(this).html() === "End Turn" && $(this).is(":visible")) {
                $(this).click();
                okdice.log("Ended turn");
            }
        });
    };


    /**
        add UI features
     **/


    okdice.loadButtons = function(options) {

        var buttonPark = $('<div class="btn_park"></div>').appendTo(okdice.ui('sidebar'));

        /**
            Chat Buttons
        **/
        var chatContainer = $('<div class="chat-buttons"></div>');
        var chatButtonTemplate = _.template('<button data-txt="<%= text %>" class="<%= className %>"><%= label %></button>');
        var chatButtons = _.map(options.chatbuttons,function(btn){
            return $(chatButtonTemplate(btn));
        });

        chatContainer.append(chatButtons);

        okdice.ui("chatinput").after(chatContainer);

        $("button", chatContainer).bind("click", function() {
            okdice.say($(this).data("txt"));
        });

        // auto end turn
        buttonPark.append('<div class="auto-end-turn"><label for="aet"><input type="checkbox" name="aet" id="aet"> Auto-End Turn</label></div>');
        okdice.aet = $("#aet");


        okdice.flagButtons(buttonPark);
        okdice.playerButtons();
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

    okdice.flagButtons = function(container) {

        var btns = $('<ul class="flag_btn_collection"></ul>');

        _.each(okdice.colors, function(color, index) {

            var b = $('<li>&#9873;</li>');
            b.data('txt', 'Flag ' + color);

            b.css({
                "color": okdice.rgb[index]
            });

            btns.append(b);

        });

        $("li", btns).bind("click", function() {
            okdice.say($(this).data("txt"));
            $(this).addClass("flagged");
        });

        container.append(btns);

    };

    okdice.linkifyChat = function() {
        // bind to chat window
        // each new entry, look for links
        // replace with html <a href="LINK">LINK</a>

        var linkified = Autolinker.link(text, {
            newWindow: true,
            truncate: 50
        });

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