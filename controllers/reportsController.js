module.exports.showPage = function(req, res) {
    res.render('reports.ejs');
};

var map, infoWindow;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -37.793, lng: 144.969},
        zoom: 10
    });
    var marker1 = addMarker({lat: -37.793, lng: 144.969});
    var marker2 = addMarker({lat: -37.893, lng: 144.989});
    var marker3 = addMarker({lat: -37.593, lng: 144.669});

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