'use strict';


function addReview(kdiceId, cid, review, callback) {

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(data) {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                callback(true);
            } else {
                callback(null);
            }
        }
    }

    xhr.open('POST', 'http://kdice.com/profile/' + kdiceId + '/addReview', true);

    var params = "prev=/profile/" + kdiceId + "/reviews&cid=&body=" + review;

    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.setRequestHeader("Content-length", params.length);
    xhr.setRequestHeader("Connection", "keep-alive");

    xhr.send(params);
}

chrome.extension.onRequest.addListener(function(request, sender, callback) {
    if (typeof request.review !== 'undefined') {
        addReview(request.kdiceId, request.cid, request.review, callback);
    }
});



chrome.runtime.onInstalled.addListener(function(details) {

    if (details.previousVersion !== chrome.runtime.getManifest().version){
        chrome.tabs.create({
            url: "options.html"
        });
    }



});
