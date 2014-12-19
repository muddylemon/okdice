$(document).ready(function() {

    "use strict";

    console.log("Okdice script loaded", okdice);

    var config = {
        active: true,
        chatbuttons: [{
            "text": "ty gl",
            "label": "ty",
            "className": ""
        }, {
            "text": "yes",
            "label": "y",
            "className": ""
        }, {
            "text": "no",
            "label": "n",
            "className": ""
        }, {
            "text": "gg",
            "label": "gg",
            "className": ""
        }, {
            "text": "gt ",
            "label": "gt",
            "className": ""
        }, {
            "text": "gl 2 all friends lets warrr",
            "label": "gl",
            "className": "danger"
        }],
        theme:{
            active: true,
            hideHeader: true,
            leftAlign: true,
            fontsize: "14px"
        }
    };


    okdice.start(config);

    // load local configs

    // add chat buttons

    // make links clickable

    // make table joining easier

    // save alts



});