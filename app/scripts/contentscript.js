$(document).ready(function() {

    "use strict";

    var storage = chrome.storage.sync;

    storage.get('config',function(stored){
        var config = stored.config;
        console.log("Loading okdice", config);
        okdice.start(config);
    });





    // load local configs

    // add chat buttons

    // make links clickable

    // make table joining easier

    // save alts



});