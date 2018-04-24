module.exports.showPage = function(req, res) {
    res.render('reports.ejs');
};

const db = require("../models/exampleIncidents.js");

var map, infoWindow;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -37.793, lng: 144.969},
        zoom: 10
    });
    var marker1 = addMarker({lat: -37.793, lng: 144.969});
    var marker2 = addMarker({lat: -37.893, lng: 144.989});
    var marker3 = addMarker({lat: -37.593, lng: 144.669});
}

function addMarker(location) {
    marker = new google.maps.Marker({
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


