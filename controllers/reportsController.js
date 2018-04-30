"use strict";

module.exports.showPage = function(req, res) {
    res.render('reports.ejs');
};

var map, infoWindow;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -37.793, lng: 144.969},
        zoom: 10
    });
    let marker1 = addMarker({lat: -37.793, lng: 144.969});
    let marker2 = addMarker({lat: -37.893, lng: 144.989});
    let marker3 = addMarker({lat: -37.593, lng: 144.669});

    infoWindow = new google.maps.InfoWindow;

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            map.setCenter(pos);
        }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }

    let kmlLayer = new google.maps.KmlLayer();

    const src = 'https://services.land.vic.gov.au/kml1/vic-hospitals.kml';
    kmlLayer = new google.maps.KmlLayer(src, {
        suppressInfoWindows: true,
        preserveViewport: false,
        map: map
    });
}

function addMarker(location) {
    let marker = new google.maps.Marker({
        position: location,
        map: map,
        icon: '/public/incident-icon.png'
    });
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}

var activeReports = require('../models/reports.js');


function loadReports() {
    // Alert to test if loadReports is being called successfully
    alert("Load reports function executing");

    // Test for creating new divs
    var output = document.getElementById('incident-list');

    var ele1 = document.createElement("div");
    ele1.setAttribute("id","incident");
    ele1.setAttribute("class","incident");
    ele1.innerHTML="some more random data";
    output.appendChild(ele1);

    var ele2 = document.createElement("div");
    ele2.setAttribute("id","incident");
    ele2.setAttribute("class","incident");
    ele2.innerHTML="some more random data";
    output.appendChild(ele2);

    // NOT WORKING
    activeReports.find({}, function (err, rep) {
        if (err) {
            res.status(500).send();
        }
        else {
            let parent = document.getElementById("incident-list");

            for (let i = 0; i < rep.length; i++) {
                createIncident(parent, rep, i);
                createDropdown(parent, rep, i);
            }
        }
    });
}

function createIncident(parent, rep, i) {
    let incidentElement, idElement, timeElement, descElement, locElement;

    incidentElement = document.createElement("div");
    incidentElement.setAttribute("class", "incident");

    idElement = document.createElement("div");
    idElement.setAttribute("class", "incident-id");
    idElement.innerHTML = "ID #" + rep[i].incidentId;
    incidentElement.appendChild(idElement);

    timeElement = document.createElement("div");
    timeElement.setAttribute("class", "incident-time");
    timeElement.innerHTML = rep[i].incidentTime;
    incidentElement.appendChild(timeElement);

    incidentElement.innerHTML = "Description:";

    descElement = document.createElement("div");
    descElement.setAttribute("class", "incident-description");
    descElement.innerHTML = rep[i].incidentDescription;
    incidentElement.appendChild(descElement);

    incidentElement.innerHTML = "Location:";

    locElement = document.createElement("div");
    locElement.setAttribute("class", "incident-location");
    locElement.innerHTML = rep[i].incidentLocation;
    incidentElement.appendChild(locElement);

    parent.appendChild(incidentElement);
}

function createDropdown(parent, rep, i) {
    let dropdownElement, addinfoElement, gridElement, photoElement;

    dropdownElement = document.createElement("div");
    dropdownElement.setAttribute("class", "dropdown-info");

    addinfoElement = document.createElement("div");
    addinfoElement.setAttribute("class", "additional-info");
    addinfoElement.innerHTML = rep[i].additionalInfo;
    dropdownElement.appendChild(addinfoElement);

    for (let j; j < rep[i].photos.length; j++) {
        gridElement = document.createElement("div");
        gridElement.setAttribute("class", "photo-grid");

        photoElement = document.createElement("img");
        photoElement.setAttribute("src", rep[i].photos[j]);
        photoElement.setAttribute("alt", "photo" + j);
        gridElement.appendChild(photoElement);
    }
    dropdownElement.appendChild(gridElement);

    parent.appendChild(dropdownElement);
}

/*function displayIncidents(){
    console.log(rep)
}*/

/*
function openDetailedDescription(){
    detailedDescription.style.display = "block";
}

function closeDescription() {
    var detailedDescription = document.getElementById('detailedDescription');
    var detailedDescription = document.getElementById('dropdown-box');
    detailedDescription.style.display = "none";
}*/


