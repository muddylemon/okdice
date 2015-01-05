//
// okdice, kdice helper
//
// copyright 2014, @muddylemon
// use of this source code is governed by a MIT license
//

(function() {


    okdice = {
        version: "0.0.2",
        session: {
            player: false,
            cycle: 0
        },
        status: {
            loaded: false,
            loggedIn: false,
            playing: false,
            myTurn: false,
            flagged: false,
            autoend: false
        },
        options: {
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
                "label": "gl",
            }],
            theme: {
                active: true,
                hideHeader: true,
                fontsize: "14px"
            }
        }
    };

    okdice.start = function(options) {

        var opts = _.extend(okdice.options, options);

        if (opts.active === false) {
            console.log("options.active is false, shutting down");
            return;
        }

        if (opts.debug) {
            okdice.test(opts);
        }

        // check if player is logged in
        okdice.session.player = $(".iogc-LoginPanel-nameHeading").text() || false;
        if (okdice.session.player) {
            okdice.status.loggedIn = true;
        }



        okdice.events.init(); // initialize the event monitor
        okdice.theme(opts);
        okdice.loadButtons(opts);
        okdice.tableSelector();

        okdice.status.loaded = true;

        window.setInterval(okdice.beat, opts.beatpace || 1000);

    };


    okdice.events = {
        init: function() {



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



        var processes = {
            autoend: function() {
                if (okdice.aet && okdice.aet.is(":checked")) {
                    okdice.status.autoend = true;
                    okdice.endTurn();
                }
                return this;
            },
            turn: function() {

                // toggle isMyTurn if it is my turn right now, or vice versa
                // if it is my turn, blink my tab title and change the favicon
                return this;
            },
            chat: function() {

                $('.iogc-ChatPanel-messages tr:not(.okdiced)').each(function() {
                    // split the username bit from the message bit

                    $(this).addClass('okdiced');
                });


                // are there any unprocessed chats?
                // process each new one
                // do linkify
                // highlight things
                // add images/video embeds?
                return this;
            }
        };

        processes.autoend()
            .turn()
            .chat();

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
                },
                review: function(text) {
                    // post this as a review of this player
                },
                flag: function() {
                    okdice.say("Flag " + this.name());
                },
                mute: function() {
                    okdice.say("/mute " + this.name());
                    okdice.say("Player " + this.name() + " has been muted.");
                },
                unmute: function() {
                    okdice.say("/unmute " + this.name());
                    okdice.say("Player " + this.name() + " has been unmuted.");
                }
            };
        };

        var list = _.map(_.range(6), function(id) {
            return player(id);
        });

        var containers = function(id) {
            if (id) {
                return list[id].container;
            }
            return _.pluck(list, 'container');
        };

        var get = function(id) {
            if (id) {
                return list[id];
            }
            return list;
        };

        return {
            player: player,
            list: list,
            containers: containers,
            get: get
        };
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
                console.log("Ended turn");
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
        var chatButtons = _.map(options.chatbuttons, function(btn) {
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
            var player = okdice.players().get($(this).data('playerid'));
            player.flag();
        });

        $(".mute-player").bind('click', function() {
            var player = okdice.players().get($(this).data('playerid'));
            player.mute();
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

    okdice.tableSelector = function() {



        var loadTables = function(select) {

            var optionTemplate = _.template('<option value="<%= name %>" class="<%= optionClass %>"><%= name %> (<%= playerCount %>)</option>');

            var categoryClassMap = {
                "2": "zero-table",
                "3": "one-hundred-table",
                "4": "five-hundred-table",
                "5": "two-thousand-table",
                "6": "five-thousand-table"
            };

            $.ajax({
                    url: 'http://kdice.com/api/kdice/tables',
                    type: 'GET',
                })
                .done(function(data) {

                    console.log("Tables", data.tables);

                    var rows = _.map(data.tables, function(table) {
                        if (table.state == 0) {

                            table.optionClass = categoryClassMap[table.category_id];

                            return optionTemplate(table);
                        }

                    });

                    select.append(rows);
                });
        };

        var select = $('<select class="table-selector"><option value="">Change Table</option></select>');
        var selectWrapper = $("<td>").append(select);
        $(".iogc-GameWindow-commands").find("tr").append(selectWrapper);

        loadTables(select);

        select.bind('focus', this.loadTables, this);

        select.bind('change',function(){
            window.location = "#" + $(this).val();
        });

    }

    okdice.linkifyChat = function(text) {
        // bind to chat window
        // each new entry, look for links
        // replace with html <a href="LINK">LINK</a>

        return Autolinker.link(text, {
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

            _.each(okdice.players().list, function(player) {

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