"use strict"

//variables
var vList = {
    long: 0.0,
    lat: 0.0,
    apiKey: "ADD_API_HERE",
    dayList: [],
    dateList: [],
    dateCells: document.getElementsByClassName("dateCell"),
    weatherCells: document.getElementsByClassName("weatherCell"),
    weatherIcons: [],
    degrees: [],
    description: [],
    weatherCellsArray: [],
    timeArray: [],
    longTest: RegExp(/^[-]?[1]?([0-9]|[0-9]{1,2})(\.\d{1,6})?$/),
    latTest: RegExp(/^[-]?([0-9]|[0-9]{1,2})(\.\d{1,6})?$/)
}

$(document).ready(function () {
    //Session storage
    var sStorage = sessionStorage.getItem("hasVisited");
    if (sStorage == null) {
        sessionStorage.setItem("hasVisited", true);
    }
    else {
        document.getElementById("header").innerHTML = "My Weather - Welcome Back";
    }
    // On click function
    $("#getWeatherButt").click(function () {
        //Gets the values from input and stores in a var
        vList.lat = parseFloat(document.getElementById("latInput").value);
        vList.long = parseFloat(document.getElementById("longInput").value);
        //Test the values with a RegExp and submit else alert
        if (vList.latTest.test(vList.lat) && vList.longTest.test(vList.long)) {
            submitRequest();
        }
        else {
            alert("Latitude and Longitude are invalid");
        }
    });
    function submitRequest() {
        var url = "http://api.openweathermap.org/data/2.5/forecast?lat=" + vList.lat + "&lon=" + vList.long + "&units=metric&appid=" + vList.apiKey;
        var request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            if (request.readyState == 4 && request.status == 200) {
                populateResponse(this.response);
            }
        };

        try {
            request.open("GET", url);
            request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            request.send();
        }
        catch (ex) {
            alert("Exception of type " + ex.name + " occurred: " + ex.message + ".");
        }
    }
    function populateResponse(response) {
        //deserialise the response
        var json = JSON.parse(response);
        console.log(json);
        //This gets and stores the list from the JSON data recieved
        var reports = json.list;
        //set location name
        var name = json.city.name;
        document.getElementById("forecastHeader").innerHTML = "Forecast for " + name;
        //populate time cells with base numbers
        var timeCells = document.getElementsByClassName("timeCell");
        var times = ["2 am", "5 am", "8 am", "11 am", "2 pm", "5 pm", "8 pm", "11 pm"];
        for (var i = 0; i < 8; i++) {
            timeCells[i].innerHTML = "<p>" + times[i] + "</p>";
        };
        //Date cells
        for (var i = 0; i < reports.length; i++) {
            var day = reports[i].dt * 1000;
            var dayObj = new Date(day);
            var dateObj = new Date(day);
            vList.dayList[i] = dayObj.toLocaleString("en-AU", { weekday: "short" });
            vList.dateList[i] = dateObj.toLocaleString("en-AU", { dateStyle: "short" });
        }
        //Takes the variables from json report and gets rid of duplicates then populates the date cells
        let uniqueDays = [...new Set(vList.dayList)];
        let uniqueDate = [...new Set(vList.dateList)];
        for (var i = 0; i < 5; i++) {
            vList.dateCells[i].innerHTML = "<p>" + uniqueDays[i] + "</br>" + uniqueDate[i] + "</p>";
        };
        //Implement functions
        populateWeatherGrid();
        populateGraph();
        //Functions to keep it a little cleaner and easier to manage
        //Function for weather grid
        function populateWeatherGrid() {
            //Store weather details
            for (var i = 0; i < reports.length; i++) {
                vList.weatherIcons[i] = reports[i].weather[0].icon;
                vList.degrees[i] = Math.round(reports[i].main.temp) + "&deg;C";
                vList.description[i] = reports[i].weather[0].description;
                vList.weatherCellsArray[i] = vList.weatherCells[i];
            }
            //Populate a time array to be checked against header times
            for (var i = 0; i < reports.length; i++) {
                var day = reports[i].dt * 1000;
                var timeObj = new Date(day);
                var time = timeObj.toLocaleString("en-AU", { hour: "numeric" });
                vList.timeArray[i] = time;
            }
            //Decides where to start and finish the weather grid and populates it with data
            if (vList.timeArray[0] == "2 am") {
                vList.weatherCellsArray = vList.weatherCellsArray.slice(0, 32);
                for (var i = 0; i < 32; i++) {
                    vList.weatherCellsArray[i].innerHTML = "<p>" + vList.degrees[i] + "</br><img src='images/" + vList.weatherIcons[i] + ".png'/>" + "</br>" + vList.description[i] + "</p>";
                }
            }
            else if (vList.timeArray[0] == "5 am") {
                vList.weatherCellsArray = vList.weatherCellsArray.slice(1, 33);
                for (var i = 0; i < 32; i++) {
                    vList.weatherCellsArray[i].innerHTML = "<p>" + vList.degrees[i] + "</br><img src='images/" + vList.weatherIcons[i] + ".png'/>" + "</br>" + vList.description[i] + "</p>";
                }
            }
            else if (vList.timeArray[0] == "8 am") {
                vList.weatherCellsArray = vList.weatherCellsArray.slice(2, 34);
                for (var i = 0; i < 32; i++) {
                    vList.weatherCellsArray[i].innerHTML = "<p>" + vList.degrees[i] + "</br><img src='images/" + vList.weatherIcons[i] + ".png'/>" + "</br>" + vList.description[i] + "</p>";
                }
            }
            else if (vList.timeArray[0] == "11 am") {
                vList.weatherCellsArray = vList.weatherCellsArray.slice(3, 35);
                for (var i = 0; i < 32; i++) {
                    vList.weatherCellsArray[i].innerHTML = "<p>" + vList.degrees[i] + "</br><img src='images/" + vList.weatherIcons[i] + ".png'/>" + "</br>" + vList.description[i] + "</p>";
                }
            }
            else if (vList.timeArray[0] == "2 pm") {
                vList.weatherCellsArray = vList.weatherCellsArray.slice(4, 36);
                for (var i = 0; i < 32; i++) {
                    vList.weatherCellsArray[i].innerHTML = "<p>" + vList.degrees[i] + "</br><img src='images/" + vList.weatherIcons[i] + ".png'/>" + "</br>" + vList.description[i] + "</p>";
                }
            }
            else if (vList.timeArray[0] == "5 pm") {
                vList.weatherCellsArray = vList.weatherCellsArray.slice(5, 37);
                for (var i = 0; i < 32; i++) {
                    vList.weatherCellsArray[i].innerHTML = "<p>" + vList.degrees[i] + "</br><img src='images/" + vList.weatherIcons[i] + ".png'/>" + "</br>" + vList.description[i] + "</p>";
                }
            }
            else if (vList.timeArray[0] == "8 pm") {
                vList.weatherCellsArray = vList.weatherCellsArray.slice(6, 38);
                for (var i = 0; i < 32; i++) {
                    vList.weatherCellsArray[i].innerHTML = "<p>" + vList.degrees[i] + "</br><img src='images/" + vList.weatherIcons[i] + ".png'/>" + "</br>" + vList.description[i] + "</p>";
                }
            }
            else if (vList.timeArray[0] == "11 pm") {
                vList.weatherCellsArray = vList.weatherCellsArray.slice(7, 39);
                for (var i = 0; i < 32; i++) {
                    vList.weatherCellsArray[i].innerHTML = "<p>" + vList.degrees[i] + "</br><img src='images/" + vList.weatherIcons[i] + ".png'/>" + "</br>" + vList.description[i] + "</p>";
                }
            }
        };
        //Function for drawing graph
        function populateGraph() {
            //Basic layout
            var canvas = document.getElementById("graph");
            var draw = canvas.getContext("2d");
            draw.font = "20px Arial";
            draw.fillText("0°", 0, 500);
            drawLine(0, 500, 1600, 500);
            draw.fillText("10°", 0, 400);
            drawLine(0, 400, 1600, 400);
            draw.fillText("20°", 0, 300);
            drawLine(0, 300, 1600, 300);
            draw.fillText("30°", 0, 200);
            drawLine(0, 200, 1600, 200);
            draw.fillText("40°", 0, 100);
            drawLine(0, 100, 1600, 100);
            //Fill in days 320px per column 40px per circle
            draw.fillText(uniqueDays[0], 0, 20);
            draw.fillText(uniqueDays[1], 320, 20);
            drawLine(318, 0, 318, 500);
            draw.fillText(uniqueDays[2], 640, 20);
            drawLine(638, 0, 638, 500);
            draw.fillText(uniqueDays[3], 960, 20);
            drawLine(958, 0, 958, 500);
            draw.fillText(uniqueDays[4], 1280, 20);
            drawLine(1278, 0, 1278, 500);
            // Filling the graph with data
            var gStart = 0;
            var count = 31;
            if (vList.timeArray[0] == "2 am") {
                gStart = 0;
                for (var i = 0; i < 32; i++) {
                    var gDeg = 500 - (Math.round(reports[i].main.temp) * 10);
                    var nextDeg = 500 - (Math.round(reports[i + 1].main.temp) * 10);
                    drawCircle(gStart, gDeg);
                    if (count != 0) {
                        drawLine((gStart + 8), gDeg, (gStart + 40), nextDeg);
                        count -= 1;
                    }
                    gStart += 40;
                }
            }
            else if (vList.timeArray[0] == "5 am") {
                gStart = 40;
                for (var i = 0; i < 32; i++) {
                    var gDeg = 500 - (Math.round(reports[i].main.temp) * 10);
                    var nextDeg = 500 - (Math.round(reports[i + 1].main.temp) * 10);
                    drawCircle(gStart, gDeg);
                    if (count != 0) {
                        drawLine((gStart + 8), gDeg, (gStart + 40), nextDeg);
                        count -= 1;
                    }
                    gStart += 40;
                }
            }
            else if (vList.timeArray[0] == "8 am") {
                gStart = 80;
                for (var i = 0; i < 32; i++) {
                    var gDeg = 500 - (Math.round(reports[i].main.temp) * 10);
                    var nextDeg = 500 - (Math.round(reports[i + 1].main.temp) * 10);
                    drawCircle(gStart, gDeg);
                    if (count != 0) {
                        drawLine((gStart + 8), gDeg, (gStart + 40), nextDeg);
                        count -= 1;
                    }
                    gStart += 40;
                }
            }
            else if (vList.timeArray[0] == "11 am") {
                gStart = 120;
                for (var i = 0; i < 32; i++) {
                    var gDeg = 500 - (Math.round(reports[i].main.temp) * 10);
                    var nextDeg = 500 - (Math.round(reports[i + 1].main.temp) * 10);
                    drawCircle(gStart, gDeg);
                    if (count != 0) {
                        drawLine((gStart + 8), gDeg, (gStart + 40), nextDeg);
                        count -= 1;
                    }
                    gStart += 40;
                }
            }
            else if (vList.timeArray[0] == "2 pm") {
                gStart = 160;
                for (var i = 0; i < 32; i++) {
                    var gDeg = 500 - (Math.round(reports[i].main.temp) * 10);
                    var nextDeg = 500 - (Math.round(reports[i + 1].main.temp) * 10);
                    drawCircle(gStart, gDeg);
                    if (count != 0) {
                        drawLine((gStart + 8), gDeg, (gStart + 40), nextDeg);
                        count -= 1;
                    }
                    gStart += 40;
                }
            }
            else if (vList.timeArray[0] == "5 pm") {
                gStart = 200;
                for (var i = 0; i < 32; i++) {
                    var gDeg = 500 - (Math.round(reports[i].main.temp) * 10);
                    var nextDeg = 500 - (Math.round(reports[i + 1].main.temp) * 10);
                    drawCircle(gStart, gDeg);
                    if (count != 0) {
                        drawLine((gStart + 8), gDeg, (gStart + 40), nextDeg);
                        count -= 1;
                    }
                    gStart += 40;
                }
            }
            else if (vList.timeArray[0] == "8 pm") {
                gStart = 240;
                for (var i = 0; i < 32; i++) {
                    var gDeg = 500 - (Math.round(reports[i].main.temp) * 10);
                    var nextDeg = 500 - (Math.round(reports[i + 1].main.temp) * 10);
                    drawCircle(gStart, gDeg);
                    if (count != 0) {
                        drawLine((gStart + 8), gDeg, (gStart + 40), nextDeg);
                        count -= 1;
                    }
                    gStart += 40;
                }
            }
            else if (vList.timeArray[0] == "11 pm") {
                gStart = 280;
                for (var i = 0; i < 32; i++) {
                    var gDeg = 500 - (Math.round(reports[i].main.temp) * 10);
                    var nextDeg = 500 - (Math.round(reports[i + 1].main.temp) * 10);
                    drawCircle(gStart, gDeg);
                    if (count != 0) {
                        drawLine((gStart + 8), gDeg, (gStart + 40), nextDeg);
                        count -= 1;
                    }
                    gStart += 40;
                }
            }

            //Function to create circles(takes x and y coords)
            function drawCircle(x, y) {
                draw.beginPath();
                draw.arc(x, y, 8, 0, 2 * Math.PI);
                draw.fillStyle = "blue";
                draw.fill();
                draw.stroke();
            }
            //Draw lines (takes start x and y, end x and y)
            function drawLine(sx, sy, ex, ey) {
                draw.moveTo(sx, sy);
                draw.lineTo(ex, ey);
                draw.stroke();
            }
        };
    };
});