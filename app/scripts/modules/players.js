const _ = require('lodash');
const $ = require('jQuery');

var Players = function() {
  var players = [],
    model = {
      id: id,
      kdiceId: kdiceId,
      name: name,
      profileUrl: profileUrl,
      color: null,
      hex: null,
      container: null,
    };

  function load() {
    players = _.map(_.range(7), function(index) {
      return parse(index);
    });
  }

  function me() {
    var name = $('iogc-LoginPanel-nameHeading').text();
    return _.find(players, { name: name });
  }

  function parse(id) {
    var player = _.cloneDeep(model), el = $('.iogc-PlayerPanel' + id);

    player.name = el.find('.iogc-PlayerPanel-name').text();
    player.profileUrl = el
      .find('.iogc-PlayerPanel-name')
      .find('a')
      .attr('href') || '';
    player.kdiceId = player.profileUrl.replace('/profile/', '');

    return player;
  }

  function get(player) {
  }

  return { players: players, me: me, load: load, get: get };
};

module.exports = Players;
