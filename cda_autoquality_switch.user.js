// ==UserScript==
// @name         CDA AutoQuality Switch
// @namespace    http://tampermonkey.net/
// @version      2022.10.18
// @description  Automatycznie zmienia jakość filmu na CDA - na 720p, jeżeli dostępne.
// @author       Fapka
// @match        https://www.cda.pl/video/*
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==
//Develop in Firefox Dev

var firstTimeQuality = "720p";

console.info && console.info('%c «%s» %c—— %c %s ',
        'background:#000000; color:#7ebe45', GM_info.script.name,
        'background:#000000; color:dimlight',
        'background:#3c424d; color:#ffffff', GM_info.script.version);

(function() {
    'use strict';

    //Wczytaj zapamiętaną wartość jakości lub załaduj domyślnie 720p
    var quality = GM_getValue("CDAquality", firstTimeQuality);

    function switchQuality(destinationQuality = quality){
        //if ( destinationQuality === undefined ) { destinationQuality = "720p"; }
        var mainQualityDiv = document.querySelector("span.button-players > span > span.pb-quality > span.pb-settings-menu.pb-settings-menu-quality.pb-settings-menu-on > span.pb-settings-menu-wrapper > span > span > span > ul");
        //Klikaj w ten przycisk wyboru jakości, tylko, gdy nie został kliknięty... (po kliknięciu widoczny jest nowy div - to on jest tu sprawdzany)
        if ( mainQualityDiv === null ) {
            document.querySelector("span.button-players > span > span.pb-quality > span.pb-settings-click").click();
        }
        //Wybierz jakość docelową...
        document.querySelector("span.button-players > span > span.pb-quality > span.pb-settings-menu.pb-settings-menu-quality.pb-settings-menu-on > span.pb-settings-menu-wrapper > span > span > span > ul").querySelector('[data-quality="'+destinationQuality+'"] > a').click();
    }
    //Automatycznie przełącz jakość na ostatnio zapamiętaną...
    switchQuality(quality);

    //Wstaw nasłuch na przyciski przyciski do pamiętania ostatnio wybranej jakości
    //Flaga zapewniająca jednokrotne przypisanie nasłuchu kliknięcia...
    var injectedListeners = false;
    document.querySelector("span.button-players > span > span.pb-quality > span.pb-settings-click").addEventListener("click", function(){
        if ( injectedListeners === false ) {
            //Miejsce w którym znajdują się przyciski z wyborem jakości...
            var qualityDivs = document.querySelector("span.button-players > span > span.pb-quality > span.pb-settings-menu.pb-settings-menu-quality.pb-settings-menu-on > span.pb-settings-menu-wrapper > span > span > span > ul").children;
            qualityDivs = Array.from(qualityDivs);
            var currentQuality = []; //Array potrzebny, by pętla poprawnie adresowała jakość w addEventListener;
            for ( let i = 0; i < qualityDivs.length; i++ )
            {
                currentQuality.push(qualityDivs[i].getAttribute('data-quality'));
                qualityDivs[i].addEventListener("click", function(){
                    GM_setValue("CDAquality", currentQuality[i]);
                })
            }
            injectedListeners = true; //Zmień flagę - już przypisaliśmy nasłuch
        }
    })

})();
