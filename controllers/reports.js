"use strict"

var map, infoWindow;
var mapMarkers = {};

// Retrieves data of incidents from an API call to the database.
function getIncidents() {
    $.ajax({
        url: "http://localhost:3000/database/all", type: "POST", success: function (result) {
            clearIncidents();
            populateIncidents(result);
            addMapMarkers(result);
        }
    });
}

function searchIncidents() {
    var id = document.getElementById('search').value;
    var data = {incidentId: id};
    $.ajax({
        url: "http://localhost:3000/database/search", type: "POST", data: data, success: function (result) {
            clearIncidents();
            populateIncidents(result);
            addMapMarkers(result);
        }
    });
}

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

function deleteIncident(id) {
    const data = {incidentId: id};
    $.ajax({
        url: "http://localhost:3000/database/delete", type: "POST", data: data, success: function (result) {
            getIncidents();
        }
    });
}

// Adds markers to the map based on database data.
function addMapMarkers(result){
    for(let i=0; i<result.length; i++){
        addMarker({lat: result[i]['lat'], lng: result[i]['lon']}, result[i]['incidentId']);
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

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -37.793, lng: 144.969},
        zoom: 10
    });

    /*let kmlLayer = new google.maps.KmlLayer();

    const src = 'http://www.health.vic.gov.au/maps/downloads/vic_hospitals.kmz';
    //const src = 'https://services.land.vic.gov.au/kml1/vic-hospitals.kml';
    kmlLayer = new google.maps.KmlLayer(src, {
        suppressInfoWindows: true,
        preserveViewport: false,
        map: map,
        //icon: '/public/Hospital-pin.png'
    });*/
}

function addMarker(location, id) {
    let marker = new google.maps.Marker({
        position: location,
        map: map,
        icon: '/public/incident-icon.png',
        id: id
    });

    google.maps.event.addListener(marker, 'click', function(){
        document.getElementById(this.get('id')).click();
    });

    mapMarkers[id] = marker;
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}

function mapZoomIn(latlngPosition){
    map.panTo(latlngPosition);
    map.setZoom(13);
}

function incidentZoom(element){
    element.scrollIntoView({behavior: 'smooth'});
    mapZoomIn(mapMarkers[element.id].getPosition());
    mapMarkers[element.id].setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function(){ mapMarkers[element.id].setAnimation(null); }, 2800);
}

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

function hideModalBox() {
    deleteIncidentBox.style.display = "none";
}