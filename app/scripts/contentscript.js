$(document).ready(function() {

    "use strict";

    var storage = chrome.storage.sync;

    storage.get('config',function(stored){
        var config = stored.config;
        console.log("Loading okdice v" + okdice.version);
        okdice.start(config);
    });

});