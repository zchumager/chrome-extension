"use strict";

//se ejecuta hasta que das click a la extension para desplegar popup.html 
chrome.extension.onConnect.addListener(function(port) {
    //console.log("Connected to popup.js");
    port.onMessage.addListener(function(msg) {
         console.log("message recieved: " + msg);

         chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
            var url = tabs[0].url;

            //si se ha ingresado al login
            if(url === "https://matmgtqa.z21.web.core.windows.net/user/login") {
                console.log(`se ha ingresado a ${url}`);
                chrome.tabs.sendMessage(tabs[0].id, {"message": msg});
            }
        });
    });
})

//se ejecuta cuando se refresca la pantalla
chrome.tabs.onUpdated.addListener(function(tabId, change, tab) {
    //si el la pagina ha recargado completamente 
    if(change.status == 'complete') {
        chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
            var url = tabs[0].url;

            //si se ha ingresado al dashboard
            if(url === "https://matmgtqa.z21.web.core.windows.net/dashboard") {
                console.log(`se ha ingresado a ${url}`);
                chrome.tabs.sendMessage(tabs[0].id, {"message": "dashboard"})
            }
        });
    }
});

