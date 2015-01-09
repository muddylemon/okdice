
'use strict';




chrome.runtime.onInstalled.addListener(function (details) {
  console.log('previousVersion', details.previousVersion);

   chrome.tabs.create({url: "options.html"});

});
