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
            "text": "giggity giggity",
            "label": "gg",
            "className": ""
        }, {
            "text": "good tournament, my ",
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

    okdice.ui("chatmessages").css({
        "background-color": "#E3E3E3"
    });


    // load local configs

    // add chat buttons

    // make links clickable

    // make table joining easier

    // save alts



});