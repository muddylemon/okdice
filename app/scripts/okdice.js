//
// okdice, kdice helper
//
// copyright 2014-2016, @muddylemon
// use of this source code is governed by a MIT license
//

(function(_, $, Backbone, Bacon) {
  // WE'LL DO IT GLOBAL (and sandboxed)
  okdice = {
    version: '0.0.16',
    colors: {
      names: [ 'red', 'green', 'purple', 'yellow', 'blue', 'brown', 'teal' ],
      lightrgb: [
        '#ffb9b9',
        '#84ba96',
        '#A884BA',
        '#baba84',
        '#8484ba',
        '#ffaa80',
        '#84BABA'
      ],
      rgb: [ '#F00', '#090', '#60C', '#FF0', '#009', '#630', '#0CC' ]
    },
    session: { player: false, cycle: 0 },
    status: {
      loaded: false,
      loggedIn: false,
      playing: false,
      isGameRunning: false,
      myTurn: false,
      flagged: false,
      autoend: false
    },
    options: {
      active: true,
      debug: true,
      beatpace: 1200,
      chatbuttons: [
        { text: 'thank you', label: 'ty' },
        { text: 'yes', label: 'y' },
        { text: 'no', label: 'n' },
        { text: 'gg', label: 'gg' },
        { text: 'gt', label: 'gt' },
        { text: 'gl 2 all friends lets warrr', label: 'gl' }
      ],
      theme: { active: true, hideHeader: true, fontsize: '14px' }
    }
  };

  _.extend(okdice, Backbone.Events);

  okdice.start = function(options) {
    var opts = _.extend(okdice.options, options);

    if (opts.debug === true) {
      okdice.on('all', function(eventName) {
        console.log('Event:' + eventName);
      });
    }

    okdice.on('chat:said', function(obj) {
      console.log(obj);
    });

    if (opts.active === false) {
      console.log('okdice setting: options.active is false, shutting down');
      return;
    }

    okdice.actions = loadActions(opts);
    okdice.ui = loadUi(opts);
    okdice.players = loadPlayers(opts);
    okdice.beat = beat();

    loadTheme(opts);
    loadButtons(opts);

    okdice.session.player = okdice.players.current();

    okdice.status.loaded = true;

    window.setInterval(okdice.beat, opts.beatpace || 1000);
  };

  function loadActions() {
    var say = function(message) {
      okdice.ui.chatinput.val(message.toString());
      okdice.ui.chatsendbutton.click();
    },
      focus = function() {
        okdice.ui.chatinput.focus();
      },
      sit = function(table) {
        if (table) {
          window.location = '#' + table;
        }
        okdice.ui.sitInButton.click();
      },
      stand = function() {
        okdice.ui.sitOutButton.click();
      },
      endturn = function() {
        okdice.ui.gamecontrols.find('button').each(function() {
          if ($(this).html() === 'End Turn' && $(this).is(':visible')) {
            $(this).click();
          }
        });
      },
      move = function(table) {
        window.location = '#' + table;
      };

    // say is throttled to execute no more than once every 2 seconds
    return {
      say: _.throttle(say, 2000),
      focus: focus,
      stand: stand,
      sit: sit,
      endturn: endturn,
      move: move
    };
  }

  function loadPlayers() {
    var player = function(id) {
      var container = $('.iogc-PlayerPanel' + id);

      var name = container.find('.iogc-PlayerPanel-name').text();
      var profileUrl = container
        .find('.iogc-PlayerPanel-name')
        .find('a')
        .attr('href') ||
        '';
      var kdiceId = profileUrl.replace('/profile/', '');

      return {
        id: id,
        kdiceId: kdiceId,
        color: okdice.colors.names[id],
        hex: okdice.colors.lightrgb[id],
        container: container,
        name: name,
        profileUrl: profileUrl,
        review: function(text) {
          // post this as a review of this player
          chrome.extension.sendRequest(
            { kdiceId: kdiceId, cid: '', review: text },
            callback
          );
        },
        flag: function() {
          okdice.actions.say('Flag ' + this.color);
        },
        mute: function() {
          okdice.actions.say('/mute ' + this.name);
          okdice.actions.say('Player ' + this.name + ' has been muted.');
        },
        unmute: function() {
          okdice.actions.say('/unmute ' + this.name);
          okdice.actions.say('Player ' + this.name + ' has been unmuted.');
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
      var name = $('.iogc-LoginPanel-nameHeading').text() || false;
      if (name) {
        okdice.status.loggedIn = true;
      }
      return name;
    };

    return {
      player: function(id) {
        return player(id);
      },
      list: list,
      containers: loadContainers,
      get: function(id) {
        if (!_.isUndefined(id)) {
          return list[id];
        }
        return list;
      },
      current: loadCurrent
    };
  }

  function loadUi() {
    return {
      game: $('#KGame'),
      gametable: $('.iogc-GameWindow-table'),
      gamecontrols: $('.iogc-Controls'),
      sidebar: $('#iogc-PlayerPanel'),
      header: $('#hd'),
      chatbox: $('.iogc-ChatPanel'),
      chatinput: $('.iogc-ChatPanel .gwt-TextBox'),
      chatsendbutton: $('.iogc-ChatPanel').find('.iogc-NewButton'),
      chatmessages: $('.iogc-ChatPanel').find('.iogc-ChatPanel-messages'),
      tablelist: $('.iogc-ScrollTable-table'),
      sitOutButton: $('.iogc-GameWindow-sitOutButton'),
      sitInButton: $('.iogc-GameWindow-sitDownButton')
    };
  }

  function beat() {
    var processes = {
      autoend: function() {
        if (okdice.aet && okdice.aet.is(':checked')) {
          okdice.status.autoend = true;
          okdice.actions.endturn();
        }
        return this;
      },
      tables: function() {
        if (okdice.session.cycle % 3 === 0) {
          okdice.trigger('load:tables');
        }
        return this;
      },
      turn: function() {
        // toggle isMyTurn if it is my turn right now, or vice versa
        // if it is my turn, blink my tab title and change the favicon
        return this;
      },
      game: function() {
        var status = $('.iogc-GameWindow-status').text();

        if (status.indexOf('running') > 0) {
          if (okdice.status.isGameRunning === false) {
            okdice.trigger('game:start');
            okdice.status.isGameRunning = true;
          }
        }

        if (status.indexOf('waiting') > 0) {
          if (okdice.status.isGameRunning === true) {
            okdice.trigger('game:end');
            okdice.status.isGameRunning = false;
          }
        }

        return this;
      },
      chat: function() {
        $('.iogc-ChatPanel-messages tr:not(.okdiced)').each(function() {
          /**
               * Check for:
               * Someone arrived/left
               * someone chatted
               * ignore floods/repeats
               **/
          var el = $(this),
            content = el.find('.gwt-HTML').html(),
            semi = content.indexOf(':'),
            message = getMessage(content),
            speaker = getSpeaker(el);

          el.find('.gwt-HTML').html(content.substring(0, semi + 2) + message);
          okdice.trigger('chat:said', { speaker: speaker, message: message });

          el.addClass('okdiced');
        });

        function getSpeaker(el) {
          return el.find('.gwt-HTML').find('b').text();
        }

        function getMessage(content) {
          return Autolinker.link(content.substring(content.indexOf(':') + 2), {
            newWindow: true,
            truncate: 45
          });
        }

        return this;
      }
    };

    return function() {
      okdice.session.cycle++;

      processes.autoend().turn().tables().game().chat();
    };
    // is it my turn? change the tab title
    // is it not my turn? stop that
    // did a game just start? note that
    // flip the events toggles
    // call the event functions
    // etc
  }

  function loadButtons(options) {
    var park = $('<div class="btn_park"></div>').appendTo(okdice.ui.sidebar);

    loadOptionsLink(park);
    loadAutoEndTurnButton(park);
    loadTableSelector({ container: park });
    loadFlagButtons(park);
    loadChatButtons(options);

    function loadOptionsLink(container) {
      var optionsLink = '<div class="text-right"><a href="' +
        chrome.extension.getURL('options.html') +
        '" target="_blank"><small>okdice options</small></a></div> ';
      container.after(optionsLink);
    }

    function loadAutoEndTurnButton(container) {
      container.append(
        '<div class="auto-end-turn"><label for="aet"><input type="checkbox" name="aet" id="aet"> Auto-End Turn</label></div>'
      );

      okdice.aet = $('#aet');

      okdice.aet.bind('change', function() {
        okdice.trigger('aet:change', okdice.aet.is('checked'));
      });

      okdice.on('game:start game:end change:table', function() {
        okdice.aet.prop('checked', false);
      });

      okdice.on('aet:change', function(isChecked) {
        console.log('aet', isChecked);
      });
    }

    function loadChatButtons(options) {
      var chatContainer = $('<div class="chat-buttons"></div>');
      var chatButtonTemplate = _.template(
        '<button class="chat-btn" data-txt="<%= text %>"><%= label %></button>'
      );
      var chatButtons = _.map(options.chatbuttons, function(btn) {
        return $(chatButtonTemplate(btn));
      });

      okdice.ui.chatinput.after(chatContainer.append(chatButtons));

      $('button', chatContainer).bind('click', function() {
        okdice.actions.say($(this).data('txt'));
      });
    }

    function loadPlayerButtons() {
      var btnsTemplate = _.template(
        '<div class="player_btn_collection"><button class="iogc-NewButton-green iogc-NewButton flag-player" data-playerid="<%= id %>"> &#9873; Flag </button><button class="iogc-NewButton-green iogc-NewButton mute-player" data-playerid="<%= id %>"> Mute </button><button class="iogc-NewButton-green iogc-NewButton profile-player" data-playerid="<%= id %>">Profile</button></div>'
      );

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

      $('.profile-player').on('click', function() {
        var pid = $(this).data('playerid'),
          player = okdice.players.player(pid),
          profileUrl = player.profileUrl;
        window.open(profileUrl);
      });

      $('.flag-player').on('click', function() {
        var player = okdice.players.player($(this).data('playerid'));
        player.flag();
      });

      $('.mute-player').bind('click', function() {
        var player = okdice.players.player($(this).data('playerid'));
        player.mute();
      });
    }

    function loadFlagButtons(container) {
      var btns = $('<ul class="flags"></ul>');

      _.each(okdice.colors.names, function(color, index) {
        var b = $('<li>&#9873;</li>');
        b.data('txt', 'Flag ' + color.charAt(0).toUpperCase() + color.slice(1));

        b.css({ color: okdice.colors.rgb[index] });

        btns.append(b);
      });

      $('li', btns).bind('click', function() {
        okdice.actions.say($(this).data('txt'));
        $(this).addClass('flagged');
      });

      okdice.on('game:start game:end change:table', function() {
        $('.flagged').removeClass('flagged');
      });

      container.append(btns);
    }

    function loadTableSelector(options) {
      var container = options.container ||
        $('.iogc-GameWindow-commands').find('tr');

      var tableTemplate = _.template(
        '<tr class="pts-<%= desc %>"><td class="table-name"><a href="#<%= name %>"><%= name %></a></td><td class="table-num-players"><%= playerCount %> <small>(<%= viewerCount %>)</small></td><td class="table-min-points"><%= desc.replace("000","k") %></td></tr>'
      ),
        optionTemplate = _.template(
          '<option value="<%= name %>"><%= name %> (<%= playerCount %>) -- <span class="pull-right opt-desc"><%= desc %></span> </option>'
        ),
        currentTable = window.location.hash,
        categoryClassMap = {
          '2': '0',
          '3': '100',
          '4': '500',
          '5': '2000',
          '6': '5000'
        },
        select = $(
          '<select class="table-selector"><option value="" class="default-option">Change Table</option></select>'
        ),
        listTable = $(
          '<table class="table striped table-selector"><thead><td>Name</td><td>Players</td><td>Pts</td></thead><tbody class="current-tables"></tbody></table>'
        );

      // attach the select element to the top bar
      container.append($('<td>').append(listTable));

      function loadTables(ev) {
        $
          .ajax({ url: 'https://kdice.com/api/kdice/tables', type: 'GET' })
          .done(function(data) {
            var tables = _.sortBy(data.tables, function(table) {
              return -table.playerCount;
            });
            var rows = _.map(tables, function(table) {
              if (table.state == 0) {
                table.desc = categoryClassMap[table.category_id];
                return tableTemplate(table);
              }
            });
            if (rows.length) {
              listTable.find('.current-tables').html(rows);
            }
          });
      }

      // don't allow the tables to be reloaded more than once every 2 seconds
      var reload = _.throttle(loadTables, 2000);

      okdice.on('load:tables', reload);

      container.bind('mouseover', function() {
        reload();
      });

      select.bind('change', function() {
        var tableName = $(this).val();
        if (tableName && tableName !== currentTable) {
          window.location = '#' + tableName;
          okdice.trigger('table:change', tableName);
        }
        reload();
      });
      // and one for the road
      reload();
    }
  }

  function loadTheme(options) {
    var themeOptions = options.theme || {};
    if (themeOptions.active) {
      // do the theming
      if (themeOptions.hideHeader) {
        okdice.ui.header.addClass('nope');
        $('#iogc-regularMenu').css({ 'margin-top': '30px' });
      }

      if (themeOptions.leftAlign) {
        $('center').css({ 'text-align': 'left' });
      }

      if (themeOptions.colorizePlayers) {
        _.each(okdice.players.list, function(player) {
          player.container
            .css({
              'background-color': player.hex,
              border: '5px solid ' + player.hex,
              'border-collapse': 'separate'
            })
            .addClass('player-' + player.color);
        });
      }
    }
  }

  return okdice;
})(_, jQuery, Backbone, Bacon);
