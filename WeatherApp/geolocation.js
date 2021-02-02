"use strict"

window.onload = function () {
    var positionOptions = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
    }
    //Launch geolocation request
    navigator.geolocation.getCurrentPosition(geolocationSuccessCallback, geolocationFailureCallback, positionOptions);
    //If there is a successful callBack
    function geolocationSuccessCallback(position) {
        //Check that the values are not null
        if (parseFloat(position.coords.latitude) && parseFloat(position.coords.longitude) != null) {
            document.getElementById("latInput").value = parseFloat(position.coords.latitude).toFixed(6);
            document.getElementById("longInput").value = parseFloat(position.coords.longitude).toFixed(6);
        }
    }
    //If something goes wrong
    function geolocationFailureCallback() {
        alert("Geolocation error code " + error.code + ": " + error.message);
        console.log("Geolocation error code " + error.code + ": " + error.message);
    }
}