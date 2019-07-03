
'use strict'

var $ = require('jquery');
require('jquery-sendkeys');
var assert = require('assert');

var data = require("./config");
var {millisToMinutesAndSeconds} = require('./utils');

let message = "";

chrome.runtime.onMessage.addListener(function(request, sender) {
    //console.log("Contentscript has received a message from from background script: '" + request.message + "'");

    message = request.message;

    if(message === "start-login-test") {
        console.log("Login in the application");

        let domLoadWait = setInterval(function() {
            //se obtienen los elementos del formulario mediante JQuery
            const userTxt = $('#userNameOrEmailAddress');
            const passwordTxt = $('#password');
            const button = $('button');
        
            //solo se ejecuta la funcion init si y solo si ninguno de los elementos es nulo
            if(userTxt.attr("id") !== undefined
             && passwordTxt.attr("id") !== undefined
             && button.text() !== undefined
             && data.username !== undefined
             && data.password !== undefined) {

                //variable a nivel dominio que permite la ejecucion de la medicion del tiempo de sesion del login
                localStorage.setItem("test", message);

                init(userTxt, passwordTxt, button);
            }
            
            //se limpia el intervalo para evitar un loop infinito
            clearInterval(domLoadWait);

        }, 4000);

    } 
    
    if(message === "dashboard" && localStorage.getItem("test") !== "nil") {
        localStorage.setItem("test", "nil");

        setTimeout(function() {
            console.log(`Starting login session time measuring at ${new Date()}`);
            
            let startingTime = window.performance.now();
            //despues de 61 minutos se valida el login
            setTimeout(function() {
                console.log("Clicking Users span");
                const usersSpan = $("span:contains('Users')");
                
                verifySessionEnding(startingTime, usersSpan);
                
            }, 3660000);

        }, 5000);
    }
});

/*
 * Como tal se programo un retardo entre cada instruccion debido a que
 * de esta manera se simula la velocidad en la que lo haria un ser humano
 */
let init = function(userTxt, passwordTxt, button) {
    console.log(`Getting Username input: ${userTxt.attr("id")} | Getting Password input: ${passwordTxt.attr("id")}`);

    setTimeout(function() {
        console.log("Escribiendo Usuario");
        userTxt.val("");
        userTxt.sendkeys(data.username);
    }, 2000);

    setTimeout(function() {
        console.log("Escribiendo Password");
        passwordTxt.val("");
        passwordTxt.sendkeys(data.password);
    }, 3000);

    setTimeout(function() {
        console.log("Dando Click al Boton");
        button.click();
    }, 4000);
}

let verifySessionEnding = function(startingTime, clickeableTag) {
    clickeableTag.click();

    setTimeout(function(){
        console.log(`Verifing session expired modal message at ${new Date()}`);

        console.log(`Modal message: ${
        document.getElementsByClassName("ant-modal-confirm-content")[0].textContent
        }`);

        assert.equal(
            document.getElementsByClassName("ant-modal-confirm-content")[0].textContent
            ,"Your session has expired. Please log again."
        );

        //se captura el tiempo y se obtienen los minutos transcurridos
        let endingTime = window.performance.now();
        let elapsed = millisToMinutesAndSeconds((endingTime - startingTime));

        console.log(`elapsed time: ${elapsed} minutes`);
        alert(`elapsed time: ${elapsed} minutes`);

    }, 10000);
}