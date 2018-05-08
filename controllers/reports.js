"use strict"

var map, infoWindow, service;
var mapMarkers = {};

// Retrieves data of incidents from an API call to the database.
function getIncidents() {
    $.ajax({
        url: "/database/all", type: "POST", success: function (result) {
            clearIncidents();
            populateIncidents(result);
            addIncidentMarkers(result);
        }
    });
}

// Retrieves specific incidents based on search input
function searchIncidents() {
    var id = document.getElementById('search').value;
    var data = {incidentId: id};
    $.ajax({
        url: "/database/search", type: "POST", data: data, success: function (result) {
            clearIncidents();
            populateIncidents(result);
            addIncidentMarkers(result);
        }
    });
}

// Clears all incidents from report page
function clearIncidents(){
    var reportPage = document.getElementById('report-page');
    reportPage.removeChild(document.getElementById('incident-list'));
    var incidentList = document.createElement('div');
    incidentList.setAttribute('id', 'incident-list');
    reportPage.appendChild(incidentList);

    for(var key in mapMarkers){
        mapMarkers[key].setMap(null);
    }
    mapMarkers = {};
}

// Deletes a specific incident and repopulated report page with all non-deleted incidents
function deleteIncident(id) {
    const data = {incidentId: id};
    $.ajax({
        url: "/database/delete", type: "POST", data: data, success: function () {
            getIncidents();
        }
    });
}

// Adds markers to the map based on database data.
function addIncidentMarkers(result){
    for(let i=0; i<result.length; i++){
        createIncidentMarker({lat: result[i]['lat'], lng: result[i]['lon']}, result[i]['incidentId']);

    }
}

// Builds the incident list using results from the database data
function populateIncidents(result){
    for(let i=0; i<result.length; i++) {
        $("#incident-list")
            .append(
                $("<div class=\"incident\" id=\""+result[i]['incidentId']+"\" onclick=\"incidentZoom(this)\">")
                    .append(
                        $("<span class=\"closeButton\" onclick=\"displayModalBox(" + result[i]['incidentId'] + ")\">&times;</span>")
                    )
                    .append(
                        $("<div class=\"incident-id\">ID#" + result[i]['incidentId'] + "</div>")
                    )
                    .append(
                        $("<div class=\"incident-time\">" + result[i]['time'] + "</div>")
                    )
                    .append(
                        $("<div class=\"incident-date\">" + result[i]['date'] + "</div>")
                    )
                    .append(
                        $("<div class=\"description\">Description:</div>")
                    )
                    .append(
                        $("<div class=\"incident-description\">" + result[i]['incidentDescription'] + "</div>")
                    )
                    .append(
                        $("<div class=\"location\">Location:</div>")
                    )
                    .append(
                        $("<div class=\"incident-location\">" + result[i]['incidentLocation'] + "</div>")
                    )

            )
            .append(
                $("<div class=\"dropdown-info\">")
                    /*.append(
                        $("<div class=\"incident\">")
                            .append(
                                $("<div class=\"incident-id\"><h2>ID#" + result[i]['incidentId'] + "</h2></div>")
                            )
                            .append(
                                $("<div class=\"incident-time\">" + result[i]['time'] + "</div><br>")
                            )
                            .append(
                                $("<div class=\"incident-description\">" + result[i]['incidentDescription'] + "</div>")
                            )
                            .append(
                                $("<div class=\"incident-location\">" + result[i]['incidentLocation'] + "</div>")
                            )
                            .append(
                                $("</div>")
                            )
                    )*/
                    .append(
                        $("<div class=\"additional-info\">")
                            .append(
                                $("<h2>Additional Info</h2>" + result[i]['additionalInfo'] + "<br>")
                            )
                    )
                    .append(
                        $("<div class=\"photos-title\"><h2>Photos</h2></div>")
                    )
                    .append(
                        $("<div class=\"photo-grid\" id=\"photogrid"+result[i]['incidentId']+"\"></div>")
                    )
            );

        for(let j=0; j<result[i]['photos'].length; j++){
            $("#photogrid"+result[i]['incidentId'])
                .append(
                    $("<div class=\"photo\">")
                        .append(
                            $("<img src=\""+result[i]['photos'][j]+"\" alt=\"ParaMed logo\"/>")
                        )
                        .append(
                            $("</div>")
                        )
                )
        }
    }

    $("#incident-list").accordion({
        active: false,
        collapsible: true
    });
}

// Initialises the map
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -36.3833, lng: 145.400},
        zoom: 7
    });

    infoWindow = new google.maps.InfoWindow();
    service = new google.maps.places.PlacesService(map);
}

// Adds a marker to the map for a specific incident and adds nearby hospital markers
function createIncidentMarker(location, id) {
    // Add markers for nearby hospitals for this location
    service.nearbySearch({
        location: location,
        radius: 10000,
        type: ['hospital']
    }, addHospitalMarkers);

    let marker = new google.maps.Marker({
        position: location,
        map: map,
        icon: '/public/incident-pin.png',
        id: id
    });

    google.maps.event.addListener(marker, 'click', function(){
        document.getElementById(this.get('id')).click();
    });

    mapMarkers[id] = marker;
}

// Finds nearby hospital markers for a specific location
function addHospitalMarkers(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (let i = 0; i < results.length; i++) {
            createHospitalMarker(results[i]);
        }
    }
}

// Adds hospital marker to the map
function createHospitalMarker(place) {
    let placeLoc = place.geometry.location;
    let marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location,
        icon: '/public/hospital-pin.png'
    });

    google.maps.event.addListener(marker, 'click', function() {
        infoWindow.setContent(place.name);
        infoWindow.open(map, this);
    });
}

/*
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}*/

// Zooms in on a position on the map
function mapZoomIn(latlngPosition){
    map.panTo(latlngPosition);
    map.setZoom(13);
}

// Centres and zooms in on an incident
function incidentZoom(element){
    element.scrollIntoView({behavior: 'smooth'});
    mapZoomIn(mapMarkers[element.id].getPosition());
    mapMarkers[element.id].setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function(){ mapMarkers[element.id].setAnimation(null); }, 2800);
}

// Displays the modal box that confirms whether to delete an incident
function displayModalBox(incidentId) {
    // Disable dropdown box being displayed when delete button pressed
    $("#incident-list").accordion({
        active: false,
        collapsible: true,
        disabled: true
    });

    document.getElementById('idToDelete').innerHTML = incidentId;

    deleteIncidentBox.style.display = "block";

    $("#buttonYes").on('click', function() {
        deleteIncident(incidentId);
        hideModalBox();
    });
    $("#buttonNo").on('click', function() {
        hideModalBox();
    });
}

// Hides the modal box
function hideModalBox() {
    deleteIncidentBox.style.display = "none";
}