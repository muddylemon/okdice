$(document).ready(function() {

  "use strict";

  // pay the ryan tax -- wait until his dom stuff is done
  setTimeout(function() {

    chrome.storage.sync.get('config', function(stored) {
      var config = stored.config;
      console.log("config", config);
      console.log("Loading okdice v" + okdice.version);
      console.log("gl 2 all friends letss wwwarrr")
      okdice.start(config);
    });

  }, 1200);

});
