"use strict"

document.addEventListener('DOMContentLoaded', function() {

    const startBtn = document.getElementById("startBtn");

    const port = chrome.extension.connect({
        name: "Communication to Background"
   });

    startBtn.addEventListener("click", function() {
        if(confirm("Do you want to start login sesion time test?")) {
            port.postMessage("start-login-test");
        }
    });
});