//
// okdice, kdice helper
//
// copyright 2014, @muddylemon
// use of this source code is governed by a MIT license
//

(function() {


    okdice = {
        version: "0.0.2",
        colors: {
            names: ["red", "green", "purple", "yellow", "blue", "brown", "teal"],
            lightrgb: ["#e5bfcb", "#84ba96", "#A884BA", "#baba84", "#8484ba", "#BA9684", "#84BABA"],
            rgb: ["#F00", "#090", "#60C", "#FF0", "#009", "#630", "#0CC"]
        },
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
            console.log("okdice setting: options.active is false, shutting down");
            return;
        }

        okdice.ui      = loadUi(opts);
        okdice.players = loadPlayers();
        okdice.actions = loadActions();

        loadTheme(opts);
        loadButtons(opts);


        okdice.session.player = okdice.players.current();


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

        okdice.session.cycle++;

        var processes = {
            autoend: function() {
                if (okdice.aet && okdice.aet.is(":checked")) {
                    okdice.status.autoend = true;
                    okdice.actions.endTurn();
                }
                return this;
            },
            turn: function() {

                // toggle isMyTurn if it is my turn right now, or vice versa
                // if it is my turn, blink my tab title and change the favicon
                return this;
            },
            game: function() {

                if ($(".iogc-GameWindow-status").text().indexOf('running') !== false) {

                }


                return this;
            },
            chat: function() {

                $('.iogc-ChatPanel-messages tr:not(.okdiced)').each(function() {
                    var el = $(this);
                    el.html(okdice.linkifyChat(el.html()));
                    el.addClass('okdiced');
                });
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

    var loadUi = function() {
        return {
            game: $("#KGame"),
            gametable: $(".iogc-GameWindow-table"),
            gamecontrols: $(".iogc-Controls"),
            sidebar: $("#iogc-PlayerPanel"),
            header: $("#hd"),
            chatbox: $(".iogc-ChatPanel"),
            chatinput: $(".iogc-ChatPanel .gwt-TextBox"),
            chatsendbutton: $(".iogc-ChatPanel").find(".iogc-NewButton"),
            chatmessages: $(".iogc-ChatPanel").find(".iogc-ChatPanel-messages"),
            tablelist: $(".iogc-ScrollTable-table"),
            sitOutButton: $(".iogc-GameWindow-sitOutButton"),
            sitInButton: $(".iogc-GameWindow-sitDownButton")
        }
    };


    var loadButtons = function(options) {

        var park = $('<div class="btn_park"></div>').appendTo(okdice.ui.sidebar);
        park.append('<div class="auto-end-turn"><label for="aet"><input type="checkbox" name="aet" id="aet"> Auto-End Turn</label></div>');
        okdice.aet = $("#aet");

        loadTableSelector();
        loadFlagButtons(park);
        loadPlayerButtons();
        loadChatButtons(options);
    };


    var loadChatButtons = function(options) {
        var chatContainer = $('<div class="chat-buttons"></div>');
        var chatButtonTemplate = _.template('<button data-txt="<%= text %>" class="<%= className %>"><%= label %></button>');
        var chatButtons = _.map(options.chatbuttons, function(btn) {
            return $(chatButtonTemplate(btn));
        });

        okdice.ui.chatinput.after(chatContainer.append(chatButtons));

        $("button", chatContainer).bind("click", function() {
            okdice.actions.say($(this).data("txt"));
        });
    };

    var loadPlayerButtons = function() {

        var btnsTemplate = _.template('<div class="player_btn_collection"><button class="flag-player" data-txt="Flag <%= color %>"> &#9873; Flag </button><button class="mute-player" data-playerid="<%= id %>"> Mute </button></div>');

        _.each(okdice.players.list, function(player) {
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
            var player = okdice.players.get($(this).data('playerid'));
            player.flag();
        });

        $(".mute-player").bind('click', function() {
            var player = okdice.players.get($(this).data('playerid'));
            player.mute();
        });

    };

    var loadFlagButtons = function(container) {

        var btns = $('<ul class="flags"></ul>');

        _.each(okdice.colors.names, function(color, index) {

            var b = $('<li>&#9873;</li>');
            b.data('txt', 'Flag ' + color.charAt(0).toUpperCase() + color.slice(1));

            b.css({
                "color": okdice.colors.rgb[index]
            });

            btns.append(b);

        });

        $("li", btns).bind("click", function() {
            okdice.actions.say($(this).data("txt"));
            $(this).addClass("flagged");
        });

        container.append(btns);

    };

    var loadTableSelector = function() {


        var optionTemplate = _.template('<option value="<%= name %>"><%= name %> (<%= playerCount %>) -- <span class="pull-right opt-desc"><%= desc %> table</span> </option>');

        var categoryClassMap = {
            "2": "0",
            "3": "100",
            "4": "500",
            "5": "2000",
            "6": "5000"
        };

        var loadTables = function(select) {

            $.ajax({
                    url: 'http://kdice.com/api/kdice/tables',
                    type: 'GET',
                })
                .done(function(data) {
                    var rows = _.map(data.tables, function(table) {
                        if (table.state == 0) {

                            table.desc = categoryClassMap[table.category_id];

                            return optionTemplate(table);
                        }
                    });

                    if (rows.length) {
                        select.find('option:not(.default-option)').remove();
                        select.append(rows);

                    }
                });
        };

        var select = $('<select class="table-selector"><option value="" class="default-option">Change Table</option></select>');
        var selectWrapper = $("<td>").append(select);
        $(".iogc-GameWindow-commands").find("tr").append(selectWrapper);

        loadTables(select);

        select.bind('focus', function() {
            loadTables($(this));
        });

        select.bind('change', function() {
            var tableName = $(this).val();
            if (tableName) {
                window.location = "#" + tableName;
            }
            loadTables($(this));

        });

    };

    var loadPlayers = function() {

        var player = function(id) {
            return {
                id: id,
                color: okdice.colors.names[id],
                hex: okdice.colors.lightrgb[id],
                container: $(".iogc-PlayerPanel" + id),
                name: $(".iogc-PlayerPanel" + id).find('.iogc-PlayerPanel-name').text(),
                review: function(text) {
                    // post this as a review of this player
                },
                flag: function() {
                    okdice.actions.say("Flag " + this.name);
                },
                mute: function() {
                    okdice.actions.say("/mute " + this.name);
                    okdice.actions.say("Player " + this.name + " has been muted.");
                },
                unmute: function() {
                    okdice.actions.say("/unmute " + this.name);
                    okdice.actions.say("Player " + this.name + " has been unmuted.");
                }
            };
        };

        var list = _.map(_.range(7), function(id) {
            return player(id);
        });

        var loadContainers = function(id) {
            if (id) {
                return list[id].container;
            }
            return _.pluck(list, 'container');
        };

        var loadCurrent = function() {
            var name = $(".iogc-LoginPanel-nameHeading").text() || false;
            if (name) {
                okdice.status.loggedIn = true;
            }
            return name;
        }

        return {
            player: player,
            list: list,
            containers: loadContainers,
            get: function(id) {
                if (id) {
                    return list[id];
                }
                return list;
            },
            current: loadCurrent
        };
    }

    var loadActions = function() {

        var say = function(message) {
            okdice.ui.chatinput.val(message.toString());
            okdice.ui.chatsendbutton.click();
        };

        var focus = function() {
            okdice.ui.chatinput.focus();
        };

        var sit = function(table) {
            if (table) {
                window.location = "#" + table;
            }
            okdice.sitInButton.click();
        }

        var stand = function() {
            okdice.ui.sitOutButton.click();
        }

        var endturn = function() {
            this.ui.gamecontrols.find("button").each(function() {
                if ($(this).html() === "End Turn" && $(this).is(":visible")) {
                    $(this).click();
                    console.log("Ended turn");
                }
            });
        }

        var move = function(table) {
            window.location = "#" + table;
        }


        return {
            say: say,
            focus: focus,
            stand: stand,
            sit: sit,
            endturn: endturn,
            move: move
        }
    }



    /**
        add UI features
     **/



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

    var loadTheme = function(options) {

        var themeOptions = options.theme || {};

        if (themeOptions.active) {
            // do the theming
            if (themeOptions.hideHeader) {
                var menu = $('#iogc-regularMenu').clone();
                okdice.ui.header.addClass('nope').after(menu);

            }

            if (themeOptions.leftAlign) {
                $("center").css({
                    "text-align": "left"
                });
            }

            _.each(okdice.players.list, function(player) {

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


    return okdice;


})();