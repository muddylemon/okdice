$(document).ready(function() {

    "use strict";

    console.log("Okdice script loaded", okdice);

    var config = {
        active: true,
        chatbuttons: [{
            "text": "thank you",
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
            "text": "good game goober",
            "label": "gg",
            "className": ""
        }, {
            "text": "good tournament, my lad",
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
            fontsize: "14px"
        }
    };


    okdice.start(config);

    okdice.ui("chatmessages").css({
        "background-color": "#E3E3E3"
    });

    okdice.ui("header").css({
        "display": "none"
    });


    // load local configs

    // add chat buttons

    // make links clickable

    // make table joining easier

    // save alts



});