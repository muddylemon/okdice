'use strict';

/**
    This is the default configuration
**/
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

var storeConfig = function(config) {

    chrome.storage.sync.set({'config': config}, function() {
        console.log('okdice configuration saved');
    });

};



storeConfig(config);

